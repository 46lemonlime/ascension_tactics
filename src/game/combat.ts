import * as THREE from 'three';
import type { Unit } from '../data/types';
import { cheb, worldX, worldZ, COLS, TILE_SIZE, key } from '../data/constants';
import { sfx } from '../audio/synth';
import { logCombat } from '../ui/combat-log';
import { showWorldText, spawnSquadVolley, spawnHitSparks, animateSquadMeleeLunge, addTween } from './effects';
import { getSurvivingFigures, restructureSquadFormation, MoraleSystem } from './morale';
import { playerAwareTiles } from './awareness';
import { animateCameraTo, getActionCamEnabled } from '../renderer/camera';
import { setActionSavedCam, clearActionSavedCam } from './movement';

export const d6 = (): number => Math.floor(Math.random() * 6) + 1;

export function updateSquadCasualties(unit: Unit): void {
  if (!unit || !unit.model || !unit.model.userData) return;
  const figures = unit.model.userData.figures;
  if (!figures) return;
  const maxhp = unit.maxhp || unit.maxWounds || 5;
  const curhp = unit.hp || unit.wounds || 0;
  const squadSize = unit.squadSize || 1;
  const hpPerModel = maxhp / squadSize;
  const modelsLiving = Math.max(0, Math.ceil(curhp / hpPerModel));

  let casualtyOccurred = false;
  for (let i = figures.length - 1; i >= 0; i--) {
    const fig = figures[i];
    if (i >= modelsLiving && fig.alive) {
      fig.alive = false;
      casualtyOccurred = true;
      const initialScale = fig.root.scale.clone();
      addTween(
        0.6,
        p => {
          fig.root.rotation.x = p * (Math.PI / 2);
          fig.root.position.y = -p * 0.3;
          fig.root.scale.copy(initialScale).multiplyScalar(Math.max(1 - p, 0.01));
        },
        () => {
          fig.root.visible = false;
        }
      );
    }
  }

  if (casualtyOccurred) {
    restructureSquadFormation(unit);
  }
}

export function killUnit(
  u: Unit,
  scene?: THREE.Scene,
  onAfterKill?: () => void
): void {
  u.alive = false;
  u.dead = true;
  sfx.death();
  if (u.model) {
    showWorldText('SQUAD DESTROYED!', u.model.position, '#dc2626');
  }
  logCombat(`💀 <b>${u.name}</b> has been wiped out!`, 'morale');

  if (u.model && scene) {
    const initScale = u.model.scale.clone();
    addTween(
      0.7,
      p => {
        u.model.rotation.x = p * (Math.PI / 2);
        u.model.position.y = -p * 0.3;
        u.model.scale.copy(initScale).multiplyScalar(Math.max(1 - p * 0.4, 0.01));
      },
      () => {
        scene.remove(u.model);
        if (onAfterKill) onAfterKill();
      }
    );
  } else if (onAfterKill) {
    onAfterKill();
  }
}

export function applyDamage(
  target: Unit,
  dmg: number,
  unitsList: Unit[] = [],
  scene?: THREE.Scene,
  isBusy: () => boolean = () => false,
  onUpdateDatasheet?: () => void,
  onCheckGameEnd?: () => void
): void {
  const prevFiguresLiving = getSurvivingFigures(target).length;
  target.hp = (target.hp !== undefined ? target.hp : target.wounds) - dmg;
  target.wounds = target.hp;
  sfx.hit();
  if (target.model) {
    showWorldText(`-${dmg} DMG`, target.model.position, '#ef4444');
  }
  logCombat(
    `💥 <b>${target.name}</b> takes <b>${dmg}</b> damage! (${Math.max(
      target.hp,
      0
    )}/${target.maxhp || target.maxWounds} HP remaining)`,
    'combat'
  );

  if (scene && target.model) {
    spawnHitSparks(target.model.position, scene);
  }
  updateSquadCasualties(target);

  const currentFiguresLiving = getSurvivingFigures(target).length;
  const casualties = Math.max(0, prevFiguresLiving - currentFiguresLiving);

  MoraleSystem.applyDamage(target, dmg, casualties, unitsList, isBusy);

  if (target.hp <= 0) {
    killUnit(target, scene);
  }
  if (onUpdateDatasheet) onUpdateDatasheet();
  if (onCheckGameEnd) onCheckGameEnd();
}

export function resolveAttack(
  attacker: Unit,
  target: Unit,
  unitsList: Unit[] = [],
  scene?: THREE.Scene,
  camera?: THREE.Camera,
  controlsTarget?: THREE.Vector3,
  setBusy?: (b: boolean) => void,
  isBusy?: () => boolean,
  onComplete?: () => void,
  onUpdateDatasheet?: () => void,
  onCheckGameEnd?: () => void
): { totalDamage: number; casualties: number } {
  // If called without full interactive 3D context, resolve synchronously
  if (!scene || !camera || !setBusy || !isBusy) {
    const attackerDef = attacker.def;
    const targetDef = target.def;

    const hitRoll = d6();
    const reqHit = attackerDef?.bs || 3;
    if (hitRoll < reqHit) {
      logCombat(`🎲 To Hit: Rolled <b>[${hitRoll}]</b> (Needed ${reqHit}+) &rarr; MISS!`, 'combat');
      return { totalDamage: 0, casualties: 0 };
    }

    const woundRoll = d6();
    const reqWound = (attackerDef?.s || 4) >= (targetDef?.t || 4) ? 4 : 5;
    if (woundRoll < reqWound) {
      logCombat(`🎲 To Wound: Rolled <b>[${woundRoll}]</b> (Needed ${reqWound}+) &rarr; FAILED TO WOUND!`, 'combat');
      return { totalDamage: 0, casualties: 0 };
    }

    const saveRoll = d6();
    const reqSave = targetDef?.sv || 3;
    if (saveRoll >= reqSave) {
      logCombat(`🎲 Armor Save: Rolled <b>[${saveRoll}]</b> (Needed ${reqSave}+) &rarr; ARMOR SAVED!`, 'combat');
      return { totalDamage: 0, casualties: 0 };
    }

    const dmg = attackerDef?.dmg || 2;
    target.wounds = Math.max(0, (target.wounds || target.hp || 5) - dmg);
    target.hp = target.wounds;
    updateSquadCasualties(target);
    return { totalDamage: dmg, casualties: target.wounds <= 0 ? 1 : 0 };
  }

  // Interactive full 3D combat resolution
  setBusy(true);
  attacker.hasAttacked = true;

  const targetDist = cheb(attacker, target);
  const isMeleeCombat = targetDist <= 1 && attacker.hasMelee;
  const attackDamage = isMeleeCombat ? (attacker.meleeDmg || 2) : (attacker.dmg || 2);
  const weaponDesc = isMeleeCombat ? 'Melee Strike' : 'Ranged Volley';

  const preActionCamPos = camera.position.clone();
  const preActionCamTarget = (controlsTarget || new THREE.Vector3()).clone();
  setActionSavedCam(preActionCamPos, preActionCamTarget);

  // Face target
  const targetWorld = new THREE.Vector3(worldX(target.c !== undefined ? target.c : target.x), 0, worldZ(target.r !== undefined ? target.r : target.z));
  const attackerWorld = new THREE.Vector3(worldX(attacker.c !== undefined ? attacker.c : attacker.x), 0, worldZ(attacker.r !== undefined ? attacker.r : attacker.z));
  const lookDir = targetWorld.clone().sub(attackerWorld).normalize();
  attacker.model.rotation.y = Math.atan2(lookDir.x, lookDir.z);

  const ux = attacker.c !== undefined ? attacker.c : attacker.x;
  const uz = attacker.r !== undefined ? attacker.r : attacker.z;
  const tx = target.c !== undefined ? target.c : target.x;
  const tz = target.r !== undefined ? target.r : target.z;

  const isAttackVisibleToPlayer =
    attacker.team === 'player' ||
    attacker.player === 1 ||
    playerAwareTiles.has(key(ux, uz)) ||
    playerAwareTiles.has(key(tx, tz));
  const useActionCam = getActionCamEnabled() && isAttackVisibleToPlayer;
  let camPos: THREE.Vector3 | null = null;
  let camTarget: THREE.Vector3 | null = null;

  if (useActionCam) {
    const diff = targetWorld.clone().sub(attackerWorld);
    const dist = attackerWorld.distanceTo(targetWorld);
    const fireDir = diff.clone().normalize();

    let sideDir = new THREE.Vector3(-fireDir.z, 0, fireDir.x).normalize();
    if (
      attackerWorld.x + sideDir.x * 12 > (COLS * TILE_SIZE) / 2 ||
      attackerWorld.x + sideDir.x * 12 < -(COLS * TILE_SIZE) / 2
    ) {
      sideDir.negate();
    }

    const behindDist = isMeleeCombat ? 12.0 : Math.min(Math.max(dist * 0.38, 14.0), 28.0);
    const sideDist = isMeleeCombat ? 7.5 : Math.min(Math.max(dist * 0.26, 8.0), 16.0);
    const camHeight = isMeleeCombat ? 6.5 : Math.min(Math.max(dist * 0.22, 7.5), 16.0);

    camPos = attackerWorld
      .clone()
      .sub(fireDir.clone().multiplyScalar(behindDist))
      .add(sideDir.clone().multiplyScalar(sideDist));
    camPos.y = camHeight;

    camTarget = attackerWorld.clone().lerp(targetWorld, 0.38);
    camTarget.y = 1.8;
  }

  const finishAttack = (delay = 700) => {
    setTimeout(() => {
      const shouldReturnCamera =
        useActionCam && preActionCamPos && preActionCamTarget && (attacker.team === 'player' || attacker.player === 1);
      if (shouldReturnCamera) {
        animateCameraTo(preActionCamPos, preActionCamTarget, 0.45, () => {
          clearActionSavedCam();
          setBusy(false);
          if (onComplete) onComplete();
        });
      } else {
        clearActionSavedCam();
        setBusy(false);
        if (onComplete) onComplete();
      }
    }, delay);
  };

  const startCombatAction = () => {
    const hitRoll = d6();
    const reqHit = isMeleeCombat ? (attacker.def?.ws || 3) : (attacker.def?.bs || 3);
    const isHit = hitRoll >= reqHit;

    sfx.dice();
    logCombat(
      `<b>${attacker.name}</b> attacks <b>${target.name}</b> with <i>${attacker.def?.weapon || 'Weapons'}</i> (${weaponDesc}):`,
      'combat'
    );
    logCombat(
      `🎲 To Hit: Rolled <b>[${hitRoll}]</b> (Needed ${reqHit}+) &rarr; ${
        isHit ? '<span style="color:#34d399">HIT!</span>' : '<span style="color:#f87171">MISS!</span>'
      }`,
      'combat'
    );

    if (!isHit) {
      if (!isMeleeCombat && scene) spawnSquadVolley(attacker, target, false, scene);
      showWorldText('MISS!', target.model.position, '#9ca3af');
      finishAttack(650);
      return;
    }

    const woundRoll = d6();
    const reqWound = (attacker.def?.s || 4) >= (target.def?.t || 4) ? 4 : 5;
    const isWound = woundRoll >= reqWound;
    logCombat(
      `🎲 To Wound: Rolled <b>[${woundRoll}]</b> (Needed ${reqWound}+) &rarr; ${
        isWound
          ? '<span style="color:#34d399">WOUND!</span>'
          : '<span style="color:#f87171">FAILED TO WOUND!</span>'
      }`,
      'combat'
    );

    if (!isWound) {
      if (!isMeleeCombat && scene) spawnSquadVolley(attacker, target, true, scene);
      showWorldText('DEFLECTED!', target.model.position, '#9ca3af');
      finishAttack(650);
      return;
    }

    const saveRoll = d6();
    const reqSave = target.def?.sv || 3;
    const isSaved = saveRoll >= reqSave;
    logCombat(
      `🎲 Armor Save: Rolled <b>[${saveRoll}]</b> (Needed ${reqSave}+) &rarr; ${
        isSaved
          ? '<span style="color:#38bdf8">ARMOR SAVED!</span>'
          : '<span style="color:#ef4444">SAVE FAILED!</span>'
      }`,
      'combat'
    );

    if (isSaved) {
      if (!isMeleeCombat && scene) spawnSquadVolley(attacker, target, true, scene);
      showWorldText('SAVED!', target.model.position, '#38bdf8');
      sfx.hit();
      finishAttack(650);
      return;
    }

    if (!isMeleeCombat) {
      sfx.bolter();
      if (scene) spawnSquadVolley(attacker, target, true, scene);
      setTimeout(() => {
        applyDamage(target, attackDamage, unitsList, scene, isBusy, onUpdateDatasheet, onCheckGameEnd);
        finishAttack(500);
      }, 280);
    } else {
      if (attacker.def?.factionId === 'tyranids') sfx.hit();
      else if (attacker.type === 'sm_assault' || attacker.type === 'c_raptors') sfx.chainsword();
      else sfx.powerWeapon();

      animateSquadMeleeLunge(attacker, target, () => {
        applyDamage(target, attackDamage, unitsList, scene, isBusy, onUpdateDatasheet, onCheckGameEnd);
        finishAttack(500);
      });
    }
  };

  if (useActionCam && camPos && camTarget) {
    animateCameraTo(camPos, camTarget, 0.45, () => {
      startCombatAction();
    });
  } else {
    startCombatAction();
  }

  return { totalDamage: attackDamage, casualties: 0 };
}
