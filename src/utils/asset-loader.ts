import { GIProduct } from '../types/gi-data';
import { ArtworkGenerator } from './artwork-generator';

export class AssetLoader {
  private static imageCache: Map<string, HTMLImageElement> = new Map();

  public static resolveUrl(url: string): string {
    if (!url || url.startsWith('http') || url.startsWith('data:')) {
      return url;
    }
    const base = import.meta.env.BASE_URL || './';
    const cleanBase = base.endsWith('/') ? base : `${base}/`;
    const cleanPath = url.startsWith('/') || url.startsWith('./') ? url.replace(/^(\.\/|\/)/, '') : url;
    return `${cleanBase}${cleanPath}`;
  }

  public static getCategoryBackgroundSrc(category: string): string {
    const slugMap: Record<string, string> = {
      'Handicraft': 'handicrafts-bg.svg',
      'Handicrafts': 'handicrafts-bg.svg',
      'Agricultural': 'agricultural-bg.svg',
      'Food Stuff': 'food-stuff-bg.svg',
      'Manufactured': 'manufactured-bg.svg',
      'Natural Goods': 'natural-goods-bg.svg'
    };
    const file = slugMap[category] || 'handicrafts-bg.svg';
    return this.resolveUrl(`assets/gi-images/backgrounds/${file}`);
  }

  public static getDisplaySrc(product: GIProduct): string {
    if (product.imageUrl) {
      return this.resolveUrl(product.imageUrl);
    }
    return ArtworkGenerator.generateFallbackDataUri(product);
  }

  public static preloadProducts(products: GIProduct[]): void {
    products.forEach(p => {
      if (p.imageUrl) {
        const url = this.resolveUrl(p.imageUrl);
        if (!this.imageCache.has(url)) {
          const img = new Image();
          img.src = url;
          this.imageCache.set(url, img);
        }
      }
    });
  }
}