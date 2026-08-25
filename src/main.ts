import './style.css';
import { ExhibitionState } from './types/gi-data';

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

  constructor() {
    this.init();
  }

  private init(): void {
    console.info('🏛️ GIndia: Initializing 3D Interactive Exhibition Map of India');
    this.state.isWebGLSupported = checkWebGLSupport();

    if (!this.state.isWebGLSupported) {
      console.warn('⚠️ WebGL not supported or hardware acceleration disabled. Enabling 2D SVG vector fallback.');
      const fallbackContainer = document.getElementById('fallback-container');
      const canvasContainer = document.getElementById('canvas-container');
      if (fallbackContainer && canvasContainer) {
        fallbackContainer.classList.remove('hidden');
        canvasContainer.classList.add('hidden');
      }
    }

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    const btnTour = document.getElementById('dock-tour-toggle');
    const btnSpeech = document.getElementById('dock-speech-toggle');
    const btnReset = document.getElementById('dock-camera-reset');
    const btnFilter = document.getElementById('dock-filter-toggle');
    const filterPanel = document.getElementById('category-filter-panel');
    const btnCloseFilter = document.getElementById('btn-close-filter');

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
    });
  }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  new GIndiaApp();
});
