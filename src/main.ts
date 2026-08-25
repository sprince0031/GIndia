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

  constructor() {
    this.init();
  }

  private async init(): Promise<void> {
    console.info('🏛️ GIndia: Initializing 3D Interactive Exhibition Map of India');
    
    // Load local database
    const states = db.getAllStates();
    const products = db.getAllProducts();
    const stats = db.getNationalStats();
    console.info(`📦 GI Database Loaded: ${products.length} products across ${states.length} states/UTs.`);
    console.info('📊 National GI Stats:', stats);

    // Warm up asset cache
    AssetLoader.preloadProducts(products.slice(0, 15));

    // Setup Info Card Manager
    const cardContainer = document.getElementById('info-card-container');
    if (cardContainer) {
      this.infoCardManager = new InfoCardManager({
        container: cardContainer,
        onClose: () => {
          this.tracerLayer?.hide();
          this.interactionManager?.deselectState();
          this.state.selectedStateId = null;
        },
        onProductChange: (product) => {
          this.state.activeProductId = product.id;
        },
        onSpeak: (product) => {
          this.speakProduct(product.name, product.stateName, product.description);
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

    // 1. Initialize Scene Manager
    this.sceneManager = new SceneManager({ container: canvasContainer });

    // 2. Initialize Camera Controller
    this.cameraController = new CameraController({
      camera: this.sceneManager.camera,
      domElement: this.sceneManager.renderer.domElement
    });

    try {
      // 3. Parse & Extrude SVG Map Geometry
      console.info('🗺️ Extruding 3D vector map of India from in.svg...');
      const parseResult = await SvgMapParser.loadAndParse('assets/in.svg');
      this.sceneManager.scene.add(parseResult.mapGroup);

      // 4. Initialize Category Filter Manager
      this.categoryFilterManager = new CategoryFilterManager({
        stateInfoMap: parseResult.stateInfoMap
      });

      // 5. Initialize Interaction & Raycasting Manager
      this.interactionManager = new InteractionManager({
        camera: this.sceneManager.camera,
        domElement: this.sceneManager.renderer.domElement,
        interactiveMeshes: parseResult.interactiveMeshes,
        stateInfoMap: parseResult.stateInfoMap,
        onStateHover: (stateId, stateName) => {
          if (stateId && stateName) {
            this.updateHeaderSubtitle(`${stateName} (${stateId})`);
          } else if (!this.state.selectedStateId) {
            this.updateHeaderSubtitle('Interactive Heritage & Regional Produce Atlas');
          }
        },
        onStateSelect: (stateId, stateName, centroid) => {
          this.handleStateSelection(stateId, stateName, centroid);
        }
      });

      // 6. Initialize Tracer Layer
      if (this.infoCardManager) {
        this.tracerLayer = new TracerLayer({
          svgElement: tracerSvg,
          interactionManager: this.interactionManager,
          infoCardManager: this.infoCardManager
        });
      }

      // 7. Register render loop callbacks
      this.sceneManager.registerAnimationCallback(() => {
        this.cameraController?.update();
        this.tracerLayer?.update();
      });

      console.info('✨ 3D Map Engine & Dynamic Spatial Tracers Successfully Initialized!');
    } catch (err) {
      console.error('Failed to load 3D map, falling back to 2D canvas:', err);
      this.init2DFallback();
    }
  }

  private handleStateSelection(stateId: string, stateName: string, centroid: any): void {
    console.info(`🎯 Selected State: ${stateName} (${stateId})`);
    this.state.selectedStateId = stateId;

    const stateMeta = db.getStateById(stateId);
    const products = db.getProductsByState(stateId);

    if (stateMeta && this.infoCardManager) {
      this.infoCardManager.showStateProducts(stateMeta, products);
      this.tracerLayer?.setTargetCentroid(centroid);
      this.cameraController?.focusOnTarget(centroid);
      this.updateHeaderSubtitle(`${stateName} • ${products.length} Featured GI Tag${products.length !== 1 ? 's' : ''}`);

      if (this.state.isSpeechEnabled && products.length > 0) {
        const p = products[0];
        this.speakProduct(p.name, stateName, p.description);
      }
    }
  }

  private speakProduct(name: string, state: string, description: string): void {
    if (!('speechSynthesis' in window) || !this.state.isSpeechEnabled) return;

    window.speechSynthesis.cancel(); // Cancel any ongoing speech
    const text = `${name}, from ${state}. ${description}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    
    // Select Indian English voice if available
    const voices = window.speechSynthesis.getVoices();
    const indianVoice = voices.find(v => v.lang.includes('en-IN') || v.name.includes('India'));
    if (indianVoice) {
      utterance.voice = indianVoice;
    }

    window.speechSynthesis.speak(utterance);
  }

  private updateHeaderSubtitle(text: string): void {
    const subtitle = document.querySelector('header span');
    if (subtitle) {
      subtitle.textContent = text;
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

    // Populate category filter list
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

    btnTour?.addEventListener('click', () => {
      this.state.isTourActive = !this.state.isTourActive;
      btnTour.classList.toggle('active', this.state.isTourActive);
      document.getElementById('dock-tour-play-icon')?.classList.toggle('hidden', this.state.isTourActive);
      document.getElementById('dock-tour-pause-icon')?.classList.toggle('hidden', !this.state.isTourActive);
      document.getElementById('narration-bar')?.classList.toggle('hidden', !this.state.isTourActive);
      document.getElementById('narration-bar')?.classList.toggle('flex', this.state.isTourActive);
    });

    btnSpeech?.addEventListener('click', () => {
      this.state.isSpeechEnabled = !this.state.isSpeechEnabled;
      document.getElementById('dock-speech-on-icon')?.classList.toggle('hidden', !this.state.isSpeechEnabled);
      document.getElementById('dock-speech-off-icon')?.classList.toggle('hidden', this.state.isSpeechEnabled);
      if (!this.state.isSpeechEnabled && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    });

    btnFilter?.addEventListener('click', () => {
      filterPanel?.classList.toggle('hidden');
    });

    btnCloseFilter?.addEventListener('click', () => {
      filterPanel?.classList.add('hidden');
    });

    btnReset?.addEventListener('click', () => {
      console.log('Resetting 3D camera to exhibition default');
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