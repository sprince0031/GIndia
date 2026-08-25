import { GIProduct } from '../types/gi-data';

export class ArtworkGenerator {
  public static generateFallbackDataUri(product: GIProduct, width = 600, height = 400): string {
    const safeTitle = this.escapeXml(product.name);
    const safeState = this.escapeXml(product.stateName);

    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E293B" />
      <stop offset="60%" stop-color="#0F172A" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
    <radialGradient id="spotlight" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#D9531E" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
  </defs>

  <rect width="100%" height="100%" fill="url(#bgGrad)"/>
  <rect width="100%" height="100%" fill="url(#spotlight)"/>

  <!-- Museum Exhibition Pedestal -->
  <circle cx="300" cy="180" r="120" fill="none" stroke="#D9531E" stroke-opacity="0.18" stroke-width="1.5" />
  <circle cx="300" cy="180" r="95" fill="none" stroke="#D9531E" stroke-opacity="0.12" stroke-width="1" stroke-dasharray="4,6" />

  <!-- Hero Artifact Representation -->
  <g transform="translate(300, 180)">
    <circle cx="0" cy="0" r="60" fill="#CA8A04" opacity="0.2" />
    <polygon points="0,-55 16,-18 55,-18 25,10 38,50 0,25 -38,50 -25,10 -55,-18 -16,-18" fill="#EAB308" stroke="#CA8A04" stroke-width="2.5" />
    <circle cx="0" cy="0" r="24" fill="#78350F" />
    <circle cx="0" cy="0" r="18" fill="#FDE047" />
  </g>

  <!-- Curatorial Caption Bar -->
  <rect x="0" y="325" width="600" height="75" fill="rgba(15, 23, 42, 0.75)" />
  <rect x="0" y="325" width="600" height="1" fill="rgba(255, 255, 255, 0.12)" />

  <text x="32" y="358" fill="#F9F6F0" font-family="'Playfair Display', Georgia, serif" font-size="20" font-weight="700">
    ${safeTitle}
  </text>
  
  <text x="32" y="382" fill="rgba(249, 246, 240, 0.7)" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="500">
    ${safeState} • Registered Geographical Indication of India
  </text>

  <rect x="0" y="396" width="600" height="4" fill="#D9531E" />
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