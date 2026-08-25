import { GIProduct } from '../types/gi-data';
import { ArtworkGenerator } from './artwork-generator';

export class AssetLoader {
  private static imageCache: Map<string, HTMLImageElement> = new Map();
  private static pendingLoads: Map<string, Promise<string>> = new Map();

  public static resolveUrl(url: string): string {
    if (!url || url.startsWith('http') || url.startsWith('data:')) {
      return url;
    }
    const base = import.meta.env.BASE_URL || './';
    const cleanBase = base.endsWith('/') ? base : `${base}/`;
    const cleanPath = url.startsWith('/') || url.startsWith('./') ? url.replace(/^(\.\/|\/)/, '') : url;
    return `${cleanBase}${cleanPath}`;
  }

  /**
   * Preload an image URL into browser cache with immediate fallback to generated SVG
   */
  public static async loadImage(product: GIProduct): Promise<string> {
    const rawUrl = product.imageUrl;
    const url = this.resolveUrl(rawUrl);

    if (this.imageCache.has(url)) {
      return url;
    }

    if (this.pendingLoads.has(url)) {
      return this.pendingLoads.get(url)!;
    }

    const loadPromise = new Promise<string>((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        this.imageCache.set(url, img);
        resolve(url);
      };

      img.onerror = () => {
        // Return artistic vector fallback when external/local photo fails
        const fallback = ArtworkGenerator.generateFallbackDataUri(product);
        resolve(fallback);
      };

      img.src = url;
    });

    this.pendingLoads.set(url, loadPromise);
    return loadPromise;
  }

  /**
   * Batch preload images for a list of products
   */
  public static async preloadProducts(products: GIProduct[]): Promise<void> {
    await Promise.all(products.map(p => this.loadImage(p)));
  }

  /**
   * Synchronously obtain a displayable image src (returns either cached url or instant SVG fallback)
   */
  public static getDisplaySrc(product: GIProduct): string {
    const url = this.resolveUrl(product.imageUrl);
    if (this.imageCache.has(url)) {
      return url;
    }
    // Preload in background and return instant vector fallback
    this.loadImage(product);
    return ArtworkGenerator.generateFallbackDataUri(product);
  }
}