import './style.css';
import { ExhibitionState, GICategory } from './types/gi-data';
import { db } from './utils/database';
import { AssetLoader } from './utils/asset-loader';
import { SceneManager } from './core/scene-manager';
import { CameraController } from './core/camera-controller';
import { SvgMapParser } from './utils/svg-parser';
import { InteractionManager } from './core/interaction-manager';
import { InfoCardManager } from './components/info-card';
import { TracerLayer } from './components/tracer-layer';
import { CategoryFilterManager } from './core/category-filter';
import { ModalManager } from './components/modals';
import { AudioNarrator } from './core/audio-narrator';
import { TourManager } from './core/tour-manager';

function checkWebGLSupport(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl') || canvas.getContext('webgl2'))
    );
  } catch {
    return false;
  }
}

class GIndiaApp {
  private state: ExhibitionState = {
    selectedStateId: null,
    activeProductId: null,
    isTourActive: false,
    isSpeechEnabled: true,
    activeCategoryFilter: 'All',
    isWebGLSupported: true,
    tourSpeedMs: 7000,
  };

  private sceneManager: SceneManager | null = null;
  private cameraController: CameraController | null = null;
  private interactionManager: InteractionManager | null = null;
  private infoCardManager: InfoCardManager | null = null;
  private tracerLayer: TracerLayer | null = null;
  private categoryFilterManager: CategoryFilterManager | null = null;
  private modalManager: ModalManager | null = null;
  private audioNarrator: AudioNarrator | null = null;
  private tourManager: TourManager | null = null;

  constructor() {
    this.init();
  }

  private async init(): Promise<void> {
    console.info('🏛️ GIndia: Initializing 3D Interactive Exhibition Map of India');
    
    // 1. Load database
    const states = db.getAllStates();
    const products = db.getAllProducts();
    const stats = db.getNationalStats();
    console.info(`📦 GI Database Loaded: ${products.length} products across ${states.length} states/UTs.`);
    console.info('📊 National GI Stats:', stats);

    // Warm up asset cache
    AssetLoader.preloadProducts(products.slice(0, 15));

    // 2. Audio Engine
    this.audioNarrator = new AudioNarrator({
      onStart: () => {
        document.getElementById('narration-pulse')?.classList.add('animate-pulse');
      },
      onEnd: () => {
        document.getElementById('narration-pulse')?.classList.remove('animate-pulse');
      }
    });

    // 3. Info Card Manager
    const cardContainer = document.getElementById('info-card-container');
    if (cardContainer) {
      this.infoCardManager = new InfoCardManager({
        container: cardContainer,
        onClose: () => {
          this.tracerLayer?.hide();
          this.interactionManager?.deselectState();
          this.state.selectedStateId = null;
          this.updateHeaderSubtitle('Geographical Indications of India • Interactive Art Exhibit');
        },
        onProductChange: (product) => {
          this.state.activeProductId = product.id;
        },
        onSpeak: (product) => {
          if (this.audioNarrator) {
            this.audioNarrator.speakProduct(product, product.stateName);
          }
        }
      });
    }

    // 4. Modal Manager
    const modalContainer = document.getElementById('modal-container');
    if (modalContainer) {
      this.modalManager = new ModalManager(modalContainer);
    }

    // 5. Tour Choreographer
    if (this.audioNarrator) {
      this.tourManager = new TourManager({
        audioNarrator: this.audioNarrator,
        onStepChange: (state, product, stepIndex, totalSteps) => {
          this.handleStateSelection(state.id, state.name, null, false);
          const caption = document.getElementById('narration-caption');
          if (caption) {
            caption.innerHTML = `<strong class="text-terracotta">${stepIndex + 1}/${totalSteps}</strong>: <strong>${state.name}</strong> • ${product.name}`;
          }
        },
        onTourStateChange: (isActive, isPaused) => {
          this.updateTourUI(isActive, isPaused);
        }
      });
    }

    this.state.isWebGLSupported = checkWebGLSupport();

    if (!this.state.isWebGLSupported) {
      console.warn('⚠️ WebGL not supported. Enabling 2D SVG fallback.');
      this.init2DFallback();
    } else {
      await this.init3DScene();
    }

    this.setupUIEventListeners();
  }

  private async init3DScene(): Promise<void> {
    const canvasContainer = document.getElementById('canvas-container');
    const tracerSvg = document.getElementById('tracer-svg-layer') as unknown as SVGSVGElement;
    if (!canvasContainer || !tracerSvg) return;

    this.sceneManager = new SceneManager({ container: canvasContainer });

    this.cameraController = new CameraController({
      camera: this.sceneManager.camera,
      domElement: this.sceneManager.renderer.domElement
    });

    try {
      console.info('🗺️ Extruding 3D vector map of India from in.svg...');
      const parseResult = await SvgMapParser.loadAndParse('assets/in.svg');
      this.sceneManager.scene.add(parseResult.mapGroup);

      this.categoryFilterManager = new CategoryFilterManager({
        stateInfoMap: parseResult.stateInfoMap
      });

      this.interactionManager = new InteractionManager({
        camera: this.sceneManager.camera,
        domElement: this.sceneManager.renderer.domElement,
        interactiveMeshes: parseResult.interactiveMeshes,
        stateInfoMap: parseResult.stateInfoMap,
        onStateHover: (_stateId, stateName) => {
          if (stateName) {
            this.updateHeaderSubtitle(stateName);
          } else if (!this.state.selectedStateId && !this.tourManager?.getIsActive()) {
            this.updateHeaderSubtitle('Geographical Indications of India • Interactive Art Exhibit');
          }
        },
        onStateSelect: (stateId, stateName, centroid) => {
          if (this.tourManager?.getIsActive()) {
            this.tourManager.pause();
          }
          this.handleStateSelection(stateId, stateName, centroid, false);
        }
      });

      if (this.infoCardManager) {
        this.tracerLayer = new TracerLayer({
          svgElement: tracerSvg,
          interactionManager: this.interactionManager,
          infoCardManager: this.infoCardManager
        });
      }

      this.sceneManager.registerAnimationCallback(() => {
        this.cameraController?.update();
        this.tracerLayer?.update();
      });

      console.info('✨ 3D Map Engine, Spatial Tracers & Kiosk Tour Initialized!');
    } catch (err) {
      console.error('Failed to load 3D map, falling back to 2D canvas:', err);
      this.init2DFallback();
    }
  }

  public handleStateSelection(stateId: string, stateName?: string, centroid?: any, updateInteraction = true): void {
    const cleanId = stateId.replace('-', '').toUpperCase();
    const stateMeta = db.getStateById(cleanId);
    if (!stateMeta) return;

    const actualName = stateName || stateMeta.name;
    this.state.selectedStateId = cleanId;

    const products = db.getProductsByState(cleanId);
    const info = this.interactionManager?.getStateInfo(cleanId);
    const actualCentroid = centroid || (info ? info.centroid : null);

    if (updateInteraction && this.interactionManager) {
      this.interactionManager.selectState(cleanId, false);
    }

    if (this.infoCardManager) {
      this.infoCardManager.showStateProducts(stateMeta, products);
      if (actualCentroid) {
        this.tracerLayer?.setTargetCentroid(actualCentroid);
        this.cameraController?.focusOnTarget(actualCentroid);
      }
      this.updateHeaderSubtitle(`${actualName} • ${products.length} Featured GI Tag${products.length !== 1 ? 's' : ''}`);
    }
  }

  private updateHeaderSubtitle(text: string): void {
    const subtitle = document.querySelector('header span');
    if (subtitle) {
      subtitle.textContent = text;
    }
  }

  private updateTourUI(isActive: boolean, isPaused: boolean): void {
    const btnTour = document.getElementById('dock-tour-toggle');
    const playIcon = document.getElementById('dock-tour-play-icon');
    const pauseIcon = document.getElementById('dock-tour-pause-icon');
    const narrationBar = document.getElementById('narration-bar');
    const btnNarrationPause = document.getElementById('btn-narration-pause');

    btnTour?.classList.toggle('active', isActive);
    
    if (isActive) {
      playIcon?.classList.add('hidden');
      pauseIcon?.classList.remove('hidden');
      narrationBar?.classList.remove('hidden');
      narrationBar?.classList.add('flex');
    } else {
      playIcon?.classList.remove('hidden');
      pauseIcon?.classList.add('hidden');
      narrationBar?.classList.add('hidden');
      narrationBar?.classList.remove('flex');
    }

    if (btnNarrationPause) {
      btnNarrationPause.textContent = isPaused ? '▶️' : '⏸';
      btnNarrationPause.title = isPaused ? 'Resume Tour' : 'Pause Tour';
    }
  }

  private init2DFallback(): void {
    const fallbackContainer = document.getElementById('fallback-container');
    const canvasContainer = document.getElementById('canvas-container');
    if (fallbackContainer && canvasContainer) {
      fallbackContainer.classList.remove('hidden');
      canvasContainer.classList.add('hidden');
    }
  }

  private setupUIEventListeners(): void {
    const btnTour = document.getElementById('dock-tour-toggle');
    const btnSpeech = document.getElementById('dock-speech-toggle');
    const btnReset = document.getElementById('dock-camera-reset');
    const btnFilter = document.getElementById('dock-filter-toggle');
    const filterPanel = document.getElementById('category-filter-panel');
    const btnCloseFilter = document.getElementById('btn-close-filter');
    const categoryList = document.getElementById('category-filter-list');
    const btnSearch = document.getElementById('btn-search');
    const btnStats = document.getElementById('btn-stats');

    // Bottom Narration Bar Buttons
    const btnNarrationPrev = document.getElementById('btn-narration-prev');
    const btnNarrationPause = document.getElementById('btn-narration-pause');
    const btnNarrationNext = document.getElementById('btn-narration-next');

    btnNarrationPrev?.addEventListener('click', () => this.tourManager?.previous());
    btnNarrationNext?.addEventListener('click', () => this.tourManager?.next());
    btnNarrationPause?.addEventListener('click', () => {
      if (this.tourManager?.getIsPaused()) {
        this.tourManager.resume();
      } else {
        this.tourManager?.pause();
      }
    });

    // Tour Toggle
    btnTour?.addEventListener('click', () => {
      this.tourManager?.toggle();
    });

    // Speech Mute Toggle
    const updateSpeechIcon = () => {
      const isMuted = this.audioNarrator?.getIsMuted() ?? false;
      document.getElementById('dock-speech-on-icon')?.classList.toggle('hidden', isMuted);
      document.getElementById('dock-speech-off-icon')?.classList.toggle('hidden', !isMuted);
    };

    updateSpeechIcon();
    btnSpeech?.addEventListener('click', () => {
      this.audioNarrator?.toggleMute();
      updateSpeechIcon();
    });

    // Header buttons
    btnSearch?.addEventListener('click', () => {
      this.modalManager?.openSearchModal((stateId) => this.handleStateSelection(stateId, undefined, undefined, true));
    });

    btnStats?.addEventListener('click', () => {
      this.modalManager?.openStatsModal((stateId) => this.handleStateSelection(stateId, undefined, undefined, true));
    });

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.modalManager?.openSearchModal((stateId) => this.handleStateSelection(stateId, undefined, undefined, true));
      }
      if (e.key === 'Escape') {
        this.modalManager?.close();
        filterPanel?.classList.add('hidden');
      }
      if (e.key === ' ' && this.tourManager?.getIsActive()) {
        e.preventDefault();
        if (this.tourManager.getIsPaused()) {
          this.tourManager.resume();
        } else {
          this.tourManager.pause();
        }
      }
    });

    // Category filter list
    if (categoryList) {
      const categories = db.getCategories();
      categoryList.innerHTML = `
        <button class="text-left px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-stone-100 transition-colors flex justify-between items-center ${this.state.activeCategoryFilter === 'All' ? 'bg-terracotta/10 text-terracotta' : 'text-ink'}" data-cat="All">
          <span>All Categories</span>
          <span class="text-[10px] text-ink-muted">(${db.getAllProducts().length})</span>
        </button>
        ${categories.map(cat => {
          const count = db.filterProductsByCategory(cat.name).length;
          return `
            <button class="text-left px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-stone-100 transition-colors flex justify-between items-center text-ink" data-cat="${cat.name}">
              <span>${cat.name}</span>
              <span class="text-[10px] text-ink-muted">(${count})</span>
            </button>
          `;
        }).join('')}
      `;

      categoryList.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const cat = ((e.currentTarget as HTMLElement).getAttribute('data-cat') || 'All') as GICategory | 'All';
          this.state.activeCategoryFilter = cat;
          this.categoryFilterManager?.setFilter(cat);
          filterPanel?.classList.add('hidden');

          categoryList.querySelectorAll('button').forEach(b => {
            b.classList.remove('bg-terracotta/10', 'text-terracotta');
          });
          (e.currentTarget as HTMLElement).classList.add('bg-terracotta/10', 'text-terracotta');
        });
      });
    }

    btnFilter?.addEventListener('click', () => {
      filterPanel?.classList.toggle('hidden');
    });

    btnCloseFilter?.addEventListener('click', () => {
      filterPanel?.classList.add('hidden');
    });

    btnReset?.addEventListener('click', () => {
      console.log('Resetting 3D camera to exhibition default');
      this.tourManager?.stop();
      this.infoCardManager?.hide();
      this.tracerLayer?.hide();
      this.interactionManager?.deselectState();
      this.categoryFilterManager?.resetFilter();
      this.cameraController?.resetView();
      this.updateHeaderSubtitle('Geographical Indications of India • Interactive Art Exhibit');
    });
  }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  new GIndiaApp();
});