import { BiomeTheme } from './types';
import { key } from './constants';

export const MAP_THEMES: Record<string, BiomeTheme> = {
  jungle: {
    id: 'jungle',
    name: 'Jungle Death World',
    subtitle: 'Alien Primeval Biosphere',
    icon: '🌿',
    desc: 'Dense jungle canopy, tangled weeds, and bones. High obstacle density, widely distributed, low straight sightlines.',
    tableColor: 0x0f2916,
    particleColor: 0x60a5fa,
    particleType: 'rain',
    particleSize: 0.32,
    particleOpacity: 0.75
  },
  desert: {
    id: 'desert',
    name: 'Desert Wastes',
    subtitle: 'Ash Dunes & Sunken Outposts',
    icon: '🏜️',
    desc: 'Vast sun-scorched sands and isolated canyon spires. Low obstacle count, wide open spaces, long sniper sightlines.',
    tableColor: 0x452f19,
    particleColor: 0xfcd34d,
    particleType: 'sand',
    particleSize: 0.42,
    particleOpacity: 0.75
  },
  snow: {
    id: 'snow',
    name: 'Snow Tundra',
    subtitle: 'Sub-Zero Glacial Crag',
    icon: '❄️',
    desc: 'Glacial crags and permafrost ridges. Moderate obstacle count, balanced snowfields, low straight sightlines.',
    tableColor: 0xcbd5e1,
    particleColor: 0xffffff,
    particleType: 'snow',
    particleSize: 0.52,
    particleOpacity: 0.85
  },
  city: {
    id: 'city',
    name: 'Gothic City',
    subtitle: 'Imperial Hive Ruins',
    icon: '🏛️',
    desc: 'Ruined multistory hab-blocks and street barricades. Moderate obstacles, open intersections, long straight boulevards.',
    tableColor: 0x333d4b,
    particleColor: 0x000000,
    particleType: 'none',
    particleSize: 0,
    particleOpacity: 0
  },
  tech: {
    id: 'tech',
    name: 'Tech Space',
    subtitle: 'Void Station & Space Hulk',
    icon: '🚀',
    desc: 'Compartmentalized reactor bulkheads and conduit gangways. Moderate obstacles, tight rooms, long straight corridors.',
    tableColor: 0x121720,
    particleColor: 0xffffff,
    particleType: 'stars',
    particleSize: 0.35,
    particleOpacity: 0.85
  }
};

export const MAP_OBSTACLES: Record<string, string[]> = {
  // 1. JUNGLE: Dense obstacle network (~85)
  jungle: [
    key(2,12), key(2,13), key(3,12), key(3,13), key(4,14), key(5,14),
    key(2,24), key(3,24), key(3,25), key(4,25),
    key(2,36), key(3,36), key(3,37), key(4,38), key(5,38),
    key(6,10), key(7,10), key(6,11), key(7,11), key(8,12),
    key(6,28), key(7,28), key(6,29), key(8,30),
    key(6,42), key(7,42), key(7,43), key(8,44),
    key(12,16), key(13,16), key(13,17), key(14,17),
    key(12,32), key(13,32), key(14,33), key(13,34),
    key(18,14), key(19,14), key(20,14), key(19,15), key(20,15), key(21,15),
    key(18,26), key(19,26), key(20,27), key(21,27), key(19,28), key(20,28),
    key(18,40), key(19,40), key(20,40), key(21,41),
    key(26,16), key(27,16), key(27,17), key(28,17),
    key(26,32), key(27,32), key(27,33), key(28,34),
    key(32,10), key(33,10), key(33,11), key(34,11),
    key(32,28), key(33,28), key(34,29),
    key(32,42), key(33,42), key(34,43), key(33,44),
    key(36,12), key(37,12), key(37,13),
    key(36,24), key(37,24), key(37,25),
    key(36,36), key(37,36), key(38,37), key(37,38)
  ],

  // 2. DESERT: Sparse obstacles (~30)
  desert: [
    key(6,14), key(7,14), key(7,15), key(8,15),
    key(6,38), key(7,38), key(7,39), key(8,39),
    key(14,24), key(15,24), key(14,25), key(15,25),
    key(24,28), key(25,28), key(24,29), key(25,29),
    key(32,14), key(33,14), key(33,15), key(34,15),
    key(32,38), key(33,38), key(33,39), key(34,39),
    key(19,18), key(20,18), key(19,36), key(20,36),
    key(10,28), key(29,24), key(18,8), key(21,46)
  ],

  // 3. SNOW: Moderate obstacles (~52)
  snow: [
    key(4,14), key(5,14), key(6,15), key(7,15), key(8,16), key(9,16), key(10,17), key(11,17), key(12,18),
    key(35,14), key(34,14), key(33,15), key(32,15), key(31,16), key(30,16), key(29,17), key(28,17), key(27,18),
    key(18,26), key(19,26), key(20,26), key(21,26), key(19,27), key(20,27), key(18,28), key(19,28), key(20,28), key(21,28),
    key(4,38), key(5,38), key(6,37), key(7,37), key(8,36), key(9,36), key(10,35), key(11,35), key(12,34),
    key(35,38), key(34,38), key(33,37), key(32,37), key(31,36), key(30,36), key(29,35), key(28,35), key(27,34),
    key(2,26), key(3,26), key(36,26), key(37,26), key(19,10), key(20,10), key(19,44), key(20,44)
  ],

  // 4. CITY: 4 large ruined blocks + bunkers
  city: [
    key(8,12), key(9,12), key(10,12), key(11,12), key(8,13), key(9,13), key(10,13), key(11,13), key(8,14), key(9,14), key(10,14), key(11,14),
    key(28,12), key(29,12), key(30,12), key(31,12), key(28,13), key(29,13), key(30,13), key(31,13), key(28,14), key(29,14), key(30,14), key(31,14),
    key(8,38), key(9,38), key(10,38), key(11,38), key(8,39), key(9,39), key(10,39), key(11,39), key(8,40), key(9,40), key(10,40), key(11,40),
    key(28,38), key(29,38), key(30,38), key(31,38), key(28,39), key(29,39), key(30,39), key(31,39), key(28,40), key(29,40), key(30,40), key(31,40),
    key(18,24), key(19,24), key(20,24), key(21,24), key(18,29), key(19,29), key(20,29), key(21,29),
    key(9,26), key(10,26), key(29,26), key(30,26)
  ],

  // 5. TECH SPACE: Dual reactor cores, bulkheads
  tech: [
    key(18,18), key(19,18), key(20,18), key(21,18), key(18,19), key(19,19), key(20,19), key(21,19),
    key(18,34), key(19,34), key(20,34), key(21,34), key(18,35), key(19,35), key(20,35), key(21,35),
    key(8,12), key(9,12), key(10,12), key(8,13), key(8,17), key(8,18), key(9,18), key(10,18),
    key(8,32), key(9,32), key(10,32), key(8,33), key(8,37), key(8,38), key(9,38), key(10,38),
    key(4,24), key(4,25), key(4,26), key(4,27), key(5,26), key(6,26),
    key(29,12), key(30,12), key(31,12), key(31,13), key(29,18), key(30,18), key(31,18), key(31,17),
    key(29,32), key(30,32), key(31,32), key(31,33), key(29,38), key(30,38), key(31,38), key(31,37),
    key(35,24), key(35,25), key(35,26), key(35,27), key(34,26), key(33,26)
  ]
};

export const OBSTACLES = new Set<string>();

export function initObstaclesForTheme(themeId: string = 'tech'): void {
  OBSTACLES.clear();
  const list = MAP_OBSTACLES[themeId] || MAP_OBSTACLES.tech;
  list.forEach(k => OBSTACLES.add(k));
}

initObstaclesForTheme('tech');
