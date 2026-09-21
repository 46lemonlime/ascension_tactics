import * as THREE from 'three';
import { GRID_COLS, GRID_ROWS, TILE_SIZE, gridToWorld, worldToGrid } from '../data/constants';
import { THEMES } from '../data/themes';
import type { Theme, Unit, UnitDef, Faction } from '../data/types';
import { CameraController } from './camera';
import { createObstacleMeshes } from './terrain';
import { FogOfWarMeshManager } from './fow-mesh';
import { createSquadUnitMesh } from './models';

export class GameScene {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  public cameraController: CameraController;
  public fowManager: FogOfWarMeshManager;
  public unitMeshes: Map<number, THREE.Group> = new Map();

  private tableMatMesh!: THREE.Mesh;
  private gridLinesMesh!: THREE.LineSegments;
  private weatherParticles?: THREE.Points;
  private highlightGroup: THREE.Group;
  private obstaclesGroup?: THREE.Group;
  private raycaster: THREE.Raycaster;
  private mouseVec: THREE.Vector2;
  private currentThemeId: string = 'jungle';

  constructor(container: HTMLElement) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.5, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    container.appendChild(this.renderer.domElement);

    this.cameraController = new CameraController(this.camera, this.renderer.domElement);
    this.fowManager = new FogOfWarMeshManager();
    this.scene.add(this.fowManager.group);

    this.highlightGroup = new THREE.Group();
    this.highlightGroup.name = 'highlight_group';
    this.scene.add(this.highlightGroup);

    this.raycaster = new THREE.Raycaster();
    this.mouseVec = new THREE.Vector2();

    this.initBoard('jungle');
    this.setupLighting();

    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  public initBoard(themeId: string): void {
    this.currentThemeId = themeId;
    const theme: Theme = THEMES[themeId] || THEMES.jungle;

    this.scene.background = new THREE.Color(theme.skyColor || 0x0a0c10);
    this.scene.fog = new THREE.FogExp2(theme.fogColor || 0x0a0c10, 0.0035);

    // Remove existing table and obstacles
    if (this.tableMatMesh) this.scene.remove(this.tableMatMesh);
    if (this.gridLinesMesh) this.scene.remove(this.gridLinesMesh);
    if (this.obstaclesGroup) this.scene.remove(this.obstaclesGroup);
    if (this.weatherParticles) this.scene.remove(this.weatherParticles);

    // Tabletop battle mat
    const totalW = GRID_COLS * TILE_SIZE;
    const totalH = GRID_ROWS * TILE_SIZE;
    const matGeo = new THREE.PlaneGeometry(totalW, totalH);
    matGeo.rotateX(-Math.PI / 2);

    const matMaterial = new THREE.MeshStandardMaterial({
      color: theme.groundColor,
      roughness: 0.85,
      metalness: 0.1
    });

    this.tableMatMesh = new THREE.Mesh(matGeo, matMaterial);
    this.tableMatMesh.receiveShadow = true;
    this.tableMatMesh.name = 'battle_mat';
    this.scene.add(this.tableMatMesh);

    // Table outer beveled wooden rim / frame
    const rimThickness = 12;
    const rimMat = new THREE.MeshStandardMaterial({ color: 0x1a120b, roughness: 0.7 });
    const rimGeo = new THREE.BoxGeometry(totalW + rimThickness * 2, 2.0, totalH + rimThickness * 2);
    const rimMesh = new THREE.Mesh(rimGeo, rimMat);
    rimMesh.position.y = -1.0;
    rimMesh.receiveShadow = true;
    this.scene.add(rimMesh);

    // Subtle grid lines
    const gridHelper = new THREE.GridHelper(Math.max(totalW, totalH), GRID_ROWS, 0x445566, 0x223344);
    gridHelper.position.y = 0.02;
    gridHelper.scale.set(totalW / (GRID_ROWS * TILE_SIZE), 1, 1);
    this.gridLinesMesh = gridHelper as unknown as THREE.LineSegments;
    this.scene.add(this.gridLinesMesh);

    // Obstacles
    this.obstaclesGroup = createObstacleMeshes(themeId);
    this.scene.add(this.obstaclesGroup);

    // Atmospheric Weather Particles
    this.createWeatherParticles(theme);
  }

  private setupLighting(): void {
    const ambientLight = new THREE.AmbientLight(0xddeeff, 0.7);
    this.scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffbf0, 1.4);
    sunLight.position.set(60, 120, 80);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 300;
    sunLight.shadow.camera.left = -140;
    sunLight.shadow.camera.right = 140;
    sunLight.shadow.camera.top = 180;
    sunLight.shadow.camera.bottom = -180;
    sunLight.shadow.bias = -0.0005;
    this.scene.add(sunLight);

    const hemiLight = new THREE.HemisphereLight(0x88bbff, 0x332211, 0.4);
    this.scene.add(hemiLight);
  }

  private createWeatherParticles(theme: Theme): void {
    const particleCount = 600;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    const rangeX = GRID_COLS * TILE_SIZE;
    const rangeZ = GRID_ROWS * TILE_SIZE;

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * rangeX * 1.2;
      positions[i * 3 + 1] = Math.random() * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * rangeZ * 1.2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: theme.particleColor || 0xffffff,
      size: 0.8,
      transparent: true,
      opacity: 0.5
    });

    this.weatherParticles = new THREE.Points(geometry, material);
    this.scene.add(this.weatherParticles);
  }

  public addOrUpdateUnitMesh(unit: Unit, unitDef: UnitDef, faction: Faction | undefined): THREE.Group {
    let mesh = this.unitMeshes.get(unit.id);
    if (!mesh) {
      mesh = createSquadUnitMesh(unit, unitDef, faction);
      this.unitMeshes.set(unit.id, mesh);
      this.scene.add(mesh);
    }

    const worldPos = gridToWorld(unit.c, unit.r);
    mesh.position.set(worldPos.x, 0, worldPos.z);
    mesh.rotation.y = unit.rotation || 0;

    return mesh;
  }

  public removeUnitMesh(unitId: number): void {
    const mesh = this.unitMeshes.get(unitId);
    if (mesh) {
      this.scene.remove(mesh);
      this.unitMeshes.delete(unitId);
    }
  }

  public clearHighlights(): void {
    while (this.highlightGroup.children.length > 0) {
      const child = this.highlightGroup.children[0];
      this.highlightGroup.remove(child);
    }
  }

  /**
   * Highlights a set of grid tiles with a specific color
   */
  public highlightTiles(tiles: Array<{ c: number; r: number }>, colorHex: number = 0x00f3ff, opacity: number = 0.35): void {
    const tileGeo = new THREE.PlaneGeometry(TILE_SIZE * 0.92, TILE_SIZE * 0.92);
    tileGeo.rotateX(-Math.PI / 2);

    tiles.forEach(tile => {
      const mat = new THREE.MeshBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity,
        depthWrite: false,
        side: THREE.DoubleSide
      });
      const mesh = new THREE.Mesh(tileGeo, mat);
      const wPos = gridToWorld(tile.c, tile.r);
      mesh.position.set(wPos.x, 0.06, wPos.z);
      this.highlightGroup.add(mesh);
    });
  }

  /**
   * Raycast from mouse screen coordinates to ground grid (c, r)
   */
  public raycastGround(clientX: number, clientY: number): { c: number; r: number; worldPoint: THREE.Vector3 } | null {
    this.mouseVec.x = (clientX / window.innerWidth) * 2 - 1;
    this.mouseVec.y = -(clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouseVec, this.camera);
    const intersects = this.raycaster.intersectObject(this.tableMatMesh);

    if (intersects.length > 0) {
      const pt = intersects[0].point;
      const grid = worldToGrid(pt.x, pt.z);
      return { c: grid.c, r: grid.r, worldPoint: pt };
    }
    return null;
  }

  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  public render(dt: number): void {
    this.cameraController.update();

    if (this.weatherParticles) {
      const positions = this.weatherParticles.geometry.attributes.position.array as Float32Array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] -= 15 * dt;
        if (positions[i] < 0) positions[i] = 40;
      }
      this.weatherParticles.geometry.attributes.position.needsUpdate = true;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
