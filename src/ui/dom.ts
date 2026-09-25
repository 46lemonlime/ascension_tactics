import { FACTIONS } from '../data/factions';
import { THEMES } from '../data/themes';
import { UNIT_DEFS } from '../data/units';
import type { MissionType } from '../data/types';
import { sfx } from '../audio/synth';

export const FACTION_CYCLE: string[] = [
  'random',
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

export class DOMManager {
  // Screens & Modals
  public homeScreen: HTMLElement | null;
  public raceModal: HTMLElement | null;
  public learnModal: HTMLElement | null;
  public uiLayer: HTMLElement | null;
  public missionHudBar: HTMLElement | null;
  public gameOverModal: HTMLElement | null;

  // Selections
  public selectedP1Faction: string = 'random';
  public selectedP2Faction: string = 'random';
  public selectedTheme: string = 'random';
  public selectedMission: MissionType = 'extermination';
  public p1EscortRole: 'escort' | 'attack' | 'random' = 'escort';
  public p2EscortRole: 'opposite' | 'escort' | 'attack' | 'random' = 'opposite';

  // Single Player Flow Stage
  public currentSinglePlayerStage: 1 | 2 | 3 = 1;

  private playerCarouselIndex: number = 11;
  private aiCarouselIndex: number = 11;
  private mapCarouselIndex: number = 10;

  public onStartGame?: (
    p1Faction: string,
    p2Faction: string,
    theme: string,
    mission: MissionType,
    p1EscortRole?: 'escort' | 'attack',
    p2EscortRole?: 'escort' | 'attack'
  ) => void;

  constructor() {
    this.homeScreen = document.getElementById('home-screen');
    this.raceModal = document.getElementById('race-modal');
    this.learnModal = document.getElementById('learn-modal');
    this.uiLayer = document.getElementById('ui-layer');
    this.missionHudBar = document.getElementById('mission-hud-bar');
    this.gameOverModal = document.getElementById('game-over-modal');

    this.initHomeScreen();
    this.initRaceModal();
    this.initLearnModal();
  }

  private initHomeScreen(): void {
    const btnSinglePlayer = document.getElementById('btn-start-singleplayer');
    if (btnSinglePlayer) {
      btnSinglePlayer.addEventListener('click', () => {
        sfx('click');
        this.showRaceModal();
      });
    }

    const btnLearnMore = document.getElementById('btn-start-learn');
    if (btnLearnMore) {
      btnLearnMore.addEventListener('click', () => {
        sfx('click');
        this.showLearnModal();
      });
    }

    const btnAudioToggle = document.getElementById('btn-audio-toggle');
    const audioIcon = document.getElementById('home-audio-icon');
    let isMuted = false;
    if (btnAudioToggle) {
      btnAudioToggle.addEventListener('click', () => {
        isMuted = !isMuted;
        sfx('click');
        if (audioIcon) audioIcon.textContent = isMuted ? '🔇' : '🔊';
        const vBars = btnAudioToggle.querySelectorAll('.v-bar');
        vBars.forEach((bar) => {
          if (isMuted) {
            bar.classList.remove('active');
          } else {
            bar.classList.add('active');
          }
        });
      });
    }
  }

  public showHomeScreen(): void {
    if (this.homeScreen) this.homeScreen.style.display = 'flex';
    if (this.raceModal) this.raceModal.style.display = 'none';
    if (this.learnModal) this.learnModal.style.display = 'none';
    if (this.uiLayer) this.uiLayer.style.display = 'none';
    if (this.missionHudBar) this.missionHudBar.style.display = 'none';
  }

  public showRaceModal(): void {
    if (this.homeScreen) this.homeScreen.style.display = 'none';
    if (this.raceModal) this.raceModal.style.display = 'flex';
    if (this.learnModal) this.learnModal.style.display = 'none';
    if (this.uiLayer) this.uiLayer.style.display = 'none';
    if (this.missionHudBar) this.missionHudBar.style.display = 'none';

    this.setSinglePlayerStage(1);
    this.selectMapOption(this.selectedTheme || 'random');
    this.updateSinglePlayerSummary();

    // Reset carousel positions
    setTimeout(() => {
      this.updatePlayerCarousel(0);
      this.updateAiCarousel(0);
      this.updateMapCarousel(0);
    }, 50);
  }

  public showLearnModal(): void {
    if (this.homeScreen) this.homeScreen.style.display = 'none';
    if (this.raceModal) this.raceModal.style.display = 'none';
    if (this.learnModal) this.learnModal.style.display = 'flex';
    if (this.uiLayer) this.uiLayer.style.display = 'none';
    if (this.missionHudBar) this.missionHudBar.style.display = 'none';

    // Default to rules tab and render initial faction dossier
    this.switchLearnTab('rules');
    this.renderFactionDossier('space_marines');
  }

  public showGameUI(): void {
    if (this.homeScreen) this.homeScreen.style.display = 'none';
    if (this.raceModal) this.raceModal.style.display = 'none';
    if (this.learnModal) this.learnModal.style.display = 'none';
    if (this.uiLayer) this.uiLayer.style.display = 'flex';
    if (this.missionHudBar) this.missionHudBar.style.display = 'flex';
  }

  private initLearnModal(): void {
    const btnTabRules = document.getElementById('btn-tab-rules');
    const btnTabFactions = document.getElementById('btn-tab-factions');
    const btnLearnBack = document.getElementById('btn-learn-back');

    if (btnTabRules) {
      btnTabRules.addEventListener('click', () => this.switchLearnTab('rules'));
    }
    if (btnTabFactions) {
      btnTabFactions.addEventListener('click', () => this.switchLearnTab('factions'));
    }
    if (btnLearnBack) {
      btnLearnBack.addEventListener('click', () => this.showHomeScreen());
    }

    // Faction Pills
    const pills = document.querySelectorAll('.faction-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const fKey = pill.getAttribute('data-fkey') || 'space_marines';
        this.renderFactionDossier(fKey);
      });
    });
  }

  public switchLearnTab(tab: 'rules' | 'factions'): void {
    const btnTabRules = document.getElementById('btn-tab-rules');
    const btnTabFactions = document.getElementById('btn-tab-factions');
    const rulesContent = document.getElementById('learn-tab-rules-content');
    const factionsContent = document.getElementById('learn-tab-factions-content');

    if (tab === 'rules') {
      btnTabRules?.classList.add('active');
      btnTabFactions?.classList.remove('active');
      if (rulesContent) rulesContent.style.display = 'flex';
      if (factionsContent) factionsContent.style.display = 'none';
    } else {
      btnTabRules?.classList.remove('active');
      btnTabFactions?.classList.add('active');
      if (rulesContent) rulesContent.style.display = 'none';
      if (factionsContent) factionsContent.style.display = 'flex';
    }
  }

  public renderFactionDossier(fKey: string): void {
    const container = document.getElementById('learn-faction-dossier');
    if (!container) return;

    const faction = FACTIONS[fKey] || FACTIONS.ascendants || FACTIONS.space_marines;
    
    // Map any alias to the factionId stored on unit definitions
    let targetFactionId = fKey;
    if (fKey === 'ascendants' || fKey === 'space_marines' || fKey === 'marines') targetFactionId = 'marines';
    else if (fKey === 'directorate' || fKey === 'guard' || fKey === 'astra_militarum') targetFactionId = 'directorate';
    else if (fKey === 'elyri' || fKey === 'eldar' || fKey === 'aeldari') targetFactionId = 'eldar';
    else if (fKey === 'veykari' || fKey === 'dark_eldar' || fKey === 'drukhari') targetFactionId = 'dark_eldar';
    else if (fKey === 'ghar' || fKey === 'orcs' || fKey === 'orks') targetFactionId = 'orcs';
    else if (fKey === 'devourers' || fKey === 'tyranids') targetFactionId = 'tyranids';
    else if (fKey === 'revenant' || fKey === 'necrons' || fKey === 'necros') targetFactionId = 'necros';
    else if (fKey === 'concordat' || fKey === 'tau') targetFactionId = 'tau';
    else if (fKey === 'riftborn' || fKey === 'daemons' || fKey === 'chaos_daemons') targetFactionId = 'riftborn';
    else if (fKey === 'forsaken' || fKey === 'chaos' || fKey === 'chaos_marines') targetFactionId = 'chaos';

    const factionUnits = Object.values(UNIT_DEFS).filter(u => u.factionId === targetFactionId);

    let unitsHtml = '';
    factionUnits.forEach(u => {
      const role = u.role ? u.role.toUpperCase() : (u.isCharacter ? 'COMMANDER' : 'INFANTRY');
      unitsHtml += `
        <div class="dossier-unit-card">
          <div class="dossier-unit-header">
            <span class="dossier-unit-name">${u.icon || '⚔️'} ${u.name}</span>
            <span class="dossier-unit-role">${role}</span>
          </div>
          <div class="dossier-unit-weapon">🗡️ ${u.weapon || 'Standard Arms'}</div>
          <div class="dossier-stats-row">
            <div class="dossier-stat-badge">
              <div class="dossier-stat-lbl">Move</div>
              <div class="dossier-stat-val">${u.m || 6}"</div>
            </div>
            <div class="dossier-stat-badge">
              <div class="dossier-stat-lbl">Range</div>
              <div class="dossier-stat-val">${u.range || 18}"</div>
            </div>
            <div class="dossier-stat-badge">
              <div class="dossier-stat-lbl">Dmg</div>
              <div class="dossier-stat-val">${u.dmg || 2}</div>
            </div>
            <div class="dossier-stat-badge">
              <div class="dossier-stat-lbl">Wounds</div>
              <div class="dossier-stat-val">${u.hp || 5}</div>
            </div>
            <div class="dossier-stat-badge">
              <div class="dossier-stat-lbl">Save</div>
              <div class="dossier-stat-val">${u.sv || 3}+</div>
            </div>
          </div>
        </div>
      `;
    });

    const quoteHtml = faction.quote ? `<div class="dossier-quote">“${faction.quote}”</div>` : '';
    
    const identityHtml = faction.battlefieldIdentity ? `
      <div class="dossier-card-box">
        <div class="dossier-box-title">⚔️ BATTLEFIELD IDENTITY</div>
        <div style="font-size:13.5px; color:#f1f5f9; line-height:1.5;">${faction.battlefieldIdentity}</div>
        ${faction.doctrine ? `<div class="dossier-doctrine" style="margin-top:6px;"><strong>DOCTRINE:</strong> ${faction.doctrine}</div>` : ''}
      </div>
    ` : '';

    const strengthsHtml = faction.strengths && faction.strengths.length > 0 ? `
      <div class="dossier-card-box">
        <div class="dossier-box-title strengths">✔ STRENGTHS</div>
        <ul class="dossier-list">
          ${faction.strengths.map(s => `<li>${s}</li>`).join('')}
        </ul>
      </div>
    ` : '';

    const weaknessesHtml = faction.weaknesses && faction.weaknesses.length > 0 ? `
      <div class="dossier-card-box">
        <div class="dossier-box-title weaknesses">✖ WEAKNESSES</div>
        <ul class="dossier-list">
          ${faction.weaknesses.map(w => `<li>${w}</li>`).join('')}
        </ul>
      </div>
    ` : '';

    const metaGridHtml = (strengthsHtml || weaknessesHtml) ? `
      <div class="dossier-meta-grid">
        ${strengthsHtml}
        ${weaknessesHtml}
      </div>
    ` : '';

    const mechanicHtml = faction.uniqueMechanic ? `
      <div class="dossier-card-box mechanic">
        <div class="dossier-box-title mechanic">⚡ UNIQUE MECHANIC — ${faction.uniqueMechanic.name.toUpperCase()}</div>
        <div style="font-size:13px; color:#e0f2fe; line-height:1.5;">${faction.uniqueMechanic.desc}</div>
      </div>
    ` : '';

    const emblemHtml = faction.emblem
      ? `<img src="${faction.emblem}" alt="${faction.name}" style="width:36px;height:36px;object-fit:contain;border-radius:4px;filter:drop-shadow(0 2px 6px rgba(0,0,0,0.6));" />`
      : faction.icon;

    const heroSectionHtml = faction.image ? `
      <div class="dossier-hero-row">
        <div class="dossier-image-container">
          <img src="${faction.image}" alt="${faction.name}" class="dossier-faction-img" />
        </div>
        <div class="dossier-info-col">
          <div class="dossier-header">
            <div class="dossier-icon">${emblemHtml}</div>
            <div class="dossier-title-box">
              <h3>${faction.name.toUpperCase()}</h3>
              <div class="dossier-sub">${faction.sub || 'Warzone Battleforce'}</div>
            </div>
          </div>
          ${quoteHtml}
          <div class="dossier-lore">${faction.desc || ''}</div>
        </div>
      </div>
    ` : `
      <div class="dossier-header">
        <div class="dossier-icon">${emblemHtml}</div>
        <div class="dossier-title-box">
          <h3>${faction.name.toUpperCase()}</h3>
          <div class="dossier-sub">${faction.sub || 'Warzone Battleforce'}</div>
        </div>
      </div>
      ${quoteHtml}
      <div class="dossier-lore">${faction.desc || ''}</div>
    `;

    container.innerHTML = `
      ${heroSectionHtml}
      ${identityHtml}
      ${mechanicHtml}
      ${metaGridHtml}
      <div class="dossier-roster-title">&#9876; AUTHORITATIVE SQUAD ROSTER & COMBAT DATASHEETS</div>
      <div class="dossier-roster-grid">
        ${unitsHtml}
      </div>
    `;
  }

  public setSinglePlayerStage(stage: 1 | 2 | 3): void {
    this.currentSinglePlayerStage = stage;

    const stageFaction = document.getElementById('sp-stage-faction');
    const stageMap = document.getElementById('sp-stage-map');
    const stageMission = document.getElementById('sp-stage-mission');

    if (stageFaction) stageFaction.style.display = stage === 1 ? 'flex' : 'none';
    if (stageMap) stageMap.style.display = stage === 2 ? 'flex' : 'none';
    if (stageMission) stageMission.style.display = stage === 3 ? 'flex' : 'none';

    // Update Stepper Pills
    const pill1 = document.getElementById('sp-step-pill-1');
    const pill2 = document.getElementById('sp-step-pill-2');
    const pill3 = document.getElementById('sp-step-pill-3');

    [pill1, pill2, pill3].forEach(p => p?.classList.remove('active', 'completed'));

    if (stage === 1) {
      pill1?.classList.add('active');
    } else if (stage === 2) {
      pill1?.classList.add('completed');
      pill2?.classList.add('active');
    } else if (stage === 3) {
      pill1?.classList.add('completed');
      pill2?.classList.add('completed');
      pill3?.classList.add('active');
    }

    // Update Navigation Button Text
    const backText = document.getElementById('sp-back-text');
    const nextText = document.getElementById('sp-next-text');

    if (stage === 1) {
      if (backText) backText.textContent = 'RETURN TO MAIN MENU';
      if (nextText) nextText.textContent = 'NEXT: SELECT MAP';
    } else if (stage === 2) {
      if (backText) backText.textContent = 'BACK TO FACTION';
      if (nextText) nextText.textContent = 'NEXT: SELECT MISSION';
    } else if (stage === 3) {
      if (backText) backText.textContent = 'BACK TO MAP';
      if (nextText) nextText.textContent = 'COMMENCE DEPLOYMENT ⚔️';
    }

    this.updateSinglePlayerSummary();

    // Re-align carousels when entering stage
    setTimeout(() => {
      if (stage === 1) {
        this.updatePlayerCarousel(0);
        this.updateAiCarousel(0);
      }
      if (stage === 2) {
        this.updateMapCarousel(0);
      }
    }, 40);
  }

  public updateSinglePlayerSummary(): void {
    const summaryPlayer = document.getElementById('sp-summary-player-faction');
    const summaryAi = document.getElementById('sp-summary-ai-faction');
    const summaryMap = document.getElementById('sp-summary-map');
    const summaryMission = document.getElementById('sp-summary-mission');

    const factionNames: Record<string, string> = {
      random: 'Random Army',
      ascendants: 'The Ascendants',
      directorate: 'The Directorate',
      elyri: 'The Elyri',
      veykari: 'The Veykari',
      ghar: 'The Ghar',
      devourers: 'The Devourers',
      revenant: 'The Revenant',
      concordat: 'The Concordat',
      riftborn: 'The Riftborn',
      forsaken: 'The Forsaken'
    };

    const aiFactionNames: Record<string, string> = {
      random: 'Random Rival',
      ascendants: 'The Ascendants',
      directorate: 'The Directorate',
      elyri: 'The Elyri',
      veykari: 'The Veykari',
      ghar: 'The Ghar',
      devourers: 'The Devourers',
      revenant: 'The Revenant',
      concordat: 'The Concordat',
      riftborn: 'The Riftborn',
      forsaken: 'The Forsaken'
    };

    const mapNames: Record<string, string> = {
      random: 'Random Biome',
      jungle: 'Jungle World',
      snow: 'Glacial World',
      desert: 'Desert Wastes',
      city: 'Gothic Hive City',
      tech: 'Space-Tech Station',
      astral: 'Astral Crystal Spire',
      corrupted: 'Corrupted Flesh-World',
      devoured: 'Devoured World',
      tomb: 'Tomb World',
      rift: 'Warp Rift World'
    };

    const missionNames: Record<string, string> = {
      extermination: 'Extermination',
      escort: 'VIP Escort',
      domination: 'Domination'
    };

    if (summaryPlayer) {
      summaryPlayer.textContent = factionNames[this.selectedP1Faction] || 'Random Army';
    }
    if (summaryAi) {
      summaryAi.textContent = aiFactionNames[this.selectedP2Faction] || 'Random Rival';
    }
    if (summaryMap) {
      summaryMap.textContent = mapNames[this.selectedTheme] || 'Random Biome';
    }
    if (summaryMission) {
      summaryMission.textContent = missionNames[this.selectedMission] || 'Extermination';
    }
  }

  private initRaceModal(): void {
    // 1. PLAYER FACTION CAROUSEL
    const playerTrack = document.getElementById('factions-track-player');
    const btnPlayerPrev = document.getElementById('btn-player-carousel-prev');
    const btnPlayerNext = document.getElementById('btn-player-carousel-next');

    if (btnPlayerPrev) {
      btnPlayerPrev.addEventListener('click', () => {
        sfx('click');
        this.updatePlayerCarousel(-1);
      });
    }
    if (btnPlayerNext) {
      btnPlayerNext.addEventListener('click', () => {
        sfx('click');
        this.updatePlayerCarousel(1);
      });
    }

    if (playerTrack) {
      playerTrack.addEventListener('transitionend', () => {
        if (this.playerCarouselIndex >= 22) {
          this.playerCarouselIndex -= 11;
          this.updatePlayerCarousel(0, true);
        } else if (this.playerCarouselIndex < 11) {
          this.playerCarouselIndex += 11;
          this.updatePlayerCarousel(0, true);
        }
      });

      const playerCards = playerTrack.querySelectorAll<HTMLElement>('.sp-emblem-card');
      playerCards.forEach(card => {
        card.addEventListener('click', () => {
          const idxStr = card.getAttribute('data-index');
          if (idxStr !== null) {
            sfx('click');
            this.playerCarouselIndex = parseInt(idxStr, 10);
            this.updatePlayerCarousel(0);
          }
        });
      });
    }

    // 2. AI FACTION CAROUSEL
    const aiTrack = document.getElementById('factions-track-ai');
    const btnAiPrev = document.getElementById('btn-ai-carousel-prev');
    const btnAiNext = document.getElementById('btn-ai-carousel-next');

    if (btnAiPrev) {
      btnAiPrev.addEventListener('click', () => {
        sfx('click');
        this.updateAiCarousel(-1);
      });
    }
    if (btnAiNext) {
      btnAiNext.addEventListener('click', () => {
        sfx('click');
        this.updateAiCarousel(1);
      });
    }

    if (aiTrack) {
      aiTrack.addEventListener('transitionend', () => {
        if (this.aiCarouselIndex >= 22) {
          this.aiCarouselIndex -= 11;
          this.updateAiCarousel(0, true);
        } else if (this.aiCarouselIndex < 11) {
          this.aiCarouselIndex += 11;
          this.updateAiCarousel(0, true);
        }
      });

      const aiCards = aiTrack.querySelectorAll<HTMLElement>('.sp-emblem-card');
      aiCards.forEach(card => {
        card.addEventListener('click', () => {
          const idxStr = card.getAttribute('data-index');
          if (idxStr !== null) {
            sfx('click');
            this.aiCarouselIndex = parseInt(idxStr, 10);
            this.updateAiCarousel(0);
          }
        });
      });
    }

    // 3. MAP CAROUSEL
    const mapTrack = document.getElementById('maps-grid-track');
    const btnMapPrev = document.getElementById('btn-map-carousel-prev');
    const btnMapNext = document.getElementById('btn-map-carousel-next');
    const mcardRandom = document.getElementById('mcard-random');

    if (btnMapPrev) {
      btnMapPrev.addEventListener('click', () => {
        sfx('click');
        this.updateMapCarousel(-1);
      });
    }
    if (btnMapNext) {
      btnMapNext.addEventListener('click', () => {
        sfx('click');
        this.updateMapCarousel(1);
      });
    }

    if (mcardRandom) {
      mcardRandom.addEventListener('click', () => {
        sfx('click');
        this.selectMapOption('random');
      });
    }

    if (mapTrack) {
      const mapCards = mapTrack.querySelectorAll<HTMLElement>('.map-card');
      mapCards.forEach(card => {
        card.addEventListener('click', () => {
          const mapId = card.getAttribute('data-map');
          if (!mapId) return;
          sfx('click');
          this.selectMapOption(mapId);
        });
      });
    }

    // 4. MISSION SELECTION
    const mcardExtermination = document.getElementById('mcard-extermination');
    const mcardEscort = document.getElementById('mcard-escort');
    const mcardDomination = document.getElementById('mcard-domination');
    const mbadgeExtermination = document.getElementById('mbadge-extermination');
    const mbadgeEscort = document.getElementById('mbadge-escort');
    const mbadgeDomination = document.getElementById('mbadge-domination');
    const escortConfigRow = document.getElementById('escort-config-row');

    const selectMission = (m: MissionType) => {
      sfx('click');
      this.selectedMission = m;
      [mcardExtermination, mcardEscort, mcardDomination].forEach(c => c?.classList.remove('selected-mission'));
      if (mbadgeExtermination) mbadgeExtermination.style.display = m === 'extermination' ? 'block' : 'none';
      if (mbadgeEscort) mbadgeEscort.style.display = m === 'escort' ? 'block' : 'none';
      if (mbadgeDomination) mbadgeDomination.style.display = m === 'domination' ? 'block' : 'none';

      if (m === 'extermination') mcardExtermination?.classList.add('selected-mission');
      if (m === 'escort') mcardEscort?.classList.add('selected-mission');
      if (m === 'domination') mcardDomination?.classList.add('selected-mission');

      if (escortConfigRow) {
        escortConfigRow.style.display = m === 'escort' ? 'flex' : 'none';
      }
      this.updateSinglePlayerSummary();
    };

    if (mcardExtermination) mcardExtermination.addEventListener('click', () => selectMission('extermination'));
    if (mcardEscort) mcardEscort.addEventListener('click', () => selectMission('escort'));
    if (mcardDomination) mcardDomination.addEventListener('click', () => selectMission('domination'));

    // 5. ESCORT CONFIG
    const playerEscortSelect = document.getElementById('player-escort-role') as HTMLSelectElement;
    const enemyEscortSelect = document.getElementById('enemy-escort-role') as HTMLSelectElement;

    if (playerEscortSelect) {
      playerEscortSelect.addEventListener('change', () => {
        this.p1EscortRole = playerEscortSelect.value as any;
      });
    }
    if (enemyEscortSelect) {
      enemyEscortSelect.addEventListener('change', () => {
        this.p2EscortRole = enemyEscortSelect.value as any;
      });
    }

    // 6. STEPPER PILL NAVIGATION
    const pill1 = document.getElementById('sp-step-pill-1');
    const pill2 = document.getElementById('sp-step-pill-2');
    const pill3 = document.getElementById('sp-step-pill-3');

    if (pill1) pill1.addEventListener('click', () => { sfx('click'); this.setSinglePlayerStage(1); });
    if (pill2) pill2.addEventListener('click', () => { sfx('click'); this.setSinglePlayerStage(2); });
    if (pill3) pill3.addEventListener('click', () => { sfx('click'); this.setSinglePlayerStage(3); });

    // 7. TOP CLOSE BUTTON & SHARED FOOTER BUTTONS
    const btnSpClose = document.getElementById('btn-sp-close');
    if (btnSpClose) {
      btnSpClose.addEventListener('click', () => {
        sfx('click');
        this.showHomeScreen();
      });
    }

    const btnSpBack = document.getElementById('btn-sp-back');
    if (btnSpBack) {
      btnSpBack.addEventListener('click', () => {
        sfx('click');
        if (this.currentSinglePlayerStage === 1) {
          this.showHomeScreen();
        } else {
          this.setSinglePlayerStage((this.currentSinglePlayerStage - 1) as 1 | 2 | 3);
        }
      });
    }

    const btnSpNext = document.getElementById('btn-sp-next');
    if (btnSpNext) {
      btnSpNext.addEventListener('click', () => {
        sfx('click');
        if (this.currentSinglePlayerStage < 3) {
          this.setSinglePlayerStage((this.currentSinglePlayerStage + 1) as 1 | 2 | 3);
        } else {
          this.launchSkirmish();
        }
      });
    }

    // Legacy buttons support
    const btnBack = document.getElementById('btn-back-to-home');
    if (btnBack) {
      btnBack.addEventListener('click', () => {
        this.showHomeScreen();
      });
    }

    const btnConfirm = document.getElementById('btn-confirm-race');
    if (btnConfirm) {
      btnConfirm.addEventListener('click', () => {
        this.launchSkirmish();
      });
    }
  }

  private updatePlayerCarousel(delta: number, immediate: boolean = false): void {
    const playerTrack = document.getElementById('factions-track-player');
    const viewport = document.getElementById('viewport-player-wheel');
    if (!playerTrack || !viewport) return;

    this.playerCarouselIndex += delta;

    const cardWidth = 100;
    const gap = 12;
    const stride = cardWidth + gap;
    const viewportWidth = viewport.clientWidth || 360;
    const offset = (this.playerCarouselIndex * stride) - (viewportWidth / 2 - cardWidth / 2);

    if (immediate) {
      playerTrack.style.transition = 'none';
      playerTrack.style.transform = `translateX(-${offset}px)`;
      void playerTrack.offsetHeight;
      playerTrack.style.transition = 'transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)';
    } else {
      playerTrack.style.transition = 'transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)';
      playerTrack.style.transform = `translateX(-${offset}px)`;
    }

    const normIndex = ((this.playerCarouselIndex % 11) + 11) % 11;
    const race = FACTION_CYCLE[normIndex] || 'random';
    this.selectedP1Faction = race;

    this.syncPlayerCardHighlight(race);
    this.updatePlayerInfoBox(race);
    this.updateSinglePlayerSummary();
  }

  private updateAiCarousel(delta: number, immediate: boolean = false): void {
    const aiTrack = document.getElementById('factions-track-ai');
    const viewport = document.getElementById('viewport-ai-wheel');
    if (!aiTrack || !viewport) return;

    this.aiCarouselIndex += delta;

    const cardWidth = 100;
    const gap = 12;
    const stride = cardWidth + gap;
    const viewportWidth = viewport.clientWidth || 360;
    const offset = (this.aiCarouselIndex * stride) - (viewportWidth / 2 - cardWidth / 2);

    if (immediate) {
      aiTrack.style.transition = 'none';
      aiTrack.style.transform = `translateX(-${offset}px)`;
      void aiTrack.offsetHeight;
      aiTrack.style.transition = 'transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)';
    } else {
      aiTrack.style.transition = 'transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)';
      aiTrack.style.transform = `translateX(-${offset}px)`;
    }

    const normIndex = ((this.aiCarouselIndex % 11) + 11) % 11;
    const race = FACTION_CYCLE[normIndex] || 'random';
    this.selectedP2Faction = race;

    this.syncAiCardHighlight(race);
    this.updateAiInfoBox(race);
    this.updateSinglePlayerSummary();
  }

  private syncPlayerCardHighlight(race: string): void {
    const playerTrack = document.getElementById('factions-track-player');
    if (!playerTrack) return;
    const cards = playerTrack.querySelectorAll<HTMLElement>('.sp-emblem-card');
    cards.forEach(c => {
      const cRace = c.getAttribute('data-race');
      const badge = c.querySelector<HTMLElement>('.sp-emblem-badge');
      if (cRace === race) {
        c.classList.add('selected-player');
        if (badge) {
          badge.style.display = 'block';
          badge.textContent = race === 'random' ? 'AUTO' : 'SELECTED';
        }
      } else {
        c.classList.remove('selected-player');
        if (badge) badge.style.display = 'none';
      }
    });
  }

  private syncAiCardHighlight(race: string): void {
    const aiTrack = document.getElementById('factions-track-ai');
    if (!aiTrack) return;
    const cards = aiTrack.querySelectorAll<HTMLElement>('.sp-emblem-card');
    cards.forEach(c => {
      const cRace = c.getAttribute('data-race');
      const badge = c.querySelector<HTMLElement>('.sp-emblem-badge');
      if (cRace === race) {
        c.classList.add('selected-ai');
        if (badge) {
          badge.style.display = 'block';
          badge.textContent = race === 'random' ? 'AUTO' : 'SELECTED';
        }
      } else {
        c.classList.remove('selected-ai');
        if (badge) badge.style.display = 'none';
      }
    });
  }

  private updatePlayerInfoBox(race: string): void {
    const titleEl = document.getElementById('player-info-title');
    const subEl = document.getElementById('player-info-sub');
    const descEl = document.getElementById('player-info-desc');
    const doctrineEl = document.getElementById('player-info-doctrine');
    const rosterEl = document.getElementById('player-info-roster');

    if (race === 'random') {
      if (titleEl) titleEl.textContent = '🎲 RANDOM ARMY';
      if (subEl) subEl.textContent = 'DYNAMIC MYSTERY FORCE';
      if (descEl) descEl.textContent = 'Roll an unpredictable strike force dynamically upon tactical deployment. Test your command mastery across all 10 warhost factions.';
      if (doctrineEl) doctrineEl.innerHTML = '<strong>DOCTRINE:</strong> Dynamic tactical flexibility • Adapt & Conquer';
      if (rosterEl) rosterEl.innerHTML = '<span>Mystery Selection</span> • <span>All 10 Warhosts</span> • <span>Tactical Versatility</span>';
      return;
    }

    const f = FACTIONS[race];
    if (!f) return;

    if (titleEl) titleEl.textContent = `${f.icon} ${f.name.toUpperCase()}`;
    if (subEl) subEl.textContent = (f.sub || '').toUpperCase();
    if (descEl) descEl.textContent = f.desc || '';
    if (doctrineEl) doctrineEl.innerHTML = `<strong>DOCTRINE:</strong> ${f.doctrine || 'Standard Tactical Doctrine'}`;
    if (rosterEl) {
      const rosterNames = f.roster && f.roster.length > 0 ? f.roster.map(u => u.name).slice(0, 5).join(' • ') : 'Standard Unit Squads';
      rosterEl.textContent = rosterNames;
    }
  }

  private updateAiInfoBox(race: string): void {
    const titleEl = document.getElementById('ai-info-title');
    const subEl = document.getElementById('ai-info-sub');
    const descEl = document.getElementById('ai-info-desc');
    const doctrineEl = document.getElementById('ai-info-doctrine');
    const rosterEl = document.getElementById('ai-info-roster');

    if (race === 'random') {
      if (titleEl) titleEl.textContent = '🎲 RANDOM RIVAL';
      if (subEl) subEl.textContent = 'DYNAMIC MYSTERY FORCE';
      if (descEl) descEl.textContent = 'The AI overseer selects an unpredictable rival faction dynamically upon tactical deployment.';
      if (doctrineEl) doctrineEl.innerHTML = '<strong>DOCTRINE:</strong> Dynamic tactical flexibility • Adapt & Overcome';
      if (rosterEl) rosterEl.innerHTML = '<span>Mystery Selection</span> • <span>All 10 Warhosts</span> • <span>Tactical Versatility</span>';
      return;
    }

    const f = FACTIONS[race];
    if (!f) return;

    if (titleEl) titleEl.textContent = `${f.icon} ${f.name.toUpperCase()}`;
    if (subEl) subEl.textContent = (f.sub || '').toUpperCase();
    if (descEl) descEl.textContent = f.desc || '';
    if (doctrineEl) doctrineEl.innerHTML = `<strong>DOCTRINE:</strong> ${f.doctrine || 'Standard Tactical Doctrine'}`;
    if (rosterEl) {
      const rosterNames = f.roster && f.roster.length > 0 ? f.roster.map(u => u.name).slice(0, 5).join(' • ') : 'Standard Unit Squads';
      rosterEl.textContent = rosterNames;
    }
  }

  private updateMapCarousel(delta: number): void {
    const mapTrack = document.getElementById('maps-grid-track');
    if (!mapTrack) return;

    this.mapCarouselIndex += delta;
    if (this.mapCarouselIndex < 0) this.mapCarouselIndex = 19;
    if (this.mapCarouselIndex > 20) this.mapCarouselIndex = 10;

    const firstCard = mapTrack.querySelector<HTMLElement>('.map-card');
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 180;
    const offset = this.mapCarouselIndex * (cardWidth + 12);
    mapTrack.style.transform = `translateX(-${offset}px)`;
  }

  public selectMapOption(mapId: string): void {
    this.selectedTheme = mapId;

    // Clear all map selections & badges
    document.querySelectorAll('.map-card, .sticky-random-map-card').forEach(c => {
      c.classList.remove('selected-map');
      const badge = c.querySelector('.map-card-badge');
      if (badge) badge.remove();
    });

    if (mapId === 'random') {
      const card = document.getElementById('mcard-random');
      if (card) {
        card.classList.add('selected-map');
        const badge = document.createElement('div');
        badge.className = 'sp-card-badge map-card-badge';
        badge.textContent = 'AUTO';
        card.appendChild(badge);
      }
    } else {
      document.querySelectorAll(`[data-map="${mapId}"]`).forEach(card => {
        card.classList.add('selected-map');
        const badge = document.createElement('div');
        badge.className = 'sp-card-badge map-card-badge';
        badge.textContent = 'SELECTED';
        card.appendChild(badge);
      });
    }

    this.updateSinglePlayerSummary();
  }

  private deselectAllMapCards(): void {
    this.selectMapOption('random');
  }

  private launchSkirmish(): void {
    const factionKeys = [
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
    const themeKeys = [
      'jungle',
      'snow',
      'desert',
      'city',
      'tech',
      'astral',
      'corrupted',
      'devoured',
      'tomb',
      'rift'
    ];

    // Resolve Player Faction
    let finalP1Faction = this.selectedP1Faction;
    if (finalP1Faction === 'random') {
      finalP1Faction = factionKeys[Math.floor(Math.random() * factionKeys.length)];
    }

    // Resolve AI Faction
    let finalP2Faction = this.selectedP2Faction;
    if (finalP2Faction === 'random') {
      const candidates = factionKeys.filter(f => f !== finalP1Faction);
      finalP2Faction = candidates[Math.floor(Math.random() * candidates.length)] || 'forsaken';
    }

    // Resolve Theme
    let finalTheme = this.selectedTheme;
    if (finalTheme === 'random') {
      finalTheme = themeKeys[Math.floor(Math.random() * themeKeys.length)];
    }

    // Resolve Escort Roles
    let p1Role: 'escort' | 'attack' = 'escort';
    let p2Role: 'escort' | 'attack' = 'attack';

    if (this.selectedMission === 'escort') {
      if (this.p1EscortRole === 'random') {
        p1Role = Math.random() < 0.5 ? 'escort' : 'attack';
      } else {
        p1Role = this.p1EscortRole;
      }

      if (this.p2EscortRole === 'opposite') {
        p2Role = p1Role === 'escort' ? 'attack' : 'escort';
      } else if (this.p2EscortRole === 'random') {
        p2Role = Math.random() < 0.5 ? 'escort' : 'attack';
      } else {
        p2Role = this.p2EscortRole;
      }

      // If both picked the same stance, randomize
      if (p1Role === p2Role) {
        p1Role = Math.random() < 0.5 ? 'escort' : 'attack';
        p2Role = p1Role === 'escort' ? 'attack' : 'escort';
      }
    }

    this.showGameUI();

    if (this.onStartGame) {
      this.onStartGame(finalP1Faction, finalP2Faction, finalTheme, this.selectedMission, p1Role, p2Role);
    }
  }

  public updateTurnBanner(player: number, round: number, phase: string): void {
    const banner = document.getElementById('banner');
    if (banner) {
      banner.textContent = phase === 'deployment' ? 'DEPLOYMENT PHASE' : (player === 1 ? 'YOUR TURN' : 'ENEMY TURN');
      banner.className = 'banner-visible';
      setTimeout(() => {
        banner.className = '';
      }, 1400);
    }

    const roundBadge = document.getElementById('hud-round-badge');
    if (roundBadge) {
      roundBadge.textContent = `ROUND ${round} / 8`;
    }
  }

  public updateMissionHud(missionTitle: string, details: string): void {
    const titleEl = document.getElementById('hud-mission-title');
    const detailsEl = document.getElementById('hud-mission-details');
    if (titleEl) titleEl.textContent = missionTitle.toUpperCase();
    if (detailsEl) detailsEl.innerHTML = details;
  }

  public showGameOver(winner: number, message: string, onRestart: () => void): void {
    if (!this.gameOverModal) return;
    this.gameOverModal.style.display = 'flex';

    const title = document.getElementById('go-title');
    const desc = document.getElementById('go-desc');
    const btnPlayAgain = document.getElementById('btn-play-again');

    if (title) {
      title.textContent = winner === 1 ? 'VICTORY' : (winner === 2 ? 'DEFEAT' : 'STALEMATE');
      title.style.color = winner === 1 ? 'var(--gold-bright)' : '#ef4444';
    }
    if (desc) {
      desc.textContent = message;
    }
    if (btnPlayAgain) {
      btnPlayAgain.onclick = () => {
        this.gameOverModal!.style.display = 'none';
        onRestart();
      };
    }
  }
}
