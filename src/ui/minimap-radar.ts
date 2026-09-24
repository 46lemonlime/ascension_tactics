import { GRID_COLS, GRID_ROWS, MAP_OBSTACLES, gridToWorld } from '../data/constants';
import { THEMES } from '../data/themes';
import type { GameState } from '../data/types';
import type { CameraController } from '../renderer/camera';
import * as THREE from 'three';

export class MinimapRadar {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private cameraController: CameraController;
  private bgCanvas: HTMLCanvasElement;
  private bgCtx: CanvasRenderingContext2D;
  private currentTheme: string = '';
  private titleEl: HTMLElement | null = null;

  constructor(cameraController: CameraController) {
    let el = document.getElementById('minimap-canvas') as HTMLCanvasElement;
    if (!el) {
      el = document.createElement('canvas');
      el.id = 'minimap-canvas';
      el.className = 'minimap-canvas';
      const container = document.getElementById('minimap-container') || document.body;
      container.appendChild(el);
    }
    this.canvas = el;
    this.canvas.width = 160;
    this.canvas.height = 224; // 40x56 aspect ratio
    this.ctx = this.canvas.getContext('2d')!;
    this.cameraController = cameraController;

    // Pre-rendered offscreen background cache
    this.bgCanvas = document.createElement('canvas');
    this.bgCanvas.width = this.canvas.width;
    this.bgCanvas.height = this.canvas.height;
    this.bgCtx = this.bgCanvas.getContext('2d')!;

    this.titleEl = document.getElementById('minimap-title');

    this.setupInteractions();
  }

  private setupInteractions(): void {
    const handleMinimapClick = (e: MouseEvent) => {
      const rect = this.canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const normX = Math.max(0, Math.min(1, clickX / rect.width));
      const normY = Math.max(0, Math.min(1, clickY / rect.height));

      const col = Math.floor(normX * GRID_COLS);
      const row = Math.floor(normY * GRID_ROWS);

      const targetPos = gridToWorld(col, row);
      this.cameraController.focusOnWorld(new THREE.Vector3(targetPos.x, 0, targetPos.z));
    };

    this.canvas.addEventListener('click', handleMinimapClick);
  }

  private updateBackground(themeId: string): void {
    this.currentTheme = themeId;
    const themeObj = THEMES[themeId] || THEMES.jungle;
    if (this.titleEl && this.titleEl.textContent !== themeObj.name) {
      this.titleEl.textContent = themeObj.name;
    }

    const w = this.bgCanvas.width;
    const h = this.bgCanvas.height;
    const ctx = this.bgCtx;

    // Background
    ctx.fillStyle = '#060a12';
    ctx.fillRect(0, 0, w, h);

    const cellW = w / GRID_COLS;
    const cellH = h / GRID_ROWS;

    // Grid lines (subtle)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let c = 0; c < GRID_COLS; c += 8) {
      ctx.beginPath();
      ctx.moveTo(c * cellW, 0);
      ctx.lineTo(c * cellW, h);
      ctx.stroke();
    }
    for (let r = 0; r < GRID_ROWS; r += 8) {
      ctx.beginPath();
      ctx.moveTo(0, r * cellH);
      ctx.lineTo(w, r * cellH);
      ctx.stroke();
    }

    // Draw Obstacles once onto offscreen background canvas
    const obstacles: string[] = (MAP_OBSTACLES[themeId] || MAP_OBSTACLES.jungle) as string[];
    ctx.fillStyle = '#1e293b';
    obstacles.forEach(k => {
      const [ox, oz] = k.split(',').map(Number);
      ctx.fillRect(ox * cellW + 1, oz * cellH + 1, cellW - 2, cellH - 2);
    });
  }

  public render(state: GameState): void {
    if (state.theme !== this.currentTheme) {
      this.updateBackground(state.theme);
    }

    const w = this.canvas.width;
    const h = this.canvas.height;
    const ctx = this.ctx;
    const cellW = w / GRID_COLS;
    const cellH = h / GRID_ROWS;

    // 1. Fast blit of pre-rendered background
    ctx.drawImage(this.bgCanvas, 0, 0);

    // 2. Draw Objectives / Extraction
    if (state.mission === 'domination' && state.objectives) {
      state.objectives.forEach(obj => {
        ctx.fillStyle = obj.controlledBy === 1 ? '#00f3ff' : (obj.controlledBy === 2 ? '#ff2a6d' : '#ffcc00');
        ctx.beginPath();
        ctx.arc((obj.c + 0.5) * cellW, (obj.r + 0.5) * cellH, obj.radius * cellW, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    if (state.mission === 'escort') {
      ctx.fillStyle = '#10b981';
      ctx.fillRect((state.escortTargetC - 1) * cellW, (state.escortTargetR - 1) * cellH, 3 * cellW, 3 * cellH);
    }

    // 3. Draw Units
    state.units.forEach(u => {
      // If enemy is hidden in Fog of War, do NOT draw on minimap!
      if (u.player === 2 && state.fow[u.r]?.[u.c] !== 2) {
        return;
      }

      if (u.isVip) {
        ctx.fillStyle = '#f59e0b';
      } else {
        ctx.fillStyle = u.player === 1 ? '#00f3ff' : '#ff2a6d';
      }

      const size = (u.size || 1) * cellW * 0.9;
      ctx.fillRect(u.c * cellW, u.r * cellH, Math.max(3, size), Math.max(3, size));
    });

    // 4. Draw Camera Viewport Frustum on Minimap
    const camTarget = this.cameraController.controls.target;
    // projection of camera target to minimap
    const centerC = (camTarget.x / 6.0) + (GRID_COLS / 2);
    const centerR = (camTarget.z / 6.0) + (GRID_ROWS / 2);

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.strokeRect((centerC - 4) * cellW, (centerR - 4) * cellH, 8 * cellW, 8 * cellH);
  }
}
