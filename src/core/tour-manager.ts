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

  // Curated 36-Stop Grand Regional Itinerary across India
  private readonly itineraryStateIds: string[] = [
    // 1. Northern Himalayas & Crown
    'INLA', 'INJK', 'INHP', 'INUT', 'INPB', 'INHR', 'INCH', 'INDL',
    // 2. Central Heartland & Gangetic Basin
    'INRJ', 'INMP', 'INUP', 'INCT', 'INBR', 'INJH', 'INWB', 'INOR',
    // 3. Northeastern Seven Sisters & Sikkim
    'INSK', 'INAS', 'INAR', 'INNL', 'INMN', 'INMZ', 'INTR', 'INML',
    // 4. Western Coast & Arabian Sea
    'INGJ', 'INDH', 'INMH', 'INGA',
    // 5. Southern Peninsula & Deccan Heritage
    'INTG', 'INAP', 'INKA', 'INKL', 'INTN', 'INPY',
    // 6. Island Territories
    'INAN', 'INLD'
  ];

  constructor(options: TourManagerOptions) {
    this.audioNarrator = options.audioNarrator;
    this.onStepChange = options.onStepChange;
    this.onTourStateChange = options.onTourStateChange;

    this.setupIdleDetection();
  }

  private setupIdleDetection(): void {
    const onUserInteraction = () => {
      if (this.isActive && !this.isPaused) {
        // Visitor interacted with kiosk: pause tour and restart idle countdown
        this.pause();
      }

      if (this.idleTimeoutId !== null) {
        window.clearTimeout(this.idleTimeoutId);
      }

      this.idleTimeoutId = window.setTimeout(() => {
        if (this.isPaused) {
          console.info('⏱️ Kiosk idle for 20s. Auto-resuming exhibition guided tour...');
          this.resume();
        }
      }, this.IDLE_RESUME_DELAY_MS);
    };

    window.addEventListener('pointerdown', onUserInteraction, { passive: true });
    window.addEventListener('wheel', onUserInteraction, { passive: true });
    window.addEventListener('touchstart', onUserInteraction, { passive: true });
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
      if (!this.audioNarrator.getIsSpeaking()) {
        this.executeStep(this.currentIndex);
      }
    }
  }

  public next(): void {
    if (!this.isActive) {
      this.start((this.currentIndex + 1) % this.itineraryStateIds.length);
      return;
    }
    this.clearStepTimeout();
    this.audioNarrator.cancel();
    this.currentIndex = (this.currentIndex + 1) % this.itineraryStateIds.length;
    this.isPaused = false;
    this.onTourStateChange?.(true, false);
    this.executeStep(this.currentIndex);
  }

  public previous(): void {
    if (!this.isActive) {
      this.start((this.currentIndex - 1 + this.itineraryStateIds.length) % this.itineraryStateIds.length);
      return;
    }
    this.clearStepTimeout();
    this.audioNarrator.cancel();
    this.currentIndex = (this.currentIndex - 1 + this.itineraryStateIds.length) % this.itineraryStateIds.length;
    this.isPaused = false;
    this.onTourStateChange?.(true, false);
    this.executeStep(this.currentIndex);
  }

  private executeStep(index: number): void {
    if (!this.isActive || this.isPaused) return;

    const stateId = this.itineraryStateIds[index];
    const state = db.getStateById(stateId);
    const products = db.getProductsByState(stateId);

    if (!state || products.length === 0) {
      // Advance to next if state is missing
      this.advanceAfterDwell(1000);
      return;
    }

    const featuredProduct = products[0];

    // Trigger visual step change
    this.onStepChange?.(state, featuredProduct, index, this.itineraryStateIds.length);

    // Speak audio narration
    this.audioNarrator.speakProduct(featuredProduct, state.name, () => {
      if (this.isActive && !this.isPaused) {
        // Dwell briefly after narration concludes before flying to next stop
        this.advanceAfterDwell(2000);
      }
    });
  }

  private advanceAfterDwell(delayMs: number): void {
    this.clearStepTimeout();
    this.stepTimeoutId = window.setTimeout(() => {
      if (this.isActive && !this.isPaused) {
        this.currentIndex = (this.currentIndex + 1) % this.itineraryStateIds.length;
        this.executeStep(this.currentIndex);
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