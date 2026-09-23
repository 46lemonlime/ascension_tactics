import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { gridToWorld, GRID_COLS, GRID_ROWS, TILE_SIZE, PLAYER_DEPLOY_MIN_Z, PLAYER_DEPLOY_MAX_Z } from '../data/constants';

export interface CameraHistoryEntry {
  position: THREE.Vector3;
  target: THREE.Vector3;
}

let activeCameraController: CameraController | null = null;
let savedPlayerCameraPos: THREE.Vector3 | null = null;
let savedPlayerCameraTarget: THREE.Vector3 | null = null;

export function getActiveCameraController(): CameraController | null {
  return activeCameraController;
}

export function setActiveCameraController(ctrl: CameraController | null): void {
  activeCameraController = ctrl;
}

export function getActionCamEnabled(): boolean {
  return activeCameraController ? activeCameraController.actionCamEnabled : true;
}

export function setActionCamEnabled(val: boolean): void {
  if (activeCameraController) {
    activeCameraController.actionCamEnabled = val;
  }
}

export function savePlayerCamera(): void {
  if (activeCameraController) {
    savedPlayerCameraPos = activeCameraController.camera.position.clone();
    savedPlayerCameraTarget = activeCameraController.controls.target.clone();
  }
}

export function getSavedPlayerCamera(): { pos: THREE.Vector3 | null; target: THREE.Vector3 | null } {
  return { pos: savedPlayerCameraPos, target: savedPlayerCameraTarget };
}

export function restorePlayerCamera(durationMs: number = 650, onDone?: () => void): boolean {
  if (savedPlayerCameraPos && savedPlayerCameraTarget && activeCameraController) {
    activeCameraController.animateTo(savedPlayerCameraPos.clone(), savedPlayerCameraTarget.clone(), durationMs, onDone);
    return true;
  }
  if (onDone) onDone();
  return false;
}

export function clearSavedPlayerCamera(): void {
  savedPlayerCameraPos = null;
  savedPlayerCameraTarget = null;
}

export function getDeploymentCameraFraming(camera?: THREE.PerspectiveCamera): { pos: { x: number; y: number; z: number }; target: { x: number; y: number; z: number } } {
  const w = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const h = typeof window !== 'undefined' ? window.innerHeight : 720;
  const aspect = w / h;

  // Measure UI overlay regions
  const deployPanel = typeof document !== 'undefined' ? document.getElementById('deployment-panel') : null;
  const dockHeight = (deployPanel && deployPanel.offsetHeight > 0) ? deployPanel.offsetHeight : 160;
  const headerBar = typeof document !== 'undefined' ? document.querySelector('.header-bar') as HTMLElement : null;
  const headerHeight = (headerBar && headerBar.offsetHeight > 0) ? headerBar.offsetHeight : 50;

  // Available vertical pixel height between top header and bottom deployment dock
  const availableHeight = Math.max(h - dockHeight - headerHeight - 20, 200);
  const verticalUsableFraction = Math.min(Math.max(availableHeight / h, 0.45), 0.95);

  // Deployment area physical dimensions in world coordinates (Rows 48 to 55)
  // X: -120 to +120 (width = 240)
  // Z: 120 to 168 (depth = 48, center Z = 144)
  const deployWidth = GRID_COLS * TILE_SIZE; // 240
  const deployDepth = (PLAYER_DEPLOY_MAX_Z - PLAYER_DEPLOY_MIN_Z + 1) * TILE_SIZE; // 48
  const deployCenterZ = ((PLAYER_DEPLOY_MIN_Z + PLAYER_DEPLOY_MAX_Z) / 2 - GRID_ROWS / 2 + 0.5) * TILE_SIZE; // 144.0

  // Generous margins so deployment tiles and unit models are comfortably framed
  const marginX = 40.0;
  const marginZ = 24.0;

  // 45-degree strategic angle
  const pitchAngle = Math.PI / 4; // 45°
  const sinPitch = Math.sin(pitchAngle); // ~0.7071
  const cosPitch = Math.cos(pitchAngle); // ~0.7071

  // Camera field of view calculations
  const fovDeg = camera ? camera.fov : (activeCameraController?.camera.fov || 45);
  const fovVRad = (fovDeg * Math.PI) / 180;
  const fovHRad = 2 * Math.atan(Math.tan(fovVRad / 2) * aspect);
  const fovVUsableRad = fovVRad * verticalUsableFraction;

  // Required camera distance to fit width
  const distForWidth = ((deployWidth + marginX) / 2) / Math.tan(fovHRad / 2);

  // Required camera distance to fit depth at 45° pitch within the available vertical viewport
  const projectedDepth = (deployDepth + marginZ) * sinPitch;
  const distForDepth = (projectedDepth / 2) / Math.tan(fovVUsableRad / 2);

  // Overall required distance with safety clamp
  const dist = Math.max(distForWidth, distForDepth, 180.0);

  // Offset the camera look target slightly North so the deployment area is centered in the upper/middle viewport above the dock
  const screenCenterOffsetY = ((h - dockHeight) / 2) - (h / 2); // negative = shifted up on screen
  const targetOffsetZ = (screenCenterOffsetY / h) * (dist * Math.tan(fovVRad / 2) * 1.8);
  const targetZ = Math.max(deployCenterZ + targetOffsetZ, 60.0);

  const posX = 0;
  const posY = dist * sinPitch;
  const posZ = targetZ + dist * cosPitch;

  return {
    pos: { x: posX, y: posY, z: posZ },
    target: { x: 0, y: 0, z: targetZ }
  };
}

export function animateCameraTo(
  targetEye: THREE.Vector3 | { x: number; y: number; z: number } | null | undefined,
  targetLookAt: THREE.Vector3 | { x: number; y: number; z: number } | null | undefined,
  durationMs: number = 400,
  onDone?: () => void
): void {
  if (!targetEye || !targetLookAt || !activeCameraController) return;
  const eye = targetEye instanceof THREE.Vector3 ? targetEye : new THREE.Vector3(targetEye.x, targetEye.y, targetEye.z);
  const lookAt = targetLookAt instanceof THREE.Vector3 ? targetLookAt : new THREE.Vector3(targetLookAt.x, targetLookAt.y, targetLookAt.z);
  const actualMs = durationMs <= 10 ? durationMs * 1000 : durationMs;
  activeCameraController.animateTo(eye, lookAt, actualMs, onDone);
}

export class CameraController {
  public camera: THREE.PerspectiveCamera;
  public controls: OrbitControls;
  public actionCamEnabled: boolean = true;
  private history: CameraHistoryEntry[] = [];
  private maxHistory: number = 20;
  private isAnimating: boolean = false;

  constructor(camera: THREE.PerspectiveCamera, domElement: HTMLElement) {
    this.camera = camera;
    this.controls = new OrbitControls(camera, domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.screenSpacePanning = false;
    this.controls.minDistance = 15;
    this.controls.maxDistance = 280;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.05;

    activeCameraController = this;

    // Track user camera move starts to save undo history
    this.controls.addEventListener('start', () => {
      this.pushHistory();
    });
  }

  public pushHistory(): void {
    this.history.push({
      position: this.camera.position.clone(),
      target: this.controls.target.clone()
    });
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }
  }

  public undoCameraPosition(): boolean {
    if (this.history.length === 0) return false;
    const prev = this.history.pop();
    if (!prev) return false;

    this.animateTo(prev.position, prev.target, 350);
    return true;
  }

  /**
   * Sets the initial camera framing for deployment phase:
   * Calculated 45 degrees strategic framing looking at Player 1's starting zone
   */
  public frameDeploymentZone(animate: boolean = false): void {
    const framing = getDeploymentCameraFraming();
    const eye = new THREE.Vector3(framing.pos.x, framing.pos.y, framing.pos.z);
    const target = new THREE.Vector3(framing.target.x, framing.target.y, framing.target.z);

    if (animate) {
      this.animateTo(eye, target, 800);
    } else {
      this.camera.position.copy(eye);
      this.controls.target.copy(target);
      this.controls.update();
    }
  }

  /**
   * Switches predefined camera preset angles matching the original prototype
   */
  public setPresetView(preset: 'tactical' | 'iso' | 'top' | 'cinematic', isDeployment: boolean = false): void {
    this.pushHistory();

    if (preset === 'iso') {
      if (isDeployment) {
        this.frameDeploymentZone(true);
      } else {
        // 45° Strategic view for battle mode
        this.animateTo(new THREE.Vector3(0, 130, 220), new THREE.Vector3(0, 0, 35), 800);
      }
    } else if (preset === 'top') {
      this.animateTo(new THREE.Vector3(0, 260, 0.1), new THREE.Vector3(0, 0, 0), 800);
    } else if (preset === 'cinematic') {
      this.animateTo(new THREE.Vector3(-120, 55, 95), new THREE.Vector3(0, 4, 0), 1000);
    } else {
      // Tactical
      const currentTarget = this.controls.target.clone();
      this.animateTo(new THREE.Vector3(currentTarget.x, 80, currentTarget.z + 65), currentTarget, 600);
    }
  }

  /**
   * Rotates camera around current target on spot
   */
  public rotateOnSpot(angleRad: number): void {
    this.pushHistory();
    const offset = this.camera.position.clone().sub(this.controls.target);
    offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), angleRad);
    this.camera.position.copy(this.controls.target.clone().add(offset));
    this.controls.update();
  }

  /**
   * Focuses camera smoothly onto a target world position
   */
  public focusOnWorld(targetPos: THREE.Vector3, eyeOffset: THREE.Vector3 = new THREE.Vector3(0, 45, 40), durationMs: number = 400): void {
    const eye = targetPos.clone().add(eyeOffset);
    this.animateTo(eye, targetPos, durationMs);
  }

  /**
   * Action camera close-up during attacks or movements (if enabled)
   */
  public triggerActionCamera(attackerPos: THREE.Vector3, defenderPos: THREE.Vector3): void {
    if (!this.actionCamEnabled) return;
    this.pushHistory();

    const midpoint = attackerPos.clone().add(defenderPos).multiplyScalar(0.5);
    const dir = defenderPos.clone().sub(attackerPos).normalize();
    const side = new THREE.Vector3(-dir.z, 0, dir.x).multiplyScalar(18);
    const camPos = midpoint.clone().add(side).add(new THREE.Vector3(0, 12, 0));

    this.animateTo(camPos, midpoint, 450);
  }

  private currentAnimId: number | null = null;

  /**
   * Smooth camera interpolation with tween cancellation protection
   */
  public animateTo(targetEye: THREE.Vector3, targetLookAt: THREE.Vector3, durationMs: number = 400, onDone?: () => void): void {
    if (this.currentAnimId !== null) {
      cancelAnimationFrame(this.currentAnimId);
      this.currentAnimId = null;
    }

    const startEye = this.camera.position.clone();
    const startLookAt = this.controls.target.clone();
    const startTime = performance.now();
    this.isAnimating = true;

    const step = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / durationMs);
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

      this.camera.position.lerpVectors(startEye, targetEye, ease);
      this.controls.target.lerpVectors(startLookAt, targetLookAt, ease);
      this.controls.update();

      if (t < 1) {
        this.currentAnimId = requestAnimationFrame(step);
      } else {
        this.currentAnimId = null;
        this.isAnimating = false;
        if (onDone) onDone();
      }
    };

    this.currentAnimId = requestAnimationFrame(step);
  }

  public update(): void {
    if (!this.isAnimating) {
      this.controls.update();
    }
  }
}

