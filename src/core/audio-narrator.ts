import { GIProduct } from '../types/gi-data';

export interface AudioNarratorOptions {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

export class AudioNarrator {
  private isSupported = false;
  private isMuted = false;
  private selectedVoice: SpeechSynthesisVoice | null = null;

  private onStart?: () => void;
  private onEnd?: () => void;
  private onError?: (err: any) => void;

  constructor(options?: AudioNarratorOptions) {
    this.onStart = options?.onStart;
    this.onEnd = options?.onEnd;
    this.onError = options?.onError;

    if ('speechSynthesis' in window) {
      this.isSupported = true;
      this.isMuted = localStorage.getItem('gindia_speech_muted') === 'true';
      this.initVoices();
    }
  }

  private initVoices(): void {
    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        // Prioritize Indian English voices
        const indianVoice = voices.find(v => 
          v.lang.includes('en-IN') || 
          v.name.toLowerCase().includes('india') ||
          v.name.toLowerCase().includes('heera') ||
          v.name.toLowerCase().includes('neerja') ||
          v.name.toLowerCase().includes('ravi')
        );
        // Fallback to high quality English
        const englishVoice = voices.find(v => v.lang.startsWith('en-') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Online')));
        
        this.selectedVoice = indianVoice || englishVoice || voices[0] || null;
      }
    };

    updateVoices();
    if ('onvoiceschanged' in window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }

  public generateProductScript(product: GIProduct, stateName: string): string {
    const highlights = product.keyFeatures && product.keyFeatures.length > 0 
      ? `Distinctive characteristics include ${product.keyFeatures.slice(0, 2).join(' and ')}.` 
      : '';
    
    return `${product.name}, from ${stateName}. ${product.description} ${highlights}`.trim();
  }

  public speak(text: string, onFinish?: () => void): void {
    if (!this.isSupported || this.isMuted) {
      const simulatedDuration = Math.max(3000, Math.min(8000, text.length * 55));
      setTimeout(() => {
        onFinish?.();
        this.onEnd?.();
      }, simulatedDuration);
      return;
    }

    this.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }

    utterance.rate = 0.94;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      this.onStart?.();
    };

    utterance.onend = () => {
      onFinish?.();
      this.onEnd?.();
    };

    utterance.onerror = (e) => {
      this.onError?.(e);
      onFinish?.();
      this.onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  }

  public speakProduct(product: GIProduct, stateName: string, onFinish?: () => void): void {
    const script = this.generateProductScript(product, stateName);
    this.speak(script, onFinish);
  }

  public pause(): void {
    if (this.isSupported && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
    }
  }

  public resume(): void {
    if (this.isSupported && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  }

  public cancel(): void {
    if (this.isSupported) {
      window.speechSynthesis.cancel();
    }
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    localStorage.setItem('gindia_speech_muted', muted ? 'true' : 'false');
    if (muted) {
      this.cancel();
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsSpeaking(): boolean {
    return this.isSupported && window.speechSynthesis.speaking;
  }
}