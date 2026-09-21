import { FACTIONS } from '../data/factions';
import { THEMES } from '../data/themes';
import type { MissionType } from '../data/types';

export class DOMManager {
  // Screens & Modals
  public homeScreen: HTMLElement | null;
  public raceModal: HTMLElement | null;
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

  private raceCarouselIndex: number = 8;
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
    this.uiLayer = document.getElementById('ui-layer');
    this.missionHudBar = document.getElementById('mission-hud-bar');
    this.gameOverModal = document.getElementById('game-over-modal');

    this.initHomeScreen();
    this.initRaceModal();
  }

  private initHomeScreen(): void {
    const btnSinglePlayer = document.getElementById('btn-start-singleplayer');
    if (btnSinglePlayer) {
      btnSinglePlayer.addEventListener('click', () => {
        this.showRaceModal();
      });
    }
  }

  public showHomeScreen(): void {
    if (this.homeScreen) this.homeScreen.style.display = 'flex';
    if (this.raceModal) this.raceModal.style.display = 'none';
    if (this.uiLayer) this.uiLayer.style.display = 'none';
    if (this.missionHudBar) this.missionHudBar.style.display = 'none';
  }

  public showRaceModal(): void {
    if (this.homeScreen) this.homeScreen.style.display = 'none';
    if (this.raceModal) this.raceModal.style.display = 'flex';
    if (this.uiLayer) this.uiLayer.style.display = 'none';
    if (this.missionHudBar) this.missionHudBar.style.display = 'none';
    
    // Reset carousel positions
    setTimeout(() => {
      this.updateRaceCarousel(0);
      this.updateMapCarousel(0);
    }, 50);
  }

  public showGameUI(): void {
    if (this.homeScreen) this.homeScreen.style.display = 'none';
    if (this.raceModal) this.raceModal.style.display = 'none';
    if (this.uiLayer) this.uiLayer.style.display = 'flex';
    if (this.missionHudBar) this.missionHudBar.style.display = 'flex';
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
        this.selectedTheme = 'random';
        this.deselectAllMapCards();
        mcardRandom.classList.add('selected-map');
      });
    }

    if (mapTrack) {
      const mapCards = mapTrack.querySelectorAll<HTMLElement>('.map-card');
      mapCards.forEach(card => {
        card.addEventListener('click', () => {
          const mapId = card.getAttribute('data-map');
          if (!mapId) return;
          this.selectedTheme = mapId;
          this.deselectAllMapCards();
          card.classList.add('selected-map');
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
    if (this.raceCarouselIndex < 0) this.raceCarouselIndex = 15;
    if (this.raceCarouselIndex > 16) this.raceCarouselIndex = 8;

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

  private deselectAllMapCards(): void {
    const mcardRandom = document.getElementById('mcard-random');
    if (mcardRandom) mcardRandom.classList.remove('selected-map');

    const mapTrack = document.getElementById('maps-grid-track');
    if (mapTrack) {
      mapTrack.querySelectorAll<HTMLElement>('.map-card').forEach(c => {
        c.classList.remove('selected-map');
      });
    }
  }

  private launchSkirmish(): void {
    const factionKeys = ['marines', 'chaos', 'orcs', 'necros', 'eldar', 'dark_eldar', 'tyranids', 'tau'];
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
      finalP2Faction = candidates[Math.floor(Math.random() * candidates.length)] || 'chaos';
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
