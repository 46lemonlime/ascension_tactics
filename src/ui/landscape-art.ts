/**
 * Procedural Vector Landscape Artwork for Biomes and Missions
 * Provides rich, zero-latency, scale-independent cinematic landscape illustrations.
 */

export function getBiomeArtwork(themeId: string): string {
  switch (themeId) {
    case 'jungle':
      return `
        <svg viewBox="0 0 320 180" class="sp-landscape-svg" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="jg-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#04140a"/>
              <stop offset="60%" stop-color="#0b2816"/>
              <stop offset="100%" stop-color="#144222"/>
            </linearGradient>
            <linearGradient id="jg-spores" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#4ade80" stop-opacity="0.8"/>
              <stop offset="100%" stop-color="#15803d" stop-opacity="0.1"/>
            </linearGradient>
          </defs>
          <rect width="320" height="180" fill="url(#jg-sky)"/>
          <!-- Distant Planetary Ring & Moon -->
          <circle cx="240" cy="45" r="28" fill="#22c55e" opacity="0.25"/>
          <ellipse cx="240" cy="45" rx="55" ry="12" fill="none" stroke="#86efac" stroke-width="2" opacity="0.35" transform="rotate(-15 240 45)"/>
          <!-- Distant Mountain Ridges -->
          <path d="M0 130 Q60 85 130 115 T260 95 Q290 110 320 100 L320 180 L0 180 Z" fill="#082012" opacity="0.85"/>
          <!-- Titan Rib Cages -->
          <path d="M70 145 C65 90, 115 80, 125 145 M100 148 C95 95, 145 85, 155 148 M130 150 C125 100, 175 90, 185 150" fill="none" stroke="#166534" stroke-width="4.5" opacity="0.6"/>
          <!-- Primeval Alien Canopy Silhouettes -->
          <path d="M0 180 L0 135 Q20 120 40 138 Q70 110 100 140 Q130 115 160 135 Q190 105 230 142 Q270 115 300 138 L320 130 L320 180 Z" fill="#0c311a"/>
          <!-- Bioluminescent Ferns & Foreground Overgrowth -->
          <path d="M-10 180 Q30 140 60 180 Q90 145 130 180 Q170 140 220 180 Q270 135 330 180 Z" fill="#051a0d"/>
          <!-- Glowing Spore Particles -->
          <circle cx="50" cy="110" r="2.5" fill="#86efac" filter="drop-shadow(0 0 4px #4ade80)"/>
          <circle cx="115" cy="85" r="2" fill="#4ade80" filter="drop-shadow(0 0 3px #22c55e)"/>
          <circle cx="190" cy="120" r="3" fill="#86efac" filter="drop-shadow(0 0 4px #4ade80)"/>
          <circle cx="270" cy="95" r="2" fill="#bbf7d0" filter="drop-shadow(0 0 3px #4ade80)"/>
          <circle cx="150" cy="140" r="1.8" fill="#4ade80"/>
        </svg>`;

    case 'snow':
      return `
        <svg viewBox="0 0 320 180" class="sp-landscape-svg" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="sn-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#030712"/>
              <stop offset="50%" stop-color="#0f172a"/>
              <stop offset="100%" stop-color="#1e293b"/>
            </linearGradient>
            <linearGradient id="sn-aurora" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#38bdf8" stop-opacity="0"/>
              <stop offset="40%" stop-color="#38bdf8" stop-opacity="0.45"/>
              <stop offset="70%" stop-color="#818cf8" stop-opacity="0.5"/>
              <stop offset="100%" stop-color="#2dd4bf" stop-opacity="0"/>
            </linearGradient>
          </defs>
          <rect width="320" height="180" fill="url(#sn-sky)"/>
          <!-- Polar Aurora Waves -->
          <path d="M0 45 Q80 20 160 50 T320 35 L320 85 Q240 60 160 90 T0 70 Z" fill="url(#sn-aurora)"/>
          <!-- Distant Jagged Glacial Peaks -->
          <polygon points="0,140 45,90 90,135 150,80 210,130 270,75 320,125 320,180 0,180" fill="#334155"/>
          <!-- Midground Permafrost Crags -->
          <polygon points="0,155 60,115 120,160 180,110 240,150 300,105 320,135 320,180 0,180" fill="#64748b"/>
          <!-- Foreground Crystalline Ice & Snow Sheets -->
          <path d="M0 160 Q80 145 160 158 T320 150 L320 180 L0 180 Z" fill="#cbd5e1"/>
          <!-- Sub-Zero Crystal Shards -->
          <polygon points="35,165 42,135 48,165" fill="#f8fafc"/>
          <polygon points="215,170 225,130 232,170" fill="#f8fafc"/>
          <polygon points="280,168 288,142 294,168" fill="#f8fafc"/>
          <!-- Blizzard Particles -->
          <circle cx="80" cy="65" r="1.5" fill="#ffffff" opacity="0.9"/>
          <circle cx="140" cy="105" r="1.8" fill="#ffffff" opacity="0.85"/>
          <circle cx="230" cy="75" r="1.2" fill="#ffffff" opacity="0.9"/>
          <circle cx="295" cy="120" r="1.5" fill="#ffffff" opacity="0.95"/>
        </svg>`;

    case 'desert':
      return `
        <svg viewBox="0 0 320 180" class="sp-landscape-svg" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="ds-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#1c0e04"/>
              <stop offset="50%" stop-color="#451a03"/>
              <stop offset="100%" stop-color="#78350f"/>
            </linearGradient>
          </defs>
          <rect width="320" height="180" fill="url(#ds-sky)"/>
          <!-- Blazing Twin Suns -->
          <circle cx="75" cy="40" r="18" fill="#fef08a" opacity="0.85" filter="drop-shadow(0 0 16px #f59e0b)"/>
          <circle cx="115" cy="55" r="10" fill="#fdba74" opacity="0.75" filter="drop-shadow(0 0 10px #ea580c)"/>
          <!-- Colossal Canyon Mesa Spires -->
          <polygon points="170,140 175,70 195,70 205,140" fill="#78350f"/>
          <polygon points="230,145 235,55 265,55 275,145" fill="#92400e"/>
          <polygon points="120,150 125,90 145,90 155,150" fill="#713f12"/>
          <!-- Vast Ash Dunes -->
          <path d="M0 135 Q90 105 180 140 T320 120 L320 180 L0 180 Z" fill="#b45309"/>
          <path d="M0 155 Q110 130 220 160 T320 145 L320 180 L0 180 Z" fill="#d97706"/>
          <!-- Foreground Sunken Monolith & Ridge -->
          <polygon points="40,165 48,125 60,130 52,170" fill="#451a03"/>
          <path d="M0 170 Q140 150 320 165 L320 180 L0 180 Z" fill="#92400e"/>
          <!-- Shimmering Heat Particles -->
          <circle cx="90" cy="115" r="1.5" fill="#fef08a" opacity="0.6"/>
          <circle cx="210" cy="100" r="1.8" fill="#fde047" opacity="0.5"/>
        </svg>`;

    case 'city':
      return `
        <svg viewBox="0 0 320 180" class="sp-landscape-svg" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="ct-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#09090b"/>
              <stop offset="60%" stop-color="#18181b"/>
              <stop offset="100%" stop-color="#27272a"/>
            </linearGradient>
          </defs>
          <rect width="320" height="180" fill="url(#ct-sky)"/>
          <!-- Searchlight Beams -->
          <polygon points="50,180 110,0 135,0" fill="#e4e4e7" opacity="0.08"/>
          <polygon points="260,180 190,0 215,0" fill="#e4e4e7" opacity="0.08"/>
          <!-- Distant Tiered Gothic Hive Spires -->
          <path d="M30 140 L30 80 L40 60 L40 40 L45 30 L50 40 L50 60 L60 80 L60 140 M100 140 L100 70 L115 45 L120 20 L125 45 L140 70 L140 140 M220 140 L220 75 L235 50 L240 25 L245 50 L260 75 L260 140" stroke="#3f3f46" stroke-width="2" fill="#27272a"/>
          <!-- Midground Hab-Blocks & Blast Barricades -->
          <rect x="10" y="95" width="45" height="85" fill="#18181b"/>
          <rect x="70" y="80" width="55" height="100" fill="#27272a"/>
          <rect x="145" y="65" width="60" height="115" fill="#18181b"/>
          <rect x="220" y="90" width="50" height="90" fill="#27272a"/>
          <rect x="280" y="75" width="40" height="105" fill="#18181b"/>
          <!-- Skybridges & Conduits -->
          <line x1="55" y1="110" x2="70" y2="110" stroke="#71717a" stroke-width="3"/>
          <line x1="125" y1="95" x2="145" y2="95" stroke="#71717a" stroke-width="3"/>
          <line x1="205" y1="105" x2="220" y2="105" stroke="#71717a" stroke-width="3"/>
          <!-- Foreground Avenue & Gothic Ruins -->
          <path d="M0 165 L100 150 L220 152 L320 162 L320 180 L0 180 Z" fill="#09090b"/>
          <!-- Neon Industrial Warning Conduits -->
          <circle cx="120" cy="20" r="2.5" fill="#f87171" filter="drop-shadow(0 0 5px #ef4444)"/>
          <circle cx="240" cy="25" r="2.5" fill="#f87171" filter="drop-shadow(0 0 5px #ef4444)"/>
          <circle cx="85" cy="115" r="1.5" fill="#38bdf8"/>
          <circle cx="165" cy="90" r="1.5" fill="#38bdf8"/>
        </svg>`;

    case 'tech':
      return `
        <svg viewBox="0 0 320 180" class="sp-landscape-svg" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="tc-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#020617"/>
              <stop offset="50%" stop-color="#071226"/>
              <stop offset="100%" stop-color="#0f172a"/>
            </linearGradient>
            <radialGradient id="tc-core" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#38bdf8"/>
              <stop offset="60%" stop-color="#0284c7"/>
              <stop offset="100%" stop-color="#0369a1" stop-opacity="0"/>
            </radialGradient>
          </defs>
          <rect width="320" height="180" fill="url(#tc-sky)"/>
          <!-- Deep Space Starfield & Orbit Horizon -->
          <circle cx="40" cy="30" r="1" fill="#ffffff" opacity="0.9"/>
          <circle cx="95" cy="45" r="1.2" fill="#ffffff" opacity="0.8"/>
          <circle cx="180" cy="25" r="1" fill="#ffffff" opacity="0.9"/>
          <circle cx="280" cy="40" r="1.4" fill="#ffffff" opacity="0.85"/>
          <path d="M0 70 Q160 40 320 70 L320 0 L0 0 Z" fill="#0284c7" opacity="0.12"/>
          <!-- Orbital Station Titanium Bulkhead Frames -->
          <path d="M0 0 L40 0 L25 180 L0 180 Z M320 0 L280 0 L295 180 L320 180 Z" fill="#1e293b"/>
          <rect x="35" y="145" width="250" height="35" fill="#0f172a"/>
          <!-- Pulsing Plasma Reactor Core Array -->
          <circle cx="160" cy="95" r="32" fill="url(#tc-core)" opacity="0.8" filter="drop-shadow(0 0 16px #38bdf8)"/>
          <circle cx="160" cy="95" r="14" fill="#ffffff" opacity="0.9"/>
          <!-- Power Relay Conduits & Bulkhead Struts -->
          <line x1="25" y1="95" x2="128" y2="95" stroke="#38bdf8" stroke-width="3" opacity="0.8"/>
          <line x1="192" y1="95" x2="295" y2="95" stroke="#38bdf8" stroke-width="3" opacity="0.8"/>
          <line x1="160" y1="0" x2="160" y2="63" stroke="#38bdf8" stroke-width="3" opacity="0.8"/>
          <line x1="160" y1="127" x2="160" y2="180" stroke="#38bdf8" stroke-width="3" opacity="0.8"/>
          <!-- Floor Grate & Tech Panels -->
          <line x1="50" y1="160" x2="270" y2="160" stroke="#475569" stroke-width="2"/>
        </svg>`;

    case 'astral':
      return `
        <svg viewBox="0 0 320 180" class="sp-landscape-svg" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="as-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#0a0518"/>
              <stop offset="50%" stop-color="#241042"/>
              <stop offset="100%" stop-color="#3b0764"/>
            </linearGradient>
          </defs>
          <rect width="320" height="180" fill="url(#as-sky)"/>
          <!-- Harmonic Leyline Waves -->
          <path d="M0 60 Q80 30 160 65 T320 40 L320 90 Q240 60 160 95 T0 80 Z" fill="#c084fc" opacity="0.25"/>
          <!-- Floating Wraithbone Monoliths -->
          <polygon points="50,45 65,30 80,45 65,75" fill="#e9d5ff" opacity="0.85" filter="drop-shadow(0 0 8px #c084fc)"/>
          <polygon points="230,55 242,40 255,55 242,80" fill="#e9d5ff" opacity="0.8" filter="drop-shadow(0 0 8px #c084fc)"/>
          <!-- Towering Luminous Prismatic Crystal Spires -->
          <polygon points="160,15 145,130 175,130" fill="#d8b4fe" filter="drop-shadow(0 0 14px #a855f7)"/>
          <polygon points="105,45 95,140 120,140" fill="#a855f7"/>
          <polygon points="215,40 200,140 230,140" fill="#c084fc"/>
          <!-- Crystal Ridge Terrain -->
          <path d="M0 145 Q80 125 160 140 T320 130 L320 180 L0 180 Z" fill="#581c87"/>
          <path d="M0 160 Q110 145 220 162 T320 155 L320 180 L0 180 Z" fill="#2e1065"/>
          <!-- Glowing Resonance Particles -->
          <circle cx="70" cy="100" r="2" fill="#f5d0fe" filter="drop-shadow(0 0 4px #e879f9)"/>
          <circle cx="160" cy="40" r="2.5" fill="#ffffff" filter="drop-shadow(0 0 6px #c084fc)"/>
          <circle cx="260" cy="110" r="2" fill="#f5d0fe" filter="drop-shadow(0 0 4px #e879f9)"/>
        </svg>`;

    case 'corrupted':
      return `
        <svg viewBox="0 0 320 180" class="sp-landscape-svg" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="cr-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#180407"/>
              <stop offset="50%" stop-color="#450a0a"/>
              <stop offset="100%" stop-color="#7f1d1d"/>
            </linearGradient>
          </defs>
          <rect width="320" height="180" fill="url(#cr-sky)"/>
          <!-- Blood Eclipse Sun -->
          <circle cx="160" cy="50" r="24" fill="#000000" stroke="#ef4444" stroke-width="3" filter="drop-shadow(0 0 14px #dc2626)"/>
          <!-- Barbed Bony Tendrils & Spikes -->
          <path d="M40 160 Q60 90 75 55 Q70 95 85 160 M240 160 Q255 85 270 50 Q265 95 280 160" fill="#450a0a" stroke="#991b1b" stroke-width="2"/>
          <!-- Mutated Organic Mounds -->
          <path d="M0 140 Q60 110 130 135 T270 120 Q300 135 320 130 L320 180 L0 180 Z" fill="#7f1d1d"/>
          <!-- Barbed Foreground Tendril Roots -->
          <path d="M0 160 Q90 140 180 160 T320 152 L320 180 L0 180 Z" fill="#2b0d12"/>
          <polygon points="120,165 125,120 132,165" fill="#991b1b"/>
          <polygon points="190,168 195,125 202,168" fill="#991b1b"/>
          <!-- Bio-Toxin Spore Emissions -->
          <circle cx="90" cy="85" r="2" fill="#f87171" filter="drop-shadow(0 0 4px #ef4444)"/>
          <circle cx="230" cy="95" r="2.2" fill="#fca5a5" filter="drop-shadow(0 0 5px #ef4444)"/>
          <circle cx="160" cy="120" r="1.8" fill="#f87171"/>
        </svg>`;

    case 'devoured':
      return `
        <svg viewBox="0 0 320 180" class="sp-landscape-svg" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="dv-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#0d1108"/>
              <stop offset="50%" stop-color="#1a2e05"/>
              <stop offset="100%" stop-color="#365314"/>
            </linearGradient>
            <linearGradient id="dv-acid" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#84cc16"/>
              <stop offset="50%" stop-color="#a3e635"/>
              <stop offset="100%" stop-color="#65a30d"/>
            </linearGradient>
          </defs>
          <rect width="320" height="180" fill="url(#dv-sky)"/>
          <!-- Chitinous Spires in Distance -->
          <polygon points="60,140 70,60 85,140" fill="#3f6212"/>
          <polygon points="230,140 245,50 260,140" fill="#3f6212"/>
          <polygon points="150,145 160,75 170,145" fill="#2d4a0e"/>
          <!-- Stripped Bedrock Ravines -->
          <path d="M0 135 Q70 115 150 138 T320 125 L320 180 L0 180 Z" fill="#4d5334"/>
          <!-- Cavernous Acid Digestion Pools -->
          <ellipse cx="160" cy="155" rx="80" ry="16" fill="url(#dv-acid)" filter="drop-shadow(0 0 12px #a3e635)"/>
          <!-- Foreground Bedrock Slices -->
          <path d="M0 162 Q90 148 180 165 T320 158 L320 180 L0 180 Z" fill="#26291c"/>
          <!-- Caustic Vapor Bubbles -->
          <circle cx="130" cy="140" r="2.5" fill="#d9f99d" filter="drop-shadow(0 0 4px #84cc16)"/>
          <circle cx="185" cy="135" r="2" fill="#d9f99d" filter="drop-shadow(0 0 4px #84cc16)"/>
        </svg>`;

    case 'tomb':
      return `
        <svg viewBox="0 0 320 180" class="sp-landscape-svg" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="tb-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#020a06"/>
              <stop offset="60%" stop-color="#052014"/>
              <stop offset="100%" stop-color="#064e3b"/>
            </linearGradient>
          </defs>
          <rect width="320" height="180" fill="url(#tb-sky)"/>
          <!-- Stepped Living-Metal Necron Pyramids -->
          <polygon points="160,35 90,140 230,140" fill="#0f172a" stroke="#10b981" stroke-width="1.5"/>
          <polygon points="160,35 160,140 230,140" fill="#09140f"/>
          <!-- Floating Crypt Monoliths -->
          <polygon points="50,65 60,50 70,65 60,95" fill="#022c22" stroke="#34d399" stroke-width="1.2" filter="drop-shadow(0 0 8px #10b981)"/>
          <polygon points="250,70 260,55 270,70 260,100" fill="#022c22" stroke="#34d399" stroke-width="1.2" filter="drop-shadow(0 0 8px #10b981)"/>
          <!-- Gauss Energy Circuitry Lines -->
          <line x1="90" y1="140" x2="230" y2="140" stroke="#34d399" stroke-width="3" filter="drop-shadow(0 0 6px #10b981)"/>
          <line x1="160" y1="35" x2="160" y2="140" stroke="#34d399" stroke-width="2" filter="drop-shadow(0 0 6px #10b981)"/>
          <line x1="125" y1="88" x2="195" y2="88" stroke="#34d399" stroke-width="2"/>
          <!-- Grand Obsidian Gateway & Floor -->
          <rect x="145" y="105" width="30" height="35" fill="#34d399" filter="drop-shadow(0 0 10px #10b981)"/>
          <path d="M0 150 L320 150 L320 180 L0 180 Z" fill="#022c22"/>
          <!-- Gauss Electromagnetic Flux Points -->
          <circle cx="60" cy="50" r="2" fill="#6ee7b7" filter="drop-shadow(0 0 4px #10b981)"/>
          <circle cx="260" cy="55" r="2" fill="#6ee7b7" filter="drop-shadow(0 0 4px #10b981)"/>
        </svg>`;

    case 'rift':
      return `
        <svg viewBox="0 0 320 180" class="sp-landscape-svg" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="rf-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#140603"/>
              <stop offset="50%" stop-color="#431407"/>
              <stop offset="100%" stop-color="#7c2d12"/>
            </linearGradient>
            <radialGradient id="rf-tear" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#f43f5e"/>
              <stop offset="40%" stop-color="#8b5cf6"/>
              <stop offset="100%" stop-color="#3b0764" stop-opacity="0"/>
            </radialGradient>
          </defs>
          <rect width="320" height="180" fill="url(#rf-sky)"/>
          <!-- Swirling Dimensional Warp Rift Tear -->
          <ellipse cx="160" cy="55" rx="65" ry="30" fill="url(#rf-tear)" filter="drop-shadow(0 0 16px #c084fc)" transform="rotate(-10 160 55)"/>
          <line x1="105" y1="65" x2="215" y2="45" stroke="#ffffff" stroke-width="2.5" filter="drop-shadow(0 0 8px #f43f5e)"/>
          <!-- Volcanic Basalt Crags -->
          <polygon points="0,140 45,85 95,135 140,95 180,145 230,80 285,135 320,105 320,180 0,180" fill="#26120b"/>
          <!-- Molten Magma Fissures -->
          <path d="M0 165 Q60 145 130 160 T250 150 Q290 165 320 155 L320 172 Q270 178 200 168 T0 175 Z" fill="#ea580c" filter="drop-shadow(0 0 10px #f97316)"/>
          <!-- Molten Embers & Sparks -->
          <circle cx="85" cy="115" r="2" fill="#fdba74" filter="drop-shadow(0 0 4px #ea580c)"/>
          <circle cx="165" cy="85" r="2.5" fill="#f43f5e" filter="drop-shadow(0 0 6px #ec4899)"/>
          <circle cx="245" cy="120" r="1.8" fill="#fde047" filter="drop-shadow(0 0 4px #ea580c)"/>
        </svg>`;

    case 'random':
    default:
      return `
        <svg viewBox="0 0 320 180" class="sp-landscape-svg" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="rd-sky" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#0f172a"/>
              <stop offset="50%" stop-color="#1e1b4b"/>
              <stop offset="100%" stop-color="#311042"/>
            </linearGradient>
            <radialGradient id="rd-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#d4af37" stop-opacity="0.8"/>
              <stop offset="60%" stop-color="#38bdf8" stop-opacity="0.4"/>
              <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
            </radialGradient>
          </defs>
          <rect width="320" height="180" fill="url(#rd-sky)"/>
          <!-- Shifting Cosmos Vortex -->
          <circle cx="160" cy="85" r="55" fill="url(#rd-glow)" filter="drop-shadow(0 0 16px #d4af37)"/>
          <!-- Orbital Planetary Rings -->
          <ellipse cx="160" cy="85" rx="100" ry="26" fill="none" stroke="#d4af37" stroke-width="2" opacity="0.6" transform="rotate(-15 160 85)"/>
          <ellipse cx="160" cy="85" rx="75" ry="18" fill="none" stroke="#38bdf8" stroke-width="1.5" opacity="0.7" transform="rotate(25 160 85)"/>
          <!-- Mystery Glyph in Center -->
          <text x="160" y="102" font-family="'Cinzel', serif" font-size="44" font-weight="900" fill="#ffffff" text-anchor="middle" filter="drop-shadow(0 0 10px #d4af37)">🎲</text>
          <!-- Constellation Stars -->
          <circle cx="50" cy="35" r="1.5" fill="#ffffff" opacity="0.9"/>
          <circle cx="90" cy="140" r="1.8" fill="#ffffff" opacity="0.8"/>
          <circle cx="270" cy="45" r="1.5" fill="#ffffff" opacity="0.9"/>
          <circle cx="240" cy="145" r="2" fill="#ffffff" opacity="0.85"/>
        </svg>`;
  }
}

export function getMissionArtwork(missionId: string): string {
  switch (missionId) {
    case 'extermination':
      return `
        <svg viewBox="0 0 320 180" class="sp-landscape-svg" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="ms-ext-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#180c06"/>
              <stop offset="50%" stop-color="#2d120a"/>
              <stop offset="100%" stop-color="#451a03"/>
            </linearGradient>
            <radialGradient id="ms-ext-blast" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#fef08a"/>
              <stop offset="40%" stop-color="#f97316"/>
              <stop offset="80%" stop-color="#dc2626"/>
              <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
            </radialGradient>
          </defs>
          <rect width="320" height="180" fill="url(#ms-ext-sky)"/>
          <!-- Smoke Columns & Ruined Frontline -->
          <path d="M40 180 Q60 120 70 80 Q80 120 100 180 M210 180 Q230 110 240 70 Q250 110 270 180" fill="#1c1917" opacity="0.7"/>
          <polygon points="0,150 50,135 110,155 160,140 220,155 280,138 320,152 320,180 0,180" fill="#1c1917"/>
          <!-- Central Tactical Engagement Blast -->
          <circle cx="160" cy="120" r="38" fill="url(#ms-ext-blast)" filter="drop-shadow(0 0 20px #ea580c)"/>
          <!-- Opposing Forces Crossfire Laser Tracers -->
          <line x1="30" y1="135" x2="155" y2="120" stroke="#38bdf8" stroke-width="3" filter="drop-shadow(0 0 6px #38bdf8)"/>
          <line x1="25" y1="145" x2="160" y2="120" stroke="#38bdf8" stroke-width="2.5" filter="drop-shadow(0 0 5px #38bdf8)"/>
          <line x1="290" y1="135" x2="165" y2="120" stroke="#f87171" stroke-width="3" filter="drop-shadow(0 0 6px #ef4444)"/>
          <line x1="295" y1="145" x2="160" y2="120" stroke="#f87171" stroke-width="2.5" filter="drop-shadow(0 0 5px #ef4444)"/>
          <!-- Tactical Targeting Reticle Overlay -->
          <circle cx="160" cy="120" r="22" fill="none" stroke="#ef4444" stroke-width="1.8" stroke-dasharray="6,4"/>
          <line x1="160" y1="92" x2="160" y2="104" stroke="#ef4444" stroke-width="2"/>
          <line x1="160" y1="136" x2="160" y2="148" stroke="#ef4444" stroke-width="2"/>
          <line x1="132" y1="120" x2="144" y2="120" stroke="#ef4444" stroke-width="2"/>
          <line x1="176" y1="120" x2="188" y2="120" stroke="#ef4444" stroke-width="2"/>
        </svg>`;

    case 'escort':
      return `
        <svg viewBox="0 0 320 180" class="sp-landscape-svg" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="ms-esc-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#021324"/>
              <stop offset="50%" stop-color="#0c2d48"/>
              <stop offset="100%" stop-color="#145374"/>
            </linearGradient>
            <radialGradient id="ms-esc-shield" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.8"/>
              <stop offset="70%" stop-color="#0284c7" stop-opacity="0.3"/>
              <stop offset="100%" stop-color="#0369a1" stop-opacity="0"/>
            </radialGradient>
          </defs>
          <rect width="320" height="180" fill="url(#ms-esc-sky)"/>
          <!-- Hostile Warzone Backdrop & Extraction Beacon -->
          <polygon points="0,150 70,140 140,155 220,138 320,148 320,180 0,180" fill="#0f172a"/>
          <!-- Extraction Zone Vertical Beacon in Distance -->
          <polygon points="275,180 279,20 285,20 289,180" fill="#22c55e" opacity="0.35" filter="drop-shadow(0 0 12px #4ade80)"/>
          <circle cx="282" cy="20" r="5" fill="#86efac" filter="drop-shadow(0 0 8px #22c55e)"/>
          <!-- Protected Courier Energy Shield Dome -->
          <ellipse cx="120" cy="130" rx="48" ry="32" fill="url(#ms-esc-shield)" stroke="#38bdf8" stroke-width="2" filter="drop-shadow(0 0 12px #38bdf8)"/>
          <!-- VIP Courier Core Relic -->
          <polygon points="120,110 130,125 120,140 110,125" fill="#fef08a" filter="drop-shadow(0 0 10px #eab308)"/>
          <!-- Guardian Vanguard Squads Flanking Shield -->
          <rect x="65" y="125" width="12" height="18" rx="3" fill="#38bdf8"/>
          <rect x="160" y="125" width="12" height="18" rx="3" fill="#38bdf8"/>
          <!-- Incoming Hostile Fire Deflected off Shield -->
          <line x1="220" y1="95" x2="155" y2="115" stroke="#f87171" stroke-width="2.5" stroke-dasharray="4,3"/>
          <circle cx="155" cy="115" r="4" fill="#fbbf24" filter="drop-shadow(0 0 6px #f97316)"/>
        </svg>`;

    case 'domination':
      return `
        <svg viewBox="0 0 320 180" class="sp-landscape-svg" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="ms-dom-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#080c14"/>
              <stop offset="50%" stop-color="#131b2e"/>
              <stop offset="100%" stop-color="#1e293b"/>
            </linearGradient>
          </defs>
          <rect width="320" height="180" fill="url(#ms-dom-sky)"/>
          <!-- Contested Frontline Hexagonal Grid Horizon -->
          <polygon points="0,145 60,135 120,150 180,132 240,148 320,138 320,180 0,180" fill="#0f172a"/>
          <!-- Telemetry Zone Boundary Connections -->
          <line x1="60" y1="125" x2="160" y2="110" stroke="#d4af37" stroke-width="2" stroke-dasharray="6,4" opacity="0.75"/>
          <line x1="160" y1="110" x2="260" y2="125" stroke="#d4af37" stroke-width="2" stroke-dasharray="6,4" opacity="0.75"/>
          <!-- 3 Strategic Control Beacons (Alpha, Bravo, Charlie) -->
          <!-- Node 1: Alpha -->
          <polygon points="56,160 59,60 61,60 64,160" fill="#38bdf8" filter="drop-shadow(0 0 10px #0284c7)"/>
          <circle cx="60" cy="58" r="6" fill="#7dd3fc" filter="drop-shadow(0 0 8px #38bdf8)"/>
          <text x="60" y="172" font-family="'Cinzel', serif" font-size="11" font-weight="900" fill="#38bdf8" text-anchor="middle">A</text>
          <!-- Node 2: Bravo (Center Contested) -->
          <polygon points="156,155 159,35 161,35 164,155" fill="#facc15" filter="drop-shadow(0 0 14px #eab308)"/>
          <circle cx="160" cy="33" r="8" fill="#fef08a" filter="drop-shadow(0 0 10px #facc15)"/>
          <text x="160" y="170" font-family="'Cinzel', serif" font-size="12" font-weight="900" fill="#facc15" text-anchor="middle">B</text>
          <!-- Node 3: Charlie -->
          <polygon points="256,160 259,60 261,60 264,160" fill="#f87171" filter="drop-shadow(0 0 10px #dc2626)"/>
          <circle cx="260" cy="58" r="6" fill="#fca5a5" filter="drop-shadow(0 0 8px #f87171)"/>
          <text x="260" y="172" font-family="'Cinzel', serif" font-size="11" font-weight="900" fill="#f87171" text-anchor="middle">C</text>
        </svg>`;

    default:
      return `
        <svg viewBox="0 0 320 180" class="sp-landscape-svg" xmlns="http://www.w3.org/2000/svg">
          <rect width="320" height="180" fill="#0f172a"/>
          <text x="160" y="100" font-family="'Cinzel', serif" font-size="28" font-weight="700" fill="#d4af37" text-anchor="middle">MISSION</text>
        </svg>`;
  }
}
