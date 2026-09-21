import { Unit, Figure } from '../data/types';
import { FormationSystem } from './formation';
import { MoraleSystem } from './morale';
import { OBSTACLES } from '../data/themes';
import { COLS, ROWS, TILE_SIZE, worldX, worldZ } from '../data/constants';

export const PhysicsEngine = {
  step(dt: number, unitsList: Unit[], targetUnit: Unit | null = null): void {
    const activeUnits = targetUnit ? [targetUnit] : unitsList.filter(u => u.alive);
    if (!activeUnits.length) return;

    // Gather all living figures across all units for collision / separation checks
    const allFigures: { fig: Figure; unit: Unit }[] = [];
    unitsList
      .filter(u => u.alive)
      .forEach(u => {
        const figures = u.model.userData.figures as Figure[] | undefined;
        if (!figures) return;
        const living = figures.filter(f => f.alive);
        living.forEach(fig => {
          allFigures.push({ fig, unit: u });
        });
      });

    activeUnits.forEach(u => {
      const figures = u.model.userData.figures as Figure[] | undefined;
      if (!figures) return;
      const living = figures.filter(f => f.alive);
      if (!living.length) return;

      const isSingleModel = u.squadSize === 1 || u.size >= 2 || living.length === 1;

      // 1. Single Model Entities (Vehicles, Walkers, Monsters, Characters)
      if (isSingleModel) {
        const fig = living[0];
        if (fig) {
          fig.offset = { x: 0, z: 0 };
          fig.worldX = u.model.position.x;
          fig.worldZ = u.model.position.z;
          fig.targetX = u.model.position.x;
          fig.targetZ = u.model.position.z;
          fig.vx = 0;
          fig.vz = 0;
          fig.root.position.set(0, 0, 0);
          fig.root.rotation.y = 0;
        }
        return;
      }

      // 2. Multi-Model Squads (Infantry Formations & Swarms)
      const fType = (u.def.formation && u.def.formation.type) || 'wedge';
      const spacing = (u.def.formation && u.def.formation.spacing) || 1.45;
      const offsets = FormationSystem.getOffsets(u.squadSize, fType, spacing, living.length);
      const cohesionWeight = (u.def.formation && u.def.formation.cohesionWeight) || 1.0;
      const moraleFactor = u.morale ? MoraleSystem.getCohesionFactor(u.morale.state) : 1.0;
      const effectiveCohesion = cohesionWeight * moraleFactor;

      const anchorX = u.model.position.x;
      const anchorZ = u.model.position.z;
      const angle = u.model.rotation.y;

      living.forEach((fig, idx) => {
        const off = offsets[idx] || { x: 0, z: 0 };
        fig.offset = off;

        // Dynamic slot in continuous world space
        const slotX = anchorX + (off.x * Math.cos(angle) - off.z * Math.sin(angle));
        const slotZ = anchorZ + (off.x * Math.sin(angle) + off.z * Math.cos(angle));
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
        if (u.morale && u.morale.state === 'BROKEN') {
          const homeZ =
            u.team === 'player'
              ? (52 - ROWS / 2 + 0.5) * TILE_SIZE
              : (2 - ROWS / 2 + 0.5) * TILE_SIZE;
          const toHomeZ = homeZ - fig.worldZ;
          fz += (toHomeZ > 0 ? 1 : -1) * 35.0;
        }

        // C. Soft Separation & Hard Penetration Resolution with other figures
        for (let j = 0; j < allFigures.length; j++) {
          const other = allFigures[j];
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

        // D. Obstacle Avoidance & Hard Collision Pushout
        if (typeof OBSTACLES !== 'undefined' && OBSTACLES.size > 0) {
          OBSTACLES.forEach(k => {
            const [ox, oz] = k.split(',').map(Number);
            const minX = worldX(ox) - 3.0;
            const maxX = worldX(ox) + 3.0;
            const minZ = worldZ(oz) - 3.0;
            const maxZ = worldZ(oz) + 3.0;

            const cx = Math.max(minX, Math.min(fig.worldX, maxX));
            const cz = Math.max(minZ, Math.min(fig.worldZ, maxZ));

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
          });
        }

        // E. Table Boundary Clamping
        const halfW = (COLS * TILE_SIZE) / 2 - 2.0;
        const halfH = (ROWS * TILE_SIZE) / 2 - 2.0;
        if (fig.worldX < -halfW) {
          fig.worldX = -halfW;
          fig.vx = 0;
        }
        if (fig.worldX > halfW) {
          fig.worldX = halfW;
          fig.vx = 0;
        }
        if (fig.worldZ < -halfH) {
          fig.worldZ = -halfH;
          fig.vz = 0;
        }
        if (fig.worldZ > halfH) {
          fig.worldZ = halfH;
          fig.vz = 0;
        }

        // F. Velocity Integration with heavy damping
        const mass = fig.mass || 1.0;
        const ax = fx / mass;
        const az = fz / mass;

        fig.vx = (fig.vx + ax * dt) * 0.82;
        fig.vz = (fig.vz + az * dt) * 0.82;

        const maxSpd = (u.def.physical && u.def.physical.maxSpeed) || 12.0;
        const spdSq = fig.vx * fig.vx + fig.vz * fig.vz;
        if (spdSq > maxSpd * maxSpd) {
          const spd = Math.sqrt(spdSq);
          fig.vx = (fig.vx / spd) * maxSpd;
          fig.vz = (fig.vz / spd) * maxSpd;
        }

        fig.worldX += fig.vx * dt;
        fig.worldZ += fig.vz * dt;

        // G. Update 3D Mesh Local Position & Facing
        fig.root.position.x = fig.worldX - u.model.position.x;
        fig.root.position.z = fig.worldZ - u.model.position.z;

        const vLen = Math.sqrt(fig.vx * fig.vx + fig.vz * fig.vz);
        if (vLen > 0.25) {
          const desiredWorldHeading = Math.atan2(fig.vx, fig.vz);
          const desiredLocalHeading = desiredWorldHeading - u.model.rotation.y;
          fig.root.rotation.y +=
            (desiredLocalHeading - fig.root.rotation.y) * Math.min(10 * dt, 1.0);
        } else {
          fig.root.rotation.y += (0 - fig.root.rotation.y) * Math.min(5 * dt, 1.0);
        }
      });
    });
  }
};
