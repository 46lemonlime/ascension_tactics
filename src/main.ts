import './styles/main.css';
import { GameScene } from './renderer/scene';
import { CombatLogUI } from './ui/combat-log';
import { DatasheetUI } from './ui/datasheet-ui';
import { MinimapRadar } from './ui/minimap-radar';
import { DeploymentUI } from './ui/deployment-ui';
import { DOMManager } from './ui/dom';
import { GameEngine } from './game/engine';
import { DEPLOYMENT_ZONES } from './data/constants';
import { updateTweens } from './game/effects';
import { PhysicsEngine } from './game/physics';
import { sfx } from './audio/synth';

// Initialize core systems
const container = document.getElementById('canvas-container') || document.body;
const scene = new GameScene(container);
const log = new CombatLogUI();
const datasheet = new DatasheetUI();
const minimap = new MinimapRadar(scene.cameraController);
const deploymentUi = new DeploymentUI();
const dom = new DOMManager();

const engine = new GameEngine(scene, log, datasheet, minimap, dom);

// Start with title / home screen
dom.showHomeScreen();

// Wire Single Player launch from Race Select Modal
dom.onStartGame = (p1Faction, p2Faction, theme, mission, p1EscortRole, p2EscortRole) => {
  engine.startNewGame(p1Faction, p2Faction, theme, mission, p1EscortRole, p2EscortRole);

  deploymentUi.show(true);
  const initialKey = engine.state.rosterPlayer?.[0]?.key || null;
  deploymentUi.renderRoster(engine.state.rosterPlayer || [], initialKey);

  // Highlight Southern Deployment Zone (Rows 48–55)
  const zoneTiles: Array<{ c: number; r: number }> = [];
  const z = DEPLOYMENT_ZONES.player1;
  for (let r = z.minR; r <= z.maxR; r++) {
    for (let c = z.minC; c <= z.maxC; c++) {
      zoneTiles.push({ c, r });
    }
  }
  scene.clearHighlights();
  scene.highlightTiles(zoneTiles, 0x10b981, 0.22);
};

// Wire Deployment UI events
deploymentUi.onSelectCard = (cardKey: string) => {
  deploymentUi.selectedCardKey = cardKey;
  deploymentUi.renderRoster(engine.state.rosterPlayer || [], cardKey);
};

deploymentUi.onUndeployCard = (cardKey: string) => {
  engine.undeployPlayerCard(cardKey);
  deploymentUi.renderRoster(engine.state.rosterPlayer || [], cardKey);
};

deploymentUi.onAutoDeploy = () => {
  engine.autoDeployPlayer();
  deploymentUi.renderRoster(engine.state.rosterPlayer || [], null);
  sfx('footsteps');
};

deploymentUi.onStartBattle = () => {
  deploymentUi.show(false);
  scene.clearHighlights();
  engine.finalizeDeployment();
  scene.cameraController.setPresetView('iso', false);
};

// Top Bar View Controls
const btnCamIso = document.getElementById('cam-iso');
const btnCamTop = document.getElementById('cam-top');
const btnCamCinematic = document.getElementById('cam-cinematic');
const btnActionCamToggle = document.getElementById('cam-action-toggle');
const btnFullscreen = document.getElementById('btn-fullscreen');
const btnChangeMatch = document.getElementById('btn-change-match');

const clearCamActive = () => {
  [btnCamIso, btnCamTop, btnCamCinematic].forEach(b => b?.classList.remove('active'));
};

if (btnCamIso) {
  btnCamIso.addEventListener('click', () => {
    clearCamActive();
    btnCamIso.classList.add('active');
    scene.cameraController.setPresetView('iso', engine.state.phase === 'deployment');
  });
}

if (btnCamTop) {
  btnCamTop.addEventListener('click', () => {
    clearCamActive();
    btnCamTop.classList.add('active');
    scene.cameraController.setPresetView('top');
  });
}

if (btnCamCinematic) {
  btnCamCinematic.addEventListener('click', () => {
    clearCamActive();
    btnCamCinematic.classList.add('active');
    scene.cameraController.setPresetView('cinematic');
  });
}

if (btnActionCamToggle) {
  btnActionCamToggle.addEventListener('click', () => {
    scene.cameraController.actionCamEnabled = !scene.cameraController.actionCamEnabled;
    btnActionCamToggle.textContent = `Action Cam: ${scene.cameraController.actionCamEnabled ? 'ON' : 'OFF'}`;
    btnActionCamToggle.classList.toggle('active', scene.cameraController.actionCamEnabled);
  });
}

if (btnFullscreen) {
  btnFullscreen.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  });
}

if (btnChangeMatch) {
  btnChangeMatch.addEventListener('click', () => {
    engine.resetGameSession();
    deploymentUi.show(false);
    dom.showRaceModal();
  });
}

// Minimap & Log Collapsibles
const btnToggleMinimap = document.getElementById('btn-toggle-minimap');
const minimapBody = document.getElementById('minimap-body');
if (btnToggleMinimap && minimapBody) {
  btnToggleMinimap.addEventListener('click', () => {
    const isCollapsed = minimapBody.style.display === 'none';
    minimapBody.style.display = isCollapsed ? 'block' : 'none';
    btnToggleMinimap.innerHTML = isCollapsed ? '&#9660;' : '&#9650;';
  });
}

const btnToggleLog = document.getElementById('btn-toggle-log');
const logContainer = document.getElementById('combat-log-container');
if (btnToggleLog && logContainer) {
  btnToggleLog.addEventListener('click', () => {
    const isCollapsed = logContainer.style.display === 'none';
    logContainer.style.display = isCollapsed ? 'flex' : 'none';
    btnToggleLog.innerHTML = isCollapsed ? '&#9660;' : '&#9650;';
  });
}

// Bottom Cockpit Actions
const btnEndTurn = document.getElementById('btn-end-turn');
if (btnEndTurn) {
  btnEndTurn.addEventListener('click', () => {
    if (engine.state.phase === 'battle' && engine.state.turn === 1 && !engine.isExecutingAiTurn) {
      engine.endTurn();
    }
  });
}

const btnRestart = document.getElementById('btn-restart');
if (btnRestart) {
  btnRestart.addEventListener('click', () => {
    engine.resetGameSession();
    deploymentUi.show(false);
    dom.showRaceModal();
  });
}

// Mouse canvas interactions
container.addEventListener('pointerdown', (e: MouseEvent) => {
  const hit = scene.raycastGround(e.clientX, e.clientY);
  if (!hit) return;

  if (engine.state.phase === 'deployment') {
    const clickedExistingUnit = engine.state.units.find(
      u => u.c === hit.c && u.r === hit.r && u.player === 1 && !u.isVip
    );

    // Right click on placed unit: Undeploy
    if (e.button === 2 && clickedExistingUnit) {
      const card = engine.state.rosterPlayer?.find(c => c.unitRef?.id === clickedExistingUnit.id);
      if (card) {
        engine.undeployPlayerCard(card.key);
        deploymentUi.renderRoster(engine.state.rosterPlayer || [], card.key);
      }
      return;
    }

    // Left click on board
    if (e.button === 0) {
      if (deploymentUi.selectedCardKey) {
        const deployed = engine.deployPlayerCard(deploymentUi.selectedCardKey, hit.c, hit.r);
        if (deployed) {
          const nextUnplaced = engine.state.rosterPlayer?.find(c => !c.placed);
          deploymentUi.renderRoster(engine.state.rosterPlayer || [], nextUnplaced ? nextUnplaced.key : null);
        }
      } else if (clickedExistingUnit) {
        // Select corresponding dock card
        const card = engine.state.rosterPlayer?.find(c => c.unitRef?.id === clickedExistingUnit.id);
        if (card) {
          deploymentUi.renderRoster(engine.state.rosterPlayer || [], card.key);
        }
      }
    }
  } else {
    // Battle Phase interactions
    if (e.button === 0) {
      engine.handleTileClick(hit.c, hit.r);
    } else if (e.button === 2) {
      // Right click cancels active move/shoot targeting
      engine.selectUnit(null);
    }
  }
});

// Context menu disable on canvas to permit right-click interactions
container.addEventListener('contextmenu', (e) => e.preventDefault());

// Keyboard shortcuts
window.addEventListener('keydown', (e: KeyboardEvent) => {
  // Ctrl + Z -> Camera Undo
  if (e.ctrlKey && e.key.toLowerCase() === 'z') {
    e.preventDefault();
    scene.cameraController.undoCameraPosition();
    return;
  }

  // Camera presets
  if (e.key === '1') {
    clearCamActive();
    btnCamIso?.classList.add('active');
    scene.cameraController.setPresetView('iso');
  }
  if (e.key === '2') {
    clearCamActive();
    btnCamTop?.classList.add('active');
    scene.cameraController.setPresetView('top');
  }
  if (e.key === '3') {
    clearCamActive();
    btnCamCinematic?.classList.add('active');
    scene.cameraController.setPresetView('cinematic');
  }

  // Rotate camera
  if (e.key.toLowerCase() === 'q') scene.cameraController.rotateOnSpot(-Math.PI / 8);
  if (e.key.toLowerCase() === 'e') scene.cameraController.rotateOnSpot(Math.PI / 8);

  // Gameplay shortcuts
  if (e.code === 'Space') {
    e.preventDefault();
    if (engine.state.phase === 'battle' && engine.state.turn === 1 && !engine.isExecutingAiTurn) {
      engine.endTurn();
    }
  }

  if (e.key.toLowerCase() === 'm') engine.enterMoveMode();
  if (e.key.toLowerCase() === 'f' || e.key.toLowerCase() === 'a') engine.enterShootMode();
});

// Window resize deployment framing
window.addEventListener('resize', () => {
  if (engine.state.phase === 'deployment') {
    scene.cameraController.frameDeploymentZone();
  }
});

// Render Loop
let lastTime = performance.now();
function animate(now: number) {
  requestAnimationFrame(animate);
  const dt = Math.min((now - lastTime) / 1000, 0.06);
  lastTime = now;

  updateTweens(dt, scene.camera);

  if (engine.state.phase === 'battle') {
    PhysicsEngine.step(dt, engine.state.units);
  }

  scene.render(dt);
  minimap.render(engine.state);
}

requestAnimationFrame(animate);

