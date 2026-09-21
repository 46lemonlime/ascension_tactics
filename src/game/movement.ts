import * as THREE from 'three';
import { Unit } from '../data/types';
import { unitSize, unitWorldX, unitWorldZ, COLS, TILE_SIZE } from '../data/constants';
import { addTween } from './effects';
import { PhysicsEngine } from './physics';
import { FormationSystem } from './formation';
import { getSurvivingFigures } from './morale';
import { playerAwareTiles } from './awareness';
import { animateCameraTo, getActionCamEnabled, getActiveCameraController } from '../renderer/camera';

export let currentActionSavedCamPos: THREE.Vector3 | null = null;
export let currentActionSavedCamTarget: THREE.Vector3 | null = null;

export function clearActionSavedCam(): void {
  currentActionSavedCamPos = null;
  currentActionSavedCamTarget = null;
}

export function setActionSavedCam(pos: THREE.Vector3 | null, target: THREE.Vector3 | null): void {
  currentActionSavedCamPos = pos ? pos.clone() : null;
  currentActionSavedCamTarget = target ? target.clone() : null;
}

export function lerpAngle(from: number, to: number, t: number): number {
  let diff = (to - from) % (Math.PI * 2);
  if (diff < -Math.PI) diff += Math.PI * 2;
  if (diff > Math.PI) diff -= Math.PI * 2;
  return from + diff * t;
}

export function animateMovePath(
  unit: Unit,
  path: { x: number; z: number }[],
  unitsList: Unit[],
  onDone: () => void,
  onStepAwareness?: () => void
): void {
  if (!path.length) {
    onDone();
    return;
  }

  const sz = unitSize(unit);

  const startTile = { x: unit.c !== undefined ? unit.c : unit.x, z: unit.r !== undefined ? unit.r : unit.z };
  const destTile = path[path.length - 1];
  const destX = destTile.x !== undefined ? destTile.x : (destTile as any).c;
  const destZ = destTile.z !== undefined ? destTile.z : (destTile as any).r;
  const startWorld = new THREE.Vector3(unitWorldX(startTile.x, sz), 0, unitWorldZ(startTile.z, sz));
  const destWorld = new THREE.Vector3(unitWorldX(destX, sz), 0, unitWorldZ(destZ, sz));

  const isMoveVisibleToPlayer =
    unit.team === 'player' ||
    playerAwareTiles.has(`${startTile.x},${startTile.z}`) ||
    playerAwareTiles.has(`${destX},${destZ}`);
  const useActionCam = getActionCamEnabled() && isMoveVisibleToPlayer;

  let preMoveCamPos: THREE.Vector3 | null = null;
  let preMoveCamTarget: THREE.Vector3 | null = null;

  if (useActionCam) {
    const ctrl = getActiveCameraController();
    if (ctrl) {
      preMoveCamPos = ctrl.camera.position.clone();
      preMoveCamTarget = ctrl.controls.target.clone();
      setActionSavedCam(preMoveCamPos, preMoveCamTarget);
    }

    const diff = destWorld.clone().sub(startWorld);
    const moveDist = startWorld.distanceTo(destWorld);
    const moveDir = diff.clone().normalize();

    let sideDir = new THREE.Vector3(-moveDir.z, 0, moveDir.x).normalize();
    if (
      startWorld.x + sideDir.x * 12 > (COLS * TILE_SIZE) / 2 ||
      startWorld.x + sideDir.x * 12 < -(COLS * TILE_SIZE) / 2
    ) {
      sideDir.negate();
    }

    const behindDist = Math.min(Math.max(moveDist * 0.38, 14.0), 28.0);
    const sideDist = Math.min(Math.max(moveDist * 0.25, 7.5), 16.0);
    const camHeight = Math.min(Math.max(moveDist * 0.22, 7.5), 16.0);

    const camPos = startWorld
      .clone()
      .sub(moveDir.clone().multiplyScalar(behindDist))
      .add(sideDir.clone().multiplyScalar(sideDist));
    camPos.y = camHeight;

    const camTarget = startWorld.clone().lerp(destWorld, 0.45);
    camTarget.y = 1.8;

    animateCameraTo(camPos, camTarget, 0.6);
  }

  // Build full polyline waypoint list in world coordinates
  const waypoints: { worldPos: THREE.Vector3; tile: { x: number; z: number } }[] = [
    {
      worldPos: startWorld.clone(),
      tile: { x: startTile.x, z: startTile.z }
    }
  ];

  for (const step of path) {
    const sx = step.x !== undefined ? step.x : (step as any).c;
    const szTile = step.z !== undefined ? step.z : (step as any).r;
    waypoints.push({
      worldPos: new THREE.Vector3(unitWorldX(sx, sz), 0, unitWorldZ(szTile, sz)),
      tile: { x: sx, z: szTile }
    });
  }

  // Calculate cumulative distances along the polyline path
  const segLengths: number[] = [];
  const cumDist: number[] = [0];
  let totalDist = 0;

  for (let i = 0; i < waypoints.length - 1; i++) {
    const len = waypoints[i].worldPos.distanceTo(waypoints[i + 1].worldPos);
    segLengths.push(len);
    totalDist += len;
    cumDist.push(totalDist);
  }

  if (totalDist === 0) {
    onDone();
    return;
  }

  const isLarge = sz >= 2 || unit.squadSize === 1;
  const isHover = unit.type === 'tau_hammerhead' || unit.type === 'de_ravager';
  const isWalker = isLarge && !isHover;

  const baseSpeed = (unit.def?.physical && unit.def.physical.maxSpeed) || 12.0;
  const speed = isLarge ? baseSpeed * 0.75 : baseSpeed * 0.85;
  const totalDuration = Math.max(0.3, totalDist / speed);

  const living = getSurvivingFigures(unit);
  const isSingleModel = unit.squadSize === 1 || sz >= 2 || living.length <= 1;

  const getLeftLeg = (fig: any) => fig.root?.userData?.leftLeg || fig.root?.userData?.figure?.userData?.leftLeg;
  const getRightLeg = (fig: any) => fig.root?.userData?.rightLeg || fig.root?.userData?.figure?.userData?.rightLeg;
  const getFigBody = (fig: any) => fig.root?.userData?.figBody || fig.root?.userData?.figure?.userData?.figBody;

  function startMovement() {
    let lastP = 0;
    let lastTileKey = `${startTile.x},${startTile.z}`;

    addTween(
      totalDuration,
      (p: number) => {
        const dtTween = Math.max((p - lastP) * totalDuration, 0.016);
        lastP = p;

        const currentD = p * totalDist;

        // Find active polyline segment
        let segIdx = 0;
        while (segIdx < segLengths.length - 1 && currentD > cumDist[segIdx + 1]) {
          segIdx++;
        }

        const segLen = segLengths[segIdx] || 0.0001;
        const segT = Math.max(0, Math.min(1, (currentD - cumDist[segIdx]) / segLen));

        const segStart = waypoints[segIdx].worldPos;
        const segEnd = waypoints[segIdx + 1].worldPos;

        // Smooth continuous position interpolation
        unit.model.position.lerpVectors(segStart, segEnd, segT);
        unit.anchor = { x: unit.model.position.x, z: unit.model.position.z };

        // Smooth continuous heading orientation
        const segDir = segEnd.clone().sub(segStart).normalize();
        if (segDir.lengthSq() > 0.001) {
          const targetHeading = Math.atan2(segDir.x, segDir.z);
          unit.model.rotation.y = lerpAngle(unit.model.rotation.y, targetHeading, Math.min(dtTween * 14.0, 1.0));
          unit.angle = unit.model.rotation.y;
        }

        // Live grid coordinate and awareness reveal updates along the path
        const curTile = segT >= 0.5 ? waypoints[segIdx + 1].tile : waypoints[segIdx].tile;
        const curKey = `${curTile.x},${curTile.z}`;
        if (curKey !== lastTileKey) {
          lastTileKey = curKey;
          unit.x = curTile.x;
          unit.z = curTile.z;
          unit.c = curTile.x;
          unit.r = curTile.z;
          if (onStepAwareness) onStepAwareness();
        }

        // Physics step for squad miniatures
        PhysicsEngine.step(dtTween, unitsList, unit);

        // Fluid, non-halting stride & body animations
        if (isHover) {
          const hoverFloat = Math.sin(currentD * 2.5) * 0.12;
          living.forEach((fig: any) => {
            const body = getFigBody(fig);
            if (body) body.position.y = 0.2 + hoverFloat;
          });
        } else if (isWalker) {
          const stridePhase = currentD * 2.2;
          const legAngle = Math.sin(stridePhase) * 0.48;
          const bodyBob = Math.abs(Math.sin(stridePhase)) * 0.12;

          living.forEach((fig: any) => {
            const lLeg = getLeftLeg(fig);
            const rLeg = getRightLeg(fig);
            const body = getFigBody(fig);
            if (lLeg) lLeg.rotation.x = legAngle;
            if (rLeg) rLeg.rotation.x = -legAngle;
            if (body) body.position.y = 0.2 + bodyBob;
          });
        } else {
          const stridePhase = currentD * 3.6;
          const legAngle = Math.sin(stridePhase) * 0.65;
          const bodyBob = Math.abs(Math.sin(stridePhase)) * 0.14;

          living.forEach((fig: any) => {
            const lLeg = getLeftLeg(fig);
            const rLeg = getRightLeg(fig);
            const body = getFigBody(fig);
            if (lLeg) lLeg.rotation.x = legAngle;
            if (rLeg) rLeg.rotation.x = -legAngle;
            if (body) body.position.y = 0.2 + bodyBob;
          });
        }
      },
      () => {
        // Finalize at exact destination tile
        const finalWaypoint = waypoints[waypoints.length - 1];
        unit.x = finalWaypoint.tile.x;
        unit.z = finalWaypoint.tile.z;
        unit.c = finalWaypoint.tile.x;
        unit.r = finalWaypoint.tile.z;

        const endAnchorX = unitWorldX(unit.c, sz);
        const endAnchorZ = unitWorldZ(unit.r, sz);
        unit.model.position.set(endAnchorX, 0, endAnchorZ);
        unit.anchor = { x: endAnchorX, z: endAnchorZ };
        if (onStepAwareness) onStepAwareness();

        if (isSingleModel) {
          const fig = living[0];
          if (fig) {
            fig.offset = { x: 0, z: 0 };
            fig.worldX = endAnchorX;
            fig.worldZ = endAnchorZ;
            fig.targetX = endAnchorX;
            fig.targetZ = endAnchorZ;
            fig.vx = 0;
            fig.vz = 0;
            fig.root.position.set(0, 0, 0);
            fig.root.rotation.y = 0;
            const lLeg = getLeftLeg(fig);
            const rLeg = getRightLeg(fig);
            const body = getFigBody(fig);
            if (lLeg) lLeg.rotation.x = 0;
            if (rLeg) rLeg.rotation.x = 0;
            if (body) body.position.y = 0.2;
          }
        } else {
          const fType = (unit.def?.formation && unit.def.formation.type) || 'wedge';
          const spacing = (unit.def?.formation && unit.def.formation.spacing) || 1.45;
          const finalOffsets = FormationSystem.getOffsets(unit.squadSize, fType, spacing, living.length);
          const curAngle = unit.model.rotation.y;

          living.forEach((fig: any, idx: number) => {
            fig.offset = finalOffsets[idx] || { x: 0, z: 0 };
            const off = fig.offset;
            const slotX = endAnchorX + (off.x * Math.cos(curAngle) - off.z * Math.sin(curAngle));
            const slotZ = endAnchorZ + (off.x * Math.sin(curAngle) + off.z * Math.cos(curAngle));
            fig.worldX = slotX;
            fig.worldZ = slotZ;
            fig.targetX = slotX;
            fig.targetZ = slotZ;
            fig.vx = 0;
            fig.vz = 0;
            fig.root.position.set(off.x, 0, off.z);
            fig.root.rotation.y = 0;
            const lLeg = getLeftLeg(fig);
            const rLeg = getRightLeg(fig);
            const body = getFigBody(fig);
            if (lLeg) lLeg.rotation.x = 0;
            if (rLeg) rLeg.rotation.x = 0;
            if (body) body.position.y = 0.2;
          });
        }

        if (useActionCam && preMoveCamPos && preMoveCamTarget && unit.team === 'player') {
          setTimeout(() => {
            animateCameraTo(preMoveCamPos!, preMoveCamTarget!, 0.6);
            clearActionSavedCam();
            setTimeout(() => {
              onDone();
            }, 350);
          }, 250);
        } else {
          clearActionSavedCam();
          setTimeout(
            () => {
              onDone();
            },
            unit.team === 'enemy' && useActionCam ? 200 : 0
          );
        }
      }
    );
  }

  const camArrivalDelay = useActionCam ? 600 : 0;
  setTimeout(startMovement, camArrivalDelay);
}
