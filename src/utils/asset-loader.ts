import { GIProduct } from '../types/gi-data';
import { ArtworkGenerator } from './artwork-generator';

export class AssetLoader {
  private static imageCache: Map<string, HTMLImageElement> = new Map();
  private static pendingLoads: Map<string, Promise<string>> = new Map();

  /**
   * Preload an image URL into browser cache with immediate fallback to generated SVG
   */
  public static async loadImage(product: GIProduct): Promise<string> {
    const url = product.imageUrl;

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
    if (this.imageCache.has(product.imageUrl)) {
      return product.imageUrl;
    }
    // Return instant fallback while loading in background
    this.loadImage(product);
    return ArtworkGenerator.generateFallbackDataUri(product);
  }
}