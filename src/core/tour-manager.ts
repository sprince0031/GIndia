import { db } from '../utils/database';
import { GIProduct, StateMetadata } from '../types/gi-data';
import { AudioNarrator } from './audio-narrator';

export interface TourManagerOptions {
  audioNarrator: AudioNarrator;
  onStepChange?: (state: StateMetadata, product: GIProduct, stepIndex: number, totalSteps: number) => void;
  onTourStateChange?: (isActive: boolean, isPaused: boolean) => void;
}

export class TourManager {
  private audioNarrator: AudioNarrator;
  private isActive = false;
  private isPaused = false;
  private currentIndex = 0;
  private stepTimeoutId: number | null = null;
  private idleTimeoutId: number | null = null;
  private readonly IDLE_RESUME_DELAY_MS = 20000; // 20s

  private onStepChange?: (state: StateMetadata, product: GIProduct, stepIndex: number, totalSteps: number) => void;
  private onTourStateChange?: (isActive: boolean, isPaused: boolean) => void;

  // Curated 36-Stop Regional Tour Journey
  private readonly itineraryStateIds: string[] = [
    // 1. Northern Himalayas
    'INLA', 'INJK', 'INHP', 'INUT', 'INPB', 'INHR', 'INCH', 'INDL',
    // 2. Central Heartland & Plains
    'INRJ', 'INMP', 'INUP', 'INCT', 'INBR', 'INJH', 'INWB', 'INOR',
    // 3. Northeast Hills
    'INSK', 'INAS', 'INAR', 'INNL', 'INMN', 'INMZ', 'INTR', 'INML',
    // 4. Western Coast
    'INGJ', 'INDH', 'INMH', 'INGA',
    // 5. Southern Deccan & Coast
    'INTG', 'INAP', 'INKA', 'INKL', 'INTN', 'INPY',
    // 6. Islands
    'INAN', 'INLD'
  ];

  constructor(options: TourManagerOptions) {
    this.audioNarrator = options.audioNarrator;
    this.onStepChange = options.onStepChange;
    this.onTourStateChange = options.onTourStateChange;

    this.setupIdleDetection();
  }

  private setupIdleDetection(): void {
    let lastInteractionTime = 0;

    const onUserInteraction = (e: Event) => {
      // Ignore clicks on tour controls or header buttons
      const target = e.target as HTMLElement | null;
      if (
        target?.closest('#narration-bar') ||
        target?.closest('#dock-tour-toggle') ||
        target?.closest('#dock-speech-toggle') ||
        target?.closest('#btn-search') ||
        target?.closest('#btn-stats')
      ) {
        return;
      }

      const now = Date.now();
      if (now - lastInteractionTime < 400) return;
      lastInteractionTime = now;

      if (this.isActive && !this.isPaused) {
        console.info('⏸️ Visitor interaction on map detected. Pausing tour...');
        this.pause();
      }

      if (this.idleTimeoutId !== null) {
        window.clearTimeout(this.idleTimeoutId);
      }

      this.idleTimeoutId = window.setTimeout(() => {
        if (this.isPaused) {
          console.info('⏱️ 20s idle timeout reached. Auto-resuming tour...');
          this.resume();
        }
      }, this.IDLE_RESUME_DELAY_MS);
    };

    window.addEventListener('pointerdown', onUserInteraction, { passive: true });
    window.addEventListener('wheel', onUserInteraction, { passive: true });
  }

  public start(startIndex = 0): void {
    this.clearStepTimeout();
    this.isActive = true;
    this.isPaused = false;
    this.currentIndex = Math.max(0, Math.min(startIndex, this.itineraryStateIds.length - 1));

    this.onTourStateChange?.(true, false);
    this.executeStep(this.currentIndex);
  }

  public stop(): void {
    this.clearStepTimeout();
    this.audioNarrator.cancel();
    this.isActive = false;
    this.isPaused = false;
    this.onTourStateChange?.(false, false);
  }

  public toggle(): boolean {
    if (this.isActive) {
      if (this.isPaused) {
        this.resume();
      } else {
        this.stop();
      }
    } else {
      this.start(this.currentIndex);
    }
    return this.isActive;
  }

  public pause(): void {
    if (!this.isActive || this.isPaused) return;
    this.isPaused = true;
    this.clearStepTimeout();
    this.audioNarrator.pause();
    this.onTourStateChange?.(true, true);
  }

  public resume(): void {
    if (!this.isActive) {
      this.start(this.currentIndex);
      return;
    }
    if (this.isPaused) {
      this.isPaused = false;
      this.onTourStateChange?.(true, false);
      this.audioNarrator.resume();
      this.executeStep(this.currentIndex);
    }
  }

  public next(): void {
    this.clearStepTimeout();
    this.audioNarrator.cancel();
    this.currentIndex = (this.currentIndex + 1) % this.itineraryStateIds.length;
    this.isPaused = false;
    this.onTourStateChange?.(true, false);
    this.executeStep(this.currentIndex);
  }

  public previous(): void {
    this.clearStepTimeout();
    this.audioNarrator.cancel();
    this.currentIndex = (this.currentIndex - 1 + this.itineraryStateIds.length) % this.itineraryStateIds.length;
    this.isPaused = false;
    this.onTourStateChange?.(true, false);
    this.executeStep(this.currentIndex);
  }

  private executeStep(index: number): void {
    if (!this.isActive || this.isPaused) return;

    this.clearStepTimeout();

    const stateId = this.itineraryStateIds[index];
    const state = db.getStateById(stateId);
    const products = db.getProductsByState(stateId);

    if (!state || products.length === 0) {
      this.advanceAfterDwell(1000);
      return;
    }

    const featuredProduct = products[0];

    // Trigger visual step change
    this.onStepChange?.(state, featuredProduct, index, this.itineraryStateIds.length);

    let stepHandled = false;

    // Guaranteed watchdog timer: advance to next stop after max 8.5s
    this.stepTimeoutId = window.setTimeout(() => {
      if (!stepHandled && this.isActive && !this.isPaused) {
        stepHandled = true;
        this.next();
      }
    }, 8500);

    // Play speech narration
    this.audioNarrator.speakProduct(featuredProduct, state.name, () => {
      if (!stepHandled && this.isActive && !this.isPaused) {
        stepHandled = true;
        this.advanceAfterDwell(1500);
      }
    });
  }

  private advanceAfterDwell(delayMs: number): void {
    this.clearStepTimeout();
    this.stepTimeoutId = window.setTimeout(() => {
      if (this.isActive && !this.isPaused) {
        this.next();
      }
    }, delayMs);
  }

  private clearStepTimeout(): void {
    if (this.stepTimeoutId !== null) {
      window.clearTimeout(this.stepTimeoutId);
      this.stepTimeoutId = null;
    }
  }

  public getIsActive(): boolean {
    return this.isActive;
  }

  public getIsPaused(): boolean {
    return this.isPaused;
  }

  public getCurrentIndex(): number {
    return this.currentIndex;
  }

  public getTotalSteps(): number {
    return this.itineraryStateIds.length;
  }
}