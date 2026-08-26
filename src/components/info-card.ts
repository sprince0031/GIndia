import gsap from 'gsap';
import { GIProduct, StateMetadata } from '../types/gi-data';
import { AssetLoader } from '../utils/asset-loader';

export interface InfoCardOptions {
  container: HTMLElement;
  onClose?: () => void;
  onProductChange?: (product: GIProduct) => void;
  onSpeak?: (product: GIProduct) => void;
}

export class InfoCardManager {
  private container: HTMLElement;
  private cardElement: HTMLElement | null = null;
  private currentProducts: GIProduct[] = [];
  private currentState: StateMetadata | null = null;
  private activeProductIndex = 0;

  private onClose?: () => void;
  private onProductChange?: (product: GIProduct) => void;
  private onSpeak?: (product: GIProduct) => void;

  constructor(options: InfoCardOptions) {
    this.container = options.container;
    this.onClose = options.onClose;
    this.onProductChange = options.onProductChange;
    this.onSpeak = options.onSpeak;

    // Listen for resize to update layout if viewport crosses mobile threshold
    window.addEventListener('resize', () => {
      if (this.currentState && this.currentProducts.length > 0) {
        // Re-render only if orientation/mode needs update
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.currentState) {
        this.hide();
        this.onClose?.();
      }
    });
  }

  public showStateProducts(state: StateMetadata, products: GIProduct[], initialProductIndex = 0): void {
    this.currentState = state;
    this.currentProducts = products;
    this.activeProductIndex = Math.max(0, Math.min(initialProductIndex, products.length - 1));

    if (products.length === 0) {
      this.hide();
      return;
    }

    this.render();
  }

  private render(): void {
    if (!this.currentState || this.currentProducts.length === 0) return;

    const product = this.currentProducts[this.activeProductIndex];
    const isMobile = window.innerWidth < 768;
    const isEast = this.currentState.orientation === 'east' || this.currentState.orientation === 'northeast';

    const prodImgSrc = AssetLoader.getDisplaySrc(product);
    const bgImgSrc = AssetLoader.getCategoryBackgroundSrc(product.category);
    const hasMultipleProducts = this.currentProducts.length > 1;

    if (isMobile) {
      // Mobile Centered Modal with Backdrop Blur (< 768px)
      this.container.className = 'fixed inset-0 z-40 flex items-center justify-center p-4 sm:p-6 pointer-events-auto bg-black/60 backdrop-blur-md transition-opacity duration-300';
      this.container.id = 'info-card-mobile-modal-overlay';
      
      const html = `
        <article class="gi-info-card pointer-events-auto flex flex-col overflow-hidden max-h-[85vh] w-full max-w-lg shadow-2xl rounded-2xl bg-canvas border border-white/40" id="active-info-card">
          
          <!-- Card Header with State and High-Contrast 44x44px Dismiss Button -->
          <div class="px-5 py-3.5 flex items-center justify-between border-b border-ink/10 bg-canvas/90 backdrop-blur-md">
            <div class="flex items-baseline gap-2">
              <span class="font-serif text-xl font-bold text-ink">${this.currentState.name}</span>
              <span class="text-[10px] font-semibold uppercase tracking-wider text-terracotta bg-terracotta/10 px-2 py-0.5 rounded-full">
                ${this.currentState.productCount} GI Tags
              </span>
            </div>
            
            <button id="btn-close-card" class="w-11 h-11 -mr-2 rounded-full flex items-center justify-center text-ink hover:text-terracotta hover:bg-terracotta/10 active:scale-90 transition-all" title="Close info card" aria-label="Close info card">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <!-- Multi-Product Tabs (if state has >1 products) -->
          ${hasMultipleProducts ? `
            <div class="flex gap-2 px-5 py-2 bg-stone-base/40 border-b border-ink/8 overflow-x-auto no-scrollbar">
              ${this.currentProducts.map((p, idx) => `
                <button class="product-tab-btn text-xs font-semibold px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                  idx === this.activeProductIndex 
                    ? 'bg-terracotta text-white shadow-sm' 
                    : 'bg-white/80 text-ink-muted hover:text-ink'
                }" data-idx="${idx}">
                  ${p.name.split('(')[0].trim()}
                </button>
              `).join('')}
            </div>
          ` : ''}

          <!-- Scrollable Card Content -->
          <div class="p-5 overflow-y-auto space-y-4 flex-1 custom-scroll">
            
            <!-- Modular Exhibition Visual Plate (Category BG + Standalone Product) -->
            <div class="relative w-full h-48 rounded-xl overflow-hidden bg-stone-base shadow-inner flex items-center justify-center">
              <img src="${bgImgSrc}" alt="${product.category} Background" class="absolute inset-0 w-full h-full object-cover pointer-events-none" />
              <img src="${prodImgSrc}" alt="${product.name}" class="relative z-10 w-full h-full object-contain p-2" loading="lazy" />

              ${product.year ? `
                <div class="absolute bottom-2.5 right-2.5 z-20">
                  <span class="text-[10px] font-medium text-white/90 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full">
                    Reg: ${product.year}
                  </span>
                </div>
              ` : ''}
            </div>

            <!-- Product Titles & Narration Button -->
            <div>
              <div class="flex items-center justify-between gap-3">
                <h2 class="font-serif text-2xl font-bold text-ink leading-snug">${product.name}</h2>
                <button id="btn-card-speech" class="w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-full text-terracotta bg-terracotta/10 hover:bg-terracotta/20 transition-all" title="Listen to narration" aria-label="Listen to audio narration">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg>
                </button>
              </div>
              ${product.registrationNumber ? `
                <span class="text-xs font-mono font-medium text-ink-muted">${product.registrationNumber}</span>
              ` : ''}
            </div>

            <!-- Curatorial Storytelling Description -->
            <p class="text-sm text-ink leading-relaxed font-normal">${product.description}</p>

            <!-- Key Craftsmanship & Terroir Highlights -->
            ${product.keyFeatures && product.keyFeatures.length > 0 ? `
              <div class="space-y-1.5 pt-1">
                <h3 class="text-[11px] font-bold uppercase tracking-wider text-ink-muted">Exhibition Highlights</h3>
                <ul class="space-y-1.5 text-xs text-ink/90">
                  ${product.keyFeatures.map(f => `
                    <li class="flex items-start gap-2">
                      <span class="text-terracotta font-bold text-base leading-none">•</span>
                      <span>${f}</span>
                    </li>
                  `).join('')}
                </ul>
              </div>
            ` : ''}

            <!-- Other Notable Regional GIs -->
            ${this.currentState.otherGis && this.currentState.otherGis.length > 0 ? `
              <div class="pt-2 border-t border-ink/10">
                <h3 class="text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-2">Other ${this.currentState.name} GIs</h3>
                <div class="flex flex-wrap gap-1.5">
                  ${this.currentState.otherGis.slice(0, 4).map(tag => `
                    <span class="text-[11px] font-medium bg-ink/5 text-ink-muted px-2.5 py-1 rounded-md">${tag}</span>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <!-- Explicit Mobile Bottom Close Action Button -->
            <div class="pt-3 pb-1 border-t border-ink/10">
              <button id="btn-close-card-bottom" class="w-full py-3 rounded-xl bg-ink text-canvas font-semibold text-sm hover:bg-ink/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                <span>Close & Return to Map</span>
              </button>
            </div>

          </div>
        </article>
      `;

      this.container.innerHTML = html;
      this.cardElement = document.getElementById('active-info-card');

      // Dismiss on backdrop click
      this.container.onclick = (e) => {
        if (e.target === this.container) {
          this.hide();
          this.onClose?.();
        }
      };

      this.attachCardEvents();

      // Entrance animation
      if (this.cardElement) {
        gsap.fromTo(this.cardElement,
          { opacity: 0, scale: 0.92, y: 30 },
          { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: 'power2.out' }
        );
      }

    } else {
      // Desktop / Large Viewport Floating Spatial Card (>= 768px)
      this.container.className = `absolute inset-0 pointer-events-none z-20 flex p-6 md:p-10 ${
        isEast ? 'justify-end items-center' : 'justify-start items-center pl-20 md:pl-24'
      }`;
      this.container.id = 'info-card-container';
      this.container.onclick = null;

      const html = `
        <article class="gi-info-card pointer-events-auto flex flex-col overflow-hidden max-h-[88vh] shadow-2xl animate-card-in" id="active-info-card">
          
          <!-- Card Header with State and Dismiss Button -->
          <div class="px-5 pt-4 pb-3 flex items-center justify-between border-b border-ink/8 bg-canvas/40 backdrop-blur-md">
            <div class="flex items-baseline gap-2">
              <span class="font-serif text-lg font-bold text-ink">${this.currentState.name}</span>
              <span class="text-[10px] font-semibold uppercase tracking-wider text-terracotta bg-terracotta/10 px-2 py-0.5 rounded-full">
                ${this.currentState.productCount} GI Tags
              </span>
            </div>
            
            <button id="btn-close-card" class="w-8 h-8 rounded-full flex items-center justify-center text-ink-muted hover:text-terracotta hover:bg-terracotta/10 transition-all" title="Close info card">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <!-- Multi-Product Tabs (if state has >1 products) -->
          ${hasMultipleProducts ? `
            <div class="flex gap-1.5 px-5 py-2 bg-stone-base/30 border-b border-ink/6 overflow-x-auto no-scrollbar">
              ${this.currentProducts.map((p, idx) => `
                <button class="product-tab-btn text-xs font-semibold px-2.5 py-1 rounded-lg transition-all whitespace-nowrap ${
                  idx === this.activeProductIndex 
                    ? 'bg-terracotta text-white shadow-sm' 
                    : 'bg-white/60 text-ink-muted hover:text-ink hover:bg-white'
                }" data-idx="${idx}">
                  ${p.name.split('(')[0].trim()}
                </button>
              `).join('')}
            </div>
          ` : ''}

          <!-- Scrollable Card Content -->
          <div class="p-5 overflow-y-auto space-y-4 flex-1 custom-scroll">
            
            <!-- Modular Exhibition Visual Plate -->
            <div class="relative w-full h-44 sm:h-48 rounded-xl overflow-hidden bg-stone-base shadow-inner group flex items-center justify-center">
              <img src="${bgImgSrc}" alt="${product.category} Background" class="absolute inset-0 w-full h-full object-cover pointer-events-none" />
              <img src="${prodImgSrc}" alt="${product.name}" class="relative z-10 w-full h-full object-contain transition-transform duration-700 group-hover:scale-105" loading="lazy" />

              ${product.year ? `
                <div class="absolute bottom-2.5 right-2.5 z-20">
                  <span class="text-[10px] font-medium text-white/90 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full">
                    Reg: ${product.year}
                  </span>
                </div>
              ` : ''}
            </div>

            <!-- Product Titles & Registration Metadata -->
            <div>
              <div class="flex items-center justify-between gap-2">
                <h2 class="font-serif text-xl sm:text-2xl font-bold text-ink leading-snug">${product.name}</h2>
                <button id="btn-card-speech" class="flex-shrink-0 p-2 rounded-full text-terracotta hover:bg-terracotta/10 transition-all" title="Listen to narration">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg>
                </button>
              </div>
              ${product.registrationNumber ? `
                <span class="text-xs font-mono font-medium text-ink-muted">${product.registrationNumber}</span>
              ` : ''}
            </div>

            <!-- Curatorial Storytelling Description -->
            <p class="text-xs sm:text-sm text-ink leading-relaxed font-normal">${product.description}</p>

            <!-- Key Craftsmanship Highlights -->
            ${product.keyFeatures && product.keyFeatures.length > 0 ? `
              <div class="space-y-1.5 pt-1">
                <h3 class="text-[11px] font-bold uppercase tracking-wider text-ink-muted">Exhibition Highlights</h3>
                <ul class="space-y-1 text-xs text-ink/90">
                  ${product.keyFeatures.map(f => `
                    <li class="flex items-start gap-2">
                      <span class="text-terracotta font-bold text-sm leading-none">•</span>
                      <span>${f}</span>
                    </li>
                  `).join('')}
                </ul>
              </div>
            ` : ''}

            <!-- Other Notable Regional GIs -->
            ${this.currentState.otherGis && this.currentState.otherGis.length > 0 ? `
              <div class="pt-2 border-t border-ink/8">
                <h3 class="text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-1.5">Other ${this.currentState.name} GIs</h3>
                <div class="flex flex-wrap gap-1">
                  ${this.currentState.otherGis.slice(0, 4).map(tag => `
                    <span class="text-[10px] font-medium bg-ink/5 text-ink-muted px-2 py-0.5 rounded-md">${tag}</span>
                  `).join('')}
                </div>
              </div>
            ` : ''}

          </div>
        </article>
      `;

      this.container.innerHTML = html;
      this.cardElement = document.getElementById('active-info-card');

      this.attachCardEvents();

      if (this.cardElement) {
        const startX = isEast ? 40 : -40;
        gsap.fromTo(this.cardElement, 
          { opacity: 0, x: startX, scale: 0.95 },
          { opacity: 1, x: 0, scale: 1, duration: 0.32, ease: 'power2.out' }
        );
      }
    }
  }

  private attachCardEvents(): void {
    const btnClose = document.getElementById('btn-close-card');
    btnClose?.addEventListener('click', () => {
      this.hide();
      this.onClose?.();
    });

    const btnCloseBottom = document.getElementById('btn-close-card-bottom');
    btnCloseBottom?.addEventListener('click', () => {
      this.hide();
      this.onClose?.();
    });

    const btnSpeech = document.getElementById('btn-card-speech');
    btnSpeech?.addEventListener('click', () => {
      if (this.currentProducts.length > 0) {
        this.onSpeak?.(this.currentProducts[this.activeProductIndex]);
      }
    });

    const tabButtons = this.container.querySelectorAll('.product-tab-btn');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt((e.currentTarget as HTMLElement).getAttribute('data-idx') || '0', 10);
        if (idx !== this.activeProductIndex) {
          this.activeProductIndex = idx;
          this.render();
          this.onProductChange?.(this.currentProducts[this.activeProductIndex]);
        }
      });
    });
  }

  public hide(): void {
    if (this.cardElement) {
      gsap.to(this.cardElement, {
        opacity: 0,
        scale: 0.94,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          this.container.innerHTML = '';
          this.container.className = 'absolute inset-0 pointer-events-none z-20 flex justify-between p-6 sm:p-10';
          this.cardElement = null;
          this.currentState = null;
          this.currentProducts = [];
        }
      });
    } else {
      this.container.innerHTML = '';
      this.container.className = 'absolute inset-0 pointer-events-none z-20 flex justify-between p-6 sm:p-10';
      this.currentState = null;
      this.currentProducts = [];
    }
  }

  public getActiveCardAnchor(): { x: number; y: number; isEast: boolean } | null {
    if (!this.cardElement || !this.currentState) return null;
    const rect = this.cardElement.getBoundingClientRect();
    const isEast = this.currentState.orientation === 'east' || this.currentState.orientation === 'northeast';

    const x = isEast ? rect.left : rect.right;
    const y = rect.top + rect.height * 0.45;

    return { x, y, isEast };
  }

  public getActiveProduct(): GIProduct | null {
    if (this.currentProducts.length > 0) {
      return this.currentProducts[this.activeProductIndex];
    }
    return null;
  }

  public getCurrentState(): StateMetadata | null {
    return this.currentState;
  }
}