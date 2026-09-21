import * as THREE from 'three';
import { GRID_COLS, GRID_ROWS, rnd } from '../data/constants';

export function createBattleMatTexture(themeId: string = 'tech'): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 1536;
  c.height = 2048;
  const ctx = c.getContext('2d')!;

  const COLS = GRID_COLS;
  const ROWS = GRID_ROWS;

  if (themeId === 'jungle') {
    // Ground: Mainly green with earthy/muddy patches
    ctx.fillStyle = '#0f2916';
    ctx.fillRect(0, 0, 1536, 2048);

    // Large lush green moss biomes
    for (let i = 0; i < 120; i++) {
      const gx = rnd(0, 1536),
        gy = rnd(0, 2048),
        gr = rnd(60, 220);
      const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
      const isBright = Math.random() < 0.45;
      grad.addColorStop(0, isBright ? 'rgba(34, 197, 94, 0.65)' : 'rgba(21, 128, 61, 0.75)');
      grad.addColorStop(0.7, 'rgba(15, 75, 35, 0.4)');
      grad.addColorStop(1, 'rgba(15, 41, 22, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(gx, gy, gr, 0, Math.PI * 2);
      ctx.fill();
    }

    // Earthy brown mud & peat patches
    for (let i = 0; i < 40; i++) {
      const gx = rnd(0, 1536),
        gy = rnd(0, 2048),
        gr = rnd(40, 130);
      const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
      grad.addColorStop(0, 'rgba(61, 35, 20, 0.85)');
      grad.addColorStop(0.8, 'rgba(39, 24, 13, 0.4)');
      grad.addColorStop(1, 'rgba(15, 41, 22, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(gx, gy, gr, 0, Math.PI * 2);
      ctx.fill();
    }

    // Organic creeping root tendrils / subtle gridlines
    ctx.strokeStyle = 'rgba(74, 222, 128, 0.16)';
    ctx.lineWidth = 1.8;
    const stepX = 1536 / COLS,
      stepY = 2048 / ROWS;
    for (let x = 0; x <= 1536; x += stepX) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 2048);
      ctx.stroke();
    }
    for (let y = 0; y <= 2048; y += stepY) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1536, y);
      ctx.stroke();
    }

    // Leaf litter and bio lichen specks
    for (let i = 0; i < 5000; i++) {
      ctx.fillStyle = Math.random() < 0.6 ? 'rgba(74, 222, 128, 0.22)' : 'rgba(30, 41, 59, 0.35)';
      ctx.fillRect(rnd(0, 1536), rnd(0, 2048), rnd(1.5, 4), rnd(1.5, 4));
    }
  } else if (themeId === 'desert') {
    // Ground: Earth and sand ground with dune ripples
    ctx.fillStyle = '#452f19';
    ctx.fillRect(0, 0, 1536, 2048);

    // Golden sandbanks and dune sweeps
    for (let i = 0; i < 90; i++) {
      const gx = rnd(0, 1536),
        gy = rnd(0, 2048),
        gr = rnd(70, 260);
      const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
      grad.addColorStop(0, 'rgba(194, 136, 52, 0.7)');
      grad.addColorStop(0.6, 'rgba(161, 98, 7, 0.45)');
      grad.addColorStop(1, 'rgba(69, 47, 25, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(gx, gy, gr, 0, Math.PI * 2);
      ctx.fill();
    }

    // Earthy darker cracked clay patches
    for (let i = 0; i < 35; i++) {
      const gx = rnd(0, 1536),
        gy = rnd(0, 2048),
        gr = rnd(30, 110);
      const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
      grad.addColorStop(0, 'rgba(56, 35, 18, 0.85)');
      grad.addColorStop(1, 'rgba(69, 47, 25, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(gx, gy, gr, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.strokeStyle = 'rgba(245, 158, 11, 0.14)';
    ctx.lineWidth = 1.5;
    const stepX = 1536 / COLS,
      stepY = 2048 / ROWS;
    for (let x = 0; x <= 1536; x += stepX) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 2048);
      ctx.stroke();
    }
    for (let y = 0; y <= 2048; y += stepY) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1536, y);
      ctx.stroke();
    }

    // Sand grains and pebble noise
    for (let i = 0; i < 5000; i++) {
      ctx.fillStyle = Math.random() < 0.5 ? 'rgba(253, 224, 71, 0.18)' : 'rgba(120, 53, 15, 0.3)';
      ctx.fillRect(rnd(0, 1536), rnd(0, 2048), rnd(1, 3.5), rnd(1, 3.5));
    }
  } else if (themeId === 'snow') {
    // Ground: White, grey, and bluish snow/ice ground
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(0, 0, 1536, 2048);

    // Brilliant white packed snowdrifts
    for (let i = 0; i < 110; i++) {
      const gx = rnd(0, 1536),
        gy = rnd(0, 2048),
        gr = rnd(60, 240);
      const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
      grad.addColorStop(0.7, 'rgba(241, 245, 249, 0.45)');
      grad.addColorStop(1, 'rgba(203, 213, 225, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(gx, gy, gr, 0, Math.PI * 2);
      ctx.fill();
    }

    // Deep bluish glacial ice veins
    for (let i = 0; i < 45; i++) {
      const gx = rnd(0, 1536),
        gy = rnd(0, 2048),
        gr = rnd(30, 130);
      const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
      grad.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
      grad.addColorStop(0.6, 'rgba(30, 58, 95, 0.35)');
      grad.addColorStop(1, 'rgba(203, 213, 225, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(gx, gy, gr, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.20)';
    ctx.lineWidth = 1.5;
    const stepX = 1536 / COLS,
      stepY = 2048 / ROWS;
    for (let x = 0; x <= 1536; x += stepX) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 2048);
      ctx.stroke();
    }
    for (let y = 0; y <= 2048; y += stepY) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1536, y);
      ctx.stroke();
    }

    // Crystalline frost flecks
    for (let i = 0; i < 5000; i++) {
      ctx.fillStyle = Math.random() < 0.6 ? 'rgba(255, 255, 255, 0.4)' : 'rgba(56, 189, 248, 0.25)';
      ctx.fillRect(rnd(0, 1536), rnd(0, 2048), rnd(1, 3.5), rnd(1, 3.5));
    }
  } else if (themeId === 'city') {
    // Ground: Weathered Imperial urban slate concrete & distressed basalt paving
    ctx.fillStyle = '#2d3542';
    ctx.fillRect(0, 0, 1536, 2048);

    // Weathered flagstone plazas & slate paving slabs
    for (let i = 0; i < 90; i++) {
      const gx = rnd(0, 1536),
        gy = rnd(0, 2048),
        gr = rnd(50, 190);
      const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
      const tone = Math.random();
      if (tone < 0.4) {
        grad.addColorStop(0, 'rgba(100, 116, 139, 0.42)');
        grad.addColorStop(0.7, 'rgba(71, 85, 105, 0.25)');
      } else if (tone < 0.75) {
        grad.addColorStop(0, 'rgba(115, 128, 145, 0.32)');
        grad.addColorStop(0.6, 'rgba(60, 72, 88, 0.20)');
      } else {
        grad.addColorStop(0, 'rgba(15, 20, 28, 0.60)');
        grad.addColorStop(0.8, 'rgba(25, 32, 42, 0.25)');
      }
      grad.addColorStop(1, 'rgba(45, 53, 66, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(gx, gy, gr, 0, Math.PI * 2);
      ctx.fill();
    }

    // Weathered & chipped yellow tactical roadway markings
    ctx.fillStyle = 'rgba(217, 119, 6, 0.38)';
    for (let y = 80; y < 2048; y += 160) {
      ctx.fillRect(760, y, 16, 60);
    }
    // Faded white cross-boulevard lanes
    ctx.fillStyle = 'rgba(203, 213, 225, 0.28)';
    for (let x = 60; x < 1536; x += 140) {
      ctx.fillRect(x, 1020, 50, 12);
    }

    // Dual-tone recessed flagstone seams
    const stepX = 1536 / COLS,
      stepY = 2048 / ROWS;
    ctx.strokeStyle = 'rgba(12, 16, 23, 0.45)';
    ctx.lineWidth = 1.6;
    for (let x = 0; x <= 1536; x += stepX) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 2048);
      ctx.stroke();
    }
    for (let y = 0; y <= 2048; y += stepY) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1536, y);
      ctx.stroke();
    }

    ctx.strokeStyle = 'rgba(148, 163, 184, 0.12)';
    ctx.lineWidth = 0.8;
    for (let x = 0; x <= 1536; x += stepX) {
      ctx.beginPath();
      ctx.moveTo(x + 1, 0);
      ctx.lineTo(x + 1, 2048);
      ctx.stroke();
    }
    for (let y = 0; y <= 2048; y += stepY) {
      ctx.beginPath();
      ctx.moveTo(0, y + 1);
      ctx.lineTo(1536, y + 1);
      ctx.stroke();
    }

    // Organic crack fissures
    ctx.strokeStyle = 'rgba(15, 20, 28, 0.35)';
    ctx.lineWidth = 1.0;
    for (let i = 0; i < 40; i++) {
      let cx = rnd(50, 1480),
        cy = rnd(50, 1990);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      for (let seg = 0; seg < 4; seg++) {
        cx += rnd(-18, 18);
        cy += rnd(-18, 18);
        ctx.lineTo(cx, cy);
      }
      ctx.stroke();
    }

    // Blast soot & rubble specks
    for (let i = 0; i < 5000; i++) {
      const r = Math.random();
      if (r < 0.4) ctx.fillStyle = 'rgba(203, 213, 225, 0.18)';
      else if (r < 0.75) ctx.fillStyle = 'rgba(15, 20, 28, 0.35)';
      else ctx.fillStyle = 'rgba(148, 163, 184, 0.26)';
      ctx.fillRect(rnd(0, 1536), rnd(0, 2048), rnd(1, 3.2), rnd(1, 3.2));
    }
  } else {
    // Tech space (baseline metallic deckplates)
    ctx.fillStyle = '#0f141d';
    ctx.fillRect(0, 0, 1536, 2048);

    for (let i = 0; i < 90; i++) {
      const gx = rnd(0, 1536),
        gy = rnd(0, 2048),
        gr = rnd(40, 160);
      const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
      grad.addColorStop(0, 'rgba(6, 8, 12, 0.85)');
      grad.addColorStop(1, 'rgba(15, 20, 29, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(gx, gy, gr, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.strokeStyle = 'rgba(212, 175, 55, 0.10)';
    ctx.lineWidth = 1.5;
    const stepX = 1536 / COLS,
      stepY = 2048 / ROWS;
    for (let x = 0; x <= 1536; x += stepX) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 2048);
      ctx.stroke();
    }
    for (let y = 0; y <= 2048; y += stepY) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1536, y);
      ctx.stroke();
    }
    for (let i = 0; i < 4500; i++) {
      ctx.fillStyle = Math.random() < 0.5 ? 'rgba(140,150,165,0.12)' : 'rgba(80,85,95,0.2)';
      ctx.fillRect(rnd(0, 1536), rnd(0, 2048), rnd(1, 3.5), rnd(1, 3.5));
    }
  }

  const texture = new THREE.CanvasTexture(c);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}
