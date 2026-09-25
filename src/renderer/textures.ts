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
  } else if (themeId === 'tech') {
    // Space-Tech / Void Station: High-tech metallic deckplates & reactor panels
    ctx.fillStyle = '#0b0f17';
    ctx.fillRect(0, 0, 1536, 2048);

    // Dark industrial reactor plating
    for (let i = 0; i < 90; i++) {
      const gx = rnd(0, 1536),
        gy = rnd(0, 2048),
        gr = rnd(40, 180);
      const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
      grad.addColorStop(0, 'rgba(15, 23, 42, 0.75)');
      grad.addColorStop(0.7, 'rgba(10, 15, 26, 0.4)');
      grad.addColorStop(1, 'rgba(11, 15, 23, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(gx, gy, gr, 0, Math.PI * 2);
      ctx.fill();
    }

    // High-tech cyan & amber conduit conduits
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.18)';
    ctx.lineWidth = 1.6;
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

    // Steel hex bolts and micro-circuits
    for (let i = 0; i < 4500; i++) {
      ctx.fillStyle = Math.random() < 0.5 ? 'rgba(56, 189, 248, 0.15)' : 'rgba(71, 85, 105, 0.28)';
      ctx.fillRect(rnd(0, 1536), rnd(0, 2048), rnd(1, 3.5), rnd(1, 3.5));
    }
  } else if (themeId === 'astral') {
    // Astral / Crystal World: Cosmic twilight, iridescent ley lines, and prismatic crystal facets
    ctx.fillStyle = '#120d24';
    ctx.fillRect(0, 0, 1536, 2048);

    // Glowing ethereal amethyst & violet nebulas
    for (let i = 0; i < 90; i++) {
      const gx = rnd(0, 1536),
        gy = rnd(0, 2048),
        gr = rnd(60, 240);
      const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
      const isCyan = Math.random() < 0.35;
      grad.addColorStop(0, isCyan ? 'rgba(56, 189, 248, 0.55)' : 'rgba(192, 132, 252, 0.60)');
      grad.addColorStop(0.6, 'rgba(88, 28, 135, 0.35)');
      grad.addColorStop(1, 'rgba(18, 13, 36, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(gx, gy, gr, 0, Math.PI * 2);
      ctx.fill();
    }

    // Prismatic crystalline geometric facets
    for (let i = 0; i < 35; i++) {
      const cx = rnd(50, 1480),
        cy = rnd(50, 1990),
        sz = rnd(30, 90);
      ctx.strokeStyle = 'rgba(232, 121, 249, 0.25)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let a = 0; a < 6; a++) {
        const ang = (a / 6) * Math.PI * 2;
        const px = cx + Math.cos(ang) * sz;
        const py = cy + Math.sin(ang) * sz;
        if (a === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
    }

    // Harmonic ley line grid
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.22)';
    ctx.lineWidth = 1.4;
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

    // Radiant crystal dust motes
    for (let i = 0; i < 5000; i++) {
      ctx.fillStyle = Math.random() < 0.6 ? 'rgba(232, 121, 249, 0.35)' : 'rgba(56, 189, 248, 0.40)';
      ctx.fillRect(rnd(0, 1536), rnd(0, 2048), rnd(1.2, 3.8), rnd(1.2, 3.8));
    }
  } else if (themeId === 'corrupted') {
    // Corrupted Flesh-World: Bruised obsidian crust, pulsing crimson-orange veins, festering mutation pustules
    ctx.fillStyle = '#1c080b';
    ctx.fillRect(0, 0, 1536, 2048);

    // Pulsing blood-iron flesh masses
    for (let i = 0; i < 100; i++) {
      const gx = rnd(0, 1536),
        gy = rnd(0, 2048),
        gr = rnd(50, 210);
      const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
      grad.addColorStop(0, 'rgba(185, 28, 28, 0.70)');
      grad.addColorStop(0.5, 'rgba(127, 29, 29, 0.45)');
      grad.addColorStop(1, 'rgba(28, 8, 11, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(gx, gy, gr, 0, Math.PI * 2);
      ctx.fill();
    }

    // Branching corrupted bio-veins
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.35)';
    ctx.lineWidth = 1.8;
    for (let i = 0; i < 30; i++) {
      let cx = rnd(60, 1470),
        cy = rnd(60, 1980);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      for (let s = 0; s < 6; s++) {
        cx += rnd(-25, 25);
        cy += rnd(-25, 25);
        ctx.lineTo(cx, cy);
      }
      ctx.stroke();
    }

    // Dark gore grid lines
    ctx.strokeStyle = 'rgba(220, 38, 38, 0.18)';
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

    // Blood crust specks & spore pustules
    for (let i = 0; i < 5000; i++) {
      ctx.fillStyle = Math.random() < 0.5 ? 'rgba(248, 113, 113, 0.35)' : 'rgba(30, 10, 12, 0.6)';
      ctx.fillRect(rnd(0, 1536), rnd(0, 2048), rnd(1, 3.6), rnd(1, 3.6));
    }
  } else if (themeId === 'devoured') {
    // Devoured World: Desaturated bone-grey bedrock, acidic bile pools, capillary erosion channels
    ctx.fillStyle = '#212418';
    ctx.fillRect(0, 0, 1536, 2048);

    // Acidic digestive bile residue pools
    for (let i = 0; i < 90; i++) {
      const gx = rnd(0, 1536),
        gy = rnd(0, 2048),
        gr = rnd(60, 220);
      const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
      grad.addColorStop(0, 'rgba(163, 230, 53, 0.55)');
      grad.addColorStop(0.6, 'rgba(77, 83, 52, 0.40)');
      grad.addColorStop(1, 'rgba(33, 36, 24, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(gx, gy, gr, 0, Math.PI * 2);
      ctx.fill();
    }

    // Stripped excavation claw gouges
    ctx.strokeStyle = 'rgba(132, 204, 22, 0.28)';
    ctx.lineWidth = 1.6;
    for (let i = 0; i < 35; i++) {
      let cx = rnd(80, 1450),
        cy = rnd(80, 1960);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      for (let s = 0; s < 5; s++) {
        cx += rnd(-20, 20);
        cy += rnd(-20, 20);
        ctx.lineTo(cx, cy);
      }
      ctx.stroke();
    }

    // Chitinous grid seams
    ctx.strokeStyle = 'rgba(163, 230, 53, 0.16)';
    ctx.lineWidth = 1.4;
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

    // Acid droplet specks and bone gravel
    for (let i = 0; i < 5000; i++) {
      ctx.fillStyle = Math.random() < 0.5 ? 'rgba(190, 242, 100, 0.32)' : 'rgba(50, 55, 35, 0.5)';
      ctx.fillRect(rnd(0, 1536), rnd(0, 2048), rnd(1, 3.4), rnd(1, 3.4));
    }
  } else if (themeId === 'tomb') {
    // Tomb World: Dark obsidian basalt flagstones & glowing Gauss-green circuit hieroglyphs
    ctx.fillStyle = '#060d09';
    ctx.fillRect(0, 0, 1536, 2048);

    // Deep obsidian basalt slab mottling
    for (let i = 0; i < 90; i++) {
      const gx = rnd(0, 1536),
        gy = rnd(0, 2048),
        gr = rnd(50, 190);
      const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
      grad.addColorStop(0, 'rgba(15, 41, 30, 0.70)');
      grad.addColorStop(0.7, 'rgba(9, 20, 15, 0.40)');
      grad.addColorStop(1, 'rgba(6, 13, 9, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(gx, gy, gr, 0, Math.PI * 2);
      ctx.fill();
    }

    // Glowing Gauss-green circuit conduit tracks
    ctx.strokeStyle = 'rgba(52, 211, 153, 0.30)';
    ctx.lineWidth = 1.6;
    for (let i = 0; i < 25; i++) {
      let cx = rnd(80, 1450),
        cy = rnd(80, 1960);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      for (let s = 0; s < 4; s++) {
        // Orthogonal 90-degree circuit traces
        if (s % 2 === 0) cx += rnd(-40, 40);
        else cy += rnd(-40, 40);
        ctx.lineTo(cx, cy);
      }
      ctx.stroke();
    }

    // Living metal grid seams
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.22)';
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

    // Ancient Gauss spark flecks
    for (let i = 0; i < 4500; i++) {
      ctx.fillStyle = Math.random() < 0.55 ? 'rgba(52, 211, 153, 0.28)' : 'rgba(5, 25, 16, 0.6)';
      ctx.fillRect(rnd(0, 1536), rnd(0, 2048), rnd(1, 3.2), rnd(1, 3.2));
    }
  } else {
    // Warp Rift World (rift): Scorched volcanic basalt, molten magma rivers, and purple dimensional tear lines
    ctx.fillStyle = '#1c0c07';
    ctx.fillRect(0, 0, 1536, 2048);

    // Blazing molten magma fissures & thermal glows
    for (let i = 0; i < 90; i++) {
      const gx = rnd(0, 1536),
        gy = rnd(0, 2048),
        gr = rnd(50, 220);
      const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
      const isWarp = Math.random() < 0.3;
      grad.addColorStop(0, isWarp ? 'rgba(168, 85, 247, 0.65)' : 'rgba(249, 115, 22, 0.70)');
      grad.addColorStop(0.5, 'rgba(194, 65, 12, 0.45)');
      grad.addColorStop(1, 'rgba(28, 12, 7, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(gx, gy, gr, 0, Math.PI * 2);
      ctx.fill();
    }

    // Searing molten lava channels
    ctx.strokeStyle = 'rgba(251, 146, 60, 0.42)';
    ctx.lineWidth = 2.2;
    for (let i = 0; i < 30; i++) {
      let cx = rnd(60, 1470),
        cy = rnd(60, 1980);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      for (let s = 0; s < 5; s++) {
        cx += rnd(-30, 30);
        cy += rnd(-30, 30);
        ctx.lineTo(cx, cy);
      }
      ctx.stroke();
    }

    // Scorched basalt gridlines
    ctx.strokeStyle = 'rgba(234, 88, 12, 0.20)';
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

    // Floating volcanic ember sparks & obsidian fragments
    for (let i = 0; i < 5000; i++) {
      ctx.fillStyle = Math.random() < 0.6 ? 'rgba(251, 146, 60, 0.38)' : 'rgba(192, 132, 252, 0.35)';
      ctx.fillRect(rnd(0, 1536), rnd(0, 2048), rnd(1.2, 3.8), rnd(1.2, 3.8));
    }
  }

  const texture = new THREE.CanvasTexture(c);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}
