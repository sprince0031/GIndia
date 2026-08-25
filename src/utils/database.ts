import dbJson from '../../data/gi_database.json';
import { GIDatabase, GIProduct, StateMetadata, GICategory, ExhibitionSummary, CategoryInfo } from '../types/gi-data';

class DatabaseManager {
  private data: GIDatabase;
  private productIndex: Map<string, GIProduct> = new Map();
  private stateIndex: Map<string, StateMetadata> = new Map();
  private stateProductsIndex: Map<string, GIProduct[]> = new Map();

  constructor() {
    this.data = dbJson as unknown as GIDatabase;
    this.buildIndexes();
  }

  private buildIndexes(): void {
    // Index States
    for (const [key, state] of Object.entries(this.data.states)) {
      this.stateIndex.set(key.toUpperCase(), state);
      // Also map with hyphen if applicable (e.g. IN-WB -> INWB)
      if (key.includes('-')) {
        this.stateIndex.set(key.replace('-', '').toUpperCase(), state);
      }
    }

    // Index Products
    for (const product of this.data.products) {
      this.productIndex.set(product.id.toLowerCase(), product);
      
      const normalizedStateId = product.stateId.replace('-', '').toUpperCase();
      if (!this.stateProductsIndex.has(normalizedStateId)) {
        this.stateProductsIndex.set(normalizedStateId, []);
      }
      this.stateProductsIndex.get(normalizedStateId)!.push(product);
    }
  }

  public getAllStates(): StateMetadata[] {
    return Object.values(this.data.states);
  }

  public getStateById(stateId: string): StateMetadata | undefined {
    const key = stateId.replace('-', '').toUpperCase();
    return this.stateIndex.get(key);
  }

  public getAllProducts(): GIProduct[] {
    return this.data.products;
  }

  public getProductById(productId: string): GIProduct | undefined {
    return this.productIndex.get(productId.toLowerCase());
  }

  public getProductsByState(stateId: string): GIProduct[] {
    const key = stateId.replace('-', '').toUpperCase();
    return this.stateProductsIndex.get(key) || [];
  }

  public getCategories(): CategoryInfo[] {
    return this.data.categories;
  }

  public filterProductsByCategory(category: GICategory | 'All'): GIProduct[] {
    if (category === 'All') {
      return this.data.products;
    }
    return this.data.products.filter(p => p.category === category);
  }

  public searchProducts(query: string): { products: GIProduct[]; matchedStates: StateMetadata[] } {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      return { products: this.data.products, matchedStates: [] };
    }

    const tokens = trimmed.split(/\s+/).filter(Boolean);

    const matchedProducts = this.data.products.filter(product => {
      const searchableText = [
        product.name,
        product.stateName,
        product.category,
        product.description,
        ...(product.keyFeatures || []),
        ...(product.tags || [])
      ].join(' ').toLowerCase();

      return tokens.every(token => searchableText.includes(token));
    });

    const matchedStates = Object.values(this.data.states).filter(state => {
      const stateSearchable = [
        state.name,
        state.code,
        state.capital,
        ...(state.otherGis || [])
      ].join(' ').toLowerCase();

      return tokens.every(token => stateSearchable.includes(token));
    });

    return { products: matchedProducts, matchedStates };
  }

  public getNationalStats(): ExhibitionSummary {
    return this.data.summary;
  }

  public getDatabase(): GIDatabase {
    return this.data;
  }
}

export const db = new DatabaseManager();