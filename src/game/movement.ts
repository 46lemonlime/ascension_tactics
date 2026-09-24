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
  let camPos: THREE.Vector3 | null = null;
  let camTarget: THREE.Vector3 | null = null;

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

    camPos = startWorld
      .clone()
      .sub(moveDir.clone().multiplyScalar(behindDist))
      .add(sideDir.clone().multiplyScalar(sideDist));
    camPos.y = camHeight;

    camTarget = startWorld.clone().lerp(destWorld, 0.45);
    camTarget.y = 1.8;
  }

  const living = getSurvivingFigures(unit);
  const isLarge = sz >= 2 || unit.squadSize === 1;
  const isHover = unit.type === 'tau_hammerhead' || unit.type === 'de_ravager';
  const isVehicleTracked =
    unit.type === 'dir_battle_tank' ||
    unit.type === 'dir_basilisk' ||
    unit.type === 'sm_predator' ||
    unit.type === 'c_predator' ||
    unit.type === 'orc_battlewagon' ||
    living.some((fig: any) => (fig.root?.userData?.animProfile || fig.root?.userData?.figure?.userData?.animProfile) === 'vehicle_tracked');
  const isWalker = isLarge && !isHover && !isVehicleTracked;
  const isSingleModel = unit.squadSize === 1 || sz >= 2 || living.length <= 1;

  const getLeftLeg = (fig: any) => fig.root?.userData?.leftLeg || fig.root?.userData?.figure?.userData?.leftLeg;
  const getRightLeg = (fig: any) => fig.root?.userData?.rightLeg || fig.root?.userData?.figure?.userData?.rightLeg;
  const getFigBody = (fig: any) => fig.root?.userData?.figBody || fig.root?.userData?.figure?.userData?.figBody;
  const getWheels = (fig: any): THREE.Mesh[] => fig.root?.userData?.wheels || fig.root?.userData?.figure?.userData?.wheels || [];

  let stepIdx = 0;

  function runNextSegment() {
    if (stepIdx >= path.length) {
      // Finalize at exact destination tile
      const dest = path[path.length - 1];
      const endC = dest.x !== undefined ? dest.x : (dest as any).c;
      const endR = dest.z !== undefined ? dest.z : (dest as any).r;
      unit.x = endC;
      unit.z = endR;
      unit.c = endC;
      unit.r = endR;

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
        animateCameraTo(preMoveCamPos, preMoveCamTarget, 0.45, () => {
          clearActionSavedCam();
          onDone();
        });
      } else {
        clearActionSavedCam();
        onDone();
      }
      return;
    }

    const currentX = unit.c !== undefined ? unit.c : unit.x;
    const currentZ = unit.r !== undefined ? unit.r : unit.z;
    const nextStep = path[stepIdx++];
    const nextX = nextStep.x !== undefined ? nextStep.x : (nextStep as any).c;
    const nextZ = nextStep.z !== undefined ? nextStep.z : (nextStep as any).r;
    unit.x = nextX;
    unit.z = nextZ;
    unit.c = nextX;
    unit.r = nextZ;

    const startPos = new THREE.Vector3(unitWorldX(currentX, sz), 0, unitWorldZ(currentZ, sz));
    const endPos = new THREE.Vector3(unitWorldX(nextX, sz), 0, unitWorldZ(nextZ, sz));
    const look = endPos.clone().sub(startPos).normalize();
    const targetHeading = Math.atan2(look.x, look.z);
    const startHeading = unit.model.rotation.y;

    const segmentDist = startPos.distanceTo(endPos);
    const baseSpeed = (unit.def?.physical && unit.def.physical.maxSpeed) || 12.0;
    const runDuration = isLarge
      ? Math.max(0.18, Math.min(0.28, segmentDist / (baseSpeed * 0.90)))
      : Math.max(0.14, Math.min(0.24, segmentDist / (baseSpeed * 0.95)));

    let lastP = 0;
    addTween(
      runDuration,
      (p: number) => {
        const dp = p - lastP;
        const dtTween = Math.max(dp * runDuration, 0.016);
        lastP = p;

        unit.model.position.lerpVectors(startPos, endPos, p);
        unit.model.rotation.y = lerpAngle(startHeading, targetHeading, Math.min(p * 2.6, 1.0));
        unit.angle = unit.model.rotation.y;
        unit.anchor = { x: unit.model.position.x, z: unit.model.position.z };

        // Physics step for moving unit miniatures
        PhysicsEngine.step(dtTween, [unit], unit);

        // Stride & bobbing animations
        if (isVehicleTracked) {
          const deltaDist = dp * segmentDist;
          const wheelRadius = 0.20;
          const deltaAngle = deltaDist / wheelRadius;
          living.forEach((fig: any) => {
            const body = getFigBody(fig);
            if (body) body.position.y = 0.20;
            const wheels = getWheels(fig);
            wheels.forEach(w => {
              w.rotation.x += deltaAngle;
            });
          });
        } else if (isHover) {
          const hoverFloat = Math.sin(p * Math.PI * 4) * 0.12;
          living.forEach((fig: any) => {
            const body = getFigBody(fig);
            if (body) body.position.y = 0.20 + hoverFloat;
          });
        } else if (isWalker) {
          const stridePhase = p * Math.PI * 2.4;
          const legAngle = Math.sin(stridePhase) * 0.48;
          const bodyBob = Math.abs(Math.sin(stridePhase)) * 0.12;
          living.forEach((fig: any) => {
            const lLeg = getLeftLeg(fig);
            const rLeg = getRightLeg(fig);
            const body = getFigBody(fig);
            if (lLeg) lLeg.rotation.x = legAngle;
            if (rLeg) rLeg.rotation.x = -legAngle;
            if (body) body.position.y = 0.20 + bodyBob;
          });
        } else {
          const stridePhase = p * Math.PI * 4;
          const legAngle = Math.sin(stridePhase) * 0.65;
          const bodyBob = Math.abs(Math.sin(stridePhase)) * 0.14;
          living.forEach((fig: any) => {
            const lLeg = getLeftLeg(fig);
            const rLeg = getRightLeg(fig);
            const body = getFigBody(fig);
            if (lLeg) lLeg.rotation.x = legAngle;
            if (rLeg) rLeg.rotation.x = -legAngle;
            if (body) body.position.y = 0.20 + bodyBob;
          });
        }
      },
      () => {
        runNextSegment();
      }
    );
  }

  if (useActionCam && camPos && camTarget) {
    animateCameraTo(camPos, camTarget, 0.45, () => {
      runNextSegment();
    });
  } else {
    runNextSegment();
  }
}
