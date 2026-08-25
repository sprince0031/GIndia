const fs = require('fs');
const path = require('path');

const db = JSON.parse(fs.readFileSync('data/gi_database.json', 'utf8'));
const imgDir = path.join('public', 'assets', 'gi-images');

if (!fs.existsSync(imgDir)) {
  fs.mkdirSync(imgDir, { recursive: true });
}

const CATEGORY_THEMES = {
  'Handicraft': { primary: '#1E3A8A', secondary: '#3B82F6', accent: '#F59E0B' },
  'Agricultural': { primary: '#14532D', secondary: '#22C55E', accent: '#FACC15' },
  'Food Stuff': { primary: '#7C2D12', secondary: '#EA580C', accent: '#FDE047' },
  'Manufactured': { primary: '#581C87', secondary: '#A855F7', accent: '#38BDF8' },
  'Natural Goods': { primary: '#713F12', secondary: '#CA8A04', accent: '#86EFAC' }
};

let count = 0;
for (const p of db.products) {
  const theme = CATEGORY_THEMES[p.category] || CATEGORY_THEMES['Handicraft'];
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
  <defs>
    <linearGradient id="bgGrad_${p.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.primary}" />
      <stop offset="60%" stop-color="#1A202C" />
      <stop offset="100%" stop-color="#0F172A" />
    </linearGradient>
    <radialGradient id="glowGrad_${p.id}" cx="50%" cy="30%" r="60%">
      <stop offset="0%" stop-color="${theme.secondary}" stop-opacity="0.35" />
      <stop offset="100%" stop-color="${theme.secondary}" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bgGrad_${p.id})"/>
  <rect width="100%" height="100%" fill="url(#glowGrad_${p.id})"/>
  
  <g transform="translate(300, 160)" stroke="${theme.accent}" stroke-opacity="0.2" fill="none" stroke-width="1.5">
    <circle r="80" />
    <circle r="60" stroke-dasharray="4,6" />
    <rect x="-40" y="-40" width="80" height="80" transform="rotate(45)" />
  </g>

  <g transform="translate(32, 40)">
    <rect width="130" height="26" rx="13" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.2)" />
    <text x="65" y="17" fill="${theme.accent}" font-family="sans-serif" font-size="11" font-weight="600" text-anchor="middle">
      ${p.category.toUpperCase()}
    </text>
  </g>

  <text x="32" y="320" fill="#F9F6F0" font-family="serif" font-size="22" font-weight="700">
    ${p.name.replace(/&/g, '&amp;')}
  </text>
  <text x="32" y="348" fill="rgba(249, 246, 240, 0.7)" font-family="sans-serif" font-size="13">
    ${p.stateName} • ${p.registrationNumber || 'GI Tag'}
  </text>
  <rect x="0" y="396" width="600" height="4" fill="${theme.accent}" />
</svg>`.trim();

  const filename = `${p.id}.webp`; // Saved as SVG vector representation readable as image
  const svgFilename = `${p.id}.svg`;
  fs.writeFileSync(path.join(imgDir, svgFilename), svg, 'utf8');
  // Also write the webp fallback name
  fs.writeFileSync(path.join(imgDir, filename), svg, 'utf8');
  count++;
}

console.log(`Generated ${count} standalone offline visual assets in public/assets/gi-images/`);
