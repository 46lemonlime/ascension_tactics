import type { Unit, Figure } from '../data/types';
import { FormationSystem } from './formation';
import { MoraleSystem } from './morale';
import { OBSTACLES } from '../data/themes';
import { COLS, ROWS, TILE_SIZE, worldX, worldZ } from '../data/constants';

interface CachedObstacle {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

interface FigureEntry {
  fig: Figure;
  unit: Unit;
}

export class PhysicsEngine {
  private static _allFiguresPool: FigureEntry[] = [];
  private static _cachedObstacles: CachedObstacle[] = [];
  private static _lastObstaclesVersion: string = '';

  private static updateObstacleCache(): void {
    if (typeof OBSTACLES === 'undefined' || OBSTACLES.size === 0) {
      PhysicsEngine._cachedObstacles.length = 0;
      return;
    }

    PhysicsEngine._cachedObstacles.length = 0;
    OBSTACLES.forEach(k => {
      const commaIdx = k.indexOf(',');
      const ox = Number(k.substring(0, commaIdx));
      const oz = Number(k.substring(commaIdx + 1));
      const wx = worldX(ox);
      const wz = worldZ(oz);
      PhysicsEngine._cachedObstacles.push({
        minX: wx - 3.0,
        maxX: wx + 3.0,
        minZ: wz - 3.0,
        maxZ: wz + 3.0
      });
    });
  }

  public static step(dt: number, unitsList: Unit[], targetUnit: Unit | null = null): void {
    const activeUnits = targetUnit ? [targetUnit] : unitsList.filter(u => u.alive && !u.dead);
    if (!activeUnits.length) return;

    // Refresh obstacle numeric cache if needed
    const currentObstaclesCount = typeof OBSTACLES !== 'undefined' ? OBSTACLES.size : 0;
    const currentVersionKey = `${currentObstaclesCount}_${typeof OBSTACLES !== 'undefined' ? Array.from(OBSTACLES)[0] : ''}`;
    if (currentVersionKey !== PhysicsEngine._lastObstaclesVersion) {
      PhysicsEngine._lastObstaclesVersion = currentVersionKey;
      PhysicsEngine.updateObstacleCache();
    }

    // Reuse persistent figure pool to eliminate per-frame GC allocations
    let poolIndex = 0;
    const pool = PhysicsEngine._allFiguresPool;

    for (let i = 0; i < unitsList.length; i++) {
      const u = unitsList[i];
      if (!u.alive || u.dead) continue;
      const figures = u.model?.userData?.figures as Figure[] | undefined;
      if (!figures) continue;
      for (let f = 0; f < figures.length; f++) {
        const fig = figures[f];
        if (fig.alive) {
          if (poolIndex < pool.length) {
            pool[poolIndex].fig = fig;
            pool[poolIndex].unit = u;
          } else {
            pool.push({ fig, unit: u });
          }
          poolIndex++;
        }
      }
    }
    const allFiguresCount = poolIndex;

    const obstacles = PhysicsEngine._cachedObstacles;
    const obstacleCount = obstacles.length;
    const halfW = (COLS * TILE_SIZE) / 2 - 2.0;
    const halfH = (ROWS * TILE_SIZE) / 2 - 2.0;

    for (let uIdx = 0; uIdx < activeUnits.length; uIdx++) {
      const u = activeUnits[uIdx];
      const figures = u.model?.userData?.figures as Figure[] | undefined;
      if (!figures) continue;

      let livingCount = 0;
      for (let f = 0; f < figures.length; f++) {
        if (figures[f].alive) livingCount++;
      }
      if (livingCount === 0) continue;

      const isSingleModel = u.squadSize === 1 || u.size >= 2 || livingCount === 1;

      // 1. Single Model Entities (Vehicles, Walkers, Monsters, Characters)
      if (isSingleModel) {
        let firstFig: Figure | null = null;
        for (let f = 0; f < figures.length; f++) {
          if (figures[f].alive) {
            firstFig = figures[f];
            break;
          }
        }
        if (firstFig) {
          firstFig.offset.x = 0;
          firstFig.offset.z = 0;
          firstFig.worldX = u.model.position.x;
          firstFig.worldZ = u.model.position.z;
          firstFig.targetX = u.model.position.x;
          firstFig.targetZ = u.model.position.z;
          firstFig.vx = 0;
          firstFig.vz = 0;
          firstFig.root.position.set(0, 0, 0);
          firstFig.root.rotation.y = 0;
        }
        continue;
      }

      // 2. Multi-Model Squads (Infantry Formations & Swarms)
      const fType = (u.def?.formation && u.def.formation.type) || 'wedge';
      const spacing = (u.def?.formation && u.def.formation.spacing) || 1.45;
      const offsets = FormationSystem.getOffsets(u.squadSize, fType, spacing, livingCount);
      const cohesionWeight = (u.def?.formation && u.def.formation.cohesionWeight) || 1.0;
      const moraleState = typeof u.morale === 'object' ? u.morale.state : (u.moraleState.toUpperCase() as any);
      const moraleFactor = moraleState ? MoraleSystem.getCohesionFactor(moraleState) : 1.0;
      const effectiveCohesion = cohesionWeight * moraleFactor;

      const anchorX = u.model.position.x;
      const anchorZ = u.model.position.z;
      const angle = u.model.rotation.y;
      const cosAngle = Math.cos(angle);
      const sinAngle = Math.sin(angle);

      let livingIndex = 0;
      for (let f = 0; f < figures.length; f++) {
        const fig = figures[f];
        if (!fig.alive) continue;

        const off = offsets[livingIndex] || { x: 0, z: 0 };
        livingIndex++;
        fig.offset = off;

        // Dynamic slot in continuous world space
        const slotX = anchorX + (off.x * cosAngle - off.z * sinAngle);
        const slotZ = anchorZ + (off.x * sinAngle + off.z * cosAngle);
        fig.targetX = slotX;
        fig.targetZ = slotZ;

        let fx = 0,
          fz = 0;

        // A. Slot Attraction (Critically damped spring)
        if (effectiveCohesion > 0.001) {
          const toSlotX = slotX - fig.worldX;
          const toSlotZ = slotZ - fig.worldZ;
          fx += toSlotX * 55.0 * effectiveCohesion - fig.vx * 8.5;
          fz += toSlotZ * 55.0 * effectiveCohesion - fig.vz * 8.5;
        }

        // B. Morale Broken / Fleeing Force
        if (u.moraleState === 'broken' || (typeof u.morale === 'object' && u.morale.state === 'BROKEN')) {
          const homeZ =
            u.team === 'player' || u.player === 1
              ? (52 - ROWS / 2 + 0.5) * TILE_SIZE
              : (2 - ROWS / 2 + 0.5) * TILE_SIZE;
          const toHomeZ = homeZ - fig.worldZ;
          fz += (toHomeZ > 0 ? 1 : -1) * 35.0;
        }

        // C. Soft Separation & Hard Penetration Resolution with other figures
        for (let j = 0; j < allFiguresCount; j++) {
          const other = pool[j];
          if (other.fig === fig) continue;

          const dx = fig.worldX - other.fig.worldX;
          const dz = fig.worldZ - other.fig.worldZ;
          const distSq = dx * dx + dz * dz;
          const sepDist = fig.sepRadius + other.fig.sepRadius;
          const colDist = fig.radius + other.fig.radius;

          if (distSq < sepDist * sepDist && distSq > 0.0001) {
            const dist = Math.sqrt(distSq);
            const norm = dist / sepDist;
            const sepForce = Math.pow(1.0 - norm, 1.8) * 35.0;
            fx += (dx / dist) * sepForce;
            fz += (dz / dist) * sepForce;

            // Hard collision pushout
            if (dist < colDist) {
              const overlap = (colDist - dist) * 0.5;
              const pushX = (dx / dist) * overlap;
              const pushZ = (dz / dist) * overlap;
              fig.worldX += pushX;
              fig.worldZ += pushZ;
              other.fig.worldX -= pushX;
              other.fig.worldZ -= pushZ;
            }
          }
        }

        // D. Obstacle Avoidance & Hard Collision Pushout (Using pre-parsed bounding boxes)
        for (let o = 0; o < obstacleCount; o++) {
          const obs = obstacles[o];
          const cx = Math.max(obs.minX, Math.min(fig.worldX, obs.maxX));
          const cz = Math.max(obs.minZ, Math.min(fig.worldZ, obs.maxZ));

          const dx = fig.worldX - cx;
          const dz = fig.worldZ - cz;
          const distSq = dx * dx + dz * dz;
          const avoidDist = fig.radius + 1.0;

          if (distSq < avoidDist * avoidDist) {
            const dist = Math.sqrt(distSq);
            if (dist > 0.001) {
              const norm = dist / avoidDist;
              const obsForce = Math.pow(1.0 - norm, 2) * 50.0;
              fx += (dx / dist) * obsForce;
              fz += (dz / dist) * obsForce;

              if (dist < fig.radius) {
                fig.worldX = cx + (dx / dist) * fig.radius;
                fig.worldZ = cz + (dz / dist) * fig.radius;
              }
            } else {
              fig.worldX += 0.3;
              fig.worldZ += 0.3;
            }
          }
        }

        // E. Table Boundary Clamping
        if (fig.worldX < -halfW) {
          fig.worldX = -halfW;
          fig.vx = 0;
        } else if (fig.worldX > halfW) {
          fig.worldX = halfW;
          fig.vx = 0;
        }
        if (fig.worldZ < -halfH) {
          fig.worldZ = -halfH;
          fig.vz = 0;
        } else if (fig.worldZ > halfH) {
          fig.worldZ = halfH;
          fig.vz = 0;
        }

        // F. Velocity Integration with heavy damping
        const mass = fig.mass || 1.0;
        const ax = fx / mass;
        const az = fz / mass;

        fig.vx = (fig.vx + ax * dt) * 0.82;
        fig.vz = (fig.vz + az * dt) * 0.82;

        const maxSpd = (u.def?.physical && u.def.physical.maxSpeed) || 12.0;
        const spdSq = fig.vx * fig.vx + fig.vz * fig.vz;
        if (spdSq > maxSpd * maxSpd) {
          const spd = Math.sqrt(spdSq);
          fig.vx = (fig.vx / spd) * maxSpd;
          fig.vz = (fig.vz / spd) * maxSpd;
        }

        fig.worldX += fig.vx * dt;
        fig.worldZ += fig.vz * dt;

        // G. Update 3D Mesh Local Position & Facing
        const ldx = fig.worldX - u.model.position.x;
        const ldz = fig.worldZ - u.model.position.z;

        fig.root.position.x = ldx * cosAngle + ldz * sinAngle;
        fig.root.position.z = -ldx * sinAngle + ldz * cosAngle;

        const vLenSq = fig.vx * fig.vx + fig.vz * fig.vz;
        if (vLenSq > 0.0625) {
          const desiredWorldHeading = Math.atan2(fig.vx, fig.vz);
          let desiredLocalHeading = desiredWorldHeading - angle;
          while (desiredLocalHeading > Math.PI) desiredLocalHeading -= Math.PI * 2;
          while (desiredLocalHeading < -Math.PI) desiredLocalHeading += Math.PI * 2;
          fig.root.rotation.y +=
            (desiredLocalHeading - fig.root.rotation.y) * Math.min(10 * dt, 1.0);
        } else {
          fig.root.rotation.y += (0 - fig.root.rotation.y) * Math.min(5 * dt, 1.0);
        }
      }
    }
  }

  public step(dt: number, unitsList: Unit[], targetUnit: Unit | null = null): void {
    PhysicsEngine.step(dt, unitsList, targetUnit);
  }
}
