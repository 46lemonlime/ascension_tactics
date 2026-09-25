import type { Theme } from './types';
import { MAP_OBSTACLES as BASE_OBSTACLES, key } from './constants';

export const THEMES: Record<string, Theme> = {
  jungle: {
    id: 'jungle',
    name: 'Jungle Death World',
    subtitle: 'Alien Primeval Biosphere',
    icon: '🌿',
    desc: 'Dense canopy, gnarled roots, overgrown terrain, and titan rib cages with bio-spores.',
    groundColor: 0x142b1b,
    obstacleColor: 0x224422,
    skyColor: 0x051108,
    fogColor: 0x0a1c10,
    particleColor: 0x4ade80,
    tableColor: 0x142b1b,
    particleType: 'rain',
    particleSize: 0.35,
    particleOpacity: 0.7
  },
  snow: {
    id: 'snow',
    name: 'Glacial Frost World',
    subtitle: 'Permafrost Ridges & Ice Chasms',
    icon: '❄️',
    desc: 'Sub-zero glacial crags, permafrost ridges, ice walls, and frozen installations.',
    groundColor: 0xd1d5db,
    obstacleColor: 0x4b5563,
    skyColor: 0x0f172a,
    fogColor: 0x1e293b,
    particleColor: 0xffffff,
    tableColor: 0xd1d5db,
    particleType: 'snow',
    particleSize: 0.5,
    particleOpacity: 0.85
  },
  desert: {
    id: 'desert',
    name: 'Desert Wastes',
    subtitle: 'Ash Dunes & Canyon Spires',
    icon: '🏜️',
    desc: 'Sun-scorched dunes, canyon-like mesa spires, rocky pillars, and buried ruins.',
    groundColor: 0x4a3b2c,
    obstacleColor: 0x6e5238,
    skyColor: 0x1a1208,
    fogColor: 0x2c1f10,
    particleColor: 0xfde047,
    tableColor: 0x4a3b2c,
    particleType: 'sand',
    particleSize: 0.4,
    particleOpacity: 0.75
  },
  city: {
    id: 'city',
    name: 'Gothic Hive City',
    subtitle: 'Industrial Ruins & Streets',
    icon: '🏛️',
    desc: 'Dense hab-blocks, blast barricades, street avenues, and ruined gothic architecture.',
    groundColor: 0x27272a,
    obstacleColor: 0x3f3f46,
    skyColor: 0x09090b,
    fogColor: 0x18181b,
    particleColor: 0xa1a1aa,
    tableColor: 0x27272a,
    particleType: 'none',
    particleSize: 0,
    particleOpacity: 0
  },
  tech: {
    id: 'tech',
    name: 'Space-Tech / Void Station',
    subtitle: 'Orbital Reactor & Bulkheads',
    icon: '🚀',
    desc: 'Reinforced orbital bulkheads, power generator cores, and glowing relay conduits.',
    groundColor: 0x0f172a,
    obstacleColor: 0x1e293b,
    skyColor: 0x020617,
    fogColor: 0x0f172a,
    particleColor: 0x38bdf8,
    tableColor: 0x0f172a,
    particleType: 'stars',
    particleSize: 0.35,
    particleOpacity: 0.85
  },
  astral: {
    id: 'astral',
    name: 'Astral Crystal Spire',
    subtitle: 'Harmonic Prisms & Floating Monoliths',
    icon: '✨',
    desc: 'Prismatic crystal clusters, floating wraithbone monoliths, and harmonic ley pathways.',
    groundColor: 0x18122b,
    obstacleColor: 0x581c87,
    skyColor: 0x0d071a,
    fogColor: 0x1e1136,
    particleColor: 0xc084fc,
    tableColor: 0x18122b,
    particleType: 'astral',
    particleSize: 0.4,
    particleOpacity: 0.85
  },
  corrupted: {
    id: 'corrupted',
    name: 'Corrupted Flesh-World',
    subtitle: 'Mutated Terrain & Dark Tendrils',
    icon: '💀',
    desc: 'Infected flesh growths, mutated root tendrils, barbed spikes, and warped altars.',
    groundColor: 0x2b0d12,
    obstacleColor: 0x7f1d1d,
    skyColor: 0x140407,
    fogColor: 0x24070c,
    particleColor: 0xf87171,
    tableColor: 0x2b0d12,
    particleType: 'corruption',
    particleSize: 0.42,
    particleOpacity: 0.8
  },
  devoured: {
    id: 'devoured',
    name: 'Devoured World',
    subtitle: 'Stripped Desolation & Digestion Pits',
    icon: '👾',
    desc: 'Stripped bedrock landscapes, acidic digestion pits, and subterranean feeding ducts.',
    groundColor: 0x26291c,
    obstacleColor: 0x4d5334,
    skyColor: 0x0e1107,
    fogColor: 0x181d0c,
    particleColor: 0xa3e635,
    tableColor: 0x26291c,
    particleType: 'acid',
    particleSize: 0.38,
    particleOpacity: 0.75
  },
  tomb: {
    id: 'tomb',
    name: 'Tomb World',
    subtitle: 'Living Metal Crypts & Monoliths',
    icon: '⚡',
    desc: 'Stepped living-metal pyramid pylons, grand crypt gateways, and Gauss energy circuits.',
    groundColor: 0x09140f,
    obstacleColor: 0x0f291e,
    skyColor: 0x020a06,
    fogColor: 0x051a10,
    particleColor: 0x34d399,
    tableColor: 0x09140f,
    particleType: 'gauss',
    particleSize: 0.32,
    particleOpacity: 0.8
  },
  rift: {
    id: 'rift',
    name: 'Warp Rift World',
    subtitle: 'Dimensional Fissures & Molten Void',
    icon: '🔥',
    desc: 'Volcanic basalt crags, molten magma fissures, and swirling dimensional warp tears.',
    groundColor: 0x26120b,
    obstacleColor: 0x7c2d12,
    skyColor: 0x140603,
    fogColor: 0x240b05,
    particleColor: 0xfb923c,
    tableColor: 0x26120b,
    particleType: 'rift',
    particleSize: 0.45,
    particleOpacity: 0.85
  }
};

export const MAP_THEMES = THEMES;
export const MAP_OBSTACLES = BASE_OBSTACLES;
export const OBSTACLES = new Set<string>();

export function initObstaclesForTheme(themeId: string = 'jungle'): void {
  OBSTACLES.clear();
  const list = MAP_OBSTACLES[themeId] || MAP_OBSTACLES.jungle;
  list.forEach(k => {
    OBSTACLES.add(k);
  });
}

initObstaclesForTheme('jungle');
