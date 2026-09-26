/**
 * Procedural Vector Landscape Artwork for Biomes and Missions
 * Provides rich, zero-latency, scale-independent cinematic landscape illustrations.
 */

export function getBiomeArtwork(themeId: string): string {
  switch (themeId) {
    case 'jungle':
      return `<img src="/assets/maps/jungle.jpg" alt="Jungle Death World" class="sp-landscape-img" loading="eager" />`;

    case 'snow':
      return `<img src="/assets/maps/snow.jpg" alt="Glacial Frost World" class="sp-landscape-img" loading="eager" />`;

    case 'desert':
      return `<img src="/assets/maps/desert.jpg" alt="Desert Wastes World" class="sp-landscape-img" loading="eager" />`;

    case 'city':
      return `<img src="/assets/maps/city.jpg" alt="Gothic Hive City" class="sp-landscape-img" loading="eager" />`;

    case 'tech':
      return `<img src="/assets/maps/tech.jpg" alt="Void Mothership" class="sp-landscape-img" loading="eager" />`;

    case 'astral':
      return `<img src="/assets/maps/astral.jpg" alt="Astral Crystal World" class="sp-landscape-img" loading="eager" />`;

    case 'corrupted':
      return `<img src="/assets/maps/corrupted.jpg" alt="Corrupted Flesh World" class="sp-landscape-img" loading="eager" />`;

    case 'devoured':
      return `<img src="/assets/maps/devoured.jpg" alt="Devoured World" class="sp-landscape-img" loading="eager" />`;

    case 'tomb':
      return `<img src="/assets/maps/tomb.jpg" alt="Tomb World" class="sp-landscape-img" loading="eager" />`;

    case 'rift':
      return `<img src="/assets/maps/rift.jpg" alt="Rift World" class="sp-landscape-img" loading="eager" />`;

    case 'random':
    default:
      return `<img src="/assets/maps/random.jpg" alt="Random World" class="sp-landscape-img" loading="eager" />`;
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
