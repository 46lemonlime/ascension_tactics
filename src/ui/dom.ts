import { FACTIONS } from '../data/factions';
import { THEMES } from '../data/themes';
import type { MissionType } from '../data/types';

export class DOMManager {
  // Screens
  public homeScreen: HTMLElement | null;
  public lobbyScreen: HTMLElement | null;
  public gameHud: HTMLElement | null;
  public gameOverModal: HTMLElement | null;

  // Selections
  public selectedP1Faction: string = 'space_marines';
  public selectedP2Faction: string = 'chaos_marines';
  public selectedTheme: string = 'jungle';
  public selectedMission: MissionType = 'extermination';
  public p1EscortRole: 'escort' | 'attack' = 'escort';
  public p2EscortRole: 'escort' | 'attack' = 'attack';

  public onStartGame?: () => void;

  constructor() {
    this.homeScreen = document.getElementById('home-screen');
    this.lobbyScreen = document.getElementById('lobby-screen');
    this.gameHud = document.getElementById('game-hud');
    this.gameOverModal = document.getElementById('game-over-modal');

    this.initHomeScreen();
    this.initLobbyScreen();
  }

  private initHomeScreen(): void {
    const btnSinglePlayer = document.getElementById('btn-single-player');
    const btnMultiplayer = document.getElementById('btn-multiplayer');
    const btnLearnMore = document.getElementById('btn-learn-more');
    const modalLearnMore = document.getElementById('modal-learn-more');
    const btnCloseLearnMore = document.getElementById('btn-close-learn-more');

    if (btnSinglePlayer) {
      btnSinglePlayer.addEventListener('click', () => {
        this.showScreen('lobby');
      });
    }

    if (btnLearnMore && modalLearnMore) {
      btnLearnMore.addEventListener('click', () => {
        modalLearnMore.style.display = 'flex';
      });
    }

    if (btnCloseLearnMore && modalLearnMore) {
      btnCloseLearnMore.addEventListener('click', () => {
        modalLearnMore.style.display = 'none';
      });
    }
  }

  private initLobbyScreen(): void {
    const p1Container = document.getElementById('p1-factions-carousel');
    const p2Container = document.getElementById('p2-factions-carousel');
    const themeContainer = document.getElementById('maps-carousel');
    const missionContainer = document.getElementById('missions-carousel');
    const btnLaunch = document.getElementById('btn-launch-deployment');

    // Populate Factions
    const factionKeys = Object.keys(FACTIONS);
    if (p1Container) {
      p1Container.innerHTML = factionKeys.map(k => `
        <div class="carousel-card ${k === this.selectedP1Faction ? 'active' : ''}" data-id="${k}">
          <div class="card-title">${FACTIONS[k].name}</div>
          <div class="card-subtitle">${FACTIONS[k].roster.length} Units</div>
        </div>
      `).join('');

      p1Container.querySelectorAll('.carousel-card').forEach(el => {
        el.addEventListener('click', () => {
          p1Container.querySelectorAll('.carousel-card').forEach(c => c.classList.remove('active'));
          el.classList.add('active');
          this.selectedP1Faction = el.getAttribute('data-id') || 'space_marines';
        });
      });
    }

    if (p2Container) {
      p2Container.innerHTML = factionKeys.map(k => `
        <div class="carousel-card ${k === this.selectedP2Faction ? 'active' : ''}" data-id="${k}">
          <div class="card-title">${FACTIONS[k].name}</div>
          <div class="card-subtitle">${FACTIONS[k].roster.length} Units</div>
        </div>
      `).join('');

      p2Container.querySelectorAll('.carousel-card').forEach(el => {
        el.addEventListener('click', () => {
          p2Container.querySelectorAll('.carousel-card').forEach(c => c.classList.remove('active'));
          el.classList.add('active');
          this.selectedP2Faction = el.getAttribute('data-id') || 'chaos_marines';
        });
      });
    }

    // Populate Themes
    const themeKeys = Object.keys(THEMES);
    if (themeContainer) {
      themeContainer.innerHTML = themeKeys.map(k => `
        <div class="carousel-card ${k === this.selectedTheme ? 'active' : ''}" data-id="${k}">
          <div class="card-title">${THEMES[k].name}</div>
          <div class="card-subtitle">Battlezone</div>
        </div>
      `).join('');

      themeContainer.querySelectorAll('.carousel-card').forEach(el => {
        el.addEventListener('click', () => {
          themeContainer.querySelectorAll('.carousel-card').forEach(c => c.classList.remove('active'));
          el.classList.add('active');
          this.selectedTheme = el.getAttribute('data-id') || 'jungle';
        });
      });
    }

    // Missions
    const missions: Array<{ id: MissionType; name: string; desc: string }> = [
      { id: 'extermination', name: 'Extermination', desc: 'Eliminate all hostile forces or have majority survivors' },
      { id: 'escort', name: 'Escort VIP', desc: 'Escort the sacred relic courier to the landing pad' },
      { id: 'domination', name: 'Domination', desc: 'Capture and hold holographic data beacons' }
    ];

    if (missionContainer) {
      missionContainer.innerHTML = missions.map(m => `
        <div class="carousel-card ${m.id === this.selectedMission ? 'active' : ''}" data-id="${m.id}">
          <div class="card-title">${m.name}</div>
          <div class="card-subtitle">${m.desc}</div>
        </div>
      `).join('');

      missionContainer.querySelectorAll('.carousel-card').forEach(el => {
        el.addEventListener('click', () => {
          missionContainer.querySelectorAll('.carousel-card').forEach(c => c.classList.remove('active'));
          el.classList.add('active');
          this.selectedMission = (el.getAttribute('data-id') as MissionType) || 'extermination';
          
          const escortRoleBox = document.getElementById('escort-role-selection');
          if (escortRoleBox) {
            escortRoleBox.style.display = this.selectedMission === 'escort' ? 'block' : 'none';
          }
        });
      });
    }

    if (btnLaunch) {
      btnLaunch.addEventListener('click', () => {
        if (this.onStartGame) this.onStartGame();
      });
    }
  }

  public showScreen(screen: 'home' | 'lobby' | 'game'): void {
    if (this.homeScreen) this.homeScreen.style.display = screen === 'home' ? 'flex' : 'none';
    if (this.lobbyScreen) this.lobbyScreen.style.display = screen === 'lobby' ? 'flex' : 'none';
    if (this.gameHud) this.gameHud.style.display = screen === 'game' ? 'block' : 'none';
  }

  public updateTurnBanner(player: number, round: number, phase: string): void {
    const banner = document.getElementById('turn-banner');
    if (banner) {
      banner.innerHTML = `ROUND ${round} • ${player === 1 ? '<span class="text-cyan">PLAYER TURN</span>' : '<span class="text-red">ENEMY TURN</span>'} (${phase.toUpperCase()})`;
    }
  }

  public updateMissionScore(text: string): void {
    const el = document.getElementById('mission-objective-tracker');
    if (el) {
      el.innerHTML = text;
    }
  }

  public showGameOver(winner: number, message: string, onRestart: () => void): void {
    if (!this.gameOverModal) return;
    this.gameOverModal.style.display = 'flex';

    const title = this.gameOverModal.querySelector('.modal-title');
    const msg = this.gameOverModal.querySelector('.modal-desc');
    const btnRestart = document.getElementById('btn-restart-match');

    if (title) {
      title.textContent = winner === 1 ? 'VICTORY ACHIEVED' : (winner === 2 ? 'DEFEAT' : 'STALEMATE');
      title.className = `modal-title ${winner === 1 ? 'text-cyan' : 'text-red'}`;
    }

    if (msg) {
      msg.textContent = message;
    }

    if (btnRestart) {
      btnRestart.onclick = () => {
        this.gameOverModal!.style.display = 'none';
        onRestart();
      };
    }
  }
}
