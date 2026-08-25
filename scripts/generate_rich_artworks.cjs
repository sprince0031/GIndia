const fs = require('fs');
const path = require('path');

const db = JSON.parse(fs.readFileSync('data/gi_database.json', 'utf8'));
const outDir = path.resolve('public/assets/gi-images');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Category palette & ambient styling
const CATEGORY_STYLES = {
  'Handicraft': {
    primary: '#1E3A8A',
    secondary: '#3B82F6',
    accent: '#F59E0B',
    glow: 'rgba(59, 130, 246, 0.4)',
    bg1: '#0F172A',
    bg2: '#1E293B'
  },
  'Handicrafts': {
    primary: '#1E3A8A',
    secondary: '#3B82F6',
    accent: '#F59E0B',
    glow: 'rgba(59, 130, 246, 0.4)',
    bg1: '#0F172A',
    bg2: '#1E293B'
  },
  'Agricultural': {
    primary: '#14532D',
    secondary: '#22C55E',
    accent: '#FACC15',
    glow: 'rgba(34, 197, 94, 0.4)',
    bg1: '#052E16',
    bg2: '#14532D'
  },
  'Food Stuff': {
    primary: '#7C2D12',
    secondary: '#EA580C',
    accent: '#FDE047',
    glow: 'rgba(234, 88, 12, 0.4)',
    bg1: '#431407',
    bg2: '#7C2D12'
  },
  'Manufactured': {
    primary: '#581C87',
    secondary: '#A855F7',
    accent: '#38BDF8',
    glow: 'rgba(168, 85, 247, 0.4)',
    bg1: '#2E1065',
    bg2: '#581C87'
  },
  'Natural Goods': {
    primary: '#713F12',
    secondary: '#CA8A04',
    accent: '#86EFAC',
    glow: 'rgba(202, 138, 4, 0.4)',
    bg1: '#422006',
    bg2: '#713F12'
  }
};

// Object Illustration Renderers for all 50 GI Spotlight Products
function renderProductIllustration(id) {
  switch (id) {
    case 'darjeeling-tea':
      return `
        <!-- Teacup saucer & cup -->
        <ellipse cx="0" cy="55" rx="90" ry="24" fill="#E2E8F0" opacity="0.9" />
        <ellipse cx="0" cy="52" rx="75" ry="18" fill="#CBD5E1" />
        <path d="M-55,20 C-50,60 50,60 55,20 C55,-10 -55,-10 -55,20 Z" fill="#FFFFFF" filter="drop-shadow(0 10px 15px rgba(0,0,0,0.3))" />
        <ellipse cx="0" cy="18" rx="52" ry="14" fill="#C2410C" />
        <ellipse cx="0" cy="18" rx="46" ry="11" fill="#D97706" opacity="0.9" />
        <path d="M52,15 C75,15 75,45 50,45" fill="none" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" />
        <!-- Fresh green tea flush (two leaves and a bud) -->
        <g transform="translate(10, -25) scale(1.1)">
          <path d="M0,20 Q-30,-20 0,-60 Q30,-20 0,20 Z" fill="#16A34A" />
          <path d="M0,20 Q-15,-15 0,-60" fill="none" stroke="#86EFAC" stroke-width="2" />
          <path d="M-15,10 Q-50,0 -40,-40 Q-10,-20 -15,10 Z" fill="#22C55E" />
          <path d="M15,15 Q50,5 40,-35 Q10,-15 15,15 Z" fill="#15803D" />
          <circle cx="-5" cy="-25" r="4" fill="#FEF08A" opacity="0.9" filter="drop-shadow(0 0 4px #FACC15)" />
        </g>
        <!-- Rising aromatic steam -->
        <path d="M-15,0 Q-25,-30 -10,-50 T-20,-90" fill="none" stroke="#FFFFFF" stroke-width="2.5" opacity="0.4" stroke-linecap="round" />
        <path d="M10,-5 Q25,-35 15,-60 T25,-95" fill="none" stroke="#FFFFFF" stroke-width="2" opacity="0.3" stroke-linecap="round" />
      `;

    case 'gobindobhog-rice':
      return `
        <!-- Terracotta handi bowl -->
        <ellipse cx="0" cy="60" rx="80" ry="20" fill="rgba(0,0,0,0.4)" />
        <path d="M-70,10 Q-80,65 0,70 Q80,65 70,10 Z" fill="#9A3412" />
        <path d="M-65,15 Q-75,60 0,65 Q75,60 65,15 Z" fill="#C2410C" />
        <!-- Steaming mounded aromatic short rice grains -->
        <ellipse cx="0" cy="12" rx="68" ry="22" fill="#F8FAFC" />
        <path d="M-65,12 Q0,-45 65,12 Z" fill="#FFFFFF" />
        <!-- Individual short glistening rice grains -->
        ${Array.from({length: 24}).map((_, i) => {
          const rx = (Math.random() - 0.5) * 90;
          const ry = -10 - Math.random() * 25;
          const rot = Math.random() * 180;
          return `<ellipse cx="${rx.toFixed(1)}" cy="${ry.toFixed(1)}" rx="5.5" ry="2.8" fill="#F1F5F9" stroke="#E2E8F0" stroke-width="0.8" transform="rotate(${rot.toFixed(1)}, ${rx.toFixed(1)}, ${ry.toFixed(1)})" />`;
        }).join('')}
        <!-- Sacred Tulsi holy basil leaf garnish -->
        <g transform="translate(0, -35) scale(0.8)">
          <path d="M0,0 Q-15,-20 0,-35 Q15,-20 0,0 Z" fill="#15803D" />
          <path d="M0,0 Q-20,-10 -25,-25 Q-5,-20 0,0 Z" fill="#16A34A" />
          <path d="M0,0 Q20,-10 25,-25 Q5,-20 0,0 Z" fill="#15803D" />
        </g>
      `;

    case 'kashmir-pashmina':
      return `
        <!-- Flowing luxurious Pashmina fabric with Kani weave -->
        <path d="M-90,-50 C-40,-70 40,-30 90,-50 C110,20 70,70 40,80 C-20,90 -90,40 -90,-50 Z" fill="#991B1B" filter="drop-shadow(0 15px 25px rgba(0,0,0,0.5))" />
        <path d="M-75,-35 C-30,-50 35,-20 75,-35 C90,15 60,55 35,65 C-15,75 -75,35 -75,-35 Z" fill="#B91C1C" />
        <!-- Intricate Kani Paisley / Boteh Gold Motif -->
        <g transform="translate(0, 10) scale(0.95)" fill="none" stroke="#FDE047" stroke-width="2">
          <path d="M0,35 C-25,35 -40,15 -35,-10 C-30,-35 -10,-55 5,-65 C10,-45 -5,-30 0,-10 C5,10 25,35 0,35 Z" fill="#D97706" opacity="0.85" />
          <path d="M-10,15 Q-20,0 -15,-15 Q0,-30 5,-45" stroke="#FEF08A" />
          <circle cx="-5" cy="5" r="4" fill="#FEF08A" />
          <circle cx="-15" cy="-5" r="3" fill="#FEF08A" />
        </g>
        <!-- Fine hand-twisted fringe tassels -->
        ${Array.from({length: 12}).map((_, i) => {
          const x = -50 + i * 9;
          return `<line x1="${x}" y1="75" x2="${x + (i % 2 === 0 ? -3 : 3)}" y2="100" stroke="#FDE047" stroke-width="1.8" stroke-linecap="round" />`;
        }).join('')}
      `;

    case 'kashmir-saffron':
      return `
        <!-- Purple Crocus Sativus petals -->
        <g transform="translate(0, 20)">
          <ellipse cx="-40" cy="10" rx="35" ry="60" fill="#6B21A8" transform="rotate(-35, -40, 10)" opacity="0.9" />
          <ellipse cx="40" cy="10" rx="35" ry="60" fill="#7E22CE" transform="rotate(35, 40, 10)" opacity="0.9" />
          <ellipse cx="0" cy="20" rx="38" ry="65" fill="#9333EA" />
          <!-- Golden yellow stamen center -->
          <ellipse cx="0" cy="15" rx="16" ry="25" fill="#EAB308" />
        </g>
        <!-- Radiant deep crimson saffron stigmas (Mongra threads) -->
        <g stroke="#DC2626" stroke-width="4.5" stroke-linecap="round" fill="none" filter="drop-shadow(0 0 10px #EF4444)">
          <path d="M0,15 Q-25,-30 -50,-70 Q-55,-85 -40,-90" />
          <path d="M0,15 Q0,-45 0,-85 Q5,-100 20,-95" />
          <path d="M0,15 Q25,-30 50,-70 Q55,-85 40,-90" />
        </g>
        <!-- Trumpet flared stigma tips -->
        <circle cx="-40" cy="-90" r="5" fill="#991B1B" />
        <circle cx="20" cy="-95" r="5" fill="#991B1B" />
        <circle cx="40" cy="-90" r="5" fill="#991B1B" />
      `;

    case 'kanchipuram-silk-saree':
      return `
        <!-- Folded royal magenta & gold zari silk drape -->
        <rect x="-85" y="-55" width="170" height="120" rx="10" fill="#831843" filter="drop-shadow(0 15px 25px rgba(0,0,0,0.5))" />
        <rect x="-75" y="-45" width="150" height="100" rx="6" fill="#9D174D" />
        <!-- Korvai pure gold zari temple border -->
        <rect x="-75" y="15" width="150" height="40" fill="#CA8A04" />
        <g fill="#FEF08A">
          ${Array.from({length: 6}).map((_, i) => `<polygon points="${-65 + i * 25},15 ${-52.5 + i * 25},-5 ${-40 + i * 25},15" />`).join('')}
        </g>
        <!-- Traditional Mayil (Peacock) Zari Motif -->
        <g transform="translate(0, -15) scale(0.9)" fill="#FDE047">
          <circle cx="-10" cy="-10" r="7" />
          <path d="M-10,-3 C-5,15 15,20 25,0 C30,-15 15,-20 0,-15" />
          <path d="M15,-5 Q35,-15 45,-5 Q30,10 15,0" />
        </g>
      `;

    case 'thanjavur-gold-paintings':
      return `
        <!-- Teakwood frame & Gesso gold foil relief arch -->
        <rect x="-80" y="-70" width="160" height="145" rx="8" fill="#451A03" stroke="#78350F" stroke-width="6" filter="drop-shadow(0 15px 30px rgba(0,0,0,0.6))" />
        <rect x="-68" y="-58" width="136" height="121" fill="#7F1D1D" />
        <!-- 22K Gold foil embossed temple mandapa arch -->
        <path d="M-55,45 L-55,-20 Q0,-65 55,-20 L55,45 Z" fill="#EAB308" stroke="#CA8A04" stroke-width="2" />
        <path d="M-45,45 L-45,-15 Q0,-50 45,-15 L45,45 Z" fill="#1E293B" />
        <!-- Krishna Icon with flute & peacock feather crown -->
        <circle cx="0" cy="-5" r="18" fill="#38BDF8" />
        <path d="M-15,35 Q0,10 15,35 Z" fill="#EAB308" />
        <line x1="-25" y1="12" x2="28" y2="2" stroke="#FEF08A" stroke-width="4" stroke-linecap="round" />
        <circle cx="0" cy="-28" r="7" fill="#10B981" />
        <!-- Ruby & Emerald gemstone insets -->
        <circle cx="-55" cy="-20" r="4" fill="#DC2626" />
        <circle cx="55" cy="-20" r="4" fill="#059669" />
        <circle cx="0" cy="-55" r="5" fill="#DC2626" />
      `;

    case 'channapatna-wooden-toys':
      return `
        <!-- Glossy vegetable-dyed lacquered rocking horse / stacker -->
        <!-- Amber base stand -->
        <ellipse cx="0" cy="65" rx="75" ry="16" fill="#0284C7" />
        <!-- Lacquered ring stacking layers -->
        <ellipse cx="0" cy="48" rx="60" ry="14" fill="#DC2626" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.3))" />
        <ellipse cx="0" cy="32" rx="50" ry="12" fill="#EAB308" />
        <ellipse cx="0" cy="18" rx="40" ry="10" fill="#16A34A" />
        <ellipse cx="0" cy="5" rx="30" ry="8" fill="#EA580C" />
        <!-- Glossy ivory wood topper head -->
        <circle cx="0" cy="-22" r="22" fill="#FBBF24" filter="drop-shadow(0 6px 10px rgba(0,0,0,0.3))" />
        <circle cx="-7" cy="-25" r="3.5" fill="#1E293B" />
        <circle cx="7" cy="-25" r="3.5" fill="#1E293B" />
        <path d="M-6,-14 Q0,-8 6,-14" stroke="#DC2626" stroke-width="2.5" fill="none" stroke-linecap="round" />
        <!-- Conical king cap with brass finial -->
        <polygon points="0,-60 -16,-38 16,-38" fill="#DC2626" />
        <circle cx="0" cy="-62" r="5" fill="#FEF08A" />
        <!-- High-gloss lacquer reflection highlight -->
        <path d="M-10,-32 Q-14,-22 -12,-12" stroke="#FFFFFF" stroke-width="2" fill="none" opacity="0.6" stroke-linecap="round" />
      `;

    case 'mysore-pure-silk':
      return `
        <!-- Indigo & Gold zari Mysore Silk fold -->
        <rect x="-85" y="-55" width="170" height="115" rx="10" fill="#1E3A8A" filter="drop-shadow(0 15px 25px rgba(0,0,0,0.5))" />
        <rect x="-75" y="-45" width="150" height="95" rx="6" fill="#1D4ED8" />
        <rect x="-75" y="10" width="150" height="40" fill="#EAB308" />
        <!-- Kasuti geometric embroidery motifs -->
        <g fill="#1E3A8A" transform="translate(-50, 28) scale(0.7)">
          <polygon points="0,-15 15,0 0,15 -15,0" />
          <polygon points="35,-15 50,0 35,15 20,0" />
          <polygon points="70,-15 85,0 70,15 55,0" />
          <polygon points="105,-15 120,0 105,15 90,0" />
          <polygon points="140,-15 155,0 140,15 125,0" />
        </g>
        <path d="M-75,-25 Q0,-45 75,-25" stroke="#FDE047" stroke-width="2" stroke-dasharray="4,4" fill="none" />
      `;

    case 'aranmula-kannadi-mirror':
      return `
        <!-- Handheld Front-Surface Metal Alloy Mirror -->
        <!-- Ornate cast brass handle & base -->
        <path d="M-8,50 L-14,100 L14,100 L8,50 Z" fill="#CA8A04" stroke="#A16207" stroke-width="2" />
        <circle cx="0" cy="105" r="8" fill="#EAB308" />
        <!-- Sunburst crowned ornate frame -->
        <circle cx="0" cy="0" r="62" fill="#EAB308" filter="drop-shadow(0 15px 25px rgba(0,0,0,0.5))" />
        <circle cx="0" cy="0" r="54" fill="#CA8A04" />
        <!-- Front-surface polished bronze-speculum reflective oval plate -->
        <ellipse cx="0" cy="0" rx="42" ry="46" fill="#E2E8F0" />
        <ellipse cx="0" cy="0" rx="38" ry="42" fill="#F8FAFC" />
        <!-- Flawless mirror reflection streak -->
        <path d="M-25,-30 L20,35 L32,30 L-13,-35 Z" fill="#FFFFFF" opacity="0.6" />
        <!-- Ornate top crown arch -->
        <g transform="translate(0, -62)" fill="#EAB308">
          <circle cx="0" cy="-10" r="9" />
          <circle cx="-20" cy="-4" r="6" />
          <circle cx="20" cy="-4" r="6" />
        </g>
      `;

    case 'malabar-black-pepper':
      return `
        <!-- Jute burlap sack spilling Tellicherry black peppercorns -->
        <path d="M-70,50 Q-80,10 -40,-30 Q30,-40 65,-10 Q80,40 50,60 Z" fill="#A16207" filter="drop-shadow(0 15px 20px rgba(0,0,0,0.4))" />
        <path d="M-60,40 Q-70,10 -35,-20 Q25,-30 55,-5 Q70,35 45,50 Z" fill="#78350F" />
        <!-- Fresh green pepper vine leaves -->
        <path d="M-50,-20 Q-70,-60 -30,-70 Q-10,-40 -50,-20 Z" fill="#15803D" />
        <path d="M20,-30 Q60,-70 70,-40 Q40,-10 20,-30 Z" fill="#16A34A" />
        <!-- Lustrous wrinkled black peppercorn spheres -->
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
        <!-- Crimson red royal Varanasi brocade with Jangla gold floral lattice -->
        <rect x="-85" y="-55" width="170" height="115" rx="10" fill="#991B1B" filter="drop-shadow(0 15px 25px rgba(0,0,0,0.5))" />
        <rect x="-75" y="-45" width="150" height="95" rx="6" fill="#B91C1C" />
        <!-- Zari floral creepers & Mughal jaal lattice -->
        <g stroke="#FDE047" stroke-width="2" fill="none" opacity="0.9">
          <circle cx="0" cy="0" r="28" fill="#CA8A04" fill-opacity="0.3" />
          <circle cx="-45" cy="0" r="20" />
          <circle cx="45" cy="0" r="20" />
          <path d="M-60,-35 Q0,-10 60,-35" />
          <path d="M-60,35 Q0,10 60,35" />
          <path d="M-30,-45 Q0,0 -30,45" />
          <path d="M30,-45 Q0,0 30,45" />
        </g>
        <circle cx="0" cy="0" r="8" fill="#FEF08A" />
      `;

    case 'kannauj-rose-attar':
      return `
        <!-- Cut-crystal perfume bottle / Itardani with pure Damask rose attar -->
        <!-- Liquid amber rose oil inside bottle -->
        <path d="M-40,65 L-45,0 L-20,-20 L20,-20 L45,0 L40,65 Z" fill="#D97706" opacity="0.85" filter="drop-shadow(0 15px 20px rgba(0,0,0,0.4))" />
        <!-- Faceted cut crystal glass outer walls -->
        <path d="M-40,65 L-45,0 L-20,-20 L20,-20 L45,0 L40,65 Z" fill="none" stroke="#E2E8F0" stroke-width="4" />
        <!-- Crystal stopper wand -->
        <polygon points="0,-65 -15,-40 15,-40" fill="#E2E8F0" stroke="#CBD5E1" stroke-width="2" />
        <rect x="-10" y="-40" width="20" height="20" rx="3" fill="#CA8A04" />
        <!-- Glowing fresh Damask Rose bloom -->
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
        <!-- Luscious golden-saffron ripe mango with emerald leaves -->
        <g transform="translate(0, 5) rotate(-15)">
          <!-- Fresh green stalk & mango leaves -->
          <path d="M0,-45 Q-30,-75 -60,-65 Q-50,-40 -5,-35 Z" fill="#15803D" />
          <path d="M10,-45 Q40,-80 70,-60 Q50,-35 15,-35 Z" fill="#16A34A" />
          <rect x="-4" y="-55" width="8" height="22" rx="4" fill="#78350F" />
          <!-- Plump mango fruit with saffron/ruby blush -->
          <path d="M0,-35 C50,-35 85,10 70,55 C55,90 -20,95 -50,60 C-80,25 -50,-35 0,-35 Z" fill="#F59E0B" filter="drop-shadow(0 15px 25px rgba(0,0,0,0.4))" />
          <path d="M-20,-20 C30,-20 60,15 50,50 C40,75 -10,80 -35,50 C-60,20 -40,-20 -20,-20 Z" fill="#FBBF24" />
          <!-- Rosy ripe blush highlight -->
          <path d="M10,-25 C45,-25 70,5 60,40 C50,60 20,60 5,35 Z" fill="#EA580C" opacity="0.6" />
          <!-- Velvet sheen reflection -->
          <ellipse cx="-25" cy="5" rx="8" ry="24" fill="#FEF08A" opacity="0.5" transform="rotate(-25, -25, 5)" />
        </g>
      `;

    case 'nagpur-orange':
      return `
        <!-- Plump Nagpur Mandarin Orange with fresh sliced wheel -->
        <g transform="translate(-25, 0)">
          <!-- Whole orange fruit -->
          <circle cx="0" cy="15" r="55" fill="#EA580C" filter="drop-shadow(0 15px 25px rgba(0,0,0,0.4))" />
          <circle cx="-10" cy="5" r="45" fill="#F97316" />
          <!-- Green leaf & stem -->
          <path d="M0,-40 Q-25,-65 -50,-50 Q-35,-30 0,-35 Z" fill="#16A34A" />
          <rect x="-3" y="-45" width="6" height="12" rx="3" fill="#78350F" />
        </g>
        <!-- Juicy sliced orange half -->
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
        <!-- Cobalt Blue floral glazed ceramic vase -->
        <ellipse cx="0" cy="70" rx="35" ry="10" fill="#0F172A" opacity="0.5" />
        <!-- Vase body silhouette -->
        <path d="M-22,-50 L22,-50 L28,-30 Q65,15 30,65 L-30,65 Q-65,15 -28,-30 Z" fill="#0284C7" filter="drop-shadow(0 15px 25px rgba(0,0,0,0.4))" />
        <!-- White quartz / Egyptian paste glaze base -->
        <path d="M-18,-45 L18,-45 L24,-28 Q55,15 25,60 L-25,60 Q-55,15 -24,-28 Z" fill="#F8FAFC" />
        <!-- Traditional Turquoise & Cobalt blue floral arabesques -->
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
        <!-- Traditional brass bowl filled with crispy moth-bean crisp sev -->
        <ellipse cx="0" cy="55" rx="75" ry="18" fill="rgba(0,0,0,0.4)" />
        <path d="M-65,15 Q-75,60 0,65 Q75,60 65,15 Z" fill="#B45309" />
        <path d="M-60,18 Q-70,55 0,60 Q70,55 60,18 Z" fill="#F59E0B" />
        <!-- Mounded golden crisp noodles -->
        <ellipse cx="0" cy="15" rx="60" ry="20" fill="#FBBF24" />
        <g stroke="#D97706" stroke-width="2.5" stroke-linecap="round" fill="none">
          ${Array.from({length: 40}).map((_, i) => {
            const x1 = -45 + Math.random() * 90;
            const y1 = -10 + Math.random() * 35;
            const x2 = x1 + (Math.random() - 0.5) * 25;
            const y2 = y1 + (Math.random() - 0.5) * 20;
            return `<path d="M${x1.toFixed(1)},${y1.toFixed(1)} Q${((x1+x2)/2 + (Math.random()-0.5)*15).toFixed(1)},${((y1+y2)/2 - 8).toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}" />`;
          }).join('')}
        </g>
        <!-- Black pepper specks -->
        ${Array.from({length: 20}).map((_, i) => `<circle cx="${(-40 + Math.random() * 80).toFixed(1)}" cy="${(-5 + Math.random() * 35).toFixed(1)}" r="1.5" fill="#18181B" />`).join('')}
      `;

    case 'tirupati-laddu':
      return `
        <!-- Sacred golden Besan & Ghee Laddu -->
        <circle cx="0" cy="10" r="60" fill="#D97706" filter="drop-shadow(0 15px 25px rgba(0,0,0,0.5))" />
        <circle cx="-10" cy="0" r="50" fill="#F59E0B" />
        <circle cx="-15" cy="-8" r="40" fill="#FBBF24" />
        <!-- Glistening Cashew nut pieces -->
        <path d="M-25,-10 C-35,-20 -20,-35 0,-25 C-10,-20 -15,-15 -25,-10 Z" fill="#FEF08A" stroke="#FDE047" stroke-width="1.5" />
        <path d="M15,10 C5,0 20,-15 35,-5 C25,0 20,5 15,10 Z" fill="#FEF08A" stroke="#FDE047" stroke-width="1.5" />
        <!-- Golden Raisins (Kishmish) & Green Cardamom pods -->
        <ellipse cx="10" cy="-20" rx="8" ry="5" fill="#78350F" transform="rotate(25, 10, -20)" />
        <ellipse cx="-15" cy="25" rx="9" ry="5" fill="#15803D" transform="rotate(-30, -15, 25)" />
        <circle cx="2" cy="20" r="3" fill="#FFFFFF" opacity="0.9" /> <!-- Camphor crystal -->
      `;

    case 'guntur-sannam-chilli':
    case 'naga-king-chilli-bhut-jolokia':
    case 'mizo-bird-s-eye-chilli':
      return `
        <!-- Fiery Red Sun-Dried Hot Chillies -->
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
        <!-- Earthen clay handi with soft white Rasagola floating in syrup -->
        <ellipse cx="0" cy="55" rx="75" ry="18" fill="rgba(0,0,0,0.4)" />
        <path d="M-65,15 Q-75,60 0,65 Q75,60 65,15 Z" fill="#9A3412" />
        <ellipse cx="0" cy="15" rx="60" ry="18" fill="#D97706" opacity="0.6" /> <!-- Sugar syrup -->
        <!-- Plump soft Rasagola cheese spheres -->
        <circle cx="-25" cy="5" r="28" fill="#F8FAFC" filter="drop-shadow(0 8px 12px rgba(0,0,0,0.25))" />
        <circle cx="22" cy="10" r="26" fill="#F1F5F9" filter="drop-shadow(0 8px 12px rgba(0,0,0,0.25))" />
        <circle cx="0" cy="-12" r="30" fill="#FFFFFF" filter="drop-shadow(0 10px 15px rgba(0,0,0,0.3))" />
        <circle cx="-8" cy="-18" r="8" fill="#FFFFFF" opacity="0.9" />
        <!-- Saffron strand & cardamom garnish -->
        <path d="M-5,-20 Q5,-30 15,-25" stroke="#DC2626" stroke-width="2" fill="none" stroke-linecap="round" />
        <ellipse cx="-2" cy="-5" rx="4" ry="2.5" fill="#15803D" transform="rotate(35, -2, -5)" />
      `;

    case 'madhubani-painting':
    case 'puri-pattachitra-art':
    case 'sohrai-khovar-tribal-art':
    case 'dadra-nagar-haveli-warli-art':
      return `
        <!-- Tribal & Folk Heritage Art Canvas (Madhubani / Warli / Pattachitra) -->
        <rect x="-85" y="-60" width="170" height="125" rx="8" fill="#FEF3C7" stroke="#78350F" stroke-width="5" filter="drop-shadow(0 15px 25px rgba(0,0,0,0.5))" />
        <!-- Double-line border with geometric triangles -->
        <rect x="-75" y="-50" width="150" height="105" fill="none" stroke="#DC2626" stroke-width="2" />
        <!-- Traditional Peacock & Sun Folk Motifs -->
        <g transform="translate(0, 0)" fill="none" stroke="#1E293B" stroke-width="2.5">
          <!-- Central Sacred Sun / Tree of Life -->
          <circle cx="0" cy="0" r="24" fill="#F59E0B" />
          ${Array.from({length: 12}).map((_, i) => `<line x1="${Math.cos(i * Math.PI / 6) * 26}" y1="${Math.sin(i * Math.PI / 6) * 26}" x2="${Math.cos(i * Math.PI / 6) * 36}" y2="${Math.sin(i * Math.PI / 6) * 36}" stroke="#DC2626" stroke-width="2.5" />`).join('')}
          <!-- Twin folk fish / peacock flourishes -->
          <path d="M-45,25 Q-25,10 -35,-15 Q-55,0 -45,25 Z" fill="#0284C7" stroke="#1E293B" />
          <path d="M45,25 Q25,10 35,-15 Q55,0 45,25 Z" fill="#16A34A" stroke="#1E293B" />
        </g>
      `;

    default:
      // High quality universal artisanal artifact representation
      return `
        <!-- Heritage Craft Artifact Display -->
        <circle cx="0" cy="0" r="65" fill="#CA8A04" opacity="0.2" filter="drop-shadow(0 0 20px rgba(234,179,8,0.4))" />
        <!-- Royal Medal Emblem -->
        <polygon points="0,-60 18,-20 60,-20 28,10 40,55 0,28 -40,55 -28,10 -60,-20 -18,-20" fill="#EAB308" stroke="#CA8A04" stroke-width="3" filter="drop-shadow(0 10px 15px rgba(0,0,0,0.4))" />
        <circle cx="0" cy="0" r="28" fill="#78350F" />
        <circle cx="0" cy="0" r="22" fill="#FDE047" />
        <path d="M-10,0 L0,-12 L10,0 L0,12 Z" fill="#991B1B" />
      `;
  }
}

// Generate all 50 full SVG and WebP artwork plates
let count = 0;
for (const product of db.products) {
  const theme = CATEGORY_STYLES[product.category] || CATEGORY_STYLES['Handicraft'];
  const safeTitle = product.name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const safeState = product.stateName.replace(/&/g, '&amp;');

  const illustrationSvg = renderProductIllustration(product.id);

  const fullSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
  <defs>
    <linearGradient id="bgGrad_${product.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.primary}" />
      <stop offset="50%" stop-color="${theme.bg1}" />
      <stop offset="100%" stop-color="${theme.bg2}" />
    </linearGradient>
    <radialGradient id="spotlight_${product.id}" cx="50%" cy="45%" r="55%">
      <stop offset="0%" stop-color="${theme.secondary}" stop-opacity="0.45" />
      <stop offset="60%" stop-color="${theme.secondary}" stop-opacity="0.1" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="floorShadow_${product.id}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(0,0,0,0.6)" />
      <stop offset="100%" stop-color="rgba(0,0,0,0)" />
    </radialGradient>
  </defs>

  <!-- Ambient Gallery Plate Canvas -->
  <rect width="100%" height="100%" fill="url(#bgGrad_${product.id})"/>
  <rect width="100%" height="100%" fill="url(#spotlight_${product.id})"/>

  <!-- Museum Exhibition Grid & Aura -->
  <circle cx="300" cy="180" r="140" fill="none" stroke="${theme.accent}" stroke-opacity="0.12" stroke-width="1.5" />
  <circle cx="300" cy="180" r="115" fill="none" stroke="${theme.accent}" stroke-opacity="0.08" stroke-width="1" stroke-dasharray="6,6" />

  <!-- Pedestal Floor Drop Shadow -->
  <ellipse cx="300" cy="285" rx="140" ry="25" fill="url(#floorShadow_${product.id})" />

  <!-- HERO PHYSICAL OBJECT ILLUSTRATION -->
  <g transform="translate(300, 180)">
    ${illustrationSvg}
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

  <!-- Accent Corner Tag -->
  <rect x="0" y="396" width="600" height="4" fill="${theme.accent}" />
</svg>
  `.trim();

  const svgPath = path.join(outDir, `${product.id}.svg`);
  const webpPath = path.join(outDir, `${product.id}.webp`);

  fs.writeFileSync(svgPath, fullSvg, 'utf8');
  fs.writeFileSync(webpPath, fullSvg, 'utf8');
  count++;
}

console.log(`🎉 Successfully generated ${count} rich standalone GI product artwork visual plates!`);