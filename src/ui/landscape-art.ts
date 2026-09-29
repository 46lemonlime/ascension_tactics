/**
 * Procedural Vector Landscape Artwork for Biomes and Missions
 * Provides rich, zero-latency, scale-independent cinematic landscape illustrations.
 */

export function getBiomeArtwork(themeId: string): string {
  switch (themeId) {
    case 'jungle':
      return `<img src="/assets/maps/jungle.jpg" alt="Jungle Death World" class="sp-landscape-img" loading="eager" />`;

    case 'snow':
      return `<img src="/assets/maps/snow.jpg" alt="Glacial Frost World" class="sp-landscape-img" loading="eager" />`;

    case 'desert':
      return `<img src="/assets/maps/desert.jpg" alt="Desert Wastes World" class="sp-landscape-img" loading="eager" />`;

    case 'city':
      return `<img src="/assets/maps/city.jpg" alt="Gothic Hive City" class="sp-landscape-img" loading="eager" />`;

    case 'tech':
      return `<img src="/assets/maps/tech.jpg" alt="Void Mothership" class="sp-landscape-img" loading="eager" />`;

    case 'astral':
      return `<img src="/assets/maps/astral.jpg" alt="Astral Crystal World" class="sp-landscape-img" loading="eager" />`;

    case 'corrupted':
      return `<img src="/assets/maps/corrupted.jpg" alt="Corrupted Flesh World" class="sp-landscape-img" loading="eager" />`;

    case 'devoured':
      return `<img src="/assets/maps/devoured.jpg" alt="Devoured World" class="sp-landscape-img" loading="eager" />`;

    case 'tomb':
      return `<img src="/assets/maps/tomb.jpg" alt="Tomb World" class="sp-landscape-img" loading="eager" />`;

    case 'rift':
      return `<img src="/assets/maps/rift.jpg" alt="Rift World" class="sp-landscape-img" loading="eager" />`;

    case 'random':
    default:
      return `<img src="/assets/maps/random.jpg" alt="Random World" class="sp-landscape-img" loading="eager" />`;
  }
}

export function getMissionArtwork(missionId: string): string {
  switch (missionId) {
    case 'escort':
      return `<img src="/assets/missions/escort.jpg" alt="VIP Escort" class="sp-landscape-img" loading="eager" />`;

    case 'domination':
      return `<img src="/assets/missions/domination.jpg" alt="Domination" class="sp-landscape-img" loading="eager" />`;

    case 'extermination':
    default:
      return `<img src="/assets/missions/extermination.jpg" alt="Extermination" class="sp-landscape-img" loading="eager" />`;
  }
}

