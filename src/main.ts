import './styles/main.css';
import { GameScene } from './renderer/scene';
import { CombatLogUI } from './ui/combat-log';
import { DatasheetUI } from './ui/datasheet-ui';
import { MinimapRadar } from './ui/minimap-radar';
import { DeploymentUI } from './ui/deployment-ui';
import { DOMManager } from './ui/dom';
import { GameEngine } from './game/engine';
import { DEPLOYMENT_ZONES } from './data/constants';
import { FACTIONS } from './data/factions';
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

// Drag-to-reposition in deployment phase
let isDraggingUnit: boolean = false;
let draggedUnitId: number | null = null;

// Wire Start Battle from Lobby
dom.onStartGame = () => {
  dom.showScreen('game');
  engine.startNewGame(dom.selectedP1Faction, dom.selectedP2Faction, dom.selectedTheme, dom.selectedMission);

  const p1Faction = FACTIONS[dom.selectedP1Faction];
  deploymentUi.show(true);
  deploymentUi.renderRoster(engine.state.p1Roster, engine.state.p1Deployed, p1Faction);

  // Highlight player 1 deployment zone
  const zoneTiles: Array<{ c: number; r: number }> = [];
  const z = DEPLOYMENT_ZONES.player1;
  for (let r = z.minR; r <= z.maxR; r++) {
    for (let c = z.minC; c <= z.maxC; c++) {
      zoneTiles.push({ c, r });
    }
  }
  scene.clearHighlights();
  scene.highlightTiles(zoneTiles, 0x10b981, 0.25);
};

// Wire Deployment UI events
deploymentUi.onAutoDeploy = () => {
  engine.autoDeployPlayer(1, engine.state.p1Roster);
  const p1Faction = FACTIONS[dom.selectedP1Faction];
  deploymentUi.renderRoster(engine.state.p1Roster, engine.state.p1Deployed, p1Faction);
  sfx('footsteps');
};

deploymentUi.onStartBattle = () => {
  deploymentUi.show(false);
  scene.clearHighlights();
  engine.finalizeDeployment();
};

// HUD Controls
const btnEndTurn = document.getElementById('btn-end-turn');
if (btnEndTurn) {
  btnEndTurn.addEventListener('click', () => {
    if (engine.state.phase === 'battle' && engine.state.turn === 1 && !engine.isExecutingAiTurn) {
      engine.endTurn();
    }
  });
}

const btnUndoCam = document.getElementById('btn-undo-camera');
if (btnUndoCam) {
  btnUndoCam.addEventListener('click', () => {
    scene.cameraController.undoCameraPosition();
  });
}

const btnActionCamToggle = document.getElementById('btn-toggle-actioncam');
if (btnActionCamToggle) {
  btnActionCamToggle.addEventListener('click', () => {
    scene.cameraController.actionCamEnabled = !scene.cameraController.actionCamEnabled;
    btnActionCamToggle.classList.toggle('active', scene.cameraController.actionCamEnabled);
    log.log(`Action Camera ${scene.cameraController.actionCamEnabled ? 'Enabled' : 'Disabled'}`, 'info');
  });
}

// Mouse canvas interactions
container.addEventListener('pointerdown', (e: MouseEvent) => {
  const hit = scene.raycastGround(e.clientX, e.clientY);
  if (!hit) return;

  if (engine.state.phase === 'deployment') {
    const existingUnit = engine.state.units.find(u => u.c === hit.c && u.r === hit.r && u.player === 1 && !u.isVip);

    // Right click undeploys unit
    if (e.button === 2 && existingUnit) {
      const rosterIdx = engine.state.p1Roster.findIndex(u => u.id === existingUnit.unitDefId);
      if (rosterIdx !== -1) {
        engine.state.p1Deployed[rosterIdx] = false;
        engine.scene.removeUnitMesh(existingUnit.id);
        engine.state.units = engine.state.units.filter(u => u.id !== existingUnit.id);
        deploymentUi.renderRoster(engine.state.p1Roster, engine.state.p1Deployed, FACTIONS[dom.selectedP1Faction]);
        sfx('footsteps');
      }
      return;
    }

    // Left click on existing unit starts drag to reposition
    if (e.button === 0 && existingUnit) {
      isDraggingUnit = true;
      draggedUnitId = existingUnit.id;
      return;
    }

    // Deploy selected roster unit to valid tile
    if (e.button === 0 && deploymentUi.selectedRosterIndex !== null) {
      const z = DEPLOYMENT_ZONES.player1;
      if (hit.c >= z.minC && hit.c <= z.maxC && hit.r >= z.minR && hit.r <= z.maxR) {
        if (!engine.state.units.some(u => u.c === hit.c && u.r === hit.r)) {
          const unitDef = engine.state.p1Roster[deploymentUi.selectedRosterIndex];
          engine.deployUnitOnBoard(unitDef, 1, hit.c, hit.r);
          engine.state.p1Deployed[deploymentUi.selectedRosterIndex] = true;
          deploymentUi.clearSelection();
          deploymentUi.renderRoster(engine.state.p1Roster, engine.state.p1Deployed, FACTIONS[dom.selectedP1Faction]);
          sfx('footsteps');
        }
      }
    }
  } else {
    // Battle phase left click
    if (e.button === 0) {
      engine.handleTileClick(hit.c, hit.r);
    }
  }
});

container.addEventListener('pointerup', (e: MouseEvent) => {
  if (isDraggingUnit && draggedUnitId !== null && engine.state.phase === 'deployment') {
    const hit = scene.raycastGround(e.clientX, e.clientY);
    if (hit) {
      const z = DEPLOYMENT_ZONES.player1;
      if (hit.c >= z.minC && hit.c <= z.maxC && hit.r >= z.minR && hit.r <= z.maxR) {
        if (!engine.state.units.some(u => u.c === hit.c && u.r === hit.r && u.id !== draggedUnitId)) {
          const unit = engine.state.units.find(u => u.id === draggedUnitId);
          if (unit) {
            unit.c = hit.c;
            unit.r = hit.r;
            const mesh = scene.unitMeshes.get(unit.id);
            if (mesh) {
              const wPos = scene.unitMeshes.get(unit.id);
              if (wPos) {
                // update position in scene
                engine.scene.addOrUpdateUnitMesh(unit, engine.state.p1Roster.find(r => r.id === unit.unitDefId)!, FACTIONS[dom.selectedP1Faction]);
              }
            }
            sfx('footsteps');
          }
        }
      }
    }
    isDraggingUnit = false;
    draggedUnitId = null;
  }
});

// Context menu disable on canvas to permit right-click undeploy
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
  if (e.key === '1') scene.cameraController.setPresetView('tactical');
  if (e.key === '2') scene.cameraController.setPresetView('iso');
  if (e.key === '3') scene.cameraController.setPresetView('top');
  if (e.key === '4') scene.cameraController.setPresetView('cinematic');

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

// Render Loop
let lastTime = performance.now();
function animate(now: number) {
  requestAnimationFrame(animate);
  const dt = (now - lastTime) / 1000;
  lastTime = now;

  scene.render(dt);
  minimap.render(engine.state);
}

requestAnimationFrame(animate);
