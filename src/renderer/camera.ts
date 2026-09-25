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

  // Overall required distance with safety clamp, scaled for closer tactical zoom (5 scrolls ~0.7738)
  const dist = Math.max(distForWidth, distForDepth, 180.0) * 0.77378;

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
  if (!targetEye || !targetLookAt || !activeCameraController) {
    if (onDone) onDone();
    return;
  }
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
    this.controls.mouseButtons = {
      LEFT: THREE.MOUSE.PAN,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.ROTATE
    };

    activeCameraController = this;

    // Track user camera move starts to save undo history
    this.controls.addEventListener('start', () => {
      this.pushHistory();
    });

    // Modifier (Ctrl / Shift / Alt) + Right Mouse Button + Drag: In-place camera rotation
    // Position remains strictly fixed (X, Y, Z unchanged), only rotation changes.
    let isModifierRightDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    const fixedCamPos = new THREE.Vector3();
    const startSpherical = new THREE.Spherical();
    let lookDist = 50;

    domElement.addEventListener(
      'pointerdown',
      (e: PointerEvent) => {
        const hasModifier = e.ctrlKey || e.shiftKey || e.altKey;
        if (e.button === 2 && hasModifier) {
          e.preventDefault();
          e.stopImmediatePropagation();
          isModifierRightDragging = true;
          dragStartX = e.clientX;
          dragStartY = e.clientY;
          fixedCamPos.copy(this.camera.position);

          const lookDir = this.controls.target.clone().sub(this.camera.position).normalize();
          startSpherical.setFromVector3(lookDir);
          lookDist = Math.max(this.camera.position.distanceTo(this.controls.target), 20);

          this.pushHistory();
        }
      },
      { capture: true }
    );

    window.addEventListener(
      'pointermove',
      (e: PointerEvent) => {
        if (!isModifierRightDragging) return;
        e.preventDefault();
        e.stopImmediatePropagation();

        const dx = e.clientX - dragStartX;
        const dy = e.clientY - dragStartY;
        const rotateSpeed = 0.0035;

        const theta = startSpherical.theta - dx * rotateSpeed;
        const phi = Math.max(0.08, Math.min(Math.PI - 0.08, startSpherical.phi - dy * rotateSpeed));

        const newLookDir = new THREE.Vector3().setFromSpherical(new THREE.Spherical(1, phi, theta));

        this.camera.position.copy(fixedCamPos);
        this.controls.target.copy(fixedCamPos).addScaledVector(newLookDir, lookDist);
        this.controls.update();
        this.camera.position.copy(fixedCamPos);
      },
      { capture: true }
    );

    window.addEventListener(
      'pointerup',
      (e: PointerEvent) => {
        if (isModifierRightDragging && (e.button === 2 || (e.buttons & 2) === 0)) {
          isModifierRightDragging = false;
        }
      },
      { capture: true }
    );

    // Intercept wheel events when modifier keys (Ctrl, Shift, Alt) are active
    domElement.addEventListener(
      'wheel',
      (e: WheelEvent) => {
        if (e.ctrlKey || e.shiftKey || e.altKey) {
          e.preventDefault();
          e.stopImmediatePropagation();
          this.adjustCameraHeight(e.deltaY);
        }
      },
      { capture: true, passive: false }
    );
  }

  private heightHistoryDebounceTimer: number | null = null;

  /**
   * Adjusts camera vertical height (Y axis) on the spot:
   * Translates camera position and target vertically by the exact same delta,
   * keeping X, Z, rotation, pitch, yaw, roll, viewing angle, and distance to target strictly identical.
   */
  public adjustCameraHeight(deltaY: number): void {
    if (this.heightHistoryDebounceTimer === null) {
      this.pushHistory();
    } else {
      window.clearTimeout(this.heightHistoryDebounceTimer);
    }
    this.heightHistoryDebounceTimer = window.setTimeout(() => {
      this.heightHistoryDebounceTimer = null;
    }, 400);

    const step = 4.5;
    const direction = deltaY < 0 ? 1 : -1; // Wheel Up (<0) increases height, Wheel Down (>0) decreases height
    const currentY = this.camera.position.y;
    const newY = Math.min(Math.max(currentY + direction * step, 8), 260);
    const actualDeltaY = newY - currentY;

    if (Math.abs(actualDeltaY) > 0.0001) {
      this.camera.position.y = newY;
      this.controls.target.y += actualDeltaY;
      this.controls.update();
    }
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
        // 45° Strategic view for battle mode (zoomed by 5 scrolls from (0, 130, 220))
        this.animateTo(new THREE.Vector3(0, 100.6, 178.15), new THREE.Vector3(0, 0, 35), 800);
      }
    } else if (preset === 'top') {
      // Top-down tactical view (zoomed by 5 scrolls from (0, 260, 0.1))
      this.animateTo(new THREE.Vector3(0, 201.2, 0.08), new THREE.Vector3(0, 0, 0), 800);
    } else if (preset === 'cinematic') {
      // Low-angle cinematic vista (zoomed by 5 scrolls from (-120, 55, 95))
      this.animateTo(new THREE.Vector3(-92.85, 43.46, 73.51), new THREE.Vector3(0, 4, 0), 1000);
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

