import * as THREE from 'three';
import { Unit } from '../data/types';
import { unitSize, unitWorldX, unitWorldZ, COLS, TILE_SIZE } from '../data/constants';
import { addTween } from './effects';
import { PhysicsEngine } from './physics';
import { FormationSystem } from './formation';
import { getSurvivingFigures } from './morale';
import { playerAwareTiles } from './awareness';
import { animateCameraTo, getActionCamEnabled } from '../renderer/camera';

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

  const startTile = { x: unit.x, z: unit.z };
  const destTile = path[path.length - 1];
  const startWorld = new THREE.Vector3(unitWorldX(startTile.x, sz), 0, unitWorldZ(startTile.z, sz));
  const destWorld = new THREE.Vector3(unitWorldX(destTile.x, sz), 0, unitWorldZ(destTile.z, sz));

  const isMoveVisibleToPlayer =
    unit.team === 'player' ||
    playerAwareTiles.has(`${startTile.x},${startTile.z}`) ||
    playerAwareTiles.has(`${destTile.x},${destTile.z}`);
  const useActionCam = getActionCamEnabled() && isMoveVisibleToPlayer;

  let preMoveCamPos: THREE.Vector3 | null = null;
  let preMoveCamTarget: THREE.Vector3 | null = null;

  if (useActionCam) {
    // Need camera and controls position from external or global
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

  let stepIdx = 0;

  function runNextSegment() {
    if (stepIdx >= path.length) {
      unit.x = path[path.length - 1].x;
      unit.z = path[path.length - 1].z;
      const endAnchorX = unitWorldX(unit.x, sz);
      const endAnchorZ = unitWorldZ(unit.z, sz);
      unit.model.position.set(endAnchorX, 0, endAnchorZ);
      unit.anchor = { x: endAnchorX, z: endAnchorZ };
      if (onStepAwareness) onStepAwareness();

      const living = getSurvivingFigures(unit);
      const isSingleModel = unit.squadSize === 1 || sz >= 2 || living.length <= 1;

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
          if (fig.root.userData.leftLeg) fig.root.userData.leftLeg.rotation.x = 0;
          if (fig.root.userData.rightLeg) fig.root.userData.rightLeg.rotation.x = 0;
          if (fig.root.userData.figBody) fig.root.userData.figBody.position.y = 0.2;
        }
      } else {
        const fType = (unit.def.formation && unit.def.formation.type) || 'wedge';
        const spacing = (unit.def.formation && unit.def.formation.spacing) || 1.45;
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
          if (fig.root.userData.leftLeg) fig.root.userData.leftLeg.rotation.x = 0;
          if (fig.root.userData.rightLeg) fig.root.userData.rightLeg.rotation.x = 0;
          if (fig.root.userData.figBody) fig.root.userData.figBody.position.y = 0.2;
        });
      }

      if (useActionCam && preMoveCamPos && preMoveCamTarget && unit.team === 'player') {
        setTimeout(() => {
          animateCameraTo(preMoveCamPos!, preMoveCamTarget!, 0.65);
          clearActionSavedCam();
          setTimeout(() => {
            onDone();
          }, 350);
        }, 400);
      } else {
        clearActionSavedCam();
        setTimeout(
          () => {
            onDone();
          },
          unit.team === 'enemy' && useActionCam ? 300 : 0
        );
      }
      return;
    }

    const current = { x: unit.x, z: unit.z };
    const next = path[stepIdx++];
    unit.x = next.x;
    unit.z = next.z;
    if (onStepAwareness) onStepAwareness();

    const startPos = new THREE.Vector3(unitWorldX(current.x, sz), 0, unitWorldZ(current.z, sz));
    const endPos = new THREE.Vector3(unitWorldX(next.x, sz), 0, unitWorldZ(next.z, sz));
    const look = endPos.clone().sub(startPos).normalize();
    const targetHeading = Math.atan2(look.x, look.z);
    const startHeading = unit.model.rotation.y;

    const segmentDist = startPos.distanceTo(endPos);
    const isLarge = sz >= 2 || unit.squadSize === 1;
    const isHover = unit.type === 'tau_hammerhead' || unit.type === 'de_ravager';
    const isWalker = isLarge && !isHover;

    const baseSpeed = (unit.def.physical && unit.def.physical.maxSpeed) || 12.0;
    const runDuration = isLarge
      ? Math.max(0.26, Math.min(0.38, segmentDist / (baseSpeed * 0.7)))
      : Math.max(0.2, Math.min(0.32, segmentDist / (baseSpeed * 0.75)));
    const living = getSurvivingFigures(unit);

    let lastP = 0;
    addTween(
      runDuration,
      p => {
        const dtTween = Math.max((p - lastP) * runDuration, 0.016);
        lastP = p;

        unit.model.position.lerpVectors(startPos, endPos, p);
        unit.model.rotation.y = lerpAngle(startHeading, targetHeading, Math.min(p * 2.6, 1.0));
        unit.angle = unit.model.rotation.y;
        unit.anchor = { x: unit.model.position.x, z: unit.model.position.z };

        PhysicsEngine.step(dtTween, unitsList, unit);

        if (isHover) {
          const hoverFloat = Math.sin(p * Math.PI * 4) * 0.12;
          living.forEach((fig: any) => {
            if (fig.root.userData.figBody) fig.root.userData.figBody.position.y = 0.2 + hoverFloat;
          });
        } else if (isWalker) {
          const stridePhase = p * Math.PI * 2.4;
          const legAngle = Math.sin(stridePhase) * 0.48;
          const bodyBob = Math.abs(Math.sin(stridePhase)) * 0.12;

          living.forEach((fig: any) => {
            if (fig.root.userData.leftLeg) fig.root.userData.leftLeg.rotation.x = legAngle;
            if (fig.root.userData.rightLeg) fig.root.userData.rightLeg.rotation.x = -legAngle;
            if (fig.root.userData.figBody) fig.root.userData.figBody.position.y = 0.2 + bodyBob;
          });
        } else {
          const stridePhase = p * Math.PI * 4;
          const legAngle = Math.sin(stridePhase) * 0.65;
          const bodyBob = Math.abs(Math.sin(stridePhase)) * 0.14;

          living.forEach((fig: any) => {
            if (fig.root.userData.leftLeg) fig.root.userData.leftLeg.rotation.x = legAngle;
            if (fig.root.userData.rightLeg) fig.root.userData.rightLeg.rotation.x = -legAngle;
            if (fig.root.userData.figBody) fig.root.userData.figBody.position.y = 0.2 + bodyBob;
          });
        }
      },
      () => {
        runNextSegment();
      }
    );
  }

  const camArrivalDelay = useActionCam ? 1600 : 0;
  setTimeout(runNextSegment, camArrivalDelay);
}
