import type { Theme } from './types';
import { MAP_OBSTACLES as BASE_OBSTACLES, key } from './constants';

export const THEMES: Record<string, Theme> = {
  jungle: {
    id: 'jungle',
    name: 'Jungle Death World',
    subtitle: 'Alien Primeval Biosphere',
    icon: '🌿',
    desc: 'Dense canopy and alien vegetation. High obstacle density with short engagement ranges.',
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
  desert: {
    id: 'desert',
    name: 'Desert Wastes',
    subtitle: 'Ash Dunes & Sunken Outposts',
    icon: '🏜️',
    desc: 'Sun-scorched sands and isolated canyon spires. Wide sightlines and minimal cover.',
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
  snow: {
    id: 'snow',
    name: 'Snow Tundra',
    subtitle: 'Sub-Zero Glacial Crag',
    icon: '❄️',
    desc: 'Glacial crags and permafrost ridges. Moderate cover with falling blizzards.',
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
  city: {
    id: 'city',
    name: 'Gothic City',
    subtitle: 'Imperial Hive Ruins',
    icon: '🏛️',
    desc: 'Ruined hab-blocks and street barricades. Heavy cover and urban choke points.',
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
    name: 'Tech Space',
    subtitle: 'Void Station & Space Hulk',
    icon: '🚀',
    desc: 'Reactor bulkheads and energy conduit spires. High-tech void environment.',
    groundColor: 0x0f172a,
    obstacleColor: 0x1e293b,
    skyColor: 0x020617,
    fogColor: 0x0f172a,
    particleColor: 0x38bdf8,
    tableColor: 0x0f172a,
    particleType: 'stars',
    particleSize: 0.35,
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
