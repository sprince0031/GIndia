import './style.css';
import { ExhibitionState } from './types/gi-data';
import { db } from './utils/database';
import { AssetLoader } from './utils/asset-loader';
import { SceneManager } from './core/scene-manager';
import { CameraController } from './core/camera-controller';
import { SvgMapParser } from './utils/svg-parser';
import { InteractionManager } from './core/interaction-manager';

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

    // Warm up asset cache for top products
    AssetLoader.preloadProducts(products.slice(0, 12));

    this.state.isWebGLSupported = checkWebGLSupport();

    if (!this.state.isWebGLSupported) {
      console.warn('⚠️ WebGL not supported or hardware acceleration disabled. Enabling 2D SVG fallback.');
      this.init2DFallback();
    } else {
      await this.init3DScene();
    }

    this.setupUIEventListeners();
  }

  private async init3DScene(): Promise<void> {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    // 1. Initialize Scene Manager
    this.sceneManager = new SceneManager({ container });

    // 2. Initialize Camera Controller
    this.cameraController = new CameraController({
      camera: this.sceneManager.camera,
      domElement: this.sceneManager.renderer.domElement
    });

    // Register controller update in render loop
    this.sceneManager.registerAnimationCallback(() => {
      this.cameraController?.update();
    });

    try {
      // 3. Parse & Extrude SVG Map Geometry
      console.info('🗺️ Extruding 3D vector map of India from in.svg...');
      const parseResult = await SvgMapParser.loadAndParse('assets/in.svg');
      this.sceneManager.scene.add(parseResult.mapGroup);

      // 4. Initialize Interaction & Raycasting Manager
      this.interactionManager = new InteractionManager({
        camera: this.sceneManager.camera,
        domElement: this.sceneManager.renderer.domElement,
        interactiveMeshes: parseResult.interactiveMeshes,
        stateInfoMap: parseResult.stateInfoMap,
        onStateHover: (stateId, stateName) => {
          if (stateId && stateName) {
            console.log(`Hover: ${stateName} (${stateId})`);
          }
        },
        onStateSelect: (stateId, stateName, centroid) => {
          console.info(`🎯 Selected State: ${stateName} (${stateId})`);
          this.state.selectedStateId = stateId;
          this.cameraController?.focusOnTarget(centroid);
        }
      });

      console.info('✨ 3D Map Engine Successfully Initialized!');
    } catch (err) {
      console.error('Failed to load 3D map, falling back to 2D canvas:', err);
      this.init2DFallback();
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
          const cat = (e.currentTarget as HTMLElement).getAttribute('data-cat') || 'All';
          this.state.activeCategoryFilter = cat as any;
          console.log(`Filtering by category: ${cat}`);
          filterPanel?.classList.add('hidden');
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
    });

    btnFilter?.addEventListener('click', () => {
      filterPanel?.classList.toggle('hidden');
    });

    btnCloseFilter?.addEventListener('click', () => {
      filterPanel?.classList.add('hidden');
    });

    btnReset?.addEventListener('click', () => {
      console.log('Resetting 3D camera to exhibition default');
      this.interactionManager?.deselectState();
      this.cameraController?.resetView();
    });
  }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  new GIndiaApp();
});