import { FACTIONS } from '../data/factions';
import { THEMES } from '../data/themes';
import { UNIT_DEFS } from '../data/units';
import type { MissionType } from '../data/types';

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

  private raceCarouselIndex: number = 10;
  private mapCarouselIndex: number = 5;

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
        this.showRaceModal();
      });
    }

    const btnLearnMore = document.getElementById('btn-start-learn');
    if (btnLearnMore) {
      btnLearnMore.addEventListener('click', () => {
        this.showLearnModal();
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
    
    this.selectMapOption(this.selectedTheme || 'random');

    // Reset carousel positions
    setTimeout(() => {
      this.updateRaceCarousel(0);
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

    const heroSectionHtml = faction.image ? `
      <div class="dossier-hero-row">
        <div class="dossier-image-container">
          <img src="${faction.image}" alt="${faction.name}" class="dossier-faction-img" />
        </div>
        <div class="dossier-info-col">
          <div class="dossier-header">
            <div class="dossier-icon">${faction.icon}</div>
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
        <div class="dossier-icon">${faction.icon}</div>
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

  private initRaceModal(): void {
    // 1. FACTION CAROUSEL
    const raceTrack = document.getElementById('factions-grid-track');
    const btnRacePrev = document.getElementById('btn-race-carousel-prev');
    const btnRaceNext = document.getElementById('btn-race-carousel-next');
    const fcardRandom = document.getElementById('fcard-random');
    const fbadgeRandom = document.getElementById('fbadge-random');

    if (btnRacePrev) {
      btnRacePrev.addEventListener('click', () => this.updateRaceCarousel(-1));
    }
    if (btnRaceNext) {
      btnRaceNext.addEventListener('click', () => this.updateRaceCarousel(1));
    }

    if (fcardRandom) {
      fcardRandom.addEventListener('click', () => {
        this.selectedP1Faction = 'random';
        this.deselectAllFactionCards();
        fcardRandom.classList.add('selected-player');
        if (fbadgeRandom) fbadgeRandom.style.display = 'block';
      });
    }

    if (raceTrack) {
      const factionCards = raceTrack.querySelectorAll<HTMLElement>('.faction-card');
      factionCards.forEach(card => {
        card.addEventListener('click', () => {
          const race = card.getAttribute('data-race');
          if (!race) return;
          this.selectedP1Faction = race;
          this.deselectAllFactionCards();
          card.classList.add('selected-player');
          const badge = card.querySelector<HTMLElement>('.faction-card-badge');
          if (badge) badge.style.display = 'block';
        });
      });
    }

    // 2. MAP CAROUSEL
    const mapTrack = document.getElementById('maps-grid-track');
    const btnMapPrev = document.getElementById('btn-map-carousel-prev');
    const btnMapNext = document.getElementById('btn-map-carousel-next');
    const mcardRandom = document.getElementById('mcard-random');

    if (btnMapPrev) {
      btnMapPrev.addEventListener('click', () => this.updateMapCarousel(-1));
    }
    if (btnMapNext) {
      btnMapNext.addEventListener('click', () => this.updateMapCarousel(1));
    }

    if (mcardRandom) {
      mcardRandom.addEventListener('click', () => {
        this.selectMapOption('random');
      });
    }

    if (mapTrack) {
      const mapCards = mapTrack.querySelectorAll<HTMLElement>('.map-card');
      mapCards.forEach(card => {
        card.addEventListener('click', () => {
          const mapId = card.getAttribute('data-map');
          if (!mapId) return;
          this.selectMapOption(mapId);
        });
      });
    }

    // 3. MISSION SELECTION
    const mcardExtermination = document.getElementById('mcard-extermination');
    const mcardEscort = document.getElementById('mcard-escort');
    const mcardDomination = document.getElementById('mcard-domination');
    const mbadgeExtermination = document.getElementById('mbadge-extermination');
    const mbadgeEscort = document.getElementById('mbadge-escort');
    const mbadgeDomination = document.getElementById('mbadge-domination');
    const escortConfigRow = document.getElementById('escort-config-row');

    const selectMission = (m: MissionType) => {
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
    };

    if (mcardExtermination) mcardExtermination.addEventListener('click', () => selectMission('extermination'));
    if (mcardEscort) mcardEscort.addEventListener('click', () => selectMission('escort'));
    if (mcardDomination) mcardDomination.addEventListener('click', () => selectMission('domination'));

    // 4. ESCORT CONFIG
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

    // 5. BUTTONS: BACK TO HOME & CONFIRM
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

  private updateRaceCarousel(delta: number): void {
    const raceTrack = document.getElementById('factions-grid-track');
    if (!raceTrack) return;

    this.raceCarouselIndex += delta;
    if (this.raceCarouselIndex < 0) this.raceCarouselIndex = 19;
    if (this.raceCarouselIndex > 20) this.raceCarouselIndex = 10;

    const firstCard = raceTrack.querySelector<HTMLElement>('.faction-card');
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 220;
    const offset = this.raceCarouselIndex * (cardWidth + 12);
    raceTrack.style.transform = `translateX(-${offset}px)`;
  }

  private updateMapCarousel(delta: number): void {
    const mapTrack = document.getElementById('maps-grid-track');
    if (!mapTrack) return;

    this.mapCarouselIndex += delta;
    if (this.mapCarouselIndex < 0) this.mapCarouselIndex = 9;
    if (this.mapCarouselIndex > 10) this.mapCarouselIndex = 5;

    const firstCard = mapTrack.querySelector<HTMLElement>('.map-card');
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 180;
    const offset = this.mapCarouselIndex * (cardWidth + 12);
    mapTrack.style.transform = `translateX(-${offset}px)`;
  }

  private deselectAllFactionCards(): void {
    const fcardRandom = document.getElementById('fcard-random');
    const fbadgeRandom = document.getElementById('fbadge-random');
    if (fcardRandom) fcardRandom.classList.remove('selected-player');
    if (fbadgeRandom) fbadgeRandom.style.display = 'none';

    const raceTrack = document.getElementById('factions-grid-track');
    if (raceTrack) {
      raceTrack.querySelectorAll<HTMLElement>('.faction-card').forEach(c => {
        c.classList.remove('selected-player');
        const b = c.querySelector<HTMLElement>('.faction-card-badge');
        if (b) b.style.display = 'none';
      });
    }
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
        badge.className = 'map-card-badge';
        badge.textContent = 'AUTO';
        card.appendChild(badge);
      }
    } else {
      document.querySelectorAll(`[data-map="${mapId}"]`).forEach(card => {
        card.classList.add('selected-map');
        const badge = document.createElement('div');
        badge.className = 'map-card-badge';
        badge.textContent = 'SELECTED';
        card.appendChild(badge);
      });
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
    const themeKeys = ['jungle', 'desert', 'snow', 'city', 'tech'];

    // Resolve Player Faction
    let finalP1Faction = this.selectedP1Faction;
    if (finalP1Faction === 'random') {
      finalP1Faction = factionKeys[Math.floor(Math.random() * factionKeys.length)];
    }

    // Resolve AI Faction
    const aiSelect = document.getElementById('ai-race-select') as HTMLSelectElement;
    let finalP2Faction = aiSelect ? aiSelect.value : 'random';
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
