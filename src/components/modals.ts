import { db } from '../utils/database';

export class ModalManager {
  private container: HTMLElement;
  private onSelectState?: (stateId: string) => void;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  public openSearchModal(onSelectState: (stateId: string) => void): void {
    this.onSelectState = onSelectState;
    this.container.classList.remove('hidden');

    const html = `
      <div class="glass-panel w-full max-w-xl rounded-2xl shadow-2xl p-6 relative animate-card-in flex flex-col max-h-[80vh]">
        <!-- Search Input -->
        <div class="flex items-center gap-3 pb-4 border-b border-ink/10">
          <svg class="w-5 h-5 text-terracotta flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input type="text" id="modal-search-input" placeholder="Search GI products, states, crafts, spices..." class="w-full bg-transparent text-sm sm:text-base text-ink placeholder-ink-muted focus:outline-none font-medium" autofocus />
          <button id="modal-btn-close" class="p-1 rounded-lg text-ink-muted hover:text-terracotta hover:bg-terracotta/10 transition-colors">✕</button>
        </div>

        <!-- Results List -->
        <div id="modal-search-results" class="flex-1 overflow-y-auto py-3 space-y-2 custom-scroll">
          <!-- Populated dynamically -->
        </div>

        <!-- Keyboard Hint -->
        <div class="pt-3 border-t border-ink/8 flex items-center justify-between text-[11px] text-ink-muted">
          <span>Search 50+ GI products & 36 States</span>
          <span>Press <kbd class="px-1.5 py-0.5 bg-ink/10 rounded font-mono">ESC</kbd> to close</span>
        </div>
      </div>
    `;

    this.container.innerHTML = html;
    const input = document.getElementById('modal-search-input') as HTMLInputElement;
    const resultsContainer = document.getElementById('modal-search-results');
    const btnClose = document.getElementById('modal-btn-close');

    btnClose?.addEventListener('click', () => this.close());
    this.container.addEventListener('click', (e) => {
      if (e.target === this.container) this.close();
    });

    const renderResults = (query: string) => {
      if (!resultsContainer) return;
      const { products, matchedStates } = db.searchProducts(query);

      if (products.length === 0 && matchedStates.length === 0) {
        resultsContainer.innerHTML = `
          <div class="text-center py-8 text-xs text-ink-muted">
            No geographical indications found matching "${query}".
          </div>
        `;
        return;
      }

      resultsContainer.innerHTML = `
        ${products.slice(0, 15).map(p => `
          <button class="search-item-btn w-full text-left p-2.5 rounded-xl hover:bg-terracotta/10 flex items-center justify-between transition-colors group" data-state="${p.stateId}">
            <div class="flex items-center gap-3">
              <span class="w-2 h-2 rounded-full bg-terracotta"></span>
              <div>
                <div class="text-xs sm:text-sm font-semibold text-ink group-hover:text-terracotta transition-colors">${p.name}</div>
                <div class="text-[11px] text-ink-muted">${p.stateName} • ${p.category}</div>
              </div>
            </div>
            <span class="text-[10px] text-terracotta font-medium px-2 py-0.5 rounded bg-terracotta/10">${p.year || 'GI Tag'}</span>
          </button>
        `).join('')}
      `;

      resultsContainer.querySelectorAll('.search-item-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const stateId = (e.currentTarget as HTMLElement).getAttribute('data-state');
          if (stateId) {
            this.close();
            this.onSelectState?.(stateId);
          }
        });
      });
    };

    renderResults('');

    input?.addEventListener('input', (e) => {
      renderResults((e.target as HTMLInputElement).value);
    });

    input?.focus();
  }

  public openStatsModal(onSelectState: (stateId: string) => void): void {
    this.onSelectState = onSelectState;
    this.container.classList.remove('hidden');

    const stats = db.getNationalStats();

    const html = `
      <div class="glass-panel w-full max-w-2xl rounded-2xl shadow-2xl p-6 sm:p-8 relative animate-card-in flex flex-col max-h-[85vh] overflow-y-auto custom-scroll">
        <!-- Header -->
        <div class="flex items-center justify-between pb-4 border-b border-ink/10">
          <div>
            <h2 class="font-serif text-xl sm:text-2xl font-bold text-ink">Geographical Indications Atlas</h2>
            <p class="text-xs text-ink-muted">National GI distribution & regional craft heritage</p>
          </div>
          <button id="modal-btn-close" class="p-1 rounded-lg text-ink-muted hover:text-terracotta hover:bg-terracotta/10 transition-colors">✕</button>
        </div>

        <!-- Metric Cards -->
        <div class="grid grid-cols-3 gap-3 my-5">
          <div class="p-4 rounded-xl bg-canvas-subtle border border-ink/8 text-center">
            <div class="font-serif text-2xl sm:text-3xl font-bold text-terracotta">${stats.totalStatesCovered}</div>
            <div class="text-[11px] font-semibold uppercase tracking-wider text-ink-muted mt-1">States & UTs</div>
          </div>
          <div class="p-4 rounded-xl bg-canvas-subtle border border-ink/8 text-center">
            <div class="font-serif text-2xl sm:text-3xl font-bold text-indigo">${stats.totalFeaturedProducts}</div>
            <div class="text-[11px] font-semibold uppercase tracking-wider text-ink-muted mt-1">Spotlight GIs</div>
          </div>
          <div class="p-4 rounded-xl bg-canvas-subtle border border-ink/8 text-center">
            <div class="font-serif text-2xl sm:text-3xl font-bold text-gold">${stats.totalCatalogEntries}+</div>
            <div class="text-[11px] font-semibold uppercase tracking-wider text-ink-muted mt-1">Total Catalog</div>
          </div>
        </div>

        <!-- Top States Leaderboard -->
        <div class="space-y-3">
          <h3 class="text-xs font-bold uppercase tracking-wider text-ink-muted">Leading States by Registered GI Tags</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            ${stats.topStatesByGI.map((s, idx) => `
              <button class="stats-state-btn flex items-center justify-between p-2.5 rounded-xl bg-white/70 hover:bg-terracotta/10 border border-ink/6 transition-colors group text-left" data-state="${s.code}">
                <div class="flex items-center gap-2.5">
                  <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${idx < 3 ? 'bg-terracotta text-white' : 'bg-ink/10 text-ink-muted'}">${idx + 1}</span>
                  <span class="text-xs font-semibold text-ink group-hover:text-terracotta transition-colors">${s.name}</span>
                </div>
                <span class="text-xs font-bold font-mono text-terracotta">${s.count} tags</span>
              </button>
            `).join('')}
          </div>
        </div>

        <div class="pt-5 mt-5 border-t border-ink/8 text-center text-xs text-ink-muted">
          Click any state above to navigate the 3D map directly.
        </div>
      </div>
    `;

    this.container.innerHTML = html;
    const btnClose = document.getElementById('modal-btn-close');
    btnClose?.addEventListener('click', () => this.close());
    this.container.addEventListener('click', (e) => {
      if (e.target === this.container) this.close();
    });

    this.container.querySelectorAll('.stats-state-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const stateId = (e.currentTarget as HTMLElement).getAttribute('data-state');
        if (stateId) {
          this.close();
          this.onSelectState?.(stateId);
        }
      });
    });
  }

  public close(): void {
    this.container.classList.add('hidden');
    this.container.innerHTML = '';
  }
}