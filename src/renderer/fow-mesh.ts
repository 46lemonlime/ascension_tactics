import * as THREE from 'three';
import { GRID_COLS, GRID_ROWS, TILE_SIZE, gridToWorld } from '../data/constants';

/**
 * Fog of War 3D Shroud Overlay Manager
 * Manages an instanced or matrix-based grid overlay that dims/blacks out tiles
 * that are unexplored or not currently in Line-of-Sight.
 */
export class FogOfWarMeshManager {
  public group: THREE.Group;
  private instancedMesh: THREE.InstancedMesh;
  private dummy: THREE.Object3D;
  private colorArray: Float32Array;

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'fog_of_war_mesh';
    this.dummy = new THREE.Object3D();

    const tileGeo = new THREE.PlaneGeometry(TILE_SIZE * 0.98, TILE_SIZE * 0.98);
    tileGeo.rotateX(-Math.PI / 2);

    const tileMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.85,
      depthWrite: false
    });

    const totalTiles = GRID_COLS * GRID_ROWS;
    this.instancedMesh = new THREE.InstancedMesh(tileGeo, tileMat, totalTiles);
    this.instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    this.colorArray = new Float32Array(totalTiles * 3);

    // Initialize positions for all tiles
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        const idx = r * GRID_COLS + c;
        const wPos = gridToWorld(c, r);
        this.dummy.position.set(wPos.x, 0.04, wPos.z);
        this.dummy.scale.set(1, 1, 1);
        this.dummy.updateMatrix();
        this.instancedMesh.setMatrixAt(idx, this.dummy.matrix);

        // Black default
        this.colorArray[idx * 3] = 0.02;
        this.colorArray[idx * 3 + 1] = 0.02;
        this.colorArray[idx * 3 + 2] = 0.04;
      }
    }

    this.instancedMesh.instanceColor = new THREE.InstancedBufferAttribute(this.colorArray, 3);
    this.instancedMesh.instanceMatrix.needsUpdate = true;
    this.group.add(this.instancedMesh);
  }

  /**
   * Updates tile visibility from the game state FoW grid
   * 0 = Unexplored (full black), 1 = Explored but out of view (dim grey shroud), 2 = Visible (clear)
   */
  public updateVisibility(fowGrid: number[][]): void {
    if (!fowGrid || fowGrid.length === 0) return;

    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        const idx = r * GRID_COLS + c;
        const state = fowGrid[r]?.[c] ?? 0;
        const wPos = gridToWorld(c, r);

        if (state === 2) {
          // Visible: scale to 0 (invisible shroud)
          this.dummy.position.set(wPos.x, -100, wPos.z);
          this.dummy.scale.set(0, 0, 0);
        } else if (state === 1) {
          // Explored (fog shroud): half transparent / dimmed
          this.dummy.position.set(wPos.x, 0.04, wPos.z);
          this.dummy.scale.set(1, 1, 1);
          this.instancedMesh.setColorAt(idx, new THREE.Color(0.05, 0.06, 0.1));
        } else {
          // Unexplored (full blackout shroud)
          this.dummy.position.set(wPos.x, 0.04, wPos.z);
          this.dummy.scale.set(1, 1, 1);
          this.instancedMesh.setColorAt(idx, new THREE.Color(0.01, 0.01, 0.02));
        }

        this.dummy.updateMatrix();
        this.instancedMesh.setMatrixAt(idx, this.dummy.matrix);
      }
    }

    this.instancedMesh.instanceMatrix.needsUpdate = true;
    if (this.instancedMesh.instanceColor) {
      this.instancedMesh.instanceColor.needsUpdate = true;
    }
  }

  public setVisible(visible: boolean): void {
    this.group.visible = visible;
  }
}
