import * as THREE from 'three';
import { Unit, Tween, Floater } from '../data/types';
import { FACTIONS } from '../data/factions';
import { rnd } from '../data/constants';
import { getSurvivingFigures } from './morale';

export const activeTweens: Tween[] = [];
export const activeFloaters: Floater[] = [];

export function addTween(
  dur: number,
  onUpdate?: (p: number) => void,
  onDone?: () => void
): void {
  activeTweens.push({ t: 0, dur: Math.max(dur, 0.001), onUpdate, onDone });
}

export function updateTweens(dt: number, camera?: THREE.Camera): void {
  for (let i = activeTweens.length - 1; i >= 0; i--) {
    const tw = activeTweens[i];
    tw.t += dt;
    const p = Math.min(tw.t / tw.dur, 1);
    if (tw.onUpdate) tw.onUpdate(p);
    if (p >= 1) {
      activeTweens.splice(i, 1);
      if (tw.onDone) tw.onDone();
    }
  }

  if (camera) {
    for (let i = activeFloaters.length - 1; i >= 0; i--) {
      const f = activeFloaters[i];
      f.age += dt;
      const p = f.age / 1.2;
      const v = f.pos.clone().add(new THREE.Vector3(0, 3.4 + p * 2.2, 0));
      v.project(camera);
      const x = (v.x * 0.5 + 0.5) * window.innerWidth;
      const y = (-(v.y * 0.5) + 0.5) * window.innerHeight;
      f.el.style.left = `${x}px`;
      f.el.style.top = `${y}px`;
      f.el.style.opacity = `${Math.max(1 - p, 0)}`;
      if (p >= 1) {
        f.el.remove();
        activeFloaters.splice(i, 1);
      }
    }
  }
}

export function clearTweens(): void {
  activeTweens.length = 0;
  for (const f of activeFloaters) {
    f.el.remove();
  }
  activeFloaters.length = 0;
}

export function showWorldText(text: string, pos: THREE.Vector3, color = '#fcd34d'): void {
  const container = document.getElementById('floating-text-layer');
  if (!container) return;
  const el = document.createElement('div');
  el.className = 'world-floater';
  el.style.color = color;
  el.textContent = text;
  container.appendChild(el);
  activeFloaters.push({ el, pos: pos.clone(), age: 0 });
}

export function spawnSquadVolley(
  attacker: Unit,
  target: Unit,
  isHit: boolean,
  scene: THREE.Scene
): void {
  const livingFigures = getSurvivingFigures(attacker);
  const tracerColor = FACTIONS[attacker.def.factionId]?.laserColor || 0xffd166;

  livingFigures.forEach((fig: any) => {
    const figWorld = new THREE.Vector3();
    fig.root.getWorldPosition(figWorld);
    figWorld.y += 1.3;

    const end = target.model.position.clone().add(
      new THREE.Vector3(
        isHit ? rnd(-0.8, 0.8) : rnd(-3.5, 3.5),
        1.3 + (isHit ? rnd(-0.4, 0.4) : rnd(-1.5, 1.5)),
        isHit ? rnd(-0.8, 0.8) : rnd(-3.5, 3.5)
      )
    );

    const geo = new THREE.CylinderGeometry(0.09, 0.09, figWorld.distanceTo(end), 6);
    geo.rotateX(Math.PI / 2);
    const mat = new THREE.MeshBasicMaterial({ color: tracerColor, transparent: true, opacity: 1 });
    const tracer = new THREE.Mesh(geo, mat);
    tracer.position.copy(figWorld).lerp(end, 0.5);
    tracer.lookAt(end);
    scene.add(tracer);

    addTween(
      0.2,
      p => {
        mat.opacity = 1 - p;
      },
      () => {
        scene.remove(tracer);
        geo.dispose();
        mat.dispose();
      }
    );
  });
}

export function spawnHitSparks(pos: THREE.Vector3, scene: THREE.Scene): void {
  const count = 16;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(count * 3);
  const pVels: THREE.Vector3[] = [];
  for (let i = 0; i < count; i++) {
    pPos[i * 3] = pos.x;
    pPos[i * 3 + 1] = pos.y + 1.4;
    pPos[i * 3 + 2] = pos.z;
    pVels.push(new THREE.Vector3(rnd(-5, 5), rnd(3, 8), rnd(-5, 5)));
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({
    color: 0xffa500,
    size: 0.55,
    transparent: true,
    opacity: 1
  });
  const pMesh = new THREE.Points(pGeo, pMat);
  scene.add(pMesh);

  addTween(
    0.35,
    p => {
      const arr = pGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        arr[i * 3] += pVels[i].x * 0.016;
        arr[i * 3 + 1] += pVels[i].y * 0.016;
        arr[i * 3 + 2] += pVels[i].z * 0.016;
        pVels[i].y -= 9.8 * 0.016;
      }
      pGeo.attributes.position.needsUpdate = true;
      pMat.opacity = 1 - p;
    },
    () => {
      scene.remove(pMesh);
      pGeo.dispose();
      pMat.dispose();
    }
  );
}

export function spawnTeleportBeam(
  pos: THREE.Vector3,
  colorHex = 0x60a5fa,
  scene: THREE.Scene
): void {
  const beamGeo = new THREE.CylinderGeometry(1.8, 1.8, 35, 16);
  const beamMat = new THREE.MeshBasicMaterial({ color: colorHex, transparent: true, opacity: 0.85 });
  const beam = new THREE.Mesh(beamGeo, beamMat);
  beam.position.set(pos.x, 17.5, pos.z);
  scene.add(beam);

  addTween(
    0.45,
    p => {
      beamMat.opacity = (1 - p) * 0.85;
      beam.scale.set(1 + p * 0.4, 1, 1 + p * 0.4);
    },
    () => {
      scene.remove(beam);
      beamGeo.dispose();
      beamMat.dispose();
    }
  );
}

export function animateSquadMeleeLunge(
  attacker: Unit,
  target: Unit,
  onDone?: () => void
): void {
  const origPos = attacker.model.position.clone();
  const tgtPos = target.model.position.clone();
  const lungePos = origPos.clone().lerp(tgtPos, 0.65);

  addTween(
    0.18,
    p => {
      attacker.model.position.lerpVectors(origPos, lungePos, p);
      attacker.model.position.y = Math.sin(p * Math.PI) * 0.8;
    },
    () => {
      if (onDone) onDone();
      addTween(0.18, p => {
        attacker.model.position.lerpVectors(lungePos, origPos, p);
        attacker.model.position.y = 0;
      });
    }
  );
}
