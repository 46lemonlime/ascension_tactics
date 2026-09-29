import { FACTIONS } from '../data/factions';
import { THEMES } from '../data/themes';
import { MISSIONS } from '../data/missions';
import { UNIT_DEFS } from '../data/units';
import { WEAPON_REGISTRY, WeaponProfileDetail } from '../data/equipment';
import { sfx } from '../audio/synth';
import { getBiomeArtwork, getMissionArtwork } from './landscape-art';
import type { Faction, UnitDef } from '../data/types';

export type LearnSection = 'rules' | 'maps' | 'missions' | 'factions';
export type FactionCodexTab = 'overview' | 'stats' | 'units' | 'weapons';

const PLAYABLE_FACTION_KEYS = [
  'ascendants',
  'directorate',
  'elyri',
  'veykari',
  'ghar',
  'devourers',
  'revenant',
  'concordat',
  'riftborn',
  'forsaken'
];

const MAP_THEME_KEYS = [
  'jungle',
  'snow',
  'desert',
  'city',
  'tech',
  'astral',
  'corrupted',
  'devoured',
  'tomb',
  'rift',
  'random'
];

const MISSION_KEYS = [
  'extermination',
  'domination',
  'escort'
];

export class LearnPageController {
  private container: HTMLElement | null = null;
  private currentSection: LearnSection = 'rules';
  private activeMapId: string | null = null;
  private activeMissionId: string | null = null;
  private activeFactionId: string | null = null;
  private activeFactionTab: FactionCodexTab = 'overview';
  private onReturnToMenu: () => void;

  constructor(onReturnToMenu: () => void) {
    this.onReturnToMenu = onReturnToMenu;
  }

  public init(): void {
    this.container = document.getElementById('learn-screen');
    if (!this.container) return;

    // Navigation Pills
    const navBtns = this.container.querySelectorAll<HTMLButtonElement>('.learn-nav-pill');
    navBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const sec = btn.getAttribute('data-section') as LearnSection;
        if (sec) {
          sfx('click');
          this.switchSection(sec);
        }
      });
    });

    // Exit Button (Top Header)
    const btnExit = document.getElementById('btn-learn-exit-top');
    if (btnExit) {
      btnExit.addEventListener('click', () => {
        sfx('click');
        this.onReturnToMenu();
      });
    }

    // Global Back Button (Footer)
    const btnGlobalBack = document.getElementById('btn-learn-global-back');
    if (btnGlobalBack) {
      btnGlobalBack.addEventListener('click', () => {
        sfx('click');
        this.handleGlobalBack();
      });
    }
  }

  public show(section: LearnSection = 'rules', subId?: string): void {
    if (!this.container) return;
    this.container.style.display = 'flex';

    if (section === 'maps' && subId) {
      this.switchSection('maps');
      this.openMapDetail(subId);
    } else if (section === 'missions' && subId) {
      this.switchSection('missions');
      this.openMissionDetail(subId);
    } else if (section === 'factions' && subId) {
      this.switchSection('factions');
      this.openFactionDetail(subId, 'overview');
    } else {
      this.switchSection(section);
    }
  }

  public hide(): void {
    if (this.container) {
      this.container.style.display = 'none';
    }
  }

  public switchSection(section: LearnSection): void {
    this.currentSection = section;
    this.activeMapId = null;
    this.activeMissionId = null;
    this.activeFactionId = null;

    // Update active nav button
    if (this.container) {
      const navBtns = this.container.querySelectorAll<HTMLButtonElement>('.learn-nav-pill');
      navBtns.forEach(btn => {
        if (btn.getAttribute('data-section') === section) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }

    // Hide all section views
    const sections = ['rules', 'maps', 'missions', 'factions'];
    sections.forEach(s => {
      const el = document.getElementById(`learn-section-${s}`);
      if (el) el.style.display = (s === section) ? 'block' : 'none';
    });

    // Render corresponding section
    if (section === 'rules') {
      this.updateFooterBackLabel('RETURN TO MAIN MENU');
    } else if (section === 'maps') {
      this.renderMapsList();
    } else if (section === 'missions') {
      this.renderMissionsList();
    } else if (section === 'factions') {
      this.renderFactionsList();
    }

    // Scroll workspace to top
    const workspace = document.getElementById('learn-main-workspace');
    if (workspace) workspace.scrollTop = 0;
  }

  public handleGlobalBack(): void {
    if (this.currentSection === 'maps' && this.activeMapId !== null) {
      this.closeMapDetail();
      return;
    }
    if (this.currentSection === 'missions' && this.activeMissionId !== null) {
      this.closeMissionDetail();
      return;
    }
    if (this.currentSection === 'factions' && this.activeFactionId !== null) {
      this.closeFactionDetail();
      return;
    }
    this.onReturnToMenu();
  }

  private updateFooterBackLabel(label: string): void {
    const labelEl = document.getElementById('learn-back-label');
    if (labelEl) {
      labelEl.textContent = label;
    }
  }

  // ==========================================
  // 1. MAPS SECTION
  // ==========================================

  private renderMapsList(): void {
    this.activeMapId = null;
    this.updateFooterBackLabel('RETURN TO MAIN MENU');

    const listView = document.getElementById('learn-maps-list-view');
    const detailView = document.getElementById('learn-map-detail-view');
    if (listView) listView.style.display = 'block';
    if (detailView) detailView.style.display = 'none';

    if (!listView) return;

    let html = `
      <div class="learn-view-header">
        <h3 class="learn-view-title">🌐 BATTLEFIELD BIOMES &amp; WARZONES</h3>
        <p class="learn-view-subtitle">Explore 10 planetary theaters with distinct environmental terrain, line-of-sight layouts, and atmospheric hazards.</p>
      </div>
      <div class="learn-cards-grid">
    `;

    MAP_THEME_KEYS.forEach(key => {
      const theme = THEMES[key] || {
        id: key,
        name: key === 'random' ? 'Random World' : key,
        subtitle: 'Dynamic Mystery Theater',
        icon: '🎲',
        desc: 'Unpredictable planetary theater with dynamic terrain obstacles and shifting atmospheric conditions.',
        image: '/assets/maps/random.jpg'
      };

      html += `
        <div class="learn-catalog-card" data-map-id="${key}">
          <div class="learn-card-image-wrap">
            ${getBiomeArtwork(key)}
            <div class="learn-card-tag-badge">${theme.icon} ${theme.name.toUpperCase()}</div>
          </div>
          <div class="learn-card-content">
            <div class="learn-card-header-row">
              <h4 class="learn-card-name">${theme.name}</h4>
              <span class="learn-card-icon">${theme.icon}</span>
            </div>
            <div class="learn-card-sub">${theme.subtitle || 'Tactical Environment'}</div>
            <p class="learn-card-desc">${theme.desc || ''}</p>
            <button class="learn-card-action-btn" type="button">VIEW MAP CODEX ➔</button>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    listView.innerHTML = html;

    // Attach click events
    listView.querySelectorAll<HTMLElement>('.learn-catalog-card').forEach(card => {
      card.addEventListener('click', () => {
        const mapId = card.getAttribute('data-map-id');
        if (mapId) {
          sfx('click');
          this.openMapDetail(mapId);
        }
      });
    });
  }

  public openMapDetail(mapId: string): void {
    this.activeMapId = mapId;
    this.updateFooterBackLabel('BACK TO MAPS');

    const listView = document.getElementById('learn-maps-list-view');
    const detailView = document.getElementById('learn-map-detail-view');
    if (listView) listView.style.display = 'none';
    if (!detailView) return;

    detailView.style.display = 'block';

    const theme = THEMES[mapId] || {
      id: mapId,
      name: mapId === 'random' ? 'Random World' : mapId,
      subtitle: 'Dynamic Mystery Theater',
      icon: '🎲',
      desc: 'Deploy into an unpredictable planetary theater with dynamic terrain obstacles, tactical hazards, and shifting environmental atmospheric conditions.',
      image: '/assets/maps/random.jpg',
      particleType: 'dynamic',
      particleColor: 0xd4af37
    };

    const terrainFeatures: Record<string, { obstacles: string; los: string; cover: string; tactics: string }> = {
      jungle: {
        obstacles: 'Dense titan root networks, towering ancient trees, hanging creepers, and bio-spore rib cages.',
        los: 'High obstacle density creates short engagement ranges and heavy sight line occlusion.',
        cover: 'Superior defensive terrain favoring close-range ambushes, rapid assault squads, and bio-monsters.',
        tactics: 'Advance through canopy avenues; avoid exposing heavy vehicles in dense foliage bottlenecks.'
      },
      snow: {
        obstacles: 'Permafrost ridges, translucent glacial ice monoliths, frozen crags, and ice chasms.',
        los: 'Diagonal glacial ridges divide the battlefield into elevated vantage points and lower frost passes.',
        cover: 'Solid ice pillars provide hard cover against ballistic fire; open snow passes create sniper lanes.',
        tactics: 'Control the central glacial crest to maintain fire superiority across both flanking avenues.'
      },
      desert: {
        obstacles: 'Stratified canyon sandstone pillars, sun-scorched ash dunes, saguaro cacti, and buried ruins.',
        los: 'Open desert flats provide long 36"–48" firing corridors with sparse tactical mesas.',
        cover: 'Pillars and rock spires serve as key redoubts for heavy weapons squads and vehicle hull-down positions.',
        tactics: 'Deploy high-range ballistic gunlines and utilize fast flanking skimmers along canyon perimeters.'
      },
      city: {
        obstacles: 'Four massive multi-story gothic ruined hab-blocks, street barricades, and industrial rubble redoubts.',
        los: 'Urban grid layout creates 90-degree intersection killzones and tight street corridors.',
        cover: 'Heavy ruins grant significant armor save protection and block true line of sight completely.',
        tactics: 'Move infantry through interior ruin floors; deploy heavy tanks down primary central boulevards.'
      },
      tech: {
        obstacles: 'Dual plasma reactor generator cores, orbital starship bulkheads, blast doors, and glowing relay conduits.',
        los: 'Symmetrical orbital corridor layout with severe choke points around reactor cores.',
        cover: 'Reinforced bulkhead steel blocks all ballistic trajectories; narrow corridors force close firefights.',
        tactics: 'Hold the reactor junctions with resilient frontline infantry and breach flank corridors.'
      },
      astral: {
        obstacles: 'Glowing crystalline spire formations, prism shards, floating arcane obelisks, and warp fissures.',
        los: 'Reflective crystal clusters distort long-range targeting arcs and create prismatic refraction lanes.',
        cover: 'Resonant crystal matrices grant deflection energy against armor-piercing projectile rounds.',
        tactics: 'Anchor psykers and elite units near crystal formations to leverage energy distortion barriers.'
      },
      corrupted: {
        obstacles: 'Pulsing flesh nodes, calcified bone spires, blood pools, and warped obsidian pillars.',
        los: 'Irregular fleshy mounds break up traditional gunlines into chaotic close-quarters killing fields.',
        cover: 'Organic barriers absorb kinetic impacts but emit disorienting atmospheric whispers.',
        tactics: 'Aggressive melee vanguards excel in closing gaps through the undulating bio-mass.'
      },
      devoured: {
        obstacles: 'Chitinous brood hives, digestive spore chimneys, acidic sludge pools, and giant ribbed carapaces.',
        los: 'Towering spore spires create dense biological canopy cover across the entire midfield.',
        cover: 'Biomass mounds provide natural defensive shielding against direct energy blasts.',
        tactics: 'Beware corrosive terrain hazards; funnel enemy squads into acidic choke points.'
      },
      tomb: {
        obstacles: 'Monolithic green-energy pylons, black necro-dermis obelisks, gauss capacitors, and stasis sarcophagi.',
        los: 'Long geometric corridors between ancient tombs favor high-precision Gauss firing lines.',
        cover: 'Living metal monuments regenerate structural integrity and block heavy anti-tank munitions.',
        tactics: 'Form interlocking fields of fire along geometric avenues to deny enemy advances.'
      },
      rift: {
        obstacles: 'Hovering molten magma rocks, dimensional vortex tears, chaotic void shards, and abyssal rifts.',
        los: 'Unstable gravity tears cause fluctuating LoS horizons across the fractured planetary surface.',
        cover: 'Floating magma fragments provide dynamic cover against high-angle ballistic strikes.',
        tactics: 'Control perimeter anchor points and avoid lingering near unstable rift vortex anomalies.'
      },
      random: {
        obstacles: 'Procedurally generated combinations of gothic ruins, alien flora, crystal spires, and energy pylons.',
        los: 'Dynamic sightline distribution tailored to the randomly generated biome seed.',
        cover: 'Varied cover ratings adapted to the active battlefield architecture.',
        tactics: 'Conduct initial reconnaissance with fast scout units to evaluate terrain choke points.'
      }
    };

    const details = terrainFeatures[mapId] || terrainFeatures.random;

    detailView.innerHTML = `
      <div class="learn-detail-header-bar">
        <button class="learn-btn-sub-back" id="btn-back-to-maps">◀ BACK TO MAPS</button>
        <div class="learn-detail-header-title">${theme.icon} ${theme.name.toUpperCase()} CODEX</div>
      </div>

      <div class="learn-detail-hero">
        <div class="learn-detail-hero-img-wrap">
          ${getBiomeArtwork(mapId)}
          <div class="learn-detail-hero-overlay">
            <h2 class="learn-detail-hero-title">${theme.name}</h2>
            <div class="learn-detail-hero-sub">${theme.subtitle || 'Planetary Battlefield'}</div>
          </div>
        </div>
      </div>

      <div class="learn-detail-grid">
        <div class="learn-detail-card">
          <div class="learn-detail-card-title"><span>🪐</span> ENVIRONMENT OVERVIEW</div>
          <p class="learn-detail-card-text">${theme.desc || 'Standard tactical theater.'}</p>
        </div>

        <div class="learn-detail-card">
          <div class="learn-detail-card-title"><span>🌲</span> TERRAIN &amp; OBSTACLES</div>
          <p class="learn-detail-card-text">${details.obstacles}</p>
        </div>

        <div class="learn-detail-card">
          <div class="learn-detail-card-title"><span>👁️</span> LINE OF SIGHT PROFILE</div>
          <p class="learn-detail-card-text">${details.los}</p>
        </div>

        <div class="learn-detail-card">
          <div class="learn-detail-card-title"><span>🛡️</span> COVER &amp; HAZARDS</div>
          <p class="learn-detail-card-text">${details.cover}</p>
        </div>

        <div class="learn-detail-card highlight-card" style="grid-column: 1 / -1;">
          <div class="learn-detail-card-title"><span>🎯</span> RECOMMENDED COMBAT DOCTRINE</div>
          <p class="learn-detail-card-text">${details.tactics}</p>
        </div>
      </div>
    `;

    document.getElementById('btn-back-to-maps')?.addEventListener('click', () => {
      sfx('click');
      this.closeMapDetail();
    });

    const workspace = document.getElementById('learn-main-workspace');
    if (workspace) workspace.scrollTop = 0;
  }

  public closeMapDetail(): void {
    this.renderMapsList();
  }

  // ==========================================
  // 2. MISSIONS SECTION
  // ==========================================

  private renderMissionsList(): void {
    this.activeMissionId = null;
    this.updateFooterBackLabel('RETURN TO MAIN MENU');

    const listView = document.getElementById('learn-missions-list-view');
    const detailView = document.getElementById('learn-mission-detail-view');
    if (listView) listView.style.display = 'block';
    if (detailView) detailView.style.display = 'none';

    if (!listView) return;

    let html = `
      <div class="learn-view-header">
        <h3 class="learn-view-title">🎯 OPERATIONAL MISSIONS &amp; OBJECTIVES</h3>
        <p class="learn-view-subtitle">Select a mission dossier to inspect victory parameters, tactical requirements, and competitive scoring rules.</p>
      </div>
      <div class="learn-cards-grid mission-grid">
    `;

    MISSION_KEYS.forEach(key => {
      const m = MISSIONS[key] || {
        id: key,
        name: key.toUpperCase(),
        subtitle: 'Tactical Operation',
        icon: '🎯',
        desc: 'Standard engagement protocol.'
      };

      html += `
        <div class="learn-catalog-card" data-mission-id="${key}">
          <div class="learn-card-image-wrap">
            ${getMissionArtwork(key)}
            <div class="learn-card-tag-badge">${m.icon} ${m.name.toUpperCase()}</div>
          </div>
          <div class="learn-card-content">
            <div class="learn-card-header-row">
              <h4 class="learn-card-name">${m.name}</h4>
              <span class="learn-card-icon">${m.icon}</span>
            </div>
            <div class="learn-card-sub">${m.subtitle || 'Tactical Operation'}</div>
            <p class="learn-card-desc">${m.desc || ''}</p>
            <button class="learn-card-action-btn" type="button">INSPECT MISSION DOSSIER ➔</button>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    listView.innerHTML = html;

    // Attach click events
    listView.querySelectorAll<HTMLElement>('.learn-catalog-card').forEach(card => {
      card.addEventListener('click', () => {
        const missionId = card.getAttribute('data-mission-id');
        if (missionId) {
          sfx('click');
          this.openMissionDetail(missionId);
        }
      });
    });
  }

  public openMissionDetail(missionId: string): void {
    this.activeMissionId = missionId;
    this.updateFooterBackLabel('BACK TO MISSIONS');

    const listView = document.getElementById('learn-missions-list-view');
    const detailView = document.getElementById('learn-mission-detail-view');
    if (listView) listView.style.display = 'none';
    if (!detailView) return;

    detailView.style.display = 'block';

    const m = MISSIONS[missionId] || {
      id: missionId,
      name: missionId.toUpperCase(),
      subtitle: 'Tactical Operation',
      icon: '🎯',
      desc: 'Execute standard operational tactical doctrine.',
      params: 'Standard Battle Limits',
      features: 'Full tactical engagement'
    };

    const missionProfiles: Record<string, { winCond: string; scoring: string; tactics: string }> = {
      extermination: {
        winCond: 'Total destruction of the opposing army, or achieving superior remaining army point value when the match turn limit expires.',
        scoring: 'Each enemy model eliminated grants points equal to its unit cost. Wiping entire squads grants an additional morale victory bonus.',
        tactics: 'Focus fire on high-threat enemy damage dealers and commanders first. Preserve your own heavy armored units to maintain point superiority.'
      },
      domination: {
        winCond: 'Accumulate target Victory Points (Default: 1,000 VP) by controlling three central battlefield capture beacons (Alpha, Bravo, Charlie).',
        scoring: 'Controlling 1 beacon generates +10 VP/turn; 2 beacons generate +25 VP/turn; controlling all 3 beacons generates +50 VP/turn.',
        tactics: 'Deploy resilient high-toughness units onto beacon pads to resist enemy artillery while fast flanking units harass enemy capture squads.'
      },
      escort: {
        winCond: 'Escort your Sacred Relic Courier across the hostile warzone into the opposing extraction zone, or eliminate the enemy courier before they extract.',
        scoring: 'Successful courier extraction grants immediate victory. Eliminating the enemy VIP awards maximum points.',
        tactics: 'Form a protective security escort around your VIP with heavy infantry and screening units. Use ranged suppression to block enemy interceptors.'
      }
    };

    const prof = missionProfiles[missionId] || missionProfiles.extermination;

    detailView.innerHTML = `
      <div class="learn-detail-header-bar">
        <button class="learn-btn-sub-back" id="btn-back-to-missions">◀ BACK TO MISSIONS</button>
        <div class="learn-detail-header-title">${m.icon} ${m.name.toUpperCase()} DOSSIER</div>
      </div>

      <div class="learn-detail-hero">
        <div class="learn-detail-hero-img-wrap">
          ${getMissionArtwork(missionId)}
          <div class="learn-detail-hero-overlay">
            <h2 class="learn-detail-hero-title">${m.name}</h2>
            <div class="learn-detail-hero-sub">${m.subtitle || 'Tactical Operation'}</div>
          </div>
        </div>
      </div>

      <div class="learn-detail-grid">
        <div class="learn-detail-card highlight-card" style="grid-column: 1 / -1;">
          <div class="learn-detail-card-title"><span>📜</span> STRATEGIC BRIEFING</div>
          <p class="learn-detail-card-text">${m.desc || ''}</p>
        </div>

        <div class="learn-detail-card">
          <div class="learn-detail-card-title"><span>🎯</span> MISSION PARAMETERS</div>
          <p class="learn-detail-card-text">${m.params || prof.winCond}</p>
        </div>

        <div class="learn-detail-card">
          <div class="learn-detail-card-title"><span>🏆</span> VICTORY CONDITIONS</div>
          <p class="learn-detail-card-text">${prof.winCond}</p>
        </div>

        <div class="learn-detail-card">
          <div class="learn-detail-card-title"><span>📊</span> SCORING &amp; PROGRESSION</div>
          <p class="learn-detail-card-text">${prof.scoring}</p>
        </div>

        <div class="learn-detail-card">
          <div class="learn-detail-card-title"><span>💡</span> TACTICAL RECOMMENDATIONS</div>
          <p class="learn-detail-card-text">${prof.tactics}</p>
        </div>
      </div>
    `;

    document.getElementById('btn-back-to-missions')?.addEventListener('click', () => {
      sfx('click');
      this.closeMissionDetail();
    });

    const workspace = document.getElementById('learn-main-workspace');
    if (workspace) workspace.scrollTop = 0;
  }

  public closeMissionDetail(): void {
    this.renderMissionsList();
  }

  // ==========================================
  // 3. FACTIONS SECTION (MULTI-PAGE CODEX)
  // ==========================================

  private renderFactionsList(): void {
    this.activeFactionId = null;
    this.updateFooterBackLabel('RETURN TO MAIN MENU');

    const listView = document.getElementById('learn-factions-list-view');
    const detailView = document.getElementById('learn-faction-detail-view');
    if (listView) listView.style.display = 'block';
    if (detailView) detailView.style.display = 'none';

    if (!listView) return;

    let html = `
      <div class="learn-view-header">
        <h3 class="learn-view-title">🛡️ PLAYABLE FACTIONS &amp; WARBANDS</h3>
        <p class="learn-view-subtitle">Select any faction to inspect its multi-page Codex, complete tactical statistics, squad rosters, and weapons arsenal.</p>
      </div>
      <div class="learn-cards-grid faction-grid">
    `;

    PLAYABLE_FACTION_KEYS.forEach(key => {
      const f: Faction = FACTIONS[key] || {
        id: key,
        name: key.toUpperCase(),
        sub: 'Unique Military Formation',
        icon: '🛡️',
        color: 0x1d4ed8,
        colorHex: 0x1d4ed8,
        trim: 0xf59e0b,
        trimHex: 0xf59e0b,
        laserColor: 0x3b82f6,
        desc: 'Distinct battlefield civilization.',
        quote: 'Honor through battle.',
        emblem: `/assets/emblems/${key}.jpg`,
        roster: []
      };

      const emblemImg = f.emblem || `/assets/emblems/${key}.jpg`;

      html += `
        <div class="learn-catalog-card" data-faction-id="${key}">
          <div class="learn-card-emblem-wrap">
            <img src="${emblemImg}" alt="${f.name} Emblem" class="learn-emblem-card-img" />
          </div>
          <div class="learn-card-content">
            <div class="learn-card-header-row">
              <h4 class="learn-card-name">${f.name}</h4>
              <span class="learn-card-icon">${f.icon}</span>
            </div>
            <div class="learn-card-sub">${f.sub}</div>
            <blockquote class="learn-faction-quote">"${f.quote || 'Ready for war.'}"</blockquote>
            <p class="learn-card-desc">${f.desc ? f.desc.substring(0, 110) + '...' : ''}</p>
            <button class="learn-card-action-btn" type="button">OPEN FACTION CODEX ➔</button>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    listView.innerHTML = html;

    // Attach click events
    listView.querySelectorAll<HTMLElement>('.learn-catalog-card').forEach(card => {
      card.addEventListener('click', () => {
        const factionId = card.getAttribute('data-faction-id');
        if (factionId) {
          sfx('click');
          this.openFactionDetail(factionId, 'overview');
        }
      });
    });
  }

  public openFactionDetail(factionId: string, tab: FactionCodexTab = 'overview'): void {
    this.activeFactionId = factionId;
    this.activeFactionTab = tab;
    this.updateFooterBackLabel('BACK TO FACTIONS');

    const listView = document.getElementById('learn-factions-list-view');
    const detailView = document.getElementById('learn-faction-detail-view');
    if (listView) listView.style.display = 'none';
    if (!detailView) return;

    detailView.style.display = 'block';

    const f: Faction = FACTIONS[factionId] || FACTIONS.ascendants;
    const emblemImg = f.emblem || `/assets/emblems/${factionId}.jpg`;

    // Map factionId to unit factionId in UNIT_DEFS
    let targetFactionId = factionId;
    if (factionId === 'ascendants' || factionId === 'space_marines' || factionId === 'marines') targetFactionId = 'marines';
    else if (factionId === 'directorate' || factionId === 'guard' || factionId === 'astra_militarum') targetFactionId = 'directorate';
    else if (factionId === 'elyri' || factionId === 'eldar' || factionId === 'aeldari') targetFactionId = 'eldar';
    else if (factionId === 'veykari' || factionId === 'dark_eldar' || factionId === 'drukhari') targetFactionId = 'dark_eldar';
    else if (factionId === 'ghar' || factionId === 'orcs' || factionId === 'orks') targetFactionId = 'orcs';
    else if (factionId === 'devourers' || factionId === 'tyranids') targetFactionId = 'tyranids';
    else if (factionId === 'revenant' || factionId === 'necrons' || factionId === 'necros') targetFactionId = 'necros';
    else if (factionId === 'concordat' || factionId === 'tau') targetFactionId = 'tau';
    else if (factionId === 'riftborn' || factionId === 'daemons' || factionId === 'chaos_daemons') targetFactionId = 'riftborn';
    else if (factionId === 'forsaken' || factionId === 'chaos' || factionId === 'chaos_marines') targetFactionId = 'chaos';

    const units = Object.values(UNIT_DEFS).filter(u => u.factionId === targetFactionId && !u.isVip);

    // Collect all unique weapon IDs equipped by this faction's units
    const weaponIdsSet = new Set<string>();
    units.forEach(u => {
      if (u.weaponIds) {
        u.weaponIds.forEach(id => weaponIdsSet.add(id));
      }
    });

    const factionWeapons: WeaponProfileDetail[] = [];
    weaponIdsSet.forEach(wId => {
      if (WEAPON_REGISTRY[wId]) {
        factionWeapons.push(WEAPON_REGISTRY[wId]);
      }
    });

    // Determine Prev and Next Faction for navigation
    const currentIndex = PLAYABLE_FACTION_KEYS.indexOf(factionId);
    const prevFactionKey = PLAYABLE_FACTION_KEYS[(currentIndex - 1 + PLAYABLE_FACTION_KEYS.length) % PLAYABLE_FACTION_KEYS.length];
    const nextFactionKey = PLAYABLE_FACTION_KEYS[(currentIndex + 1) % PLAYABLE_FACTION_KEYS.length];

    detailView.innerHTML = `
      <!-- FACTION DETAIL HEADER -->
      <div class="learn-detail-header-bar">
        <div class="learn-detail-nav-group">
          <button class="learn-btn-sub-back" id="btn-back-to-factions">◀ BACK TO FACTIONS</button>
          <div class="learn-prev-next-group">
            <button class="learn-step-btn" id="btn-prev-faction" title="Previous Faction">◀ ${FACTIONS[prevFactionKey]?.name || 'Prev'}</button>
            <button class="learn-step-btn" id="btn-next-faction" title="Next Faction">${FACTIONS[nextFactionKey]?.name || 'Next'} ▶</button>
          </div>
        </div>
        <div class="learn-detail-header-title">${f.icon} ${f.name.toUpperCase()} CODEX</div>
      </div>

      <!-- FACTION CODEX SUB-NAV TABS -->
      <div class="faction-codex-tab-bar">
        <button class="faction-tab-pill ${tab === 'overview' ? 'active' : ''}" data-tab="overview">
          <span class="tab-icon">📖</span> OVERVIEW
        </button>
        <button class="faction-tab-pill ${tab === 'stats' ? 'active' : ''}" data-tab="stats">
          <span class="tab-icon">📊</span> STATS
        </button>
        <button class="faction-tab-pill ${tab === 'units' ? 'active' : ''}" data-tab="units">
          <span class="tab-icon">👥</span> UNITS (${units.length})
        </button>
        <button class="faction-tab-pill ${tab === 'weapons' ? 'active' : ''}" data-tab="weapons">
          <span class="tab-icon">🔫</span> WEAPONS / EQUIPMENT (${factionWeapons.length})
        </button>
      </div>

      <!-- ACTIVE TAB CONTENT WRAPPER -->
      <div id="faction-tab-content" class="faction-tab-content-area">
        ${this.renderFactionTabContent(f, units, factionWeapons, emblemImg, tab)}
      </div>
    `;

    // Hook Back Button
    document.getElementById('btn-back-to-factions')?.addEventListener('click', () => {
      sfx('click');
      this.closeFactionDetail();
    });

    // Hook Stepper Buttons
    document.getElementById('btn-prev-faction')?.addEventListener('click', () => {
      sfx('click');
      this.openFactionDetail(prevFactionKey, 'overview');
    });

    document.getElementById('btn-next-faction')?.addEventListener('click', () => {
      sfx('click');
      this.openFactionDetail(nextFactionKey, 'overview');
    });

    // Hook Tab Switching
    detailView.querySelectorAll<HTMLButtonElement>('.faction-tab-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        const nextTab = btn.getAttribute('data-tab') as FactionCodexTab;
        if (nextTab && nextTab !== this.activeFactionTab) {
          sfx('click');
          this.openFactionDetail(factionId, nextTab);
        }
      });
    });

    const workspace = document.getElementById('learn-main-workspace');
    if (workspace) workspace.scrollTop = 0;
  }

  private renderFactionTabContent(
    f: Faction,
    units: UnitDef[],
    factionWeapons: WeaponProfileDetail[],
    emblemImg: string,
    tab: FactionCodexTab
  ): string {
    switch (tab) {
      case 'overview':
        return `
          <div class="faction-overview-layout">
            <!-- LARGE FACTION PORTRAIT & IDENTITY HERO -->
            <div class="learn-faction-large-hero">
              <div class="faction-large-portrait-container">
                <img src="${emblemImg}" alt="${f.name} Large Emblem" class="faction-large-emblem-art" />
                <div class="faction-portrait-glow"></div>
              </div>
              <div class="faction-large-hero-details">
                <div class="faction-hero-header-badge-row">
                  <span class="faction-hero-main-title">${f.icon} ${f.name}</span>
                  <span class="faction-hero-archetype-tag">${f.sub}</span>
                </div>
                <blockquote class="faction-hero-quote-block">
                  "${f.quote || 'Victory through superior strength.'}"
                </blockquote>
                <div class="faction-hero-identity-card">
                  <span class="identity-tag">BATTLEFIELD IDENTITY</span>
                  <p class="identity-text">${f.battlefieldIdentity || 'Standard Military Force'}</p>
                </div>
              </div>
            </div>

            <!-- ORIGINS & LORE SECTION -->
            <div class="faction-codex-text-panels">
              <div class="learn-detail-card highlight-card">
                <div class="learn-detail-card-title"><span>📜</span> ORIGINS &amp; HISTORY</div>
                <p class="learn-detail-card-text readable-lore-body">${f.desc}</p>
              </div>
              <div class="learn-detail-card">
                <div class="learn-detail-card-title"><span>⚔️</span> COMBAT PHILOSOPHY &amp; DOCTRINE</div>
                <p class="learn-detail-card-text readable-lore-body">${f.doctrine || 'Balanced tactical discipline.'}</p>
              </div>
            </div>
          </div>
        `;

      case 'stats':
        return `
          <div class="faction-stats-layout">
            <!-- IDENTITY & DOCTRINE CARDS -->
            <div class="faction-stats-grid">
              <div class="learn-detail-card highlight-card">
                <div class="learn-detail-card-title"><span>🎖️</span> BATTLEFIELD IDENTITY</div>
                <p class="learn-detail-card-text">${f.battlefieldIdentity || 'Standard military force.'}</p>
              </div>

              <div class="learn-detail-card">
                <div class="learn-detail-card-title"><span>⚔️</span> COMBAT DOCTRINE</div>
                <p class="learn-detail-card-text">${f.doctrine || 'Standard tactical operation.'}</p>
              </div>

              ${f.uniqueMechanic ? `
                <div class="learn-detail-card highlight-card" style="grid-column: 1 / -1;">
                  <div class="learn-detail-card-title"><span>⚡</span> UNIQUE MECHANIC: ${f.uniqueMechanic.name.toUpperCase()}</div>
                  <p class="learn-detail-card-text">${f.uniqueMechanic.desc}</p>
                </div>
              ` : ''}

              <!-- TACTICAL PROFILE: STRENGTHS & WEAKNESSES -->
              <div class="learn-detail-card" style="grid-column: 1 / -1;">
                <div class="learn-detail-card-title"><span>⚖️</span> TACTICAL STRENGTHS &amp; WEAKNESSES</div>
                <div class="learn-strengths-weaknesses-grid">
                  <div class="learn-sw-box strengths">
                    <div class="learn-sw-header">FACTION STRENGTHS</div>
                    <ul>
                      ${(f.strengths || []).map((s: string) => `<li>✓ ${s}</li>`).join('')}
                    </ul>
                  </div>
                  <div class="learn-sw-box weaknesses">
                    <div class="learn-sw-header">FACTION WEAKNESSES</div>
                    <ul>
                      ${(f.weaknesses || []).map((w: string) => `<li>✕ ${w}</li>`).join('')}
                    </ul>
                  </div>
                </div>
              </div>

              <!-- AGGREGATE FACTION ROSTER METRICS -->
              <div class="learn-detail-card" style="grid-column: 1 / -1;">
                <div class="learn-detail-card-title"><span>📊</span> FACTION OPERATIONAL METRICS</div>
                <div class="faction-metrics-summary-grid">
                  <div class="faction-metric-pill">
                    <span class="m-val">${units.length}</span>
                    <span class="m-lbl">ROSTER UNITS</span>
                  </div>
                  <div class="faction-metric-pill">
                    <span class="m-val">${factionWeapons.length}</span>
                    <span class="m-lbl">WEAPON TYPES</span>
                  </div>
                  <div class="faction-metric-pill">
                    <span class="m-val">${units.filter(u => u.isCharacter).length}</span>
                    <span class="m-lbl">COMMANDERS</span>
                  </div>
                  <div class="faction-metric-pill">
                    <span class="m-val">${units.reduce((acc, u) => acc + (u.squadSize || 1), 0)}</span>
                    <span class="m-lbl">TOTAL SQUAD MODELS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;

      case 'units':
        return `
          <div class="faction-units-layout">
            <div class="learn-view-header compact">
              <h4 class="learn-view-title sub">${f.name.toUpperCase()} SQUAD ROSTER (${units.length} UNITS)</h4>
              <p class="learn-view-subtitle">Authoritative data-driven squad profiles, unit stats, tactical roles, and weapon loadouts.</p>
            </div>
            <div class="learn-unit-roster-full-grid">
              ${units.map(u => this.renderUnitCodexRow(u)).join('')}
            </div>
          </div>
        `;

      case 'weapons':
        return `
          <div class="faction-weapons-layout">
            <div class="learn-view-header compact">
              <h4 class="learn-view-title sub">${f.name.toUpperCase()} ARSENAL (${factionWeapons.length} PROFILES)</h4>
              <p class="learn-view-subtitle">Authoritative weapon &amp; equipment profiles resolved from the central equipment registry. Each weapon operates as an independent tactical asset.</p>
            </div>

            <div class="weapons-cards-arsenal-list">
              ${factionWeapons.map(w => `
                <div class="learn-weapon-detail-card">
                  <div class="wep-detail-header">
                    <div class="wep-identity-left">
                      <span class="wep-icon-badge">${w.icon || '⚔️'}</span>
                      <div class="wep-title-stack">
                        <h4 class="wep-title-name">${w.name}</h4>
                        <span class="wep-category-sub">${w.category ? w.category.toUpperCase() : 'TACTICAL ARMAMENT'}</span>
                      </div>
                    </div>
                    <div class="wep-type-pill ${w.type}">${w.type.toUpperCase()}</div>
                  </div>

                  <!-- WEAPON COMBAT STATS ROW -->
                  <div class="wep-combat-stats-matrix">
                    <div class="wep-stat-cell">
                      <span class="st-k">RANGE</span>
                      <span class="st-v">${w.rangeDisplay || (w.range > 0 ? `${w.range}"` : 'Melee')}</span>
                    </div>
                    <div class="wep-stat-cell">
                      <span class="st-k">ATTACKS</span>
                      <span class="st-v">${w.attacks}</span>
                    </div>
                    <div class="wep-stat-cell">
                      <span class="st-k">STRENGTH</span>
                      <span class="st-v">${w.strength || 4}</span>
                    </div>
                    <div class="wep-stat-cell">
                      <span class="st-k">DAMAGE</span>
                      <span class="st-v">${w.damage}</span>
                    </div>
                    <div class="wep-stat-cell">
                      <span class="st-k">AP</span>
                      <span class="st-v">${w.ap > 0 ? `-${w.ap}` : '0'}</span>
                    </div>
                  </div>

                  <!-- SPECIAL TRAITS & DESCRIPTION -->
                  <div class="wep-details-body">
                    <div class="wep-trait-row">
                      <strong class="trait-label">SPECIAL RULES:</strong>
                      <span class="trait-val">${w.special || 'Standard Engagement Profile'}</span>
                    </div>
                    <div class="wep-trait-row">
                      <strong class="trait-label">DAMAGE TYPE:</strong>
                      <span class="trait-val">${w.damageType ? w.damageType.toUpperCase() : 'BALLISTIC'}</span>
                    </div>
                    ${(w.effectiveAgainst && w.effectiveAgainst.length > 0) || (w.weakAgainst && w.weakAgainst.length > 0) ? `
                      <div class="wep-effectiveness-row">
                        ${w.effectiveAgainst && w.effectiveAgainst.length > 0 ? `
                          <span class="eff-tag effective">Effective vs: ${w.effectiveAgainst.join(', ')}</span>
                        ` : ''}
                        ${w.weakAgainst && w.weakAgainst.length > 0 ? `
                          <span class="eff-tag weak">Weak vs: ${w.weakAgainst.join(', ')}</span>
                        ` : ''}
                      </div>
                    ` : ''}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
    }
  }

  private renderUnitCodexRow(u: UnitDef): string {
    const role = u.role ? u.role.toUpperCase() : (u.isCharacter ? 'COMMANDER' : 'INFANTRY');
    const cost = u.points ? `${u.points} PTS` : 'N/A';
    const squadSize = u.squadSize ? `${u.squadSize}x Models` : '1 Model';
    const wounds = u.wounds !== undefined ? u.wounds : (u.hp || 5);
    const save = u.sv !== undefined ? u.sv : (u.armorSave || 3);
    const ld = u.leadership !== undefined ? u.leadership : 7;
    const attacks = u.weapons && u.weapons.length > 0 ? u.weapons[0].attacks : 2;
    const weaponsList = u.weapons && u.weapons.length > 0 
      ? u.weapons.map(w => w.name).join(', ')
      : (u.weapon || 'Standard Arms');

    return `
      <div class="learn-roster-item">
        <div class="learn-roster-item-header">
          <div class="learn-roster-title-group">
            <span class="learn-roster-icon">${u.icon || '🛡️'}</span>
            <span class="learn-roster-name">${u.name}</span>
            <span class="learn-roster-role">${role}</span>
          </div>
          <div class="learn-roster-cost-badge">${cost}</div>
        </div>
        <div class="learn-roster-stats-row">
          <div class="learn-stat-pill"><span class="k">M</span> <span class="v">${u.m}"</span></div>
          <div class="learn-stat-pill"><span class="k">BS</span> <span class="v">${u.bs}+</span></div>
          <div class="learn-stat-pill"><span class="k">WS</span> <span class="v">${u.ws}+</span></div>
          <div class="learn-stat-pill"><span class="k">S</span> <span class="v">${u.s}</span></div>
          <div class="learn-stat-pill"><span class="k">T</span> <span class="v">${u.t}</span></div>
          <div class="learn-stat-pill"><span class="k">W</span> <span class="v">${wounds}</span></div>
          <div class="learn-stat-pill"><span class="k">A</span> <span class="v">${attacks}</span></div>
          <div class="learn-stat-pill"><span class="k">LD</span> <span class="v">${ld}</span></div>
          <div class="learn-stat-pill"><span class="k">SV</span> <span class="v">${save}+</span></div>
          <div class="learn-stat-pill squad-pill"><span class="k">SIZE</span> <span class="v">${squadSize}</span></div>
        </div>
        <div class="learn-roster-weapons-row">
          <span class="wep-label">EQUIPPED:</span> ${weaponsList}
        </div>
      </div>
    `;
  }

  public closeFactionDetail(): void {
    this.renderFactionsList();
  }
}
