const fs = require('fs');
const path = require('path');

const dbPath = path.resolve('data/gi_database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const giImagesDir = path.resolve('public/assets/gi-images');
const bgDir = path.resolve('public/assets/gi-images/backgrounds');

if (!fs.existsSync(bgDir)) {
  fs.mkdirSync(bgDir, { recursive: true });
}

// Category palette & ambient background styling
const CATEGORY_STYLES = {
  'Handicraft': { primary: '#1E3A8A', secondary: '#3B82F6', accent: '#F59E0B', bg1: '#0F172A', bg2: '#1E293B', file: 'handicraft-bg.svg' },
  'Handicrafts': { primary: '#1E3A8A', secondary: '#3B82F6', accent: '#F59E0B', bg1: '#0F172A', bg2: '#1E293B', file: 'handicrafts-bg.svg' },
  'Agricultural': { primary: '#14532D', secondary: '#22C55E', accent: '#FACC15', bg1: '#052E16', bg2: '#14532D', file: 'agricultural-bg.svg' },
  'Food Stuff': { primary: '#7C2D12', secondary: '#EA580C', accent: '#FDE047', bg1: '#431407', bg2: '#7C2D12', file: 'food-stuff-bg.svg' },
  'Manufactured': { primary: '#581C87', secondary: '#A855F7', accent: '#38BDF8', bg1: '#2E1065', bg2: '#581C87', file: 'manufactured-bg.svg' },
  'Natural Goods': { primary: '#713F12', secondary: '#CA8A04', accent: '#86EFAC', bg1: '#422006', bg2: '#713F12', file: 'natural-goods-bg.svg' }
};

// 1. Generate Modular Category Background Plates
for (const [catName, style] of Object.entries(CATEGORY_STYLES)) {
  const bgSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
  <defs>
    <linearGradient id="bgGrad_${catName.replace(/\s+/g, '_')}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${style.primary}" />
      <stop offset="50%" stop-color="${style.bg1}" />
      <stop offset="100%" stop-color="${style.bg2}" />
    </linearGradient>
    <radialGradient id="spotlight_${catName.replace(/\s+/g, '_')}" cx="50%" cy="45%" r="55%">
      <stop offset="0%" stop-color="${style.secondary}" stop-opacity="0.45" />
      <stop offset="60%" stop-color="${style.secondary}" stop-opacity="0.1" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="floorShadow_${catName.replace(/\s+/g, '_')}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(0,0,0,0.6)" />
      <stop offset="100%" stop-color="rgba(0,0,0,0)" />
    </radialGradient>
  </defs>

  <!-- Ambient Gallery Plate Canvas -->
  <rect width="100%" height="100%" fill="url(#bgGrad_${catName.replace(/\s+/g, '_')})"/>
  <rect width="100%" height="100%" fill="url(#spotlight_${catName.replace(/\s+/g, '_')})"/>

  <!-- Museum Exhibition Pedestal & Aura -->
  <circle cx="300" cy="180" r="140" fill="none" stroke="${style.accent}" stroke-opacity="0.12" stroke-width="1.5" />
  <circle cx="300" cy="180" r="115" fill="none" stroke="${style.accent}" stroke-opacity="0.08" stroke-width="1" stroke-dasharray="6,6" />

  <!-- Pedestal Floor Drop Shadow -->
  <ellipse cx="300" cy="285" rx="140" ry="25" fill="url(#floorShadow_${catName.replace(/\s+/g, '_')})" />

  <!-- Subtle Museum Accent Base Line -->
  <rect x="0" y="396" width="600" height="4" fill="${style.accent}" />
</svg>
  `.trim();

  fs.writeFileSync(path.join(bgDir, style.file), bgSvg, 'utf8');
}
console.log("✅ Created modular category background plates in public/assets/gi-images/backgrounds/");

// 2. Standalone Physical Object Illustrations (Transparent Background)
function renderStandaloneProductObject(id) {
  switch (id) {
    case 'darjeeling-tea':
      return `
        <ellipse cx="0" cy="55" rx="90" ry="24" fill="#E2E8F0" opacity="0.9" />
        <ellipse cx="0" cy="52" rx="75" ry="18" fill="#CBD5E1" />
        <path d="M-55,20 C-50,60 50,60 55,20 C55,-10 -55,-10 -55,20 Z" fill="#FFFFFF" filter="drop-shadow(0 10px 15px rgba(0,0,0,0.3))" />
        <ellipse cx="0" cy="18" rx="52" ry="14" fill="#C2410C" />
        <ellipse cx="0" cy="18" rx="46" ry="11" fill="#D97706" opacity="0.9" />
        <path d="M52,15 C75,15 75,45 50,45" fill="none" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" />
        <g transform="translate(10, -25) scale(1.1)">
          <path d="M0,20 Q-30,-20 0,-60 Q30,-20 0,20 Z" fill="#16A34A" />
          <path d="M0,20 Q-15,-15 0,-60" fill="none" stroke="#86EFAC" stroke-width="2" />
          <path d="M-15,10 Q-50,0 -40,-40 Q-10,-20 -15,10 Z" fill="#22C55E" />
          <path d="M15,15 Q50,5 40,-35 Q10,-15 15,15 Z" fill="#15803D" />
          <circle cx="-5" cy="-25" r="4" fill="#FEF08A" opacity="0.9" filter="drop-shadow(0 0 4px #FACC15)" />
        </g>
        <path d="M-15,0 Q-25,-30 -10,-50 T-20,-90" fill="none" stroke="#FFFFFF" stroke-width="2.5" opacity="0.4" stroke-linecap="round" />
        <path d="M10,-5 Q25,-35 15,-60 T25,-95" fill="none" stroke="#FFFFFF" stroke-width="2" opacity="0.3" stroke-linecap="round" />
      `;

    case 'gobindobhog-rice':
      return `
        <ellipse cx="0" cy="60" rx="80" ry="20" fill="rgba(0,0,0,0.4)" />
        <path d="M-70,10 Q-80,65 0,70 Q80,65 70,10 Z" fill="#9A3412" />
        <path d="M-65,15 Q-75,60 0,65 Q75,60 65,15 Z" fill="#C2410C" />
        <ellipse cx="0" cy="12" rx="68" ry="22" fill="#F8FAFC" />
        <path d="M-65,12 Q0,-45 65,12 Z" fill="#FFFFFF" />
        ${Array.from({length: 24}).map((_, i) => {
          const rx = (Math.random() - 0.5) * 90;
          const ry = -10 - Math.random() * 25;
          const rot = Math.random() * 180;
          return `<ellipse cx="${rx.toFixed(1)}" cy="${ry.toFixed(1)}" rx="5.5" ry="2.8" fill="#F1F5F9" stroke="#E2E8F0" stroke-width="0.8" transform="rotate(${rot.toFixed(1)}, ${rx.toFixed(1)}, ${ry.toFixed(1)})" />`;
        }).join('')}
        <g transform="translate(0, -35) scale(0.8)">
          <path d="M0,0 Q-15,-20 0,-35 Q15,-20 0,0 Z" fill="#15803D" />
          <path d="M0,0 Q-20,-10 -25,-25 Q-5,-20 0,0 Z" fill="#16A34A" />
          <path d="M0,0 Q20,-10 25,-25 Q5,-20 0,0 Z" fill="#15803D" />
        </g>
      `;

    case 'kashmir-pashmina':
      return `
        <path d="M-90,-50 C-40,-70 40,-30 90,-50 C110,20 70,70 40,80 C-20,90 -90,40 -90,-50 Z" fill="#991B1B" filter="drop-shadow(0 15px 25px rgba(0,0,0,0.5))" />
        <path d="M-75,-35 C-30,-50 35,-20 75,-35 C90,15 60,55 35,65 C-15,75 -75,35 -75,-35 Z" fill="#B91C1C" />
        <g transform="translate(0, 10) scale(0.95)" fill="none" stroke="#FDE047" stroke-width="2">
          <path d="M0,35 C-25,35 -40,15 -35,-10 C-30,-35 -10,-55 5,-65 C10,-45 -5,-30 0,-10 C5,10 25,35 0,35 Z" fill="#D97706" opacity="0.85" />
          <path d="M-10,15 Q-20,0 -15,-15 Q0,-30 5,-45" stroke="#FEF08A" />
          <circle cx="-5" cy="5" r="4" fill="#FEF08A" />
          <circle cx="-15" cy="-5" r="3" fill="#FEF08A" />
        </g>
        ${Array.from({length: 12}).map((_, i) => {
          const x = -50 + i * 9;
          return `<line x1="${x}" y1="75" x2="${x + (i % 2 === 0 ? -3 : 3)}" y2="100" stroke="#FDE047" stroke-width="1.8" stroke-linecap="round" />`;
        }).join('')}
      `;

    case 'kashmir-saffron':
      return `
        <g transform="translate(0, 20)">
          <ellipse cx="-40" cy="10" rx="35" ry="60" fill="#6B21A8" transform="rotate(-35, -40, 10)" opacity="0.9" />
          <ellipse cx="40" cy="10" rx="35" ry="60" fill="#7E22CE" transform="rotate(35, 40, 10)" opacity="0.9" />
          <ellipse cx="0" cy="20" rx="38" ry="65" fill="#9333EA" />
          <ellipse cx="0" cy="15" rx="16" ry="25" fill="#EAB308" />
        </g>
        <g stroke="#DC2626" stroke-width="4.5" stroke-linecap="round" fill="none" filter="drop-shadow(0 0 10px #EF4444)">
          <path d="M0,15 Q-25,-30 -50,-70 Q-55,-85 -40,-90" />
          <path d="M0,15 Q0,-45 0,-85 Q5,-100 20,-95" />
          <path d="M0,15 Q25,-30 50,-70 Q55,-85 40,-90" />
        </g>
        <circle cx="-40" cy="-90" r="5" fill="#991B1B" />
        <circle cx="20" cy="-95" r="5" fill="#991B1B" />
        <circle cx="40" cy="-90" r="5" fill="#991B1B" />
      `;

    case 'kanchipuram-silk-saree':
      return `
        <rect x="-85" y="-55" width="170" height="120" rx="10" fill="#831843" filter="drop-shadow(0 15px 25px rgba(0,0,0,0.5))" />
        <rect x="-75" y="-45" width="150" height="100" rx="6" fill="#9D174D" />
        <rect x="-75" y="15" width="150" height="40" fill="#CA8A04" />
        <g fill="#FEF08A">
          ${Array.from({length: 6}).map((_, i) => `<polygon points="${-65 + i * 25},15 ${-52.5 + i * 25},-5 ${-40 + i * 25},15" />`).join('')}
        </g>
        <g transform="translate(0, -15) scale(0.9)" fill="#FDE047">
          <circle cx="-10" cy="-10" r="7" />
          <path d="M-10,-3 C-5,15 15,20 25,0 C30,-15 15,-20 0,-15" />
          <path d="M15,-5 Q35,-15 45,-5 Q30,10 15,0" />
        </g>
      `;

    case 'thanjavur-gold-paintings':
      return `
        <rect x="-80" y="-70" width="160" height="145" rx="8" fill="#451A03" stroke="#78350F" stroke-width="6" filter="drop-shadow(0 15px 30px rgba(0,0,0,0.6))" />
        <rect x="-68" y="-58" width="136" height="121" fill="#7F1D1D" />
        <path d="M-55,45 L-55,-20 Q0,-65 55,-20 L55,45 Z" fill="#EAB308" stroke="#CA8A04" stroke-width="2" />
        <path d="M-45,45 L-45,-15 Q0,-50 45,-15 L45,45 Z" fill="#1E293B" />
        <circle cx="0" cy="-5" r="18" fill="#38BDF8" />
        <path d="M-15,35 Q0,10 15,35 Z" fill="#EAB308" />
        <line x1="-25" y1="12" x2="28" y2="2" stroke="#FEF08A" stroke-width="4" stroke-linecap="round" />
        <circle cx="0" cy="-28" r="7" fill="#10B981" />
        <circle cx="-55" cy="-20" r="4" fill="#DC2626" />
        <circle cx="55" cy="-20" r="4" fill="#059669" />
        <circle cx="0" cy="-55" r="5" fill="#DC2626" />
      `;

    case 'channapatna-wooden-toys':
      return `
        <ellipse cx="0" cy="65" rx="75" ry="16" fill="#0284C7" />
        <ellipse cx="0" cy="48" rx="60" ry="14" fill="#DC2626" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.3))" />
        <ellipse cx="0" cy="32" rx="50" ry="12" fill="#EAB308" />
        <ellipse cx="0" cy="18" rx="40" ry="10" fill="#16A34A" />
        <ellipse cx="0" cy="5" rx="30" ry="8" fill="#EA580C" />
        <circle cx="0" cy="-22" r="22" fill="#FBBF24" filter="drop-shadow(0 6px 10px rgba(0,0,0,0.3))" />
        <circle cx="-7" cy="-25" r="3.5" fill="#1E293B" />
        <circle cx="7" cy="-25" r="3.5" fill="#1E293B" />
        <path d="M-6,-14 Q0,-8 6,-14" stroke="#DC2626" stroke-width="2.5" fill="none" stroke-linecap="round" />
        <polygon points="0,-60 -16,-38 16,-38" fill="#DC2626" />
        <circle cx="0" cy="-62" r="5" fill="#FEF08A" />
        <path d="M-10,-32 Q-14,-22 -12,-12" stroke="#FFFFFF" stroke-width="2" fill="none" opacity="0.6" stroke-linecap="round" />
      `;

    case 'mysore-pure-silk':
      return `
        <rect x="-85" y="-55" width="170" height="115" rx="10" fill="#1E3A8A" filter="drop-shadow(0 15px 25px rgba(0,0,0,0.5))" />
        <rect x="-75" y="-45" width="150" height="95" rx="6" fill="#1D4ED8" />
        <rect x="-75" y="10" width="150" height="40" fill="#EAB308" />
        <g fill="#1E3A8A" transform="translate(-50, 28) scale(0.7)">
          <polygon points="0,-15 15,0 0,15 -15,0" />
          <polygon points="35,-15 50,0 35,15 20,0" />
          <polygon points="70,-15 85,0 70,15 55,0" />
          <polygon points="105,-15 120,0 105,15 90,0" />
        </g>
        <path d="M-75,-25 Q0,-45 75,-25" stroke="#FDE047" stroke-width="2" stroke-dasharray="4,4" fill="none" />
      `;

    case 'aranmula-kannadi-mirror':
      return `
        <path d="M-8,50 L-14,100 L14,100 L8,50 Z" fill="#CA8A04" stroke="#A16207" stroke-width="2" />
        <circle cx="0" cy="105" r="8" fill="#EAB308" />
        <circle cx="0" cy="0" r="62" fill="#EAB308" filter="drop-shadow(0 15px 25px rgba(0,0,0,0.5))" />
        <circle cx="0" cy="0" r="54" fill="#CA8A04" />
        <ellipse cx="0" cy="0" rx="42" ry="46" fill="#E2E8F0" />
        <ellipse cx="0" cy="0" rx="38" ry="42" fill="#F8FAFC" />
        <path d="M-25,-30 L20,35 L32,30 L-13,-35 Z" fill="#FFFFFF" opacity="0.6" />
        <g transform="translate(0, -62)" fill="#EAB308">
          <circle cx="0" cy="-10" r="9" />
          <circle cx="-20" cy="-4" r="6" />
          <circle cx="20" cy="-4" r="6" />
        </g>
      `;

    case 'malabar-black-pepper':
      return `
        <path d="M-70,50 Q-80,10 -40,-30 Q30,-40 65,-10 Q80,40 50,60 Z" fill="#A16207" filter="drop-shadow(0 15px 20px rgba(0,0,0,0.4))" />
        <path d="M-60,40 Q-70,10 -35,-20 Q25,-30 55,-5 Q70,35 45,50 Z" fill="#78350F" />
        <path d="M-50,-20 Q-70,-60 -30,-70 Q-10,-40 -50,-20 Z" fill="#15803D" />
        <path d="M20,-30 Q60,-70 70,-40 Q40,-10 20,-30 Z" fill="#16A34A" />
        <g fill="#18181B" stroke="#27272A" stroke-width="1.5">
          ${[
            [-25, 10, 14], [-5, 5, 16], [18, 15, 15], [35, 25, 13],
            [-15, 30, 15], [10, 32, 16], [-35, 28, 12], [28, -5, 13],
            [-5, -15, 14], [10, -5, 13], [-45, 45, 11], [-10, 50, 14],
            [15, 52, 13], [35, 48, 12], [0, 25, 15]
          ].map(([cx, cy, r]) => `
            <circle cx="${cx}" cy="${cy}" r="${r}" filter="drop-shadow(0 3px 5px rgba(0,0,0,0.5))" />
            <circle cx="${cx - r * 0.3}" cy="${cy - r * 0.3}" r="${r * 0.25}" fill="#71717A" opacity="0.7" />
          `).join('')}
        </g>
      `;

    case 'banarasi-silk-brocade':
      return `
        <rect x="-85" y="-55" width="170" height="115" rx="10" fill="#991B1B" filter="drop-shadow(0 15px 25px rgba(0,0,0,0.5))" />
        <rect x="-75" y="-45" width="150" height="95" rx="6" fill="#B91C1C" />
        <g stroke="#FDE047" stroke-width="2" fill="none" opacity="0.9">
          <circle cx="0" cy="0" r="28" fill="#CA8A04" fill-opacity="0.3" />
          <circle cx="-45" cy="0" r="20" />
          <circle cx="45" cy="0" r="20" />
          <path d="M-60,-35 Q0,-10 60,-35" />
          <path d="M-60,35 Q0,10 60,35" />
        </g>
        <circle cx="0" cy="0" r="8" fill="#FEF08A" />
      `;

    case 'kannauj-rose-attar':
      return `
        <path d="M-40,65 L-45,0 L-20,-20 L20,-20 L45,0 L40,65 Z" fill="#D97706" opacity="0.85" filter="drop-shadow(0 15px 20px rgba(0,0,0,0.4))" />
        <path d="M-40,65 L-45,0 L-20,-20 L20,-20 L45,0 L40,65 Z" fill="none" stroke="#E2E8F0" stroke-width="4" />
        <polygon points="0,-65 -15,-40 15,-40" fill="#E2E8F0" stroke="#CBD5E1" stroke-width="2" />
        <rect x="-10" y="-40" width="20" height="20" rx="3" fill="#CA8A04" />
        <g transform="translate(45, 30) scale(0.75)">
          <circle cx="0" cy="0" r="28" fill="#E11D48" />
          <circle cx="-8" cy="-6" r="20" fill="#F43F5E" />
          <circle cx="8" cy="6" r="16" fill="#BE123C" />
          <circle cx="0" cy="0" r="10" fill="#FFE4E6" />
        </g>
      `;

    case 'gir-kesar-mango':
    case 'alphonso-hapus-mango':
      return `
        <g transform="translate(0, 5) rotate(-15)">
          <path d="M0,-45 Q-30,-75 -60,-65 Q-50,-40 -5,-35 Z" fill="#15803D" />
          <path d="M10,-45 Q40,-80 70,-60 Q50,-35 15,-35 Z" fill="#16A34A" />
          <rect x="-4" y="-55" width="8" height="22" rx="4" fill="#78350F" />
          <path d="M0,-35 C50,-35 85,10 70,55 C55,90 -20,95 -50,60 C-80,25 -50,-35 0,-35 Z" fill="#F59E0B" filter="drop-shadow(0 15px 25px rgba(0,0,0,0.4))" />
          <path d="M-20,-20 C30,-20 60,15 50,50 C40,75 -10,80 -35,50 C-60,20 -40,-20 -20,-20 Z" fill="#FBBF24" />
          <path d="M10,-25 C45,-25 70,5 60,40 C50,60 20,60 5,35 Z" fill="#EA580C" opacity="0.6" />
          <ellipse cx="-25" cy="5" rx="8" ry="24" fill="#FEF08A" opacity="0.5" transform="rotate(-25, -25, 5)" />
        </g>
      `;

    case 'nagpur-orange':
      return `
        <g transform="translate(-25, 0)">
          <circle cx="0" cy="15" r="55" fill="#EA580C" filter="drop-shadow(0 15px 25px rgba(0,0,0,0.4))" />
          <circle cx="-10" cy="5" r="45" fill="#F97316" />
          <path d="M0,-40 Q-25,-65 -50,-50 Q-35,-30 0,-35 Z" fill="#16A34A" />
          <rect x="-3" y="-45" width="6" height="12" rx="3" fill="#78350F" />
        </g>
        <g transform="translate(45, 25)">
          <circle cx="0" cy="0" r="40" fill="#FED7AA" stroke="#EA580C" stroke-width="6" filter="drop-shadow(0 10px 15px rgba(0,0,0,0.3))" />
          ${Array.from({length: 8}).map((_, i) => `
            <path d="M0,0 L${Math.cos(i * Math.PI / 4) * 32},${Math.sin(i * Math.PI / 4) * 32} A32,32 0 0,1 ${Math.cos((i + 0.85) * Math.PI / 4) * 32},${Math.sin((i + 0.85) * Math.PI / 4) * 32} Z" fill="#F97316" stroke="#FFEDD5" stroke-width="1.5" />
          `).join('')}
          <circle cx="0" cy="0" r="5" fill="#FFFFFF" />
        </g>
      `;

    case 'jaipur-blue-pottery':
      return `
        <ellipse cx="0" cy="70" rx="35" ry="10" fill="#0F172A" opacity="0.5" />
        <path d="M-22,-50 L22,-50 L28,-30 Q65,15 30,65 L-30,65 Q-65,15 -28,-30 Z" fill="#0284C7" filter="drop-shadow(0 15px 25px rgba(0,0,0,0.4))" />
        <path d="M-18,-45 L18,-45 L24,-28 Q55,15 25,60 L-25,60 Q-55,15 -24,-28 Z" fill="#F8FAFC" />
        <g stroke="#0369A1" stroke-width="2" fill="none" transform="translate(0, 15)">
          <circle cx="0" cy="0" r="16" fill="#38BDF8" fill-opacity="0.3" />
          <path d="M0,-16 Q-12,-30 0,-40 Q12,-30 0,-16" fill="#0284C7" />
          <path d="M-16,0 Q-30,-12 -40,0 Q-30,12 -16,0" fill="#0284C7" />
          <path d="M16,0 Q30,-12 40,0 Q30,12 16,0" fill="#0284C7" />
          <path d="M0,16 Q-12,30 0,40 Q12,30 0,16" fill="#0284C7" />
          <circle cx="0" cy="0" r="5" fill="#F59E0B" />
        </g>
      `;

    case 'bikaneri-bhujia':
      return `
        <ellipse cx="0" cy="55" rx="75" ry="18" fill="rgba(0,0,0,0.4)" />
        <path d="M-65,15 Q-75,60 0,65 Q75,60 65,15 Z" fill="#B45309" />
        <path d="M-60,18 Q-70,55 0,60 Q70,55 60,18 Z" fill="#F59E0B" />
        <ellipse cx="0" cy="15" rx="60" ry="20" fill="#FBBF24" />
        <g stroke="#D97706" stroke-width="2.5" stroke-linecap="round" fill="none">
          ${Array.from({length: 35}).map((_, i) => {
            const x1 = -45 + Math.random() * 90;
            const y1 = -10 + Math.random() * 35;
            const x2 = x1 + (Math.random() - 0.5) * 25;
            const y2 = y1 + (Math.random() - 0.5) * 20;
            return `<path d="M${x1.toFixed(1)},${y1.toFixed(1)} Q${((x1+x2)/2 + (Math.random()-0.5)*15).toFixed(1)},${((y1+y2)/2 - 8).toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}" />`;
          }).join('')}
        </g>
      `;

    case 'tirupati-laddu':
      return `
        <circle cx="0" cy="10" r="60" fill="#D97706" filter="drop-shadow(0 15px 25px rgba(0,0,0,0.5))" />
        <circle cx="-10" cy="0" r="50" fill="#F59E0B" />
        <circle cx="-15" cy="-8" r="40" fill="#FBBF24" />
        <path d="M-25,-10 C-35,-20 -20,-35 0,-25 C-10,-20 -15,-15 -25,-10 Z" fill="#FEF08A" stroke="#FDE047" stroke-width="1.5" />
        <path d="M15,10 C5,0 20,-15 35,-5 C25,0 20,5 15,10 Z" fill="#FEF08A" stroke="#FDE047" stroke-width="1.5" />
        <ellipse cx="10" cy="-20" rx="8" ry="5" fill="#78350F" transform="rotate(25, 10, -20)" />
        <ellipse cx="-15" cy="25" rx="9" ry="5" fill="#15803D" transform="rotate(-30, -15, 25)" />
      `;

    case 'guntur-sannam-chilli':
    case 'naga-king-chilli-bhut-jolokia':
    case 'mizo-bird-s-eye-chilli':
      return `
        <g transform="translate(-15, 10) rotate(-25)">
          <path d="M-5,-45 C15,-45 25,-10 20,30 C15,60 -5,80 -10,95 C-12,80 -5,60 -5,30 C-5,-10 -20,-45 -5,-45 Z" fill="#DC2626" filter="drop-shadow(0 10px 15px rgba(0,0,0,0.4))" />
          <path d="M-2,-35 C10,-35 18,-5 15,25 C12,50 -2,65 -5,75" fill="#EF4444" opacity="0.8" />
          <path d="M-5,-45 Q-15,-60 -25,-65" stroke="#15803D" stroke-width="4.5" fill="none" stroke-linecap="round" />
        </g>
        <g transform="translate(25, 20) rotate(20)">
          <path d="M-5,-35 C12,-35 20,-10 16,25 C12,50 -4,65 -8,80 C-10,65 -4,50 -4,25 C-4,-10 -15,-35 -5,-35 Z" fill="#B91C1C" />
          <path d="M-5,-35 Q5,-50 15,-55" stroke="#16A34A" stroke-width="3.5" fill="none" stroke-linecap="round" />
        </g>
      `;

    case 'odisha-rasagola':
      return `
        <ellipse cx="0" cy="55" rx="75" ry="18" fill="rgba(0,0,0,0.4)" />
        <path d="M-65,15 Q-75,60 0,65 Q75,60 65,15 Z" fill="#9A3412" />
        <ellipse cx="0" cy="15" rx="60" ry="18" fill="#D97706" opacity="0.6" />
        <circle cx="-25" cy="5" r="28" fill="#F8FAFC" filter="drop-shadow(0 8px 12px rgba(0,0,0,0.25))" />
        <circle cx="22" cy="10" r="26" fill="#F1F5F9" filter="drop-shadow(0 8px 12px rgba(0,0,0,0.25))" />
        <circle cx="0" cy="-12" r="30" fill="#FFFFFF" filter="drop-shadow(0 10px 15px rgba(0,0,0,0.3))" />
        <circle cx="-8" cy="-18" r="8" fill="#FFFFFF" opacity="0.9" />
        <path d="M-5,-20 Q5,-30 15,-25" stroke="#DC2626" stroke-width="2" fill="none" stroke-linecap="round" />
      `;

    case 'madhubani-painting':
    case 'puri-pattachitra-art':
    case 'sohrai-khovar-tribal-art':
    case 'dadra-nagar-haveli-warli-art':
      return `
        <rect x="-85" y="-60" width="170" height="125" rx="8" fill="#FEF3C7" stroke="#78350F" stroke-width="5" filter="drop-shadow(0 15px 25px rgba(0,0,0,0.5))" />
        <rect x="-75" y="-50" width="150" height="105" fill="none" stroke="#DC2626" stroke-width="2" />
        <g transform="translate(0, 0)" fill="none" stroke="#1E293B" stroke-width="2.5">
          <circle cx="0" cy="0" r="24" fill="#F59E0B" />
          ${Array.from({length: 12}).map((_, i) => `<line x1="${Math.cos(i * Math.PI / 6) * 26}" y1="${Math.sin(i * Math.PI / 6) * 26}" x2="${Math.cos(i * Math.PI / 6) * 36}" y2="${Math.sin(i * Math.PI / 6) * 36}" stroke="#DC2626" stroke-width="2.5" />`).join('')}
          <path d="M-45,25 Q-25,10 -35,-15 Q-55,0 -45,25 Z" fill="#0284C7" stroke="#1E293B" />
          <path d="M45,25 Q25,10 35,-15 Q55,0 45,25 Z" fill="#16A34A" stroke="#1E293B" />
        </g>
      `;

    case 'arunachal-yak-churpi':
      return `
        <path d="M-80,-40 Q0,-10 80,-40" fill="none" stroke="#78350F" stroke-width="3" stroke-dasharray="4,2" />
        <g transform="translate(-45, -15)">
          <rect x="-22" y="-22" width="44" height="44" rx="4" fill="#F59E0B" stroke="#B45309" stroke-width="2" filter="drop-shadow(0 8px 12px rgba(0,0,0,0.4))" />
          <circle cx="0" cy="0" r="6" fill="#78350F" />
          <line x1="-15" y1="-15" x2="15" y2="15" stroke="#FEF08A" stroke-width="1.5" opacity="0.7" />
        </g>
        <g transform="translate(0, 15)">
          <rect x="-26" y="-26" width="52" height="52" rx="5" fill="#FBBF24" stroke="#D97706" stroke-width="2.5" filter="drop-shadow(0 10px 15px rgba(0,0,0,0.5))" />
          <circle cx="0" cy="0" r="7" fill="#78350F" />
          <line x1="-18" y1="18" x2="18" y2="-18" stroke="#FEF08A" stroke-width="2" opacity="0.8" />
        </g>
        <g transform="translate(50, -10)">
          <rect x="-20" y="-20" width="40" height="40" rx="4" fill="#D97706" stroke="#92400E" stroke-width="2" filter="drop-shadow(0 8px 12px rgba(0,0,0,0.4))" />
          <circle cx="0" cy="0" r="5.5" fill="#78350F" />
        </g>
      `;

    case 'chak-hao-black-scented-rice':
      return `
        <ellipse cx="0" cy="55" rx="75" ry="18" fill="rgba(0,0,0,0.4)" />
        <path d="M-65,15 Q-75,60 0,65 Q75,60 65,15 Z" fill="#78350F" />
        <path d="M-60,18 Q-70,55 0,60 Q70,55 60,18 Z" fill="#92400E" />
        <ellipse cx="0" cy="15" rx="60" ry="20" fill="#3B0764" />
        ${Array.from({length: 28}).map((_, i) => {
          const rx = (Math.random() - 0.5) * 80;
          const ry = -5 - Math.random() * 22;
          const rot = Math.random() * 180;
          return `<ellipse cx="${rx.toFixed(1)}" cy="${ry.toFixed(1)}" rx="6" ry="2.8" fill="#18181B" stroke="#581C87" stroke-width="1" transform="rotate(${rot.toFixed(1)}, ${rx.toFixed(1)}, ${ry.toFixed(1)})" />`;
        }).join('')}
      `;

    case 'lakadong-turmeric':
      return `
        <g transform="translate(-25, 20) rotate(-20)">
          <rect x="-35" y="-12" width="70" height="24" rx="12" fill="#D97706" stroke="#92400E" stroke-width="2" filter="drop-shadow(0 8px 12px rgba(0,0,0,0.4))" />
          <circle cx="-15" cy="0" r="10" fill="#EA580C" />
          <circle cx="15" cy="0" r="10" fill="#F59E0B" />
        </g>
        <g transform="translate(25, 0)">
          <polygon points="0,-40 -40,35 40,35" fill="#F59E0B" filter="drop-shadow(0 10px 15px rgba(0,0,0,0.4))" />
          <polygon points="0,-35 -30,30 30,30" fill="#FBBF24" />
          <circle cx="0" cy="-42" r="6" fill="#FDE047" opacity="0.9" />
        </g>
      `;

    case 'sikkim-large-cardamom':
      return `
        <g transform="translate(-20, 10) rotate(-35)">
          <ellipse cx="0" cy="0" rx="22" ry="42" fill="#581C87" stroke="#3B0764" stroke-width="2" filter="drop-shadow(0 10px 15px rgba(0,0,0,0.5))" />
          <ellipse cx="-5" cy="0" rx="14" ry="38" fill="#7E22CE" />
          <line x1="0" y1="-38" x2="0" y2="38" stroke="#3B0764" stroke-width="2.5" />
          <line x1="-10" y1="-30" x2="-10" y2="30" stroke="#3B0764" stroke-width="1.8" />
          <line x1="10" y1="-30" x2="10" y2="30" stroke="#3B0764" stroke-width="1.8" />
        </g>
        <g transform="translate(30, 20) rotate(30)">
          <ellipse cx="0" cy="0" rx="18" ry="35" fill="#6B21A8" stroke="#4C1D95" stroke-width="2" filter="drop-shadow(0 8px 12px rgba(0,0,0,0.4))" />
          <line x1="0" y1="-32" x2="0" y2="32" stroke="#4C1D95" stroke-width="2" />
        </g>
      `;

    case 'tehri-garhwal-nath':
      return `
        <circle cx="0" cy="0" r="62" fill="none" stroke="#FBBF24" stroke-width="5" filter="drop-shadow(0 12px 20px rgba(0,0,0,0.5))" />
        <circle cx="0" cy="0" r="54" fill="none" stroke="#D97706" stroke-width="2" stroke-dasharray="4,4" />
        <g transform="translate(45, 0) scale(0.9)">
          <circle cx="0" cy="0" r="22" fill="#EAB308" stroke="#CA8A04" stroke-width="2" />
          <circle cx="0" cy="0" r="9" fill="#DC2626" />
          ${Array.from({length: 8}).map((_, i) => `<circle cx="${Math.cos(i * Math.PI / 4) * 16}" cy="${Math.sin(i * Math.PI / 4) * 16}" r="3.5" fill="#FFFFFF" />`).join('')}
        </g>
      `;

    case 'tripura-queen-pineapple':
      return `
        <g transform="translate(0, 20)">
          <ellipse cx="0" cy="15" rx="42" ry="58" fill="#D97706" filter="drop-shadow(0 15px 25px rgba(0,0,0,0.5))" />
          <ellipse cx="0" cy="15" rx="38" ry="54" fill="#F59E0B" />
          <g stroke="#B45309" stroke-width="2" fill="#FBBF24">
            ${Array.from({length: 12}).map((_, i) => {
              const x = ((i % 3) - 1) * 24;
              const y = -20 + Math.floor(i / 3) * 18;
              return `<polygon points="${x},${y-8} ${x+10},${y} ${x},${y+8} ${x-10},${y}" />`;
            }).join('')}
          </g>
        </g>
        <g transform="translate(0, -35)" fill="#15803D" stroke="#16A34A" stroke-width="2">
          <polygon points="0,-45 -12,0 0,-15 12,0" />
          <polygon points="-25,-35 -8,0 -15,-15" />
          <polygon points="25,-35 8,0 15,-15" />
        </g>
      `;

    case 'goan-cashew-feni':
      return `
        <g transform="translate(-35, 10)">
          <path d="M0,-35 C28,-35 45,5 35,45 C25,75 -25,75 -35,45 C-45,5 -28,-35 0,-35 Z" fill="#DC2626" filter="drop-shadow(0 10px 15px rgba(0,0,0,0.4))" />
          <path d="M-15,-20 C5,-20 25,5 20,35 C15,55 -15,55 -20,35 Z" fill="#F59E0B" />
          <path d="M0,60 C18,60 22,80 5,85 C-12,90 -10,75 0,60 Z" fill="#78350F" />
        </g>
        <g transform="translate(35, 15)">
          <path d="M-20,55 L-24,0 L-8,-25 L8,-25 L24,0 L20,55 Z" fill="#0284C7" fill-opacity="0.3" stroke="#BAE6FD" stroke-width="3" filter="drop-shadow(0 10px 15px rgba(0,0,0,0.3))" />
          <ellipse cx="0" cy="20" rx="16" ry="30" fill="#FEF08A" fill-opacity="0.4" />
          <circle cx="0" cy="-32" r="7" fill="#CA8A04" />
        </g>
      `;

    case 'bastar-dhokra-lost-wax-craft':
      return `
        <g transform="translate(0, 15)" fill="#CA8A04" stroke="#854D0E" stroke-width="2.5" filter="drop-shadow(0 15px 25px rgba(0,0,0,0.5))">
          <ellipse cx="0" cy="0" rx="55" ry="38" />
          <path d="M-45,0 C-75,10 -75,45 -60,55 C-50,45 -55,20 -40,10" fill="none" stroke-width="7" stroke-linecap="round" />
          <rect x="-35" y="25" width="14" height="35" rx="4" />
          <rect x="20" y="25" width="14" height="35" rx="4" />
          <circle cx="-35" cy="-8" r="16" fill="#EAB308" />
          <g stroke="#FEF08A" stroke-width="1.8" fill="none">
            <line x1="-20" y1="-25" x2="20" y2="25" />
            <line x1="20" y1="-25" x2="-20" y2="25" />
            <circle cx="0" cy="0" r="10" />
          </g>
        </g>
      `;

    case 'ladakh-shingkos-wood-carving':
      return `
        <rect x="-75" y="-45" width="150" height="90" rx="6" fill="#78350F" stroke="#451A03" stroke-width="4" filter="drop-shadow(0 15px 25px rgba(0,0,0,0.6))" />
        <rect x="-65" y="-35" width="130" height="70" fill="#9A3412" stroke="#B45309" stroke-width="2" />
        <g stroke="#FDE047" stroke-width="2.5" fill="none">
          <circle cx="0" cy="0" r="22" fill="#DC2626" />
          <path d="M-45,0 Q-30,-20 -15,0 T15,0 T45,0" />
          <circle cx="0" cy="0" r="8" fill="#FBBF24" />
        </g>
      `;

    case 'delhi-mughal-zardozi':
      return `
        <rect x="-80" y="-55" width="160" height="110" rx="8" fill="#4C0519" filter="drop-shadow(0 15px 25px rgba(0,0,0,0.5))" />
        <rect x="-70" y="-45" width="140" height="90" fill="#831843" stroke="#FDE047" stroke-width="2" />
        <g transform="translate(0, 0)" fill="#EAB308" stroke="#CA8A04" stroke-width="2">
          <circle cx="0" cy="0" r="24" fill="#FBBF24" />
          <circle cx="0" cy="0" r="12" fill="#DC2626" />
          ${Array.from({length: 8}).map((_, i) => `<circle cx="${Math.cos(i * Math.PI / 4) * 34}" cy="${Math.sin(i * Math.PI / 4) * 34}" r="5" fill="#FEF08A" />`).join('')}
        </g>
      `;

    case 'villianur-terracotta-craft':
      return `
        <g transform="translate(0, 10)" fill="#C2410C" stroke="#7C2D12" stroke-width="2.5" filter="drop-shadow(0 15px 25px rgba(0,0,0,0.5))">
          <path d="M-30,-45 C-20,-75 25,-75 25,-40 L20,30 L-20,30 Z" />
          <polygon points="18,-70 28,-90 12,-75" fill="#EA580C" />
          <polygon points="-18,-70 -28,-90 -12,-75" fill="#EA580C" />
          <circle cx="0" cy="-25" r="9" fill="#F59E0B" />
          <circle cx="0" cy="5" r="9" fill="#F59E0B" />
          <circle cx="0" cy="-25" r="4" fill="#DC2626" />
        </g>
      `;

    case 'nicobari-hodi-traditional-canoe':
      return `
        <path d="M-85,15 Q0,-10 85,15 Q60,40 0,40 Q-60,40 -85,15 Z" fill="#78350F" stroke="#451A03" stroke-width="3" filter="drop-shadow(0 12px 20px rgba(0,0,0,0.5))" />
        <ellipse cx="0" cy="18" rx="70" ry="12" fill="#B45309" />
        <line x1="-40" y1="18" x2="-60" y2="-30" stroke="#FDE047" stroke-width="3.5" stroke-linecap="round" />
        <line x1="40" y1="18" x2="20" y2="-30" stroke="#FDE047" stroke-width="3.5" stroke-linecap="round" />
        <path d="M-80,-30 Q0,-45 80,-30" fill="none" stroke="#D97706" stroke-width="6" stroke-linecap="round" />
      `;

    case 'lakshadweep-smoked-masmin-tuna':
      return `
        <g transform="translate(0, 10)">
          <ellipse cx="-20" cy="-10" rx="55" ry="16" fill="#451A03" stroke="#260C02" stroke-width="2" transform="rotate(-15, -20, -10)" filter="drop-shadow(0 10px 15px rgba(0,0,0,0.5))" />
          <ellipse cx="-20" cy="-10" rx="45" ry="10" fill="#78350F" transform="rotate(-15, -20, -10)" />
          <ellipse cx="15" cy="18" rx="60" ry="18" fill="#451A03" stroke="#260C02" stroke-width="2" transform="rotate(10, 15, 18)" filter="drop-shadow(0 10px 15px rgba(0,0,0,0.5))" />
          <ellipse cx="15" cy="18" rx="50" ry="12" fill="#78350F" transform="rotate(10, 15, 18)" />
          <path d="M-15,-30 Q-25,-55 -10,-75" stroke="#FFFFFF" stroke-width="2" fill="none" opacity="0.4" stroke-linecap="round" />
          <path d="M20,-20 Q35,-50 20,-75" stroke="#FFFFFF" stroke-width="2" fill="none" opacity="0.3" stroke-linecap="round" />
        </g>
      `;

    case 'chandigarh-heritage-phulkari':
    case 'punjab-phulkari-embroidery':
    case 'haryana-traditional-phulkari':
      return `
        <rect x="-80" y="-55" width="160" height="110" rx="8" fill="#991B1B" filter="drop-shadow(0 15px 25px rgba(0,0,0,0.5))" />
        <g fill="#FBBF24" stroke="#D97706" stroke-width="1.5">
          ${[-40, 0, 40].map(x => `
            <polygon points="${x},-25 ${x+18},0 ${x},25 ${x-18},0" />
            <polygon points="${x},-15 ${x+10},0 ${x},15 ${x-10},0" fill="#EA580C" />
          `).join('')}
        </g>
      `;

    case 'muzaffarpur-shahi-litchi':
      return `
        <g transform="translate(-25, 10)">
          <circle cx="0" cy="0" r="38" fill="#DC2626" filter="drop-shadow(0 10px 15px rgba(0,0,0,0.4))" />
          <circle cx="-5" cy="-5" r="30" fill="#EF4444" />
          ${Array.from({length: 16}).map((_, i) => `<circle cx="${(Math.random()-0.5)*45}" cy="${(Math.random()-0.5)*45}" r="2.5" fill="#991B1B" />`).join('')}
        </g>
        <g transform="translate(35, 15)">
          <circle cx="0" cy="0" r="34" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="2" filter="drop-shadow(0 8px 12px rgba(0,0,0,0.3))" />
          <ellipse cx="-5" cy="-5" rx="10" ry="16" fill="#3B0764" />
          <path d="M-25,20 Q0,40 25,20" fill="#DC2626" stroke="#991B1B" stroke-width="2" />
        </g>
      `;

    case 'chanderi-fabric':
      return `
        <rect x="-85" y="-55" width="170" height="115" rx="10" fill="#0284C7" fill-opacity="0.8" filter="drop-shadow(0 15px 25px rgba(0,0,0,0.4))" />
        <g fill="#FDE047">
          ${[[-50,-25], [-15,-25], [20,-25], [55,-25], [-35,15], [0,15], [35,15]].map(([x,y]) => `
            <circle cx="${x}" cy="${y}" r="6" />
            <circle cx="${x}" cy="${y}" r="3" fill="#D97706" />
          `).join('')}
        </g>
      `;

    case 'kullu-wool-shawl':
      return `
        <rect x="-85" y="-55" width="170" height="115" rx="10" fill="#F1F5F9" filter="drop-shadow(0 15px 25px rgba(0,0,0,0.4))" />
        <rect x="-85" y="10" width="170" height="40" fill="#DC2626" />
        <g fill="#0284C7">
          ${Array.from({length: 6}).map((_, i) => `<polygon points="${-70 + i * 26},10 ${-57 + i * 26},30 ${-44 + i * 26},10" />`).join('')}
        </g>
        <g fill="#FBBF24">
          ${Array.from({length: 6}).map((_, i) => `<polygon points="${-70 + i * 26},50 ${-57 + i * 26},30 ${-44 + i * 26},50" />`).join('')}
        </g>
      `;

    case 'pochampally-ikat':
    case 'patan-patola-double-ikat':
      return `
        <rect x="-85" y="-55" width="170" height="115" rx="10" fill="#18181B" filter="drop-shadow(0 15px 25px rgba(0,0,0,0.5))" />
        <rect x="-75" y="-45" width="150" height="95" fill="#991B1B" />
        <g stroke="#FFFFFF" stroke-width="2.5" fill="none">
          <polygon points="-40,-25 0,-45 40,-25 0,-5" fill="#DC2626" />
          <polygon points="-40,15 0,-5 40,15 0,35" fill="#EAB308" />
        </g>
      `;

    case 'muga-golden-silk':
      return `
        <rect x="-85" y="-55" width="170" height="115" rx="10" fill="#D97706" filter="drop-shadow(0 15px 25px rgba(0,0,0,0.5))" />
        <rect x="-75" y="-45" width="150" height="95" rx="6" fill="#F59E0B" />
        <g transform="translate(0, 5) scale(0.9)" fill="#991B1B" stroke="#FDE047" stroke-width="2">
          <polygon points="0,-40 -35,25 35,25" />
          <circle cx="0" cy="0" r="10" fill="#FDE047" />
        </g>
      `;

    case 'assam-orthodox-tea':
      return `
        <ellipse cx="0" cy="50" rx="80" ry="20" fill="rgba(0,0,0,0.4)" />
        <path d="M-45,15 C-40,55 40,55 45,15 C45,-10 -45,-10 -45,15 Z" fill="#78350F" opacity="0.8" filter="drop-shadow(0 10px 15px rgba(0,0,0,0.4))" />
        <ellipse cx="0" cy="12" rx="42" ry="12" fill="#D97706" />
        <g transform="translate(0, -35) scale(1.1)">
          <path d="M0,15 Q-20,-15 0,-45 Q20,-15 0,15 Z" fill="#D97706" stroke="#FEF08A" stroke-width="1.5" />
        </g>
      `;

    case 'hyderabadi-haleem':
      return `
        <ellipse cx="0" cy="55" rx="75" ry="18" fill="rgba(0,0,0,0.4)" />
        <path d="M-65,15 Q-75,60 0,65 Q75,60 65,15 Z" fill="#94A3B8" />
        <path d="M-60,18 Q-70,55 0,60 Q70,55 60,18 Z" fill="#CBD5E1" />
        <ellipse cx="0" cy="15" rx="58" ry="18" fill="#78350F" />
        <g fill="#451A03">
          ${Array.from({length: 12}).map((_, i) => `<ellipse cx="${(Math.random()-0.5)*60}" cy="${5 + (Math.random()-0.5)*15}" rx="9" ry="3" transform="rotate(${Math.random()*180})" />`).join('')}
        </g>
        <circle cx="0" cy="12" r="6" fill="#FEF08A" />
        <ellipse cx="-10" cy="15" rx="8" ry="4" fill="#15803D" />
      `;

    default:
      return `
        <circle cx="0" cy="0" r="55" fill="#EAB308" opacity="0.3" filter="drop-shadow(0 0 15px rgba(234,179,8,0.5))" />
        <polygon points="0,-50 15,-15 50,-15 22,8 32,45 0,22 -32,45 -22,8 -50,-15 -15,-15" fill="#FBBF24" stroke="#CA8A04" stroke-width="2" />
        <circle cx="0" cy="0" r="18" fill="#78350F" />
        <circle cx="0" cy="0" r="12" fill="#FEF08A" />
      `;
  }
}

// 3. Generate Standalone Product Transparent SVGs
let prodCount = 0;
for (const product of db.products) {
  const objectSvg = renderStandaloneProductObject(product.id);

  const transparentSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="none">
  <!-- Standalone Physical Product Hero Artwork (Transparent Background) -->
  <g transform="translate(300, 180)">
    ${objectSvg}
  </g>
</svg>
  `.trim();

  const svgPath = path.join(giImagesDir, `${product.id}.svg`);
  fs.writeFileSync(svgPath, transparentSvg, 'utf8');

  // Ensure db imageUrl points to the transparent SVG
  product.imageUrl = `assets/gi-images/${product.id}.svg`;
  prodCount++;
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log(`🎉 Generated ${prodCount} transparent standalone product SVGs and updated database!`);
