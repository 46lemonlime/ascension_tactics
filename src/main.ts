import './styles/main.css';
import { GameScene } from './renderer/scene';
import { CombatLogUI } from './ui/combat-log';
import { DatasheetUI } from './ui/datasheet-ui';
import { MinimapRadar } from './ui/minimap-radar';
import { DeploymentUI } from './ui/deployment-ui';
import { DOMManager } from './ui/dom';
import { GameEngine } from './game/engine';
import { DEPLOYMENT_ZONES, chebyshevDist } from './data/constants';
import { updateTweens } from './game/effects';
import { PhysicsEngine } from './game/physics';
import { sfx } from './audio/synth';
import { hasLineOfSight } from './game/awareness';
import { UNIT_ROSTER } from './data/units';
import * as THREE from 'three';

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

  // Authoritative deployment camera positioning
  scene.cameraController.frameDeploymentZone(false);

  // Authoritative dual-zone deployment highlights
  scene.updateDeploymentHighlights(engine.state.rosterPlayer || []);
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

// ================== TOP-RIGHT IN-BATTLE NAVIGATION & MENUS ==================
const navBtnLogs = document.getElementById('nav-btn-logs');
const navBtnMap = document.getElementById('nav-btn-map');
const navBtnCamera = document.getElementById('nav-btn-camera');
const navBtnFullscreen = document.getElementById('nav-btn-fullscreen');
const navBtnMenu = document.getElementById('nav-btn-menu');

const cameraOptionsPopup = document.getElementById('camera-options-popup');
const menuOptionsPopup = document.getElementById('menu-options-popup');

const popCamCommand = document.getElementById('pop-cam-command');
const popCamTop = document.getElementById('pop-cam-top');
const popCamCinematic = document.getElementById('pop-cam-cinematic');
const popActionCamToggle = document.getElementById('pop-action-cam-toggle');
const popActionCamState = document.getElementById('pop-action-cam-state');

const gameMenuModal = document.getElementById('game-menu-modal');
const btnCloseGameMenu = document.getElementById('btn-close-game-menu');
const btnResumeGame = document.getElementById('btn-resume-game');
const popMenuRestart = document.getElementById('pop-menu-restart');
const popMenuRematch = document.getElementById('pop-menu-rematch');
const popMenuExit = document.getElementById('pop-menu-exit');

const confirmModal = document.getElementById('confirm-dialog-modal');
const confirmTitle = document.getElementById('confirm-title');
const confirmMsg = document.getElementById('confirm-message');
const confirmIcon = document.getElementById('confirm-icon');
const confirmAcceptBtn = document.getElementById('btn-confirm-accept');
const confirmCancelBtn = document.getElementById('btn-confirm-cancel');

// Centered Game Menu State & Lifecycle
let isGameMenuOpen = false;

const setGameMenuOpen = (open: boolean) => {
  isGameMenuOpen = open;
  if (gameMenuModal) {
    gameMenuModal.style.display = open ? 'flex' : 'none';
    gameMenuModal.setAttribute('aria-hidden', open ? 'false' : 'true');
  }
  navBtnMenu?.classList.toggle('active', open);
  if (open) {
    // Close camera popup when Game Menu opens
    if (cameraOptionsPopup) cameraOptionsPopup.style.display = 'none';
    navBtnCamera?.classList.remove('active');
  }
};

const toggleGameMenu = () => {
  setGameMenuOpen(!isGameMenuOpen);
};

// Popup Visibility Management
const closePopups = () => {
  if (cameraOptionsPopup) cameraOptionsPopup.style.display = 'none';
  navBtnCamera?.classList.remove('active');
};

const togglePopup = (popup: HTMLElement | null, btn: HTMLElement | null) => {
  if (!popup) return;
  const isCurrentlyOpen = popup.style.display === 'block';
  closePopups();
  if (isGameMenuOpen) setGameMenuOpen(false);
  if (!isCurrentlyOpen) {
    popup.style.display = 'block';
    btn?.classList.add('active');
  }
};

// 1. COMBAT LOG VISIBILITY CONTROL
const logWrapper = document.getElementById('combat-log-wrapper');

const setCombatLogVisible = (visible: boolean) => {
  if (logWrapper) {
    logWrapper.style.display = visible ? 'block' : 'none';
    logWrapper.setAttribute('aria-hidden', visible ? 'false' : 'true');
  }
  if (navBtnLogs) {
    navBtnLogs.classList.toggle('active', visible);
    navBtnLogs.setAttribute('aria-pressed', visible ? 'true' : 'false');
  }
};

if (navBtnLogs) {
  navBtnLogs.addEventListener('click', () => {
    const isVisible = logWrapper ? logWrapper.style.display !== 'none' : true;
    setCombatLogVisible(!isVisible);
  });
}

// 2. TACTICAL MAP VISIBILITY CONTROL
const minimapPanel = document.getElementById('minimap-panel');

const setMinimapVisible = (visible: boolean) => {
  if (minimapPanel) {
    minimapPanel.style.display = visible ? 'block' : 'none';
    minimapPanel.setAttribute('aria-hidden', visible ? 'false' : 'true');
    minimapPanel.classList.toggle('hidden', !visible);
  }
  if (navBtnMap) {
    navBtnMap.classList.toggle('active', visible);
    navBtnMap.setAttribute('aria-pressed', visible ? 'true' : 'false');
  }
};

if (navBtnMap) {
  navBtnMap.addEventListener('click', () => {
    const isVisible = minimapPanel ? minimapPanel.style.display !== 'none' : true;
    setMinimapVisible(!isVisible);
  });
}

// 3. CAMERA OPTIONS
if (navBtnCamera) {
  navBtnCamera.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePopup(cameraOptionsPopup, navBtnCamera);
  });
}

if (popCamCommand) {
  popCamCommand.addEventListener('click', () => {
    scene.cameraController.setPresetView('iso', engine.state.phase === 'deployment');
  });
}

if (popCamTop) {
  popCamTop.addEventListener('click', () => {
    scene.cameraController.setPresetView('top');
  });
}

if (popCamCinematic) {
  popCamCinematic.addEventListener('click', () => {
    scene.cameraController.setPresetView('cinematic');
  });
}

if (popActionCamToggle) {
  popActionCamToggle.addEventListener('click', () => {
    scene.cameraController.actionCamEnabled = !scene.cameraController.actionCamEnabled;
    const isEnabled = scene.cameraController.actionCamEnabled;
    if (popActionCamState) popActionCamState.textContent = isEnabled ? 'ON' : 'OFF';
    popActionCamToggle.classList.toggle('active', isEnabled);
  });
}

// 3. FULLSCREEN TOGGLE
const fsEnterIcon = document.querySelector('.nav-icon-fs-enter') as HTMLElement | null;
const fsExitIcon = document.querySelector('.nav-icon-fs-exit') as HTMLElement | null;

const syncFullscreenState = () => {
  const isFs = !!document.fullscreenElement;
  navBtnFullscreen?.classList.toggle('active', isFs);
  if (navBtnFullscreen) {
    navBtnFullscreen.title = isFs ? 'Exit Fullscreen' : 'Fullscreen';
  }
  if (fsEnterIcon) fsEnterIcon.style.display = isFs ? 'none' : 'block';
  if (fsExitIcon) fsExitIcon.style.display = isFs ? 'block' : 'none';
};

const toggleFullscreen = async () => {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      if ('keyboard' in navigator && typeof (navigator as any).keyboard?.lock === 'function') {
        try {
          await (navigator as any).keyboard.lock(['Escape']);
        } catch {
          // ignore if keyboard lock is not permitted by host environment
        }
      }
    } else {
      if ('keyboard' in navigator && typeof (navigator as any).keyboard?.unlock === 'function') {
        try {
          (navigator as any).keyboard.unlock();
        } catch {
          // ignore
        }
      }
      await document.exitFullscreen();
    }
  } catch {
    // fullscreen request error fallback
  }
};

if (navBtnFullscreen) {
  navBtnFullscreen.addEventListener('click', () => {
    toggleFullscreen();
  });
}

document.addEventListener('fullscreenchange', () => {
  syncFullscreenState();
  if (!document.fullscreenElement) {
    if ('keyboard' in navigator && typeof (navigator as any).keyboard?.unlock === 'function') {
      try {
        (navigator as any).keyboard.unlock();
      } catch {
        // ignore
      }
    }
  }
});

// 4. CENTERED GAME MENU & CONFIRMATION MODALS
let pendingConfirmAction: (() => void) | null = null;

const showConfirmModal = (
  title: string,
  message: string,
  icon: string,
  confirmLabel: string,
  onConfirm: () => void,
  isDanger = false
) => {
  closePopups();
  if (!confirmModal || !confirmTitle || !confirmMsg || !confirmIcon || !confirmAcceptBtn) return;
  confirmTitle.textContent = title;
  confirmMsg.textContent = message;
  confirmIcon.textContent = icon;
  confirmAcceptBtn.textContent = confirmLabel;
  confirmAcceptBtn.className = isDanger ? 'btn-action btn-danger' : 'btn-action btn-primary';
  pendingConfirmAction = onConfirm;
  confirmModal.style.display = 'flex';
};

const hideConfirmModal = () => {
  if (confirmModal) confirmModal.style.display = 'none';
  pendingConfirmAction = null;
};

if (confirmCancelBtn) confirmCancelBtn.addEventListener('click', hideConfirmModal);
if (confirmAcceptBtn) {
  confirmAcceptBtn.addEventListener('click', () => {
    const action = pendingConfirmAction;
    hideConfirmModal();
    if (action) action();
  });
}

if (navBtnMenu) {
  navBtnMenu.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleGameMenu();
  });
}

if (btnCloseGameMenu) {
  btnCloseGameMenu.addEventListener('click', () => setGameMenuOpen(false));
}

if (btnResumeGame) {
  btnResumeGame.addEventListener('click', () => setGameMenuOpen(false));
}

if (gameMenuModal) {
  gameMenuModal.addEventListener('click', (e) => {
    if (e.target === gameMenuModal) {
      setGameMenuOpen(false);
    }
  });
}

if (popMenuRestart) {
  popMenuRestart.addEventListener('click', () => {
    showConfirmModal(
      'Restart Battle',
      'Restart this battle from the beginning with the same factions, map, and mission?',
      '🔄',
      'Restart',
      () => {
        setGameMenuOpen(false);
        const p1Faction = engine.state.p1Faction || 'space_marines';
        const p2Faction = engine.state.p2Faction || 'chaos';
        const theme = engine.state.theme || 'desert';
        const mission = engine.state.mission || 'extermination';
        const p1EscortRole = engine.state.escortRole || 'escort';
        const p2EscortRole = engine.state.p2EscortRole || 'attack';
        engine.startNewGame(p1Faction, p2Faction, theme, mission, p1EscortRole, p2EscortRole);
        deploymentUi.show(true);
        const initialKey = engine.state.rosterPlayer?.[0]?.key || null;
        deploymentUi.renderRoster(engine.state.rosterPlayer || [], initialKey);
        scene.cameraController.frameDeploymentZone(false);
        scene.updateDeploymentHighlights(engine.state.rosterPlayer || []);
      }
    );
  });
}

if (popMenuRematch) {
  popMenuRematch.addEventListener('click', () => {
    showConfirmModal(
      'Rematch',
      'Abandon current match and return to faction & battlefield selection?',
      '⚔️',
      'Rematch',
      () => {
        setGameMenuOpen(false);
        engine.resetGameSession();
        deploymentUi.show(false);
        dom.showRaceModal();
      }
    );
  });
}

if (popMenuExit) {
  popMenuExit.addEventListener('click', () => {
    showConfirmModal(
      'Exit to Main Menu',
      'Abandon current match and return to the main title screen?',
      '🚪',
      'Exit Game',
      () => {
        setGameMenuOpen(false);
        engine.resetGameSession();
        deploymentUi.show(false);
        dom.showHomeScreen();
      },
      true
    );
  });
}

// Close popups on click outside
document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement | null;
  if (!target) return;
  if (!target.closest('#top-nav-bar') && !target.closest('#camera-options-popup')) {
    closePopups();
  }
});

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
    showConfirmModal(
      'New Match',
      'Abandon current battle and return to faction selection?',
      '⚔️',
      'New Match',
      () => {
        engine.resetGameSession();
        deploymentUi.show(false);
        dom.showRaceModal();
      }
    );
  });
}

// Mouse hover targeting ray & range LoS callout
container.addEventListener('pointermove', (e: MouseEvent) => {
  if (engine.state.phase !== 'battle' || engine.state.turn !== 1 || engine.isExecutingAiTurn) {
    scene.setTargetingRay(null, null, 'hidden');
    const callout = document.getElementById('los-callout');
    if (callout) callout.innerHTML = '';
    return;
  }

  const selected = engine.selectedUnitId !== null ? engine.state.units.find(u => u.id === engine.selectedUnitId && !u.dead) : null;
  const callout = document.getElementById('los-callout');

  if (!selected || selected.player !== 1 || selected.hasAttacked) {
    scene.setTargetingRay(null, null, 'hidden');
    if (callout) callout.innerHTML = '';
    return;
  }

  const hoveredUnit = scene.raycastUnit(e.clientX, e.clientY, engine.state.units);
  if (hoveredUnit && hoveredUnit.player !== 1 && !hoveredUnit.dead) {
    const selectedDef = UNIT_ROSTER[selected.unitDefId] || selected.def;
    const hoveredDef = UNIT_ROSTER[hoveredUnit.unitDefId] || hoveredUnit.def;
    const maxRange = Math.max(...(selectedDef.weapons?.map(w => w.range) || [selected.range || 18]));
    const targetDist = chebyshevDist(selected.c, selected.r, hoveredUnit.c, hoveredUnit.r);
    const inRange = targetDist <= maxRange;
    const hasLoS = hasLineOfSight(selected.c, selected.r, hoveredUnit.c, hoveredUnit.r, engine.state.theme);

    const startPos = selected.model.position.clone().add(new THREE.Vector3(0, 1.6, 0));
    const endPos = hoveredUnit.model.position.clone().add(new THREE.Vector3(0, 1.6, 0));

    if (!inRange) {
      scene.setTargetingRay(startPos, endPos, 'out_of_range');
      if (callout) callout.innerHTML = `<span style="color:#eab308">⚠️ ${hoveredDef.name}: OUT OF RANGE (${targetDist}" / Max ${maxRange}")</span>`;
    } else if (!hasLoS) {
      scene.setTargetingRay(startPos, endPos, 'blocked');
      if (callout) callout.innerHTML = `<span style="color:#ef4444">⛔ ${hoveredDef.name}: LINE OF SIGHT BLOCKED BY RUINS</span>`;
    } else {
      scene.setTargetingRay(startPos, endPos, 'valid');
      const isMelee = targetDist <= 1;
      if (callout) callout.innerHTML = `<span style="color:#34d399">🎯 ${hoveredDef.name}: CLICK TO ${isMelee ? 'MELEE STRIKE' : 'FIRE VOLLEY'} (${targetDist}" / Max ${maxRange}")</span>`;
    }
  } else {
    scene.setTargetingRay(null, null, 'hidden');
    if (callout) callout.innerHTML = '';
  }
});

// Mouse canvas interactions
container.addEventListener('pointerdown', (e: MouseEvent) => {
  if (e.target && (e.target as HTMLElement).closest('#ui-layer') && !(e.target as HTMLElement).classList.contains('instructions-tip')) {
    return;
  }

  const clickedUnit = scene.raycastUnit(e.clientX, e.clientY, engine.state.units);
  const groundHit = scene.raycastGround(e.clientX, e.clientY);

  if (engine.state.phase === 'deployment') {
    if (!groundHit) return;
    const clickedExistingUnit = engine.state.units.find(
      u => u.c === groundHit.c && u.r === groundHit.r && u.player === 1 && !u.isVip
    ) || (clickedUnit?.player === 1 ? clickedUnit : null);

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
        const deployed = engine.deployPlayerCard(deploymentUi.selectedCardKey, groundHit.c, groundHit.r);
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
      if (clickedUnit) {
        engine.handleTileClick(clickedUnit.c, clickedUnit.r);
      } else if (groundHit) {
        engine.handleTileClick(groundHit.c, groundHit.r);
      } else {
        engine.selectUnit(null);
      }
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
  // F11 -> Toggle Fullscreen mode
  if (e.key === 'F11') {
    e.preventDefault();
    toggleFullscreen();
    return;
  }

  // ESC -> Toggle Centered Game Menu or close modal/popups (does NOT exit fullscreen)
  if (e.key === 'Escape') {
    e.preventDefault();
    if (confirmModal && confirmModal.style.display === 'flex') {
      hideConfirmModal();
      return;
    }
    if (cameraOptionsPopup && cameraOptionsPopup.style.display === 'block') {
      closePopups();
      return;
    }
    if (engine.state.phase === 'deployment' || engine.state.phase === 'battle') {
      toggleGameMenu();
      return;
    }
  }

  // Ctrl + Z -> Camera Undo
  if (e.ctrlKey && e.key.toLowerCase() === 'z') {
    e.preventDefault();
    scene.cameraController.undoCameraPosition();
    return;
  }

  // Camera presets
  if (e.key === '1') {
    scene.cameraController.setPresetView('iso', engine.state.phase === 'deployment');
  }
  if (e.key === '2') {
    scene.cameraController.setPresetView('top');
  }
  if (e.key === '3') {
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

