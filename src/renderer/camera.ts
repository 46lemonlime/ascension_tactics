import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { gridToWorld, GRID_COLS } from '../data/constants';

export interface CameraHistoryEntry {
  position: THREE.Vector3;
  target: THREE.Vector3;
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
   * Angled 45 degrees looking at Player 1's starting zone
   */
  public frameDeploymentZone(): void {
    const p1Center = gridToWorld(Math.floor(GRID_COLS / 2), 48);
    const target = new THREE.Vector3(p1Center.x, 0, p1Center.z - 10);
    const eye = new THREE.Vector3(p1Center.x, 55, p1Center.z + 45);

    this.camera.position.copy(eye);
    this.controls.target.copy(target);
    this.controls.update();
  }

  /**
   * Switches predefined camera preset angles
   */
  public setPresetView(preset: 'tactical' | 'iso' | 'top' | 'cinematic'): void {
    this.pushHistory();
    const currentTarget = this.controls.target.clone();

    switch (preset) {
      case 'top':
        this.animateTo(new THREE.Vector3(currentTarget.x, 140, currentTarget.z + 0.1), currentTarget, 500);
        break;
      case 'iso':
        this.animateTo(new THREE.Vector3(currentTarget.x + 60, 70, currentTarget.z + 60), currentTarget, 500);
        break;
      case 'cinematic':
        this.animateTo(new THREE.Vector3(currentTarget.x, 22, currentTarget.z + 28), currentTarget, 500);
        break;
      case 'tactical':
      default:
        this.animateTo(new THREE.Vector3(currentTarget.x, 80, currentTarget.z + 65), currentTarget, 500);
        break;
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

  /**
   * Smooth camera interpolation
   */
  public animateTo(targetEye: THREE.Vector3, targetLookAt: THREE.Vector3, durationMs: number = 400): void {
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
        requestAnimationFrame(step);
      } else {
        this.isAnimating = false;
      }
    };

    requestAnimationFrame(step);
  }

  public update(): void {
    if (!this.isAnimating) {
      this.controls.update();
    }
  }
}
