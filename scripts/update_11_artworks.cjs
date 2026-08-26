const fs = require('fs');
const path = require('path');

const giImagesDir = path.resolve('public/assets/gi-images');

// 11 Bespoke, Highly Detailed & Authentic Standalone Product Object SVGs
const ARTWORKS = {
  // 1. Villianur Terracotta Craft (Puducherry) - Sacred Ayyanar guardian horse with applied ornaments, bells, and arched mane
  'villianur-terracotta-craft': `
    <g transform="translate(0, 10)">
      <!-- Drop Shadow for base -->
      <ellipse cx="0" cy="115" rx="70" ry="18" fill="rgba(0,0,0,0.35)" />
      
      <!-- Sturdy hollow terracotta legs & plinth -->
      <rect x="-42" y="35" width="18" height="75" rx="5" fill="#9A3412" stroke="#7C2D12" stroke-width="2" />
      <rect x="24" y="35" width="18" height="75" rx="5" fill="#9A3412" stroke="#7C2D12" stroke-width="2" />
      <rect x="-20" y="40" width="16" height="70" rx="4" fill="#7C2D12" />
      <rect x="6" y="40" width="16" height="70" rx="4" fill="#7C2D12" />

      <!-- Terracotta Horse Body & Flanks -->
      <ellipse cx="0" cy="30" rx="58" ry="36" fill="#C2410C" stroke="#7C2D12" stroke-width="2.5" />
      <ellipse cx="0" cy="28" rx="48" ry="26" fill="#EA580C" />

      <!-- Ornate Saddle with stamped floral motifs -->
      <path d="M-28,8 Q0,-5 28,8 L22,35 Q0,42 -22,35 Z" fill="#F59E0B" stroke="#B45309" stroke-width="2" />
      <circle cx="0" cy="18" r="8" fill="#DC2626" />
      <circle cx="0" cy="18" r="4" fill="#FEF08A" />

      <!-- Dramatic Arched Neck -->
      <path d="M-28,15 C-32,-35 -5,-85 22,-85 C38,-85 45,-60 38,-25 L32,15 Z" fill="#C2410C" stroke="#7C2D12" stroke-width="3" />
      
      <!-- Segmented clay mane ridge -->
      ${[-75, -60, -45, -30, -15, 0].map((y, i) => `
        <polygon points="${22 + i*2},${y-8} ${38 + i*2},${y} ${26 + i*2},${y+8}" fill="#F59E0B" stroke="#B45309" stroke-width="1.5" />
      `).join('')}

      <!-- Expressive Muzzle, Nostrils and Pricked Ears -->
      <polygon points="12,-85 24,-115 6,-92" fill="#EA580C" stroke="#7C2D12" stroke-width="2" />
      <polygon points="28,-82 42,-110 24,-90" fill="#C2410C" stroke="#7C2D12" stroke-width="2" />
      <ellipse cx="32" cy="-70" rx="14" ry="12" fill="#EA580C" stroke="#7C2D12" stroke-width="2" />
      <circle cx="36" cy="-73" r="4" fill="#1E293B" />
      <circle cx="37" cy="-74" r="1.5" fill="#FFFFFF" />

      <!-- Sacred Temple Garland & Brass Bell Medallions -->
      <path d="M-15,-20 Q10,-10 28,-35" fill="none" stroke="#FBBF24" stroke-width="6" stroke-linecap="round" />
      <path d="M-15,-20 Q10,-10 28,-35" fill="none" stroke="#DC2626" stroke-width="2" stroke-dasharray="4,4" />
      
      <circle cx="6" cy="-14" r="8" fill="#F59E0B" stroke="#B45309" stroke-width="1.5" />
      <circle cx="6" cy="-14" r="4" fill="#DC2626" />
      <circle cx="-12" cy="0" r="7" fill="#F59E0B" stroke="#B45309" stroke-width="1.5" />
      <circle cx="-12" cy="0" r="3.5" fill="#DC2626" />

      <!-- Elaborate high curled tail -->
      <path d="M-55,20 C-85,15 -90,-25 -65,-35 C-55,-40 -50,-20 -52,5" fill="none" stroke="#C2410C" stroke-width="7" stroke-linecap="round" />
      <path d="M-55,20 C-85,15 -90,-25 -65,-35 C-55,-40 -50,-20 -52,5" fill="none" stroke="#F59E0B" stroke-width="2.5" />
    </g>
  `,

  // 2. Sohrai & Khovar Tribal Art (Jharkhand) - Mud-wall Sgraffito comb-cut kaolin mural of Pashupati Bull, peacocks & tree
  'sohrai-khovar-tribal-art': `
    <g transform="translate(0, 0)">
      <!-- Mud plaster backdrop panel (Hazaribagh wall) -->
      <rect x="-95" y="-70" width="190" height="140" rx="10" fill="#1C1917" stroke="#78350F" stroke-width="5" filter="drop-shadow(0 15px 25px rgba(0,0,0,0.6))" />
      
      <!-- Comb-cut Kaolin (White Clay) Geometric Border -->
      <rect x="-85" y="-60" width="170" height="120" rx="4" fill="none" stroke="#F5F5F4" stroke-width="2" />
      <g stroke="#F5F5F4" stroke-width="1.5" fill="none">
        ${Array.from({length: 14}).map((_, i) => `<line x1="${-85 + i*13}" y1="-60" x2="${-78 + i*13}" y2="-52" />`).join('')}
        ${Array.from({length: 14}).map((_, i) => `<line x1="${-85 + i*13}" y1="60" x2="${-78 + i*13}" y2="52" />`).join('')}
      </g>

      <!-- Central Sacred Pashupati Horned Bull with Sgraffito comb lines -->
      <g transform="translate(-15, 10)">
        <!-- Bull Body with combed texture -->
        <path d="M-45,15 C-45,-15 15,-15 35,5 C42,12 40,25 35,32 C15,40 -40,35 -45,15 Z" fill="#F5F5F4" />
        <path d="M-40,15 C-40,-8 10,-8 28,8 C32,14 30,22 26,28 C10,34 -35,30 -40,15 Z" fill="#1C1917" />
        
        <!-- Sgraffito comb waves inside body -->
        <path d="M-30,12 Q-10,0 15,14" stroke="#F5F5F4" stroke-width="2" fill="none" />
        <path d="M-32,18 Q-10,6 18,20" stroke="#F5F5F4" stroke-width="2" fill="none" />
        <path d="M-30,24 Q-10,12 15,26" stroke="#F5F5F4" stroke-width="2" fill="none" />

        <!-- Sturdy Legs -->
        <line x1="-35" y1="30" x2="-35" y2="45" stroke="#F5F5F4" stroke-width="4" stroke-linecap="round" />
        <line x1="-20" y1="30" x2="-20" y2="45" stroke="#F5F5F4" stroke-width="4" stroke-linecap="round" />
        <line x1="15" y1="28" x2="15" y2="45" stroke="#F5F5F4" stroke-width="4" stroke-linecap="round" />
        <line x1="28" y1="28" x2="28" y2="45" stroke="#F5F5F4" stroke-width="4" stroke-linecap="round" />

        <!-- Bull Head, Large Sweeping Horns & Ears -->
        <path d="M35,8 L50,-5 L48,15 Z" fill="#F5F5F4" />
        <path d="M42,-2 C45,-25 25,-42 5,-45 C2,-45 8,-35 25,-32 C38,-28 40,-15 42,-2 Z" fill="#F5F5F4" />
        <path d="M46,-2 C58,-22 45,-40 28,-42 C25,-42 32,-32 42,-28 C50,-24 48,-15 46,-2 Z" fill="#E7E5E4" />
        <polygon points="38,12 52,18 42,22" fill="#F5F5F4" />
        <circle cx="44" cy="4" r="2.5" fill="#1C1917" />
        <line x1="-45" y1="5" x2="-58" y2="28" stroke="#F5F5F4" stroke-width="3" stroke-linecap="round" />
      </g>

      <!-- Perched Tribal Peacock & Tree of Life on the right -->
      <g transform="translate(48, -10)">
        <path d="M0,45 Q-15,10 0,-25 Q10,10 0,45" fill="none" stroke="#F5F5F4" stroke-width="3" />
        <!-- Combed Peacock Feathers -->
        <path d="M-8,-15 C-25,-30 -10,-45 8,-35 C20,-25 10,-5 -8,-15 Z" fill="#F5F5F4" />
        <circle cx="12" cy="-38" r="4" fill="#F5F5F4" />
        <path d="M14,-40 L22,-44 L16,-36 Z" fill="#F5F5F4" />
        <path d="M-15,-20 Q-35,-25 -40,-10 Q-25,-5 -10,-10" stroke="#F5F5F4" stroke-width="2" fill="none" />
      </g>

      <!-- Natural Red Ochre (Lal Matti) and Yellow (Pila Matti) Accent Dots -->
      <circle cx="-60" cy="-40" r="4" fill="#B91C1C" />
      <circle cx="65" cy="-42" r="4" fill="#D97706" />
      <circle cx="-65" cy="35" r="4" fill="#D97706" />
      <circle cx="65" cy="35" r="4" fill="#B91C1C" />
    </g>
  `,

  // 3. Puri Pattachitra Art (Odisha) - Traditional cloth scroll of Lord Jagannath with cinnabar red ground & floral border
  'puri-pattachitra-art': `
    <g transform="translate(0, 0)">
      <!-- Hand-treated Cotton Canvas Scroll (Patta) with burnished edge -->
      <rect x="-90" y="-70" width="180" height="140" rx="8" fill="#7F1D1D" stroke="#451A03" stroke-width="5" filter="drop-shadow(0 15px 25px rgba(0,0,0,0.6))" />
      
      <!-- Ornate Hingula Red & Yellow Mineral Border -->
      <rect x="-82" y="-62" width="164" height="124" fill="#991B1B" stroke="#F59E0B" stroke-width="2" />
      <g fill="#FEF08A">
        ${Array.from({length: 12}).map((_, i) => `<circle cx="${-72 + i*13}" cy="-56" r="2.5" />`).join('')}
        ${Array.from({length: 12}).map((_, i) => `<circle cx="${-72 + i*13}" cy="56" r="2.5" />`).join('')}
      </g>

      <!-- Traditional Arch Frame (Prabhavali) -->
      <path d="M-55,48 L-55,-15 Q0,-55 55,-15 L55,48 Z" fill="#1E293B" stroke="#F59E0B" stroke-width="3" />

      <!-- Lord Jagannath Iconography (Iconic round white face, round hypnotic eyes, red smile) -->
      <g transform="translate(0, 2)">
        <!-- Iconic Black/White Rounded Head Frame -->
        <circle cx="0" cy="-6" r="32" fill="#0F172A" stroke="#F59E0B" stroke-width="3" />
        <circle cx="0" cy="-6" r="28" fill="#1E293B" />

        <!-- Large Hypnotic Round Eyes (Netra) -->
        <circle cx="-13" cy="-10" r="11" fill="#FFFFFF" stroke="#DC2626" stroke-width="1.5" />
        <circle cx="-13" cy="-10" r="6" fill="#000000" />
        <circle cx="-11" cy="-12" r="2" fill="#FFFFFF" />

        <circle cx="13" cy="-10" r="11" fill="#FFFFFF" stroke="#DC2626" stroke-width="1.5" />
        <circle cx="13" cy="-10" r="6" fill="#000000" />
        <circle cx="15" cy="-12" r="2" fill="#FFFFFF" />

        <!-- Sacred Tilak / Chandan Y-mark on forehead -->
        <path d="M-4,-30 L4,-30 L3,-18 L0,-14 L-3,-18 Z" fill="#F59E0B" />
        <circle cx="0" cy="-18" r="2" fill="#DC2626" />

        <!-- Iconic Symmetrical Red Curved Mouth & Moustache -->
        <path d="M-15,10 Q0,20 15,10" fill="none" stroke="#DC2626" stroke-width="4" stroke-linecap="round" />
        <path d="M-18,6 Q0,12 18,6" fill="none" stroke="#F59E0B" stroke-width="2" />

        <!-- Ornate Gold Mukut Crown -->
        <path d="M-28,-28 Q0,-58 28,-28 L20,-24 Q0,-42 -20,-24 Z" fill="#F59E0B" stroke="#CA8A04" stroke-width="2" />
        <circle cx="0" cy="-48" r="6" fill="#DC2626" />
        <circle cx="-16" cy="-35" r="4" fill="#10B981" />
        <circle cx="16" cy="-35" r="4" fill="#10B981" />

        <!-- Extended Horizontal Arms & Lower Torso -->
        <path d="M-48,15 L48,15 L42,42 L-42,42 Z" fill="#F59E0B" stroke="#B45309" stroke-width="2" />
        <circle cx="-45" cy="18" r="6" fill="#DC2626" />
        <circle cx="45" cy="18" r="6" fill="#DC2626" />
        
        <!-- Sacred Garland (Vanamala) -->
        <path d="M-35,22 Q0,45 35,22" fill="none" stroke="#10B981" stroke-width="3" stroke-linecap="round" />
        <path d="M-30,28 Q0,48 30,28" fill="none" stroke="#F8FAFC" stroke-width="2" stroke-dasharray="3,3" />
      </g>
    </g>
  `,

  // 4. Punjab Phulkari Embroidery (Punjab) - Silk floss (pat) geometric Bagh diamond embroidery on khaddar
  'punjab-phulkari-embroidery': `
    <g transform="translate(0, 0)">
      <!-- Terracotta Crimson Hand-Spun Khaddar Base Cloth -->
      <rect x="-92" y="-62" width="184" height="124" rx="8" fill="#991B1B" filter="drop-shadow(0 15px 25px rgba(0,0,0,0.5))" />
      
      <!-- Authentic Dense Bagh Geometric Silk-Floss (Pat) Diamond Mosaic -->
      <g stroke="#D97706" stroke-width="1.2">
        ${[-60, -20, 20, 60].map(cx => `
          ${[-22, 22].map(cy => `
            <g transform="translate(${cx}, ${cy})">
              <!-- Outer Golden-Yellow Silk Floss Diamond -->
              <polygon points="0,-22 20,0 0,22 -20,0" fill="#FBBF24" />
              <!-- Directional Darning Stitch Texture Lines -->
              <line x1="-14" y1="-7" x2="14" y2="-7" stroke="#F59E0B" stroke-width="1" />
              <line x1="-18" y1="0" x2="18" y2="0" stroke="#F59E0B" stroke-width="1" />
              <line x1="-14" y1="7" x2="14" y2="7" stroke="#F59E0B" stroke-width="1" />
              
              <!-- Inner Vermilion & Magenta Flower Core -->
              <polygon points="0,-12 11,0 0,12 -11,0" fill="#EA580C" />
              <polygon points="0,-6 6,0 0,6 -6,0" fill="#831843" />
              <circle cx="0" cy="0" r="2" fill="#FEF08A" />
            </g>
          `).join('')}
        `).join('')}

        <!-- Interstitial Geometric Triangles in Turquoise & Emerald Floss -->
        ${[-40, 0, 40].map(cx => `
          <g transform="translate(${cx}, 0)">
            <polygon points="0,-14 14,0 0,14 -14,0" fill="#0284C7" />
            <polygon points="0,-7 7,0 0,7 -7,0" fill="#10B981" />
          </g>
        `).join('')}
      </g>

      <!-- Traditional Phulkari Fringed Khaddar Border Edge -->
      <line x1="-92" y1="-56" x2="92" y2="-56" stroke="#FEF08A" stroke-width="2" stroke-dasharray="4,4" />
      <line x1="-92" y1="56" x2="92" y2="56" stroke="#FEF08A" stroke-width="2" stroke-dasharray="4,4" />
    </g>
  `,

  // 5. Pochampally Ikat / Telia Rumal (Telangana) - Square grid double-ikat in terracotta red, black & white
  'pochampally-ikat': `
    <g transform="translate(0, 0)">
      <!-- Telia Rumal Square Kerchief Textile Frame -->
      <rect x="-85" y="-60" width="170" height="120" rx="6" fill="#18181B" stroke="#09090B" stroke-width="4" filter="drop-shadow(0 15px 25px rgba(0,0,0,0.5))" />
      
      <!-- Solid Terracotta-Red Outer Border -->
      <rect x="-76" y="-52" width="152" height="104" rx="2" fill="#991B1B" />
      
      <!-- Crisp White Double-Ikat Framing Pinstripes -->
      <rect x="-68" y="-45" width="136" height="90" fill="none" stroke="#F8FAFC" stroke-width="2" stroke-dasharray="8,2" />
      
      <!-- Central Field 3x2 Telia Grid (Chowkas with Jasmine / Diamond Stars) -->
      <g transform="translate(0, 0)">
        <rect x="-60" y="-38" width="120" height="76" fill="#18181B" />
        
        ${[-40, 0, 40].map(x => `
          ${[-19, 19].map(y => `
            <g transform="translate(${x}, ${y})">
              <!-- Terracotta Red Diamond -->
              <polygon points="0,-15 15,0 0,15 -15,0" fill="#C2410C" />
              <!-- White Stepped Ikat Star (Mallipu flower / Star motif) -->
              <polygon points="0,-11 11,0 0,11 -11,0" fill="#F8FAFC" />
              <polygon points="0,-7 7,0 0,7 -7,0" fill="#18181B" />
              <!-- Stepped Pixelated Ikat Corner Dots -->
              <rect x="-3" y="-3" width="6" height="6" fill="#EA580C" />
              <circle cx="0" cy="0" r="1.5" fill="#FFFFFF" />
            </g>
          `).join('')}
        `).join('')}

        <!-- Grid Divider Lines in Double-Ikat White/Black Dash -->
        <line x1="-20" y1="-38" x2="-20" y2="38" stroke="#F8FAFC" stroke-width="1.5" stroke-dasharray="4,2" />
        <line x1="20" y1="-38" x2="20" y2="38" stroke="#F8FAFC" stroke-width="1.5" stroke-dasharray="4,2" />
        <line x1="-60" y1="0" x2="60" y2="0" stroke="#F8FAFC" stroke-width="1.5" stroke-dasharray="4,2" />
      </g>
    </g>
  `,

  // 6. Nicobari Hodi Traditional Canoe (Andaman & Nicobar) - 12:1 sleek jackfruit wood dugout with bamboo outrigger & paddle
  'nicobari-hodi-traditional-canoe': `
    <g transform="translate(0, 10)">
      <!-- Sea water ripples under canoe -->
      <ellipse cx="0" cy="45" rx="85" ry="12" fill="rgba(2,132,199,0.15)" />
      
      <!-- Outrigger Stabilizer Float (Log boom sitting on the water) -->
      <g transform="translate(0, -32)">
        <path d="M-80,0 Q0,-8 80,0 Q70,7 0,7 Q-70,7 -80,0 Z" fill="#D97706" stroke="#92400E" stroke-width="2" />
        <line x1="-75" y1="0" x2="75" y2="0" stroke="#FDE047" stroke-width="1.5" />
      </g>

      <!-- Three Curved Bamboo Crossbeams (Booms connecting float to hull) -->
      <g stroke="#FDE047" stroke-width="3" stroke-linecap="round" fill="none">
        <path d="M-45,22 C-55,-5 -60,-20 -55,-32" />
        <path d="M0,22 C-10,-5 -15,-20 -10,-32" />
        <path d="M45,22 C35,-5 30,-20 35,-32" />
      </g>
      <!-- Lashings on crossbeams -->
      <circle cx="-55" cy="-32" r="3" fill="#78350F" />
      <circle cx="-10" cy="-32" r="3" fill="#78350F" />
      <circle cx="35" cy="-32" r="3" fill="#78350F" />

      <!-- Main Dugout Hull (Crafted from single jackfruit trunk, sleek 12:1 profile) -->
      <g transform="translate(0, 20)">
        <!-- Outer carved timber hull with sharp curved bow & stern -->
        <path d="M-92,-8 Q0,-16 92,-8 C85,25 40,32 0,32 C-40,32 -85,25 -92,-8 Z" fill="#78350F" stroke="#451A03" stroke-width="3" filter="drop-shadow(0 12px 20px rgba(0,0,0,0.5))" />
        
        <!-- Hollow interior cockpit -->
        <ellipse cx="0" cy="-2" rx="82" ry="12" fill="#451A03" />
        <ellipse cx="0" cy="1" rx="74" ry="7" fill="#9A3412" />
        
        <!-- Traditional geometric notch markings on gunwale -->
        <path d="M-82,-6 Q0,-12 82,-6" fill="none" stroke="#FBBF24" stroke-width="2" stroke-dasharray="6,4" />

        <!-- Hand-carved Wooden Paddle (Kavata) resting across the cockpit -->
        <g transform="translate(-10, -5) rotate(18)">
          <line x1="-50" y1="0" x2="45" y2="0" stroke="#FDE047" stroke-width="3" stroke-linecap="round" />
          <path d="M35,-8 Q55,0 35,8 Z" fill="#CA8A04" stroke="#92400E" stroke-width="1.5" />
        </g>
      </g>
    </g>
  `,

  // 7. Madhubani Painting (Bihar) - Authentic double-line ink work of auspicious fish, lotus & peacock
  'madhubani-painting': `
    <g transform="translate(0, 0)">
      <!-- Handmade Mithila Paper Canvas -->
      <rect x="-92" y="-68" width="184" height="136" rx="8" fill="#FEF3C7" stroke="#78350F" stroke-width="5" filter="drop-shadow(0 15px 25px rgba(0,0,0,0.5))" />
      
      <!-- Authentic Double-Line Border with Hatching (Kachni style) -->
      <rect x="-84" y="-60" width="168" height="120" fill="none" stroke="#1E293B" stroke-width="2" />
      <rect x="-80" y="-56" width="160" height="112" fill="none" stroke="#1E293B" stroke-width="1.5" />
      <g stroke="#1E293B" stroke-width="1">
        ${Array.from({length: 18}).map((_, i) => `<line x1="${-84 + i*9.5}" y1="-60" x2="${-80 + i*9.5}" y2="-56" />`).join('')}
        ${Array.from({length: 18}).map((_, i) => `<line x1="${-84 + i*9.5}" y1="56" x2="${-80 + i*9.5}" y2="60" />`).join('')}
      </g>

      <!-- Central Auspicious Sacred Lotus (Aripana) -->
      <g transform="translate(0, 0)">
        <circle cx="0" cy="0" r="15" fill="#F59E0B" stroke="#1E293B" stroke-width="2" />
        <circle cx="0" cy="0" r="8" fill="#DC2626" />
        ${Array.from({length: 8}).map((_, i) => `
          <g transform="rotate(${i * 45})">
            <path d="M0,-15 Q-8,-26 0,-34 Q8,-26 0,-15 Z" fill="#E11D48" stroke="#1E293B" stroke-width="1.5" />
            <line x1="0" y1="-15" x2="0" y2="-32" stroke="#FEF08A" stroke-width="1" />
          </g>
        `).join('')}
      </g>

      <!-- Two Auspicious Madhubani Fish with Double-Line Fine Scales (Fertility & Prosperity) -->
      <!-- Left Fish -->
      <g transform="translate(-48, 12) rotate(25)">
        <path d="M-28,0 C-15,-18 15,-18 28,0 C15,18 -15,18 -28,0 Z" fill="#0284C7" stroke="#1E293B" stroke-width="2" />
        <path d="M-22,0 C-10,-12 10,-12 22,0 C10,12 -10,12 -22,0 Z" fill="#38BDF8" />
        <!-- Fin & Tail -->
        <polygon points="-28,0 -42,-12 -38,0 -42,12" fill="#0369A1" stroke="#1E293B" stroke-width="1.5" />
        <circle cx="16" cy="-4" r="3" fill="#FFFFFF" stroke="#1E293B" stroke-width="1.5" />
        <circle cx="16" cy="-4" r="1.5" fill="#000000" />
        <!-- Kachni Hatching Scales -->
        <path d="M-10,-8 Q0,0 -10,8" fill="none" stroke="#1E293B" stroke-width="1.2" />
        <path d="M0,-10 Q10,0 0,10" fill="none" stroke="#1E293B" stroke-width="1.2" />
      </g>

      <!-- Right Graceful Peacock with Fine Feather Crown -->
      <g transform="translate(48, -10) scale(0.95)">
        <!-- Body & Neck -->
        <path d="M0,25 C-12,15 -18,-10 0,-25 C12,-15 15,15 0,25 Z" fill="#10B981" stroke="#1E293B" stroke-width="2" />
        <circle cx="2" cy="-28" r="6" fill="#059669" stroke="#1E293B" stroke-width="1.5" />
        <polygon points="8,-28 16,-26 8,-24" fill="#F59E0B" stroke="#1E293B" stroke-width="1" />
        <!-- Crest (Kalgi) -->
        <line x1="2" y1="-34" x2="-2" y2="-44" stroke="#1E293B" stroke-width="1.5" />
        <circle cx="-2" cy="-44" r="2.5" fill="#DC2626" />
        <line x1="4" y1="-34" x2="6" y2="-45" stroke="#1E293B" stroke-width="1.5" />
        <circle cx="6" cy="-45" r="2.5" fill="#F59E0B" />
        <!-- Tail Feathers -->
        <path d="M-12,18 C-35,30 -45,10 -25,-5" fill="none" stroke="#0284C7" stroke-width="4" stroke-linecap="round" />
        <circle cx="-35" cy="20" r="4" fill="#FBBF24" />
      </g>
    </g>
  `,

  // 8. Ladakh Shingkos Wood Carving (Ladakh) - Authentic carved walnut Choktse table with Snow Lion & Tibetan dragon relief
  'ladakh-shingkos-wood-carving': `
    <g transform="translate(0, 10)">
      <!-- Deep Carved Himalayan Walnut/Apricot Choktse Folding Table Top -->
      <rect x="-85" y="-55" width="170" height="24" rx="4" fill="#451A03" stroke="#270D02" stroke-width="3" filter="drop-shadow(0 15px 25px rgba(0,0,0,0.6))" />
      <rect x="-80" y="-51" width="160" height="16" rx="2" fill="#78350F" />
      
      <!-- Ornate Carved Front Apron Panel with High Relief Depth -->
      <path d="M-75,-31 L75,-31 L65,55 L-65,55 Z" fill="#542306" stroke="#270D02" stroke-width="3" />
      <path d="M-68,-26 L68,-26 L58,48 L-58,48 Z" fill="#9A3412" stroke="#CA8A04" stroke-width="2" />

      <!-- Central Sacred Himalayan Snow Lion (Sengge) - White body with turquoise mane -->
      <g transform="translate(0, 8)">
        <!-- Golden Carved Sunburst Medallion -->
        <circle cx="0" cy="0" r="26" fill="#B45309" stroke="#FDE047" stroke-width="2" />
        
        <!-- Roaring White Snow Lion Body -->
        <path d="M-16,8 C-18,-6 -5,-18 10,-14 C16,-10 18,0 12,10 C5,15 -10,15 -16,8 Z" fill="#F8FAFC" stroke="#0F172A" stroke-width="1.5" />
        <!-- Vibrant Turquoise Mane Curls -->
        <path d="M-12,-8 C-22,-16 -10,-24 -2,-16" fill="none" stroke="#06B6D4" stroke-width="3.5" stroke-linecap="round" />
        <path d="M0,-14 C-4,-24 10,-26 8,-16" fill="none" stroke="#0891B2" stroke-width="3.5" stroke-linecap="round" />
        <!-- Roaring Head & Red Mouth -->
        <circle cx="10" cy="-6" r="6" fill="#F8FAFC" stroke="#0F172A" stroke-width="1" />
        <circle cx="13" cy="-4" r="2" fill="#DC2626" />
        <!-- Tail curl -->
        <path d="M-16,4 C-25,0 -22,-12 -14,-8" fill="none" stroke="#06B6D4" stroke-width="2.5" />
      </g>

      <!-- Flanking Carved Tibetan Cloud / Dragon Motifs in Vermilion & Gold -->
      <g stroke="#FDE047" stroke-width="2" fill="none">
        <path d="M-60,-10 Q-45,-22 -35,-5 T-45,15" />
        <circle cx="-48" cy="-5" r="4" fill="#DC2626" />
        <path d="M60,-10 Q45,-22 35,-5 T45,15" />
        <circle cx="48" cy="-5" r="4" fill="#DC2626" />
      </g>

      <!-- Scalloped Lower Table Feet (Pedestal base) -->
      <path d="M-65,55 L-72,75 L-48,75 L-55,55 Z" fill="#451A03" stroke="#270D02" stroke-width="2" />
      <path d="M65,55 L72,75 L48,75 L55,55 Z" fill="#451A03" stroke="#270D02" stroke-width="2" />
      <path d="M-55,55 Q0,45 55,55" fill="none" stroke="#FBBF24" stroke-width="4" />
    </g>
  `,

  // 9. Kannauj Rose Attar (Uttar Pradesh) - Traditional copper Deg still & luxury faceted cut-crystal ittar flacon
  'kannauj-rose-attar': `
    <g transform="translate(0, 10)">
      <!-- Left: Traditional Hammered Copper Deg (Distillation Still) with mud seal -->
      <g transform="translate(-40, 15)">
        <ellipse cx="0" cy="55" rx="35" ry="10" fill="rgba(0,0,0,0.4)" />
        <!-- Copper Pot Body -->
        <path d="M-28,45 C-42,30 -38,-15 -18,-25 L18,-25 C38,-15 42,30 28,45 Z" fill="#B45309" stroke="#78350F" stroke-width="2.5" />
        <ellipse cx="0" cy="-25" rx="18" ry="6" fill="#78350F" />
        <!-- Clay & Cloth Airtight Seal Rim -->
        <rect x="-20" y="-30" width="40" height="8" rx="3" fill="#D97706" stroke="#92400E" stroke-width="1.5" />
        <!-- Bamboo Chonga Pipe leading steam to condenser -->
        <path d="M0,-28 Q15,-60 45,-45" fill="none" stroke="#FDE047" stroke-width="4" stroke-linecap="round" />
        <!-- Copper highlights -->
        <ellipse cx="-8" cy="10" rx="8" ry="20" fill="#F59E0B" opacity="0.6" transform="rotate(-15, -8, 10)" />
      </g>

      <!-- Right: Faceted Cut-Crystal Ittar Flacon with Golden Damask Rose Oil -->
      <g transform="translate(42, 0)">
        <ellipse cx="0" cy="65" rx="28" ry="8" fill="rgba(0,0,0,0.3)" />
        <!-- Crystal Bottle Body with Amber Rose Attar -->
        <path d="M-22,55 L-26,5 L-12,-18 L12,-18 L26,5 L22,55 Z" fill="#F59E0B" fill-opacity="0.85" stroke="#E2E8F0" stroke-width="3" filter="drop-shadow(0 15px 25px rgba(0,0,0,0.4))" />
        
        <!-- Crystal Facet Reflection Lines -->
        <line x1="-12" y1="-18" x2="-14" y2="55" stroke="#FFFFFF" stroke-width="2" opacity="0.8" />
        <line x1="12" y1="-18" x2="14" y2="55" stroke="#FFFFFF" stroke-width="1.5" opacity="0.6" />
        <polygon points="0,-15 10,15 0,48 -10,15" fill="#FEF08A" opacity="0.4" />

        <!-- Ornate Brass Applicator Cap & Finial Dome -->
        <rect x="-10" y="-24" width="20" height="8" rx="2" fill="#CA8A04" stroke="#854D0E" stroke-width="1.5" />
        <path d="M-8,-24 Q0,-45 0,-55 Q0,-45 8,-24 Z" fill="#EAB308" stroke="#CA8A04" stroke-width="2" />
        <circle cx="0" cy="-56" r="3.5" fill="#DC2626" />
      </g>

      <!-- Fresh Pink Damask Rose (Gulab) in the center foreground -->
      <g transform="translate(2, 45) scale(0.85)">
        <circle cx="0" cy="0" r="22" fill="#E11D48" filter="drop-shadow(0 6px 10px rgba(0,0,0,0.3))" />
        <circle cx="-6" cy="-4" r="15" fill="#F43F5E" />
        <circle cx="6" cy="4" r="12" fill="#FB7185" />
        <circle cx="0" cy="0" r="7" fill="#FFE4E6" />
        <!-- Dew droplet -->
        <circle cx="4" cy="-8" r="2" fill="#FFFFFF" opacity="0.9" />
      </g>
    </g>
  `,

  // 10. Kashmir Pashmina Kani Shawl (Jammu & Kashmir) - Draped crimson & royal blue cashmere with authentic woven Boteh paisley
  'kashmir-pashmina': `
    <g transform="translate(0, 0)">
      <!-- Masterpiece Pashmina Cashmere Draped Shawl Base -->
      <path d="M-92,-52 C-45,-75 45,-35 92,-52 C115,18 75,72 42,82 C-20,92 -92,42 -92,-52 Z" fill="#881337" filter="drop-shadow(0 18px 28px rgba(0,0,0,0.55))" />
      <path d="M-80,-38 C-35,-55 38,-24 80,-38 C95,15 62,58 35,68 C-15,78 -80,38 -80,-38 Z" fill="#9F1239" />
      
      <!-- Authentic Hand-Woven Kani Boteh (Teardrop Paisley) Motif -->
      <g transform="translate(0, 12)">
        <!-- Outer Golden Silk Paisley Silhouette with curved tip -->
        <path d="M0,38 C-32,38 -52,12 -42,-18 C-35,-48 -12,-72 8,-82 C14,-58 -4,-38 0,-12 C4,12 32,38 0,38 Z" fill="#D97706" stroke="#FEF08A" stroke-width="2" />
        
        <!-- Inner Intricate Kani Floral Lattice in Sapphire, Emerald & Ruby -->
        <path d="M-5,24 C-22,24 -36,6 -28,-14 C-22,-36 -6,-54 6,-62 C10,-44 -2,-28 0,-8 C2,8 20,24 -5,24 Z" fill="#1E3A8A" />
        
        <!-- Micro floral rosettes inside paisley -->
        <circle cx="-12" cy="5" r="5" fill="#E11D48" />
        <circle cx="-12" cy="5" r="2" fill="#FEF08A" />
        <circle cx="-18" cy="-14" r="4.5" fill="#10B981" />
        <circle cx="-18" cy="-14" r="1.8" fill="#FEF08A" />
        <circle cx="-6" cy="-32" r="4" fill="#F59E0B" />
        
        <path d="M-10,12 Q-25,-5 -15,-25" fill="none" stroke="#FDE047" stroke-width="1.8" />
      </g>

      <!-- Traditional Hand-Twisted Fine Cashmere Fringe along border -->
      <g stroke="#FDE047" stroke-width="1.8" stroke-linecap="round">
        ${Array.from({length: 15}).map((_, i) => {
          const x = -56 + i * 8;
          return `<line x1="${x}" y1="76" x2="${x + (i % 2 === 0 ? -4 : 4)}" y2="102" />`;
        }).join('')}
      </g>
    </g>
  `,

  // 11. Assam Orthodox Tea (Assam) - Whole wiry black leaves, golden tips (TGFOP) & rich copper-amber tea in clear glass teacup
  'assam-orthodox-tea': `
    <g transform="translate(0, 10)">
      <!-- Saucer Plate -->
      <ellipse cx="0" cy="62" rx="90" ry="22" fill="#CBD5E1" filter="drop-shadow(0 12px 18px rgba(0,0,0,0.35))" />
      <ellipse cx="0" cy="60" rx="76" ry="16" fill="#F8FAFC" />
      
      <!-- Clear Glass Teacup with Radiant Copper-Amber Orthodox Tea Liquor -->
      <path d="M-55,15 C-48,58 48,58 55,15 C55,-12 -55,-12 -55,15 Z" fill="#7C2D12" fill-opacity="0.85" stroke="#E2E8F0" stroke-width="3.5" filter="drop-shadow(0 15px 25px rgba(0,0,0,0.4))" />
      
      <!-- Liquid Surface with Malty Copper Sheen -->
      <ellipse cx="0" cy="14" rx="52" ry="14" fill="#C2410C" />
      <ellipse cx="0" cy="14" rx="46" ry="11" fill="#EA580C" opacity="0.9" />
      <ellipse cx="-15" cy="12" rx="14" ry="4" fill="#FBBF24" opacity="0.5" /> <!-- Golden liquor reflection -->

      <!-- Glass Handle -->
      <path d="M52,12 C78,12 78,46 50,46" fill="none" stroke="#E2E8F0" stroke-width="7" stroke-linecap="round" />
      <path d="M52,12 C78,12 78,46 50,46" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" opacity="0.8" />

      <!-- Whole Rolled Black Tea Leaves with Golden Tips (TGFOP) cascading on the right -->
      <g transform="translate(52, 28) scale(0.95)">
        <!-- Wiry black tea leaves -->
        <path d="M0,0 Q12,-8 20,4 Q10,12 0,0" fill="#18181B" stroke="#27272A" stroke-width="1" />
        <path d="M15,10 Q28,2 35,16 Q22,20 15,10" fill="#18181B" stroke="#27272A" stroke-width="1" />
        <!-- Golden Tips (Amber buds) -->
        <path d="M-8,14 Q2,5 12,18 Q0,22 -8,14" fill="#F59E0B" stroke="#B45309" stroke-width="1" />
        <path d="M22,-4 Q32,-14 40,-2 Q30,4 22,-4" fill="#FBBF24" stroke="#D97706" stroke-width="1" />
      </g>

      <!-- Fresh Two Leaves and a Bud Sprig in the background -->
      <g transform="translate(-12, -28) scale(1.1)">
        <path d="M0,18 Q-25,-15 0,-50 Q25,-15 0,18 Z" fill="#15803D" stroke="#16A34A" stroke-width="1.5" />
        <path d="M0,18 Q-12,-12 0,-50" fill="none" stroke="#86EFAC" stroke-width="1.8" />
        <path d="M-12,8 Q-42,-2 -32,-35 Q-8,-15 -12,8 Z" fill="#16A34A" />
        <path d="M12,12 Q42,2 32,-30 Q8,-12 12,12 Z" fill="#15803D" />
        <!-- Morning dew drops -->
        <circle cx="-5" cy="-22" r="3" fill="#FFFFFF" opacity="0.8" />
      </g>

      <!-- Steaming Aromatic Warmth -->
      <path d="M-15,-2 Q-28,-30 -12,-55 T-22,-95" fill="none" stroke="#FFFFFF" stroke-width="2.5" opacity="0.4" stroke-linecap="round" />
      <path d="M12,-6 Q28,-35 15,-65 T28,-100" fill="none" stroke="#FFFFFF" stroke-width="2" opacity="0.3" stroke-linecap="round" />
    </g>
  `
};

let count = 0;
for (const [id, svgContent] of Object.entries(ARTWORKS)) {
  const fullSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="none">
  <!-- Standalone Physical Product Hero Artwork (Transparent Background) -->
  <g transform="translate(300, 180)">
    ${svgContent.trim()}
  </g>
</svg>
  `.trim();

  const svgPath = path.join(giImagesDir, `${id}.svg`);
  fs.writeFileSync(svgPath, fullSvg, 'utf8');
  count++;
}

console.log(`✅ Successfully updated ${count} researched, highly authentic standalone product SVGs!`);
