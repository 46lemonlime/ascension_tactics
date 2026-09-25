import * as THREE from 'three';
import { GRID_COLS, GRID_ROWS, TILE_SIZE, DEPLOYMENT_ZONES, gridToWorld, worldToGrid, rnd } from '../data/constants';
import { THEMES, initObstaclesForTheme } from '../data/themes';
import type { Theme, Unit, UnitDef, Faction } from '../data/types';
import { CameraController } from './camera';
import { createObstacleMeshes } from './terrain';
import { createBattleMatTexture } from './textures';
import { createSquadUnitMesh } from './models';

export class GameScene {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  public cameraController: CameraController;
  public unitMeshes: Map<number, THREE.Group> = new Map();
  public fowMeshes: Map<string, THREE.Mesh> = new Map();
  public fowGroup: THREE.Group = new THREE.Group();

  private tableMatMesh!: THREE.Mesh;
  private tableMatMaterial!: THREE.MeshStandardMaterial;
  private rimMesh!: THREE.Mesh;
  private rimMatMaterial!: THREE.MeshStandardMaterial;
  private weatherParticles!: THREE.Points;
  private weatherGeometry!: THREE.BufferGeometry;
  private weatherMaterial!: THREE.PointsMaterial;
  private weatherParticleCount: number = 1000;
  private weatherVelocities: Array<{ vx: number; vy: number; vz: number }> = [];
  private highlightGroup: THREE.Group;
  private obstaclesGroup?: THREE.Group;
  private raycaster: THREE.Raycaster;
  private mouseVec: THREE.Vector2;
  private currentThemeId: string = 'jungle';
  private targetingRayMesh: THREE.Mesh;
  private targetingRayMat: THREE.MeshBasicMaterial;

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

    this.highlightGroup = new THREE.Group();
    this.highlightGroup.name = 'highlight_group';
    this.scene.add(this.highlightGroup);

    const targetingRayGeo = new THREE.CylinderGeometry(0.08, 0.08, 1, 6);
    targetingRayGeo.rotateX(Math.PI / 2);
    this.targetingRayMat = new THREE.MeshBasicMaterial({
      color: 0x22c55e,
      transparent: true,
      opacity: 0,
      depthWrite: false
    });
    this.targetingRayMesh = new THREE.Mesh(targetingRayGeo, this.targetingRayMat);
    this.targetingRayMesh.renderOrder = 999;
    this.scene.add(this.targetingRayMesh);

    this.raycaster = new THREE.Raycaster();
    this.mouseVec = new THREE.Vector2();

    this.initWeatherSystem();
    this.initBoard('jungle');
    this.setupLighting();

    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  private initWeatherSystem(): void {
    this.weatherGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.weatherParticleCount * 3);
    const colors = new Float32Array(this.weatherParticleCount * 3);
    this.weatherVelocities = [];

    const totalW = GRID_COLS * TILE_SIZE;
    const totalH = GRID_ROWS * TILE_SIZE;

    for (let i = 0; i < this.weatherParticleCount; i++) {
      positions[i * 3] = rnd(-totalW / 2 - 10, totalW / 2 + 10);
      positions[i * 3 + 1] = rnd(0, 42);
      positions[i * 3 + 2] = rnd(-totalH / 2 - 10, totalH / 2 + 10);

      colors[i * 3] = 0.8;
      colors[i * 3 + 1] = 0.85;
      colors[i * 3 + 2] = 0.9;

      this.weatherVelocities.push({
        vx: rnd(-0.04, 0.04),
        vy: rnd(-0.06, -0.02),
        vz: rnd(-0.04, 0.04)
      });
    }

    this.weatherGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.weatherGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    this.weatherMaterial = new THREE.PointsMaterial({
      vertexColors: true,
      size: 0.42,
      transparent: true,
      opacity: 0.85
    });

    this.weatherParticles = new THREE.Points(this.weatherGeometry, this.weatherMaterial);
    this.scene.add(this.weatherParticles);
  }

  public initBoard(themeId: string): void {
    this.currentThemeId = themeId;
    const theme: Theme = THEMES[themeId] || THEMES.jungle;

    // Space around the table remains neutral deep dark void
    this.scene.background = new THREE.Color(0x06080c);
    this.scene.fog = new THREE.FogExp2(0x080a0f, 0.0055);

    // Remove existing table, grid, obstacles
    if (this.tableMatMesh) {
      this.scene.remove(this.tableMatMesh);
      if (this.tableMatMaterial && this.tableMatMaterial.map) this.tableMatMaterial.map.dispose();
      this.tableMatMesh.geometry.dispose();
      if (this.tableMatMaterial) this.tableMatMaterial.dispose();
    }
    if (this.rimMesh) {
      this.scene.remove(this.rimMesh);
      this.rimMesh.geometry.dispose();
      if (this.rimMatMaterial) this.rimMatMaterial.dispose();
    }
    if (this.obstaclesGroup) {
      this.scene.remove(this.obstaclesGroup);
    }
    if (this.fowGroup) {
      this.scene.remove(this.fowGroup);
      this.fowMeshes.clear();
    }

    // 1. Rebuild Obstacles data set for the selected theme
    initObstaclesForTheme(themeId);

    // 2. Playable Tabletop battle mat with authentic canvas texture (exact 240x336 playable area)
    const totalW = GRID_COLS * TILE_SIZE;
    const totalH = GRID_ROWS * TILE_SIZE;
    const matGeo = new THREE.BoxGeometry(totalW, 1.5, totalH);

    const matTexture = createBattleMatTexture(theme.id);
    this.tableMatMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.85,
      metalness: 0.15,
      map: matTexture
    });

    this.tableMatMesh = new THREE.Mesh(matGeo, this.tableMatMaterial);
    this.tableMatMesh.position.y = -0.75;
    this.tableMatMesh.receiveShadow = true;
    this.tableMatMesh.name = 'battle_mat';
    this.scene.add(this.tableMatMesh);

    // 3. Table outer beveled wooden rim / frame surrounding the playable mat
    this.rimMatMaterial = new THREE.MeshStandardMaterial({
      color: 0x080a0f,
      roughness: 0.5,
      metalness: 0.4
    });
    const rimGeo = new THREE.BoxGeometry(totalW + 4, 1.8, totalH + 4);
    this.rimMesh = new THREE.Mesh(rimGeo, this.rimMatMaterial);
    this.rimMesh.position.y = -1.0;
    this.rimMesh.receiveShadow = true;
    this.scene.add(this.rimMesh);

    // 4. Build rich thematic 3D obstacles
    this.obstaclesGroup = createObstacleMeshes(themeId);
    this.scene.add(this.obstaclesGroup);

    // 6. Build 3D Fog of War (FoW) Shroud Overlay (40x56 grid)
    this.fowGroup = new THREE.Group();
    this.fowGroup.name = 'fow_group';
    this.fowGroup.visible = false; // Hidden during deployment
    this.scene.add(this.fowGroup);

    const fowGeo = new THREE.PlaneGeometry(TILE_SIZE * 1.0, TILE_SIZE * 1.0);
    fowGeo.rotateX(-Math.PI / 2);

    for (let z = 0; z < GRID_ROWS; z++) {
      for (let x = 0; x < GRID_COLS; x++) {
        const k = `${x},${z}`;
        const fowMat = new THREE.MeshBasicMaterial({
          color: 0x05080e,
          transparent: true,
          opacity: 0.84,
          depthWrite: false
        });
        const fowMesh = new THREE.Mesh(fowGeo, fowMat);
        const wPos = gridToWorld(x, z);
        fowMesh.position.set(wPos.x, 0.025, wPos.z);
        this.fowGroup.add(fowMesh);
        this.fowMeshes.set(k, fowMesh);
      }
    }

    // 7. Update atmospheric weather particles
    this.updateWeatherParticles(themeId);

    // 8. Update Minimap Header Title
    const minimapTitle = document.getElementById('minimap-title');
    if (minimapTitle) {
      minimapTitle.textContent = theme.name;
    }
  }

  public setFowVisible(visible: boolean): void {
    if (this.fowGroup) {
      this.fowGroup.visible = visible;
    }
  }

  public updateFowOverlay(playerAwareSet: Set<string>): void {
    this.fowMeshes.forEach((mesh, k) => {
      if (playerAwareSet.has(k)) {
        (mesh.material as THREE.MeshBasicMaterial).opacity = 0;
        mesh.visible = false;
      } else {
        (mesh.material as THREE.MeshBasicMaterial).opacity = 0.84;
        mesh.visible = true;
      }
    });
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

  public updateWeatherParticles(themeId: string): void {
    const theme = THEMES[themeId] || THEMES.tech;
    if (!this.weatherParticles) return;

    if (theme.particleType === 'none') {
      this.weatherParticles.visible = false;
      return;
    }

    this.weatherParticles.visible = true;
    this.weatherMaterial.size = theme.particleSize || 0.42;
    this.weatherMaterial.opacity = theme.particleOpacity || 0.85;

    const posArr = this.weatherGeometry.attributes.position.array as Float32Array;
    const colArr = this.weatherGeometry.attributes.color.array as Float32Array;
    const COLS = GRID_COLS;
    const ROWS = GRID_ROWS;

    for (let i = 0; i < this.weatherParticleCount; i++) {
      if (theme.particleType === 'rain') {
        // Rapid downward falling jungle rain
        this.weatherVelocities[i] = { vx: rnd(-0.02, 0.02), vy: rnd(-0.80, -1.25), vz: rnd(-0.02, 0.02) };
        posArr[i * 3] = rnd(-COLS * TILE_SIZE / 2 - 10, COLS * TILE_SIZE / 2 + 10);
        posArr[i * 3 + 1] = rnd(0, 45);
        posArr[i * 3 + 2] = rnd(-ROWS * TILE_SIZE / 2 - 10, ROWS * TILE_SIZE / 2 + 10);
        colArr[i * 3] = 0.38;
        colArr[i * 3 + 1] = 0.65;
        colArr[i * 3 + 2] = 0.98;
      } else if (theme.particleType === 'sand') {
        // Fast blowing desert sandstorm
        this.weatherVelocities[i] = { vx: rnd(0.20, 0.45), vy: rnd(-0.03, 0.01), vz: rnd(-0.04, 0.04) };
        posArr[i * 3] = rnd(-COLS * TILE_SIZE / 2 - 15, COLS * TILE_SIZE / 2 + 15);
        posArr[i * 3 + 1] = rnd(0.5, 32);
        posArr[i * 3 + 2] = rnd(-ROWS * TILE_SIZE / 2 - 10, ROWS * TILE_SIZE / 2 + 10);
        colArr[i * 3] = 0.98;
        colArr[i * 3 + 1] = 0.82;
        colArr[i * 3 + 2] = 0.35;
      } else if (theme.particleType === 'snow') {
        // Gentle fluttering snowflakes
        this.weatherVelocities[i] = { vx: rnd(-0.04, 0.04), vy: rnd(-0.06, -0.12), vz: rnd(-0.04, 0.04) };
        posArr[i * 3] = rnd(-COLS * TILE_SIZE / 2 - 10, COLS * TILE_SIZE / 2 + 10);
        posArr[i * 3 + 1] = rnd(0, 42);
        posArr[i * 3 + 2] = rnd(-ROWS * TILE_SIZE / 2 - 10, ROWS * TILE_SIZE / 2 + 10);
        colArr[i * 3] = 1.0;
        colArr[i * 3 + 1] = 1.0;
        colArr[i * 3 + 2] = 1.0;
      } else if (theme.particleType === 'astral') {
        // Floating cosmic shimmer / crystal motes
        this.weatherVelocities[i] = { vx: rnd(-0.03, 0.03), vy: rnd(0.02, 0.07), vz: rnd(-0.03, 0.03) };
        posArr[i * 3] = rnd(-COLS * TILE_SIZE / 2 - 8, COLS * TILE_SIZE / 2 + 8);
        posArr[i * 3 + 1] = rnd(0.5, 34);
        posArr[i * 3 + 2] = rnd(-ROWS * TILE_SIZE / 2 - 8, ROWS * TILE_SIZE / 2 + 8);
        if (i % 2 === 0) {
          colArr[i * 3] = 0.4;
          colArr[i * 3 + 1] = 0.9;
          colArr[i * 3 + 2] = 1.0;
        } else {
          colArr[i * 3] = 0.8;
          colArr[i * 3 + 1] = 0.4;
          colArr[i * 3 + 2] = 1.0;
        }
      } else if (theme.particleType === 'corruption') {
        // Dark crimson daemon spores & toxic miasma
        this.weatherVelocities[i] = { vx: rnd(-0.04, 0.04), vy: rnd(-0.03, 0.02), vz: rnd(-0.04, 0.04) };
        posArr[i * 3] = rnd(-COLS * TILE_SIZE / 2 - 10, COLS * TILE_SIZE / 2 + 10);
        posArr[i * 3 + 1] = rnd(0.5, 32);
        posArr[i * 3 + 2] = rnd(-ROWS * TILE_SIZE / 2 - 10, ROWS * TILE_SIZE / 2 + 10);
        colArr[i * 3] = rnd(0.8, 1.0);
        colArr[i * 3 + 1] = rnd(0.05, 0.2);
        colArr[i * 3 + 2] = rnd(0.2, 0.5);
      } else if (theme.particleType === 'acid') {
        // Rising digestion mist & toxic bile vapors
        this.weatherVelocities[i] = { vx: rnd(-0.02, 0.02), vy: rnd(0.03, 0.08), vz: rnd(-0.02, 0.02) };
        posArr[i * 3] = rnd(-COLS * TILE_SIZE / 2 - 8, COLS * TILE_SIZE / 2 + 8);
        posArr[i * 3 + 1] = rnd(0.5, 26);
        posArr[i * 3 + 2] = rnd(-ROWS * TILE_SIZE / 2 - 8, ROWS * TILE_SIZE / 2 + 8);
        colArr[i * 3] = rnd(0.45, 0.65);
        colArr[i * 3 + 1] = rnd(0.85, 1.0);
        colArr[i * 3 + 2] = rnd(0.05, 0.25);
      } else if (theme.particleType === 'gauss') {
        // Living-metal electromagnetic spark motes
        this.weatherVelocities[i] = { vx: rnd(-0.05, 0.05), vy: rnd(0.03, 0.10), vz: rnd(-0.05, 0.05) };
        posArr[i * 3] = rnd(-COLS * TILE_SIZE / 2 - 8, COLS * TILE_SIZE / 2 + 8);
        posArr[i * 3 + 1] = rnd(0.5, 30);
        posArr[i * 3 + 2] = rnd(-ROWS * TILE_SIZE / 2 - 8, ROWS * TILE_SIZE / 2 + 8);
        colArr[i * 3] = rnd(0.15, 0.45);
        colArr[i * 3 + 1] = 1.0;
        colArr[i * 3 + 2] = rnd(0.4, 0.7);
      } else if (theme.particleType === 'rift') {
        // Rising embers and warp fire motes
        this.weatherVelocities[i] = { vx: rnd(-0.05, 0.05), vy: rnd(0.08, 0.22), vz: rnd(-0.05, 0.05) };
        posArr[i * 3] = rnd(-COLS * TILE_SIZE / 2 - 8, COLS * TILE_SIZE / 2 + 8);
        posArr[i * 3 + 1] = rnd(0.5, 36);
        posArr[i * 3 + 2] = rnd(-ROWS * TILE_SIZE / 2 - 8, ROWS * TILE_SIZE / 2 + 8);
        if (i % 3 === 0) {
          colArr[i * 3] = 1.0; colArr[i * 3 + 1] = 0.35; colArr[i * 3 + 2] = 0.05;
        } else if (i % 3 === 1) {
          colArr[i * 3] = 0.85; colArr[i * 3 + 1] = 0.2; colArr[i * 3 + 2] = 0.85;
        } else {
          colArr[i * 3] = 1.0; colArr[i * 3 + 1] = 0.75; colArr[i * 3 + 2] = 0.1;
        }
      } else if (theme.particleType === 'stars') {
        // Natural 3-tier speed distribution: 40% slow subtle drift, 35% medium transit, 25% fast streaks
        const tierRoll = Math.random();
        let speed: number;
        if (tierRoll < 0.40) {
          speed = rnd(0.015, 0.045);
        } else if (tierRoll < 0.75) {
          speed = rnd(0.07, 0.14);
        } else {
          speed = rnd(0.20, 0.38);
        }

        const theta = Math.random() * Math.PI * 2;
        const phi = rnd(-0.7, 0.7);
        this.weatherVelocities[i] = {
          vx: Math.cos(theta) * Math.cos(phi) * speed,
          vy: Math.sin(phi) * speed * 0.75,
          vz: Math.sin(theta) * Math.cos(phi) * speed
        };

        const inVoid = Math.random() < 0.90;
        if (inVoid) {
          const ringAngle = Math.random() * Math.PI * 2;
          const ringDist = rnd(60, 220);
          posArr[i * 3] = Math.cos(ringAngle) * ringDist;
          posArr[i * 3 + 1] = rnd(-10, 80);
          posArr[i * 3 + 2] = Math.sin(ringAngle) * ringDist;
          colArr[i * 3] = rnd(0.75, 1.0);
          colArr[i * 3 + 1] = rnd(0.85, 1.0);
          colArr[i * 3 + 2] = 1.0;
        } else {
          posArr[i * 3] = rnd(-COLS * TILE_SIZE / 2, COLS * TILE_SIZE / 2);
          posArr[i * 3 + 1] = rnd(12, 40);
          posArr[i * 3 + 2] = rnd(-ROWS * TILE_SIZE / 2, ROWS * TILE_SIZE / 2);
          colArr[i * 3] = 0.03;
          colArr[i * 3 + 1] = 0.04;
          colArr[i * 3 + 2] = 0.06;
        }
      }
    }

    this.weatherGeometry.attributes.position.needsUpdate = true;
    this.weatherGeometry.attributes.color.needsUpdate = true;
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

  public updateDeploymentHighlights(rosterPlayer: Array<{ placed: boolean; x: number | null; z: number | null }> = []): void {
    this.clearHighlights();

    // 1. Highlight Player Deployment Zone (Rows 48–55)
    const pZ = DEPLOYMENT_ZONES.player1;
    const placedSet = new Set<string>();
    rosterPlayer.forEach(card => {
      if (card.placed && card.x !== null && card.z !== null) {
        placedSet.add(`${card.x},${card.z}`);
      }
    });

    const unplacedTiles: Array<{ c: number; r: number }> = [];
    const placedTiles: Array<{ c: number; r: number }> = [];

    for (let r = pZ.minR; r <= pZ.maxR; r++) {
      for (let c = pZ.minC; c <= pZ.maxC; c++) {
        if (placedSet.has(`${c},${r}`)) {
          placedTiles.push({ c, r });
        } else {
          unplacedTiles.push({ c, r });
        }
      }
    }

    // Unplaced tiles: tactical blue overlay
    this.highlightTiles(unplacedTiles, 0x3b82f6, 0.22);
    // Placed units: emerald green base
    this.highlightTiles(placedTiles, 0x10b981, 0.35);

    // 2. Highlight Enemy Deployment Zone (Rows 0–7)
    const eZ = DEPLOYMENT_ZONES.player2;
    const enemyTiles: Array<{ c: number; r: number }> = [];
    for (let r = eZ.minR; r <= eZ.maxR; r++) {
      for (let c = eZ.minC; c <= eZ.maxC; c++) {
        enemyTiles.push({ c, r });
      }
    }
    this.highlightTiles(enemyTiles, 0xef4444, 0.12);
  }

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

  public setTargetingRay(
    startPos: THREE.Vector3 | null,
    endPos: THREE.Vector3 | null,
    status: 'valid' | 'out_of_range' | 'blocked' | 'hidden'
  ): void {
    if (status === 'hidden' || !startPos || !endPos) {
      this.targetingRayMat.opacity = 0;
      return;
    }

    const dist = startPos.distanceTo(endPos);
    this.targetingRayMesh.position.copy(startPos).lerp(endPos, 0.5);
    this.targetingRayMesh.scale.set(1, 1, Math.max(dist, 0.01));
    this.targetingRayMesh.lookAt(endPos);

    if (status === 'out_of_range') {
      this.targetingRayMat.color.setHex(0xeab308); // Yellow
      this.targetingRayMat.opacity = 0.85;
    } else if (status === 'blocked') {
      this.targetingRayMat.color.setHex(0xef4444); // Red
      this.targetingRayMat.opacity = 0.85;
    } else {
      this.targetingRayMat.color.setHex(0x22c55e); // Green
      this.targetingRayMat.opacity = 0.95;
    }
  }

  public raycastUnit(clientX: number, clientY: number, units: Unit[]): Unit | null {
    this.mouseVec.x = (clientX / window.innerWidth) * 2 - 1;
    this.mouseVec.y = -(clientY / window.innerHeight) * 2 + 1;
    this.raycaster.setFromCamera(this.mouseVec, this.camera);

    const meshes: THREE.Object3D[] = [];
    const meshToUnitMap = new Map<THREE.Object3D, Unit>();

    units.filter(u => u.alive && !u.dead).forEach(u => {
      const m = this.unitMeshes.get(u.id);
      if (m) {
        meshes.push(m);
        meshToUnitMap.set(m, u);
      }
    });

    const intersects = this.raycaster.intersectObjects(meshes, true);
    if (intersects.length > 0) {
      let topObj: THREE.Object3D | null = intersects[0].object;
      while (topObj) {
        if (meshToUnitMap.has(topObj)) {
          return meshToUnitMap.get(topObj)!;
        }
        topObj = topObj.parent;
      }
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

    if (this.weatherParticles && this.weatherParticles.visible) {
      const theme = THEMES[this.currentThemeId] || THEMES.tech;
      if (theme.particleType !== 'none') {
        const posArr = this.weatherGeometry.attributes.position.array as Float32Array;
        const COLS = GRID_COLS;
        const ROWS = GRID_ROWS;

        const timeScale = Math.min(Math.max(dt * 60, 0.5), 2.5);

        for (let i = 0; i < this.weatherParticleCount; i++) {
          const v = this.weatherVelocities[i];
          posArr[i * 3] += v.vx * timeScale;
          posArr[i * 3 + 1] += v.vy * timeScale;
          posArr[i * 3 + 2] += v.vz * timeScale;

          if (theme.particleType === 'rain') {
            if (posArr[i * 3 + 1] < 0) {
              posArr[i * 3 + 1] = rnd(28, 42);
              posArr[i * 3] = rnd(-COLS * TILE_SIZE / 2 - 5, COLS * TILE_SIZE / 2 + 5);
              posArr[i * 3 + 2] = rnd(-ROWS * TILE_SIZE / 2 - 5, ROWS * TILE_SIZE / 2 + 5);
            }
          } else if (theme.particleType === 'sand') {
            if (posArr[i * 3] > COLS * TILE_SIZE / 2 + 10) {
              posArr[i * 3] = -COLS * TILE_SIZE / 2 - 10;
              posArr[i * 3 + 1] = rnd(0.5, 24);
              posArr[i * 3 + 2] = rnd(-ROWS * TILE_SIZE / 2 - 5, ROWS * TILE_SIZE / 2 + 5);
            }
          } else if (theme.particleType === 'snow') {
            if (posArr[i * 3 + 1] < 0) {
              posArr[i * 3 + 1] = rnd(26, 35);
              posArr[i * 3] = rnd(-COLS * TILE_SIZE / 2 - 5, COLS * TILE_SIZE / 2 + 5);
              posArr[i * 3 + 2] = rnd(-ROWS * TILE_SIZE / 2 - 5, ROWS * TILE_SIZE / 2 + 5);
            }
          } else if (theme.particleType === 'astral') {
            if (posArr[i * 3 + 1] > 36) {
              posArr[i * 3 + 1] = 0.5;
              posArr[i * 3] = rnd(-COLS * TILE_SIZE / 2 - 8, COLS * TILE_SIZE / 2 + 8);
              posArr[i * 3 + 2] = rnd(-ROWS * TILE_SIZE / 2 - 8, ROWS * TILE_SIZE / 2 + 8);
            }
          } else if (theme.particleType === 'corruption') {
            if (posArr[i * 3 + 1] < 0 || posArr[i * 3 + 1] > 34) {
              posArr[i * 3 + 1] = rnd(2, 32);
              posArr[i * 3] = rnd(-COLS * TILE_SIZE / 2 - 8, COLS * TILE_SIZE / 2 + 8);
              posArr[i * 3 + 2] = rnd(-ROWS * TILE_SIZE / 2 - 8, ROWS * TILE_SIZE / 2 + 8);
            }
          } else if (theme.particleType === 'acid') {
            if (posArr[i * 3 + 1] > 28) {
              posArr[i * 3 + 1] = 0.5;
              posArr[i * 3] = rnd(-COLS * TILE_SIZE / 2 - 8, COLS * TILE_SIZE / 2 + 8);
              posArr[i * 3 + 2] = rnd(-ROWS * TILE_SIZE / 2 - 8, ROWS * TILE_SIZE / 2 + 8);
            }
          } else if (theme.particleType === 'gauss') {
            if (posArr[i * 3 + 1] > 32) {
              posArr[i * 3 + 1] = 0.5;
              posArr[i * 3] = rnd(-COLS * TILE_SIZE / 2 - 8, COLS * TILE_SIZE / 2 + 8);
              posArr[i * 3 + 2] = rnd(-ROWS * TILE_SIZE / 2 - 8, ROWS * TILE_SIZE / 2 + 8);
            }
          } else if (theme.particleType === 'rift') {
            if (posArr[i * 3 + 1] > 38) {
              posArr[i * 3 + 1] = 0.5;
              posArr[i * 3] = rnd(-COLS * TILE_SIZE / 2 - 8, COLS * TILE_SIZE / 2 + 8);
              posArr[i * 3 + 2] = rnd(-ROWS * TILE_SIZE / 2 - 8, ROWS * TILE_SIZE / 2 + 8);
            }
          } else if (theme.particleType === 'stars') {
            if (posArr[i * 3] > 120) posArr[i * 3] = -120;
            else if (posArr[i * 3] < -120) posArr[i * 3] = 120;

            if (posArr[i * 3 + 1] > 56) posArr[i * 3 + 1] = -6;
            else if (posArr[i * 3 + 1] < -8) posArr[i * 3 + 1] = 52;

            if (posArr[i * 3 + 2] > 135) posArr[i * 3 + 2] = -135;
            else if (posArr[i * 3 + 2] < -135) posArr[i * 3 + 2] = 135;

            // View tunnel attenuation
            const px = posArr[i * 3], py = posArr[i * 3 + 1], pz = posArr[i * 3 + 2];
            const cx = this.camera.position.x, cy = this.camera.position.y, cz = this.camera.position.z;
            const tx = this.cameraController.controls.target.x, ty = this.cameraController.controls.target.y, tz = this.cameraController.controls.target.z;

            const vx = tx - cx, vy = ty - cy, vz = tz - cz;
            const lenSq = vx * vx + vy * vy + vz * vz;
            const dot = (px - cx) * vx + (py - cy) * vy + (pz - cz) * vz;
            const t = dot / (lenSq || 1);

            const isBetweenCamAndTable = (t > 0 && t < 1.05) && (
              (Math.abs(px) < (COLS * TILE_SIZE / 2 + 4) && Math.abs(pz) < (ROWS * TILE_SIZE / 2 + 4) && py < cy) ||
              ((px - (cx + t * vx)) ** 2 + (py - (cy + t * vy)) ** 2 + (pz - (cz + t * vz)) ** 2 < 1250)
            );

            const colArr = this.weatherGeometry.attributes.color.array as Float32Array;
            if (isBetweenCamAndTable) {
              colArr[i * 3] = 0.03;
              colArr[i * 3 + 1] = 0.04;
              colArr[i * 3 + 2] = 0.06;
            } else {
              if (colArr[i * 3] < 0.2) {
                colArr[i * 3] = 0.85;
                colArr[i * 3 + 1] = 0.92;
                colArr[i * 3 + 2] = 1.0;
              }
            }
          }
        }
        this.weatherGeometry.attributes.position.needsUpdate = true;
        if (theme.particleType === 'stars') {
          this.weatherGeometry.attributes.color.needsUpdate = true;
        }
      }
    }

    this.renderer.render(this.scene, this.camera);
  }
}
