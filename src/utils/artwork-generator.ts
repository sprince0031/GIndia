import { GIProduct, GICategory } from '../types/gi-data';

interface ArtworkTheme {
  primary: string;
  secondary: string;
  accent: string;
  pattern: string;
  iconSvg: string;
}

const CATEGORY_THEMES: Record<GICategory, ArtworkTheme> = {
  'Handicraft': {
    primary: '#1E3A8A',
    secondary: '#3B82F6',
    accent: '#F59E0B',
    pattern: 'weaving',
    iconSvg: '<path d="M4 6h16M4 12h16M4 18h16M7 4v16M12 4v16M17 4v16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>'
  },
  'Agricultural': {
    primary: '#14532D',
    secondary: '#22C55E',
    accent: '#FACC15',
    pattern: 'foliage',
    iconSvg: '<path d="M12 2L9.5 7.5 4 8.5l4 4-1 5.5 5-2.5 5 2.5-1-5.5 4-4-5.5-1L12 2z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 12v9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>'
  },
  'Food Stuff': {
    primary: '#7C2D12',
    secondary: '#EA580C',
    accent: '#FDE047',
    pattern: 'sunburst',
    iconSvg: '<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 4v16M4 12h16" stroke="currentColor" stroke-width="1.5"/>'
  },
  'Manufactured': {
    primary: '#581C87',
    secondary: '#A855F7',
    accent: '#38BDF8',
    pattern: 'geometric',
    iconSvg: '<polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" fill="none" stroke="currentColor" stroke-width="1.5"/>'
  },
  'Natural Goods': {
    primary: '#713F12',
    secondary: '#CA8A04',
    accent: '#86EFAC',
    pattern: 'stone',
    iconSvg: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" fill="none" stroke="currentColor" stroke-width="1.5"/>'
  }
};

export class ArtworkGenerator {
  public static generateFallbackDataUri(product: GIProduct, width = 600, height = 400): string {
    const theme = CATEGORY_THEMES[product.category] || CATEGORY_THEMES['Handicraft'];
    const safeTitle = this.escapeXml(product.name);
    const safeState = this.escapeXml(product.stateName);
    const safeCat = this.escapeXml(product.category);

    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.primary}" />
      <stop offset="60%" stop-color="#1A202C" />
      <stop offset="100%" stop-color="#0F172A" />
    </linearGradient>
    <radialGradient id="glowGrad" cx="50%" cy="30%" r="60%">
      <stop offset="0%" stop-color="${theme.secondary}" stop-opacity="0.35" />
      <stop offset="100%" stop-color="${theme.secondary}" stop-opacity="0" />
    </radialGradient>
    <pattern id="gridPattern" width="30" height="30" patternUnits="userSpaceOnUse">
      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
    </pattern>
  </defs>

  <!-- Background -->
  <rect width="100%" height="100%" fill="url(#bgGrad)"/>
  <rect width="100%" height="100%" fill="url(#glowGrad)"/>
  <rect width="100%" height="100%" fill="url(#gridPattern)"/>

  <!-- Decorative Mandala / Geometric Motif -->
  <g transform="translate(${width / 2}, ${height / 2 - 25})" stroke="${theme.accent}" stroke-opacity="0.18" fill="none" stroke-width="1.5">
    <circle r="90" />
    <circle r="70" stroke-dasharray="4,6" />
    <circle r="50" />
    <rect x="-45" y="-45" width="90" height="90" transform="rotate(45)" />
    <rect x="-45" y="-45" width="90" height="90" transform="rotate(22.5)" />
    <rect x="-45" y="-45" width="90" height="90" transform="rotate(67.5)" />
  </g>

  <!-- Icon Container -->
  <g transform="translate(${width / 2 - 28}, ${height / 2 - 53}) scale(2.4)" stroke="#FFFFFF" fill="none">
    ${theme.iconSvg}
  </g>

  <!-- Category Badge -->
  <g transform="translate(32, 40)">
    <rect width="130" height="26" rx="13" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.2)" />
    <text x="65" y="17" fill="${theme.accent}" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="600" text-anchor="middle" letter-spacing="1">
      ${safeCat.toUpperCase()}
    </text>
  </g>

  <!-- Text Container -->
  <text x="32" y="${height - 64}" fill="#F9F6F0" font-family="'Playfair Display', Georgia, serif" font-size="24" font-weight="700">
    ${safeTitle}
  </text>
  
  <text x="32" y="${height - 38}" fill="rgba(249, 246, 240, 0.7)" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="500">
    ${safeState} • Geographical Indication of India
  </text>

  <!-- Bottom Accent Line -->
  <rect x="0" y="${height - 4}" width="${width}" height="4" fill="${theme.accent}" />
</svg>
    `.trim();

    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  private static escapeXml(unsafe: string): string {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}