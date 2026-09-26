import { FACTIONS } from '../data/factions';
import { THEMES } from '../data/themes';
import { MISSIONS, MISSION_CYCLE, getDefaultMissionSettings } from '../data/missions';
import { UNIT_DEFS } from '../data/units';
import type { MissionType, PointLimit, ArmyComposition, MatchSetup, ArmyUnitSelection, UnitDef, BattleSettings, MissionSettings } from '../data/types';
import { DEFAULT_BATTLE_SETTINGS } from '../data/settings';
import { sfx } from '../audio/synth';
import { getBiomeArtwork, getMissionArtwork } from './landscape-art';
import { InfoPanelSizer } from './panel-sizer';
import { getFactionUnits, buildAIArmy, getDefaultArmyComposition } from '../game/army-builder';

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

export const MAP_CYCLE: string[] = [
  'random',
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
  public dominationWinPoints: number = 1000;
  public vipOwner: 'player' | 'ai' = 'player';
  public p1EscortRole: 'escort' | 'attack' | 'random' = 'escort';
  public p2EscortRole: 'opposite' | 'escort' | 'attack' | 'random' = 'opposite';
  public battleSettings: BattleSettings = { ...DEFAULT_BATTLE_SETTINGS };
  public selectedPointLimit: PointLimit = 2000;
  public selectedArmyUnits: Record<string, number> = {};
  public currentArmyFaction: string = '';

  // Single Player Flow Stage (1: Faction, 2: Map, 3: Mission, 4: Battle Settings, 5: Army Composition)
  public currentSinglePlayerStage: 1 | 2 | 3 | 4 | 5 = 1;

  private playerCarouselIndex: number = 11;
  private aiCarouselIndex: number = 11;
  private mapCarouselIndex: number = 11;
  private missionCarouselIndex: number = MISSION_CYCLE.length;

  public onStartGame?: (setup: MatchSetup) => void;

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
    this.selectMissionOption(this.selectedMission || 'extermination');
    this.updateSinglePlayerSummary();

    // Reset carousel positions and sync dynamic panel sizes
    setTimeout(() => {
      this.updatePlayerCarousel(0);
      this.updateAiCarousel(0);
      this.updateMapCarousel(0);
      this.updateMissionCarousel(0);
      InfoPanelSizer.syncAllPanelHeights();
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

  public setSinglePlayerStage(stage: 1 | 2 | 3 | 4 | 5): void {
    this.currentSinglePlayerStage = stage;

    const stageFaction = document.getElementById('sp-stage-faction');
    const stageMap = document.getElementById('sp-stage-map');
    const stageMission = document.getElementById('sp-stage-mission');
    const stageSettings = document.getElementById('sp-stage-settings');
    const stageArmy = document.getElementById('sp-stage-army');

    if (stageFaction) stageFaction.style.display = stage === 1 ? 'flex' : 'none';
    if (stageMap) stageMap.style.display = stage === 2 ? 'flex' : 'none';
    if (stageMission) stageMission.style.display = stage === 3 ? 'flex' : 'none';
    if (stageSettings) stageSettings.style.display = stage === 4 ? 'flex' : 'none';
    if (stageArmy) stageArmy.style.display = stage === 5 ? 'flex' : 'none';

    // Update Stepper Pills
    const pill1 = document.getElementById('sp-step-pill-1');
    const pill2 = document.getElementById('sp-step-pill-2');
    const pill3 = document.getElementById('sp-step-pill-3');
    const pill4 = document.getElementById('sp-step-pill-4');
    const pill5 = document.getElementById('sp-step-pill-5');

    [pill1, pill2, pill3, pill4, pill5].forEach(p => p?.classList.remove('active', 'completed'));

    if (stage === 1) {
      pill1?.classList.add('active');
    } else if (stage === 2) {
      pill1?.classList.add('completed');
      pill2?.classList.add('active');
    } else if (stage === 3) {
      pill1?.classList.add('completed');
      pill2?.classList.add('completed');
      pill3?.classList.add('active');
    } else if (stage === 4) {
      pill1?.classList.add('completed');
      pill2?.classList.add('completed');
      pill3?.classList.add('completed');
      pill4?.classList.add('active');
    } else if (stage === 5) {
      pill1?.classList.add('completed');
      pill2?.classList.add('completed');
      pill3?.classList.add('completed');
      pill4?.classList.add('completed');
      pill5?.classList.add('active');
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
      if (nextText) nextText.textContent = 'NEXT: BATTLE SETTINGS';
    } else if (stage === 4) {
      if (backText) backText.textContent = 'BACK TO MISSION';
      if (nextText) nextText.textContent = 'NEXT: RECRUIT ARMY';
    } else if (stage === 5) {
      if (backText) backText.textContent = 'BACK TO SETTINGS';
      if (nextText) nextText.textContent = 'COMMENCE DEPLOYMENT ⚔️';
    }

    this.updateSinglePlayerSummary();

    if (stage === 5) {
      this.renderArmyCompositionScreen();
    }

    // Re-align carousels and sync dynamic panel sizes when entering stage
    setTimeout(() => {
      if (stage === 1) {
        this.updatePlayerCarousel(0);
        this.updateAiCarousel(0);
      }
      if (stage === 2) {
        this.updateMapCarousel(0);
      }
      if (stage === 3) {
        this.updateMissionCarousel(0);
      }
      InfoPanelSizer.syncAllPanelHeights();
    }, 40);
  }

  public updateSinglePlayerSummary(): void {
    const summaryPlayer = document.getElementById('sp-summary-player-faction');
    const summaryAi = document.getElementById('sp-summary-ai-faction');
    const summaryMap = document.getElementById('sp-summary-map');
    const summaryMission = document.getElementById('sp-summary-mission');
    const summarySettings = document.getElementById('sp-summary-settings');

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
      if (this.selectedMission === 'domination') {
        summaryMission.textContent = `Domination (${this.dominationWinPoints} VP)`;
      } else if (this.selectedMission === 'escort') {
        summaryMission.textContent = `VIP Escort (${this.vipOwner === 'player' ? 'Player' : 'AI'})`;
      } else {
        summaryMission.textContent = missionNames[this.selectedMission] || 'Extermination';
      }
    }
    if (summarySettings) {
      const turnsStr = this.battleSettings.maxTurns !== null ? `${this.battleSettings.maxTurns}R` : '∞';
      summarySettings.textContent = `${this.battleSettings.pointLimit} PTS • ${turnsStr}`;
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
    this.buildBiomeLandscapeTrack();
    const mapTrack = document.getElementById('maps-grid-track');
    const btnMapPrev = document.getElementById('btn-map-carousel-prev');
    const btnMapNext = document.getElementById('btn-map-carousel-next');

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

    if (mapTrack) {
      mapTrack.addEventListener('transitionend', () => {
        const N = MAP_CYCLE.length;
        if (this.mapCarouselIndex >= 2 * N) {
          this.mapCarouselIndex -= N;
          this.updateMapCarousel(0, true);
        } else if (this.mapCarouselIndex < N) {
          this.mapCarouselIndex += N;
          this.updateMapCarousel(0, true);
        }
      });

      const mapCards = mapTrack.querySelectorAll<HTMLElement>('.sp-landscape-card');
      mapCards.forEach(card => {
        card.addEventListener('click', () => {
          const idxStr = card.getAttribute('data-index');
          if (idxStr !== null) {
            sfx('click');
            this.mapCarouselIndex = parseInt(idxStr, 10);
            this.updateMapCarousel(0);
          }
        });
      });
    }

    // 4. MISSION CAROUSEL
    this.buildMissionLandscapeTrack();
    const missionTrack = document.getElementById('missions-grid-track');
    const btnMissionPrev = document.getElementById('btn-mission-carousel-prev');
    const btnMissionNext = document.getElementById('btn-mission-carousel-next');

    if (btnMissionPrev) {
      btnMissionPrev.addEventListener('click', () => {
        sfx('click');
        this.updateMissionCarousel(-1);
      });
    }
    if (btnMissionNext) {
      btnMissionNext.addEventListener('click', () => {
        sfx('click');
        this.updateMissionCarousel(1);
      });
    }

    if (missionTrack) {
      missionTrack.addEventListener('transitionend', () => {
        const N = MISSION_CYCLE.length;
        if (this.missionCarouselIndex >= 2 * N) {
          this.missionCarouselIndex -= N;
          this.updateMissionCarousel(0, true);
        } else if (this.missionCarouselIndex < N) {
          this.missionCarouselIndex += N;
          this.updateMissionCarousel(0, true);
        }
      });

      const missionCards = missionTrack.querySelectorAll<HTMLElement>('.sp-landscape-card');
      missionCards.forEach(card => {
        card.addEventListener('click', () => {
          const idxStr = card.getAttribute('data-index');
          if (idxStr !== null) {
            sfx('click');
            this.missionCarouselIndex = parseInt(idxStr, 10);
            this.updateMissionCarousel(0);
          }
        });
      });
    }

    // 5. MISSION-SPECIFIC CONFIG SELECTORS
    const dominationPointsSelect = document.getElementById('sp-domination-points-select') as HTMLSelectElement | null;
    if (dominationPointsSelect) {
      dominationPointsSelect.addEventListener('change', () => {
        this.dominationWinPoints = parseInt(dominationPointsSelect.value, 10) || 1000;
        this.updateSinglePlayerSummary();
      });
    }

    const vipOwnerSelect = document.getElementById('sp-vip-owner-select') as HTMLSelectElement | null;
    if (vipOwnerSelect) {
      vipOwnerSelect.addEventListener('change', () => {
        this.vipOwner = (vipOwnerSelect.value === 'ai' ? 'ai' : 'player');
        this.updateSinglePlayerSummary();
      });
    }

    // 6. STAGE 4 BATTLE SETTINGS SELECTORS
    const settingPointLimit = document.getElementById('sp-settings-point-limit') as HTMLSelectElement | null;
    if (settingPointLimit) {
      settingPointLimit.addEventListener('change', () => {
        this.battleSettings.pointLimit = parseInt(settingPointLimit.value, 10) as PointLimit;
        this.selectedPointLimit = this.battleSettings.pointLimit;
        this.updateSinglePlayerSummary();
      });
    }

    const settingMaxTurns = document.getElementById('sp-settings-max-turns') as HTMLSelectElement | null;
    if (settingMaxTurns) {
      settingMaxTurns.addEventListener('change', () => {
        const val = settingMaxTurns.value;
        this.battleSettings.maxTurns = val === 'unlimited' ? null : parseInt(val, 10);
        this.updateSinglePlayerSummary();
      });
    }

    const settingGameTime = document.getElementById('sp-settings-game-time') as HTMLSelectElement | null;
    if (settingGameTime) {
      settingGameTime.addEventListener('change', () => {
        const val = settingGameTime.value;
        this.battleSettings.maxGameTimeSeconds = val === 'unlimited' ? null : parseInt(val, 10);
        this.updateSinglePlayerSummary();
      });
    }

    const settingTurnTime = document.getElementById('sp-settings-turn-time') as HTMLSelectElement | null;
    if (settingTurnTime) {
      settingTurnTime.addEventListener('change', () => {
        const val = settingTurnTime.value;
        this.battleSettings.maxTurnTimeSeconds = val === 'unlimited' ? null : parseInt(val, 10);
        this.updateSinglePlayerSummary();
      });
    }

    // Stepper Pill Navigation
    const pill1 = document.getElementById('sp-step-pill-1');
    const pill2 = document.getElementById('sp-step-pill-2');
    const pill3 = document.getElementById('sp-step-pill-3');
    const pill4 = document.getElementById('sp-step-pill-4');
    const pill5 = document.getElementById('sp-step-pill-5');

    if (pill1) pill1.addEventListener('click', () => { sfx('click'); this.setSinglePlayerStage(1); });
    if (pill2) pill2.addEventListener('click', () => { sfx('click'); this.setSinglePlayerStage(2); });
    if (pill3) pill3.addEventListener('click', () => { sfx('click'); this.setSinglePlayerStage(3); });
    if (pill4) pill4.addEventListener('click', () => { sfx('click'); this.setSinglePlayerStage(4); });
    if (pill5) pill5.addEventListener('click', () => { sfx('click'); this.setSinglePlayerStage(5); });

    // Army Composition Screen Action Buttons
    const btnArmyReset = document.getElementById('btn-army-reset');
    if (btnArmyReset) {
      btnArmyReset.addEventListener('click', () => {
        sfx('click');
        this.selectedArmyUnits = {};
        this.renderArmyCompositionScreen();
      });
    }

    const btnArmyAutofill = document.getElementById('btn-army-autofill');
    if (btnArmyAutofill) {
      btnArmyAutofill.addEventListener('click', () => {
        sfx('click');
        const p1Faction = this.selectedP1Faction === 'random' ? 'ascendants' : this.selectedP1Faction;
        const defaultComp = getDefaultArmyComposition(p1Faction, this.battleSettings.pointLimit);
        this.selectedArmyUnits = {};
        defaultComp.units.forEach(u => {
          this.selectedArmyUnits[u.unitId] = u.quantity;
        });
        this.renderArmyCompositionScreen();
      });
    }

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
          this.setSinglePlayerStage((this.currentSinglePlayerStage - 1) as 1 | 2 | 3 | 4 | 5);
        }
      });
    }

    const btnSpNext = document.getElementById('btn-sp-next');
    if (btnSpNext) {
      btnSpNext.addEventListener('click', () => {
        sfx('click');
        if (this.currentSinglePlayerStage < 5) {
          this.setSinglePlayerStage((this.currentSinglePlayerStage + 1) as 1 | 2 | 3 | 4 | 5);
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

    // 8. DYNAMIC INFOBOX SIZING ON WINDOW RESIZE & INIT
    let resizeTimer: any = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        InfoPanelSizer.syncAllPanelHeights();
      }, 100);
    });

    InfoPanelSizer.syncAllPanelHeights();
  }

  private updatePlayerCarousel(delta: number, immediate: boolean = false): void {
    const playerTrack = document.getElementById('factions-track-player');
    const viewport = document.getElementById('viewport-player-wheel');
    if (!playerTrack || !viewport) return;

    this.playerCarouselIndex += delta;

    const cardWidth = 136;
    const gap = 14;
    const stride = cardWidth + gap;
    const viewportWidth = viewport.clientWidth || 436;
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

    this.syncPlayerCardHighlight(race, this.playerCarouselIndex);
    this.updatePlayerInfoBox(race);
    this.updateSinglePlayerSummary();
  }

  private updateAiCarousel(delta: number, immediate: boolean = false): void {
    const aiTrack = document.getElementById('factions-track-ai');
    const viewport = document.getElementById('viewport-ai-wheel');
    if (!aiTrack || !viewport) return;

    this.aiCarouselIndex += delta;

    const cardWidth = 136;
    const gap = 14;
    const stride = cardWidth + gap;
    const viewportWidth = viewport.clientWidth || 436;
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

    this.syncAiCardHighlight(race, this.aiCarouselIndex);
    this.updateAiInfoBox(race);
    this.updateSinglePlayerSummary();
  }

  private syncPlayerCardHighlight(race: string, activeIndex: number): void {
    const playerTrack = document.getElementById('factions-track-player');
    if (!playerTrack) return;
    const cards = playerTrack.querySelectorAll<HTMLElement>('.sp-emblem-card');
    cards.forEach(c => {
      const idx = parseInt(c.getAttribute('data-index') || '-1', 10);
      if (idx === activeIndex) {
        c.classList.add('selected-player');
      } else {
        c.classList.remove('selected-player');
      }
    });
  }

  private syncAiCardHighlight(race: string, activeIndex: number): void {
    const aiTrack = document.getElementById('factions-track-ai');
    if (!aiTrack) return;
    const cards = aiTrack.querySelectorAll<HTMLElement>('.sp-emblem-card');
    cards.forEach(c => {
      const idx = parseInt(c.getAttribute('data-index') || '-1', 10);
      if (idx === activeIndex) {
        c.classList.add('selected-ai');
      } else {
        c.classList.remove('selected-ai');
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

  private buildBiomeLandscapeTrack(): void {
    const mapTrack = document.getElementById('maps-grid-track');
    if (!mapTrack) return;
    mapTrack.innerHTML = '';

    const N = MAP_CYCLE.length;
    // Build 3 sets of clones (Set 0: 0..N-1, Set 1: N..2N-1, Set 2: 2N..3N-1)
    for (let set = 0; set < 3; set++) {
      MAP_CYCLE.forEach((themeId, idx) => {
        const globalIdx = set * N + idx;
        const theme = themeId === 'random' ? { name: 'Random Biome', icon: '🎲' } : THEMES[themeId] || { name: themeId, icon: '🌐' };
        const card = document.createElement('div');
        card.className = `sp-landscape-card ${globalIdx === this.mapCarouselIndex ? 'selected-map' : ''}`;
        card.setAttribute('data-map', themeId);
        card.setAttribute('data-index', globalIdx.toString());
        card.title = theme.name;

        card.innerHTML = `
          <div class="sp-landscape-thumb">
            ${getBiomeArtwork(themeId)}
          </div>
          <div class="sp-landscape-label-bar">
            <span class="sp-landscape-icon">${theme.icon}</span>
            <span class="sp-landscape-name">${theme.name}</span>
          </div>
        `;
        mapTrack.appendChild(card);
      });
    }
  }

  private buildMissionLandscapeTrack(): void {
    const missionTrack = document.getElementById('missions-grid-track');
    if (!missionTrack) return;
    missionTrack.innerHTML = '';

    const N = MISSION_CYCLE.length;
    // Build 3 sets of clones (Set 0: 0..N-1, Set 1: N..2N-1, Set 2: 2N..3N-1)
    for (let set = 0; set < 3; set++) {
      MISSION_CYCLE.forEach((mId, idx) => {
        const globalIdx = set * N + idx;
        const mDef = MISSIONS[mId] || { name: mId, icon: '⚔️' };
        const card = document.createElement('div');
        card.className = `sp-landscape-card ${globalIdx === this.missionCarouselIndex ? 'selected-mission' : ''}`;
        card.setAttribute('data-mission', mId);
        card.setAttribute('data-index', globalIdx.toString());
        card.title = mDef.name;

        card.innerHTML = `
          <div class="sp-landscape-thumb">
            ${getMissionArtwork(mId)}
          </div>
          <div class="sp-landscape-label-bar">
            <span class="sp-landscape-icon">${mDef.icon}</span>
            <span class="sp-landscape-name">${mDef.name}</span>
          </div>
        `;
        missionTrack.appendChild(card);
      });
    }
  }

  private updateMapCarousel(delta: number, immediate: boolean = false): void {
    const mapTrack = document.getElementById('maps-grid-track');
    const viewport = document.getElementById('viewport-map-wheel');
    if (!mapTrack || !viewport) return;

    this.mapCarouselIndex += delta;

    const cardWidth = 260;
    const gap = 18;
    const stride = cardWidth + gap;
    const viewportWidth = viewport.clientWidth || 816;
    const offset = (this.mapCarouselIndex * stride) - (viewportWidth / 2 - cardWidth / 2);

    if (immediate) {
      mapTrack.style.transition = 'none';
      mapTrack.style.transform = `translateX(-${offset}px)`;
      void mapTrack.offsetHeight;
      mapTrack.style.transition = 'transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)';
    } else {
      mapTrack.style.transition = 'transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)';
      mapTrack.style.transform = `translateX(-${offset}px)`;
    }

    const N = MAP_CYCLE.length;
    const normIndex = ((this.mapCarouselIndex % N) + N) % N;
    const themeId = MAP_CYCLE[normIndex] || 'random';
    this.selectedTheme = themeId;

    this.syncMapCardHighlight(themeId, this.mapCarouselIndex);
    this.updateMapInfoBox(themeId);
    this.updateSinglePlayerSummary();
  }

  private syncMapCardHighlight(themeId: string, activeIndex: number): void {
    const mapTrack = document.getElementById('maps-grid-track');
    if (!mapTrack) return;
    const cards = mapTrack.querySelectorAll<HTMLElement>('.sp-landscape-card');
    cards.forEach(c => {
      const idx = parseInt(c.getAttribute('data-index') || '-1', 10);
      if (idx === activeIndex) {
        c.classList.add('selected-map');
      } else {
        c.classList.remove('selected-map');
      }
    });
  }

  private updateMapInfoBox(themeId: string): void {
    const titleEl = document.getElementById('map-info-title');
    const subEl = document.getElementById('map-info-sub');
    const descEl = document.getElementById('map-info-desc');
    const atmosphereEl = document.getElementById('map-info-atmosphere');
    const featuresEl = document.getElementById('map-info-features');

    if (themeId === 'random') {
      if (titleEl) titleEl.textContent = '🎲 RANDOM BIOME';
      if (subEl) subEl.textContent = 'DYNAMIC MYSTERY THEATER';
      if (descEl) descEl.textContent = 'Deploy into an unpredictable planetary theater with dynamic terrain obstacles, tactical hazards, and shifting environmental atmospheric conditions.';
      if (atmosphereEl) atmosphereEl.innerHTML = '<strong>ATMOSPHERE:</strong> Dynamic Environmental Conditions • Adapt to Field Terrain';
      if (featuresEl) featuresEl.innerHTML = '<span>Unpredictable Obstacles</span> • <span>Variable Line of Sight</span> • <span>Dynamic Cover</span>';
      return;
    }

    const t = THEMES[themeId];
    if (!t) return;

    if (titleEl) titleEl.textContent = `${t.icon} ${t.name.toUpperCase()}`;
    if (subEl) subEl.textContent = (t.subtitle || '').toUpperCase();
    if (descEl) descEl.textContent = t.desc || '';
    if (atmosphereEl) {
      const weatherText = t.particleType === 'rain' ? 'Torrential Acid Rain & Low Light' :
                          t.particleType === 'snow' ? 'Sub-Zero Blizzard & Permafrost Hazards' :
                          t.particleType === 'sand' ? 'Blinding Sandstorms & Solar Thermal Heat' :
                          t.particleType === 'stars' ? 'Zero-G Void Conditions & Solar Radiation' :
                          t.particleType === 'astral' ? 'Harmonic Ley Resonances & Prismatic Aura' :
                          t.particleType === 'corruption' ? 'Corrosive Spores & Mutagenic Bio-Toxins' :
                          t.particleType === 'acid' ? 'Atmospheric Digestive Vapors & Caustic Mists' :
                          t.particleType === 'gauss' ? 'Gauss Energy Static & Electromagnetic Flux' :
                          t.particleType === 'rift' ? 'Warp Fire Storms & Dimensional Grav-Anomalies' :
                          'Industrial Smog & Low Atmospheric Visibility';
      atmosphereEl.innerHTML = `<strong>ATMOSPHERE:</strong> ${weatherText}`;
    }
    if (featuresEl) {
      const obstacleMap: Record<string, string> = {
        jungle: 'Ancient Titan Ribs • Bio-Spores • Overgrown Temple Ruins',
        snow: 'Glacial Ice Walls • Sub-Zero Chasms • Frozen Relic Outposts',
        desert: 'Fossil Ash Dunes • Canyon Spires • Sunken Vault Ruins',
        city: 'Reinforced Hab-Blocks • Blast Barricades • Gothic Street Avenues',
        tech: 'Orbital Bulkheads • Reactor Cores • Power Conduit Relays',
        astral: 'Prismatic Monoliths • Crystal Clusters • Harmonic Leylines',
        corrupted: 'Mutated Flesh Altars • Barbed Spines • Mutated Tendrils',
        devoured: 'Acid Digestion Pits • Chitin Spires • Subterranean Ducts',
        tomb: 'Gauss Crypt Pylons • Living-Metal Monoliths • Tomb Portals',
        rift: 'Basalt Magma Crags • Dimensional Tears • Molten Void Fissures'
      };
      featuresEl.textContent = obstacleMap[themeId] || 'Dense Tactical Cover • Strategic Obstacles';
    }
  }

  public selectMapOption(mapId: string): void {
    const idx = MAP_CYCLE.indexOf(mapId);
    if (idx !== -1) {
      this.mapCarouselIndex = MAP_CYCLE.length + idx;
      this.updateMapCarousel(0);
    }
  }

  private updateMissionCarousel(delta: number, immediate: boolean = false): void {
    const missionTrack = document.getElementById('missions-grid-track');
    const viewport = document.getElementById('viewport-mission-wheel');
    if (!missionTrack || !viewport) return;

    this.missionCarouselIndex += delta;

    const cardWidth = 260;
    const gap = 18;
    const stride = cardWidth + gap;
    const viewportWidth = viewport.clientWidth || 816;
    const offset = (this.missionCarouselIndex * stride) - (viewportWidth / 2 - cardWidth / 2);

    if (immediate) {
      missionTrack.style.transition = 'none';
      missionTrack.style.transform = `translateX(-${offset}px)`;
      void missionTrack.offsetHeight;
      missionTrack.style.transition = 'transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)';
    } else {
      missionTrack.style.transition = 'transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)';
      missionTrack.style.transform = `translateX(-${offset}px)`;
    }

    const N = MISSION_CYCLE.length;
    const normIndex = ((this.missionCarouselIndex % N) + N) % N;
    const mId = MISSION_CYCLE[normIndex] || 'extermination';
    this.selectedMission = mId;

    this.syncMissionCardHighlight(mId, this.missionCarouselIndex);
    this.updateMissionInfoBox(mId);
    this.updateSinglePlayerSummary();
  }

  private syncMissionCardHighlight(missionId: string, activeIndex: number): void {
    const missionTrack = document.getElementById('missions-grid-track');
    if (!missionTrack) return;
    const cards = missionTrack.querySelectorAll<HTMLElement>('.sp-landscape-card');
    cards.forEach(c => {
      const idx = parseInt(c.getAttribute('data-index') || '-1', 10);
      if (idx === activeIndex) {
        c.classList.add('selected-mission');
      } else {
        c.classList.remove('selected-mission');
      }
    });
  }

  private updateMissionInfoBox(missionId: string): void {
    const titleEl = document.getElementById('mission-info-title');
    const subEl = document.getElementById('mission-info-sub');
    const descEl = document.getElementById('mission-info-desc');
    const paramsEl = document.getElementById('mission-info-params');
    const featuresEl = document.getElementById('mission-info-features');
    const dominationConfigRow = document.getElementById('domination-config-row');
    const vipOwnerConfigRow = document.getElementById('vip-owner-config-row');

    const m = MISSIONS[missionId];
    if (!m) return;

    if (titleEl) titleEl.textContent = `${m.icon} ${m.name.toUpperCase()}`;
    if (subEl) subEl.textContent = (m.subtitle || '').toUpperCase();
    if (descEl) descEl.textContent = m.desc || '';
    if (paramsEl) paramsEl.innerHTML = `<strong>PARAMETERS:</strong> ${m.params}`;
    if (featuresEl) featuresEl.textContent = m.features;

    if (dominationConfigRow) {
      dominationConfigRow.style.display = missionId === 'domination' ? 'flex' : 'none';
    }
    if (vipOwnerConfigRow) {
      vipOwnerConfigRow.style.display = missionId === 'escort' ? 'flex' : 'none';
    }
  }

  public selectMissionOption(missionId: MissionType): void {
    const idx = MISSION_CYCLE.indexOf(missionId);
    if (idx !== -1) {
      this.missionCarouselIndex = MISSION_CYCLE.length + idx;
      this.updateMissionCarousel(0);
    }
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
    const p1Role: 'escort' | 'attack' = this.vipOwner === 'player' ? 'escort' : 'attack';
    const p2Role: 'escort' | 'attack' = this.vipOwner === 'player' ? 'attack' : 'escort';

    // Construct authoritative typed MissionSettings
    let missionSettings: MissionSettings;
    if (this.selectedMission === 'domination') {
      missionSettings = {
        type: 'domination',
        dominationWinPoints: this.dominationWinPoints || 1000
      };
    } else if (this.selectedMission === 'escort') {
      missionSettings = {
        type: 'vip_escort',
        vipOwner: this.vipOwner || 'player'
      };
    } else {
      missionSettings = {
        type: 'extermination'
      };
    }

    // Build Player ArmyComposition
    const playerUnitSelections: ArmyUnitSelection[] = Object.entries(this.selectedArmyUnits)
      .filter(([_, qty]) => qty > 0)
      .map(([unitId, quantity]) => ({ unitId, quantity }));

    let playerTotalPoints = 0;
    playerUnitSelections.forEach(sel => {
      const uDef = UNIT_DEFS[sel.unitId];
      if (uDef) playerTotalPoints += (uDef.points || 200) * sel.quantity;
    });

    const activePointLimit = this.battleSettings.pointLimit;

    // Fallback if empty
    let playerArmy: ArmyComposition;
    if (playerUnitSelections.length === 0) {
      playerArmy = buildAIArmy(finalP1Faction, activePointLimit);
    } else {
      playerArmy = {
        factionId: finalP1Faction,
        units: playerUnitSelections,
        totalPoints: playerTotalPoints
      };
    }

    // Build AI Army independently
    const aiArmy = buildAIArmy(finalP2Faction, activePointLimit);

    const setup: MatchSetup = {
      p1Faction: finalP1Faction,
      p2Faction: finalP2Faction,
      theme: finalTheme,
      mission: this.selectedMission,
      missionSettings,
      pointLimit: activePointLimit,
      battleSettings: { ...this.battleSettings },
      p1EscortRole: p1Role,
      p2EscortRole: p2Role,
      playerArmy,
      aiArmy
    };

    this.showGameUI();

    if (this.onStartGame) {
      this.onStartGame(setup);
    }
  }

  public renderArmyCompositionScreen(): void {
    const p1Faction = this.selectedP1Faction === 'random' ? 'ascendants' : this.selectedP1Faction;
    const availableUnits = getFactionUnits(p1Faction);
    const factionDef = FACTIONS[p1Faction] || FACTIONS.ascendants;
    const activePointLimit = this.battleSettings.pointLimit;
    this.selectedPointLimit = activePointLimit;

    // If faction changed or not initialized, populate default army
    if (this.currentArmyFaction !== p1Faction || Object.keys(this.selectedArmyUnits).length === 0) {
      this.currentArmyFaction = p1Faction;
      const defaultComp = getDefaultArmyComposition(p1Faction, activePointLimit);
      this.selectedArmyUnits = {};
      defaultComp.units.forEach(u => {
        this.selectedArmyUnits[u.unitId] = u.quantity;
      });
    }

    // Calculate points
    let pointsUsed = 0;
    let totalSquads = 0;
    let totalModels = 0;

    availableUnits.forEach(u => {
      const qty = this.selectedArmyUnits[u.type] || 0;
      if (qty > 0) {
        pointsUsed += (u.points || 200) * qty;
        totalSquads += qty;
        totalModels += (u.squadSize || 1) * qty;
      }
    });

    const pointsRemaining = activePointLimit - pointsUsed;

    // Update Faction Badge
    const badgeEl = document.getElementById('sp-army-faction-badge');
    if (badgeEl) {
      badgeEl.textContent = this.selectedP1Faction === 'random' ? 'RANDOM (DEFAULT: ASCENDANTS)' : (factionDef.name || p1Faction).toUpperCase();
    }

    // Update Budget Stats Bar
    const limitVal = document.getElementById('sp-army-limit-val');
    const usedVal = document.getElementById('sp-army-used-val');
    const remVal = document.getElementById('sp-army-rem-val');
    const progBar = document.getElementById('sp-army-progress-bar');

    if (limitVal) limitVal.textContent = `${activePointLimit} PTS`;
    if (usedVal) {
      usedVal.textContent = `${pointsUsed} / ${activePointLimit}`;
      usedVal.className = `sp-budget-val used ${pointsUsed > activePointLimit ? 'over' : ''}`;
    }
    if (remVal) {
      remVal.textContent = `${pointsRemaining} PTS`;
      remVal.className = `sp-budget-val remaining ${pointsRemaining < 0 ? 'over' : ''}`;
    }
    if (progBar) {
      const pct = Math.min(100, Math.max(0, (pointsUsed / activePointLimit) * 100));
      progBar.style.width = `${pct}%`;
      if (pointsUsed > activePointLimit) {
        progBar.classList.add('over');
      } else {
        progBar.classList.remove('over');
      }
    }

    // Render Available Recruits Grid
    const gridEl = document.getElementById('sp-army-units-grid');
    if (gridEl) {
      gridEl.innerHTML = '';
      availableUnits.forEach(u => {
        const qty = this.selectedArmyUnits[u.type] || 0;
        const canAffordMore = (u.points || 200) <= pointsRemaining;
        const role = u.role ? u.role.toUpperCase() : (u.isCharacter ? 'COMMANDER' : u.isLarge ? 'HEAVY ENGINE' : 'SQUAD');

        const card = document.createElement('div');
        card.className = `sp-army-unit-card ${qty > 0 ? 'active-selected' : ''}`;
        card.innerHTML = `
          <div class="sp-army-card-header">
            <div class="sp-army-card-identity">
              <span class="sp-army-card-icon">${u.icon || '⚔️'}</span>
              <div class="sp-army-card-name-group">
                <span class="sp-army-card-name">${u.name}</span>
                <span class="sp-army-card-role">${role}</span>
              </div>
            </div>
            <span class="sp-army-card-pts">${u.points || 200} PTS</span>
          </div>
          <div class="sp-army-card-weapon">🗡️ ${u.weapon || 'Standard Arms'}</div>
          <div class="sp-army-card-stats">
            <div class="sp-army-stat-chip">
              <span class="sp-army-stat-lbl">M</span>
              <span class="sp-army-stat-val">${u.m || 6}"</span>
            </div>
            <div class="sp-army-stat-chip">
              <span class="sp-army-stat-lbl">R</span>
              <span class="sp-army-stat-val">${u.range || 18}"</span>
            </div>
            <div class="sp-army-stat-chip">
              <span class="sp-army-stat-lbl">DMG</span>
              <span class="sp-army-stat-val">${u.dmg || 2}</span>
            </div>
            <div class="sp-army-stat-chip">
              <span class="sp-army-stat-lbl">HP</span>
              <span class="sp-army-stat-val">${u.hp || 5}</span>
            </div>
            <div class="sp-army-stat-chip">
              <span class="sp-army-stat-lbl">SV</span>
              <span class="sp-army-stat-val">${u.sv || 3}+</span>
            </div>
          </div>
          <div class="sp-army-card-footer">
            <span class="sp-army-squad-size">${u.squadSize || 1} model${(u.squadSize || 1) > 1 ? 's' : ''}/squad</span>
            <div class="sp-army-card-counter">
              <button class="sp-army-counter-btn btn-dec" data-unit="${u.type}" ${qty === 0 ? 'disabled' : ''}>−</button>
              <span class="sp-army-counter-val">${qty}</span>
              <button class="sp-army-counter-btn btn-inc" data-unit="${u.type}" ${!canAffordMore ? 'disabled' : ''}>+</button>
            </div>
          </div>
        `;

        const btnDec = card.querySelector('.btn-dec');
        const btnInc = card.querySelector('.btn-inc');

        btnDec?.addEventListener('click', () => {
          if ((this.selectedArmyUnits[u.type] || 0) > 0) {
            sfx('click');
            this.selectedArmyUnits[u.type] = (this.selectedArmyUnits[u.type] || 0) - 1;
            this.renderArmyCompositionScreen();
          }
        });

        btnInc?.addEventListener('click', () => {
          if (canAffordMore) {
            sfx('click');
            this.selectedArmyUnits[u.type] = (this.selectedArmyUnits[u.type] || 0) + 1;
            this.renderArmyCompositionScreen();
          }
        });

        gridEl.appendChild(card);
      });
    }

    // Render Selected Summary List
    const listEl = document.getElementById('sp-army-selected-list');
    if (listEl) {
      listEl.innerHTML = '';
      const activeSelections = availableUnits.filter(u => (this.selectedArmyUnits[u.type] || 0) > 0);

      if (activeSelections.length === 0) {
        listEl.innerHTML = `
          <div class="sp-army-empty-notice">
            <span>🛡️</span>
            <div class="empty-title">NO SQUADS RECRUITED</div>
            <div class="empty-sub">Choose units from the available roster to assemble your tactical strike force.</div>
          </div>
        `;
      } else {
        activeSelections.forEach(u => {
          const qty = this.selectedArmyUnits[u.type] || 0;
          const ptsTotal = (u.points || 200) * qty;

          const item = document.createElement('div');
          item.className = 'sp-army-selected-item';
          item.innerHTML = `
            <div class="sp-army-item-info">
              <span class="sp-army-item-name">${u.name}</span>
              <span class="sp-army-item-calc">${qty} squad${qty > 1 ? 's' : ''} × ${u.points || 200} pts (${qty * (u.squadSize || 1)} models)</span>
            </div>
            <div class="sp-army-item-right">
              <span class="sp-army-item-pts">${ptsTotal} PTS</span>
              <button class="sp-army-item-btn-remove" data-unit="${u.type}" title="Remove one squad">✕</button>
            </div>
          `;

          const btnRemove = item.querySelector('.sp-army-item-btn-remove');
          btnRemove?.addEventListener('click', () => {
            if ((this.selectedArmyUnits[u.type] || 0) > 0) {
              sfx('click');
              this.selectedArmyUnits[u.type] = (this.selectedArmyUnits[u.type] || 0) - 1;
              this.renderArmyCompositionScreen();
            }
          });

          listEl.appendChild(item);
        });
      }
    }

    // Update Summary Footer Stats
    const totalSquadsEl = document.getElementById('sp-army-total-squads');
    const totalModelsEl = document.getElementById('sp-army-total-models');
    const pctEl = document.getElementById('sp-army-total-pts-pct');

    if (totalSquadsEl) totalSquadsEl.textContent = totalSquads.toString();
    if (totalModelsEl) totalModelsEl.textContent = totalModels.toString();
    if (pctEl) {
      const pct = Math.round((pointsUsed / activePointLimit) * 100);
      pctEl.textContent = `${pct}% (${pointsUsed}/${activePointLimit} pts)`;
    }

    // Validate Next Button
    const nextBtn = document.getElementById('btn-sp-next') as HTMLButtonElement | null;
    if (nextBtn && this.currentSinglePlayerStage === 5) {
      const isValid = pointsUsed > 0 && pointsUsed <= activePointLimit;
      nextBtn.disabled = !isValid;
      nextBtn.style.opacity = isValid ? '1' : '0.5';
      nextBtn.style.cursor = isValid ? 'pointer' : 'not-allowed';
    }
  }

  public updateTurnBanner(player: number, round: number, phase: string, maxTurns: number | null = 40): void {
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
      const maxStr = maxTurns !== null ? maxTurns.toString() : '∞';
      roundBadge.textContent = `ROUND ${round} / ${maxStr}`;
    }
  }

  public updateBattleHudTimers(
    turnTimeRemaining: number | null,
    elapsedGameTime: number,
    maxGameTime: number | null,
    currentRound: number,
    maxTurns: number | null
  ): void {
    const roundBadge = document.getElementById('hud-round-badge');
    if (roundBadge) {
      const maxTStr = maxTurns !== null ? maxTurns.toString() : '∞';
      roundBadge.textContent = `ROUND ${currentRound} / ${maxTStr}`;
    }

    const turnTimer = document.getElementById('hud-turn-timer');
    if (turnTimer) {
      if (turnTimeRemaining === null) {
        turnTimer.textContent = '⏳ ∞';
        turnTimer.classList.remove('warning');
      } else {
        const sec = Math.max(0, Math.ceil(turnTimeRemaining));
        turnTimer.textContent = `⏳ ${sec}s`;
        if (sec <= 15) {
          turnTimer.classList.add('warning');
        } else {
          turnTimer.classList.remove('warning');
        }
      }
    }

    const gameTimer = document.getElementById('hud-game-timer');
    if (gameTimer) {
      const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60).toString().padStart(2, '0');
        const s = Math.floor(secs % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
      };

      const elapsedStr = formatTime(elapsedGameTime);
      const maxStr = maxGameTime !== null ? formatTime(maxGameTime) : '∞';
      gameTimer.textContent = `⏱️ ${elapsedStr} / ${maxStr}`;
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
