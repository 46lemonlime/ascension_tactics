import { FACTIONS } from '../data/factions';
import { THEMES } from '../data/themes';
import { MISSIONS, MISSION_CYCLE } from '../data/missions';
import { FACTION_CYCLE, MAP_CYCLE } from './dom';

/**
 * Reusable Information Panel Dynamic Sizing Utility
 * Measures the maximum content requirements across complete rosters
 * and locks panel containers to a stable, content-derived height.
 */
export class InfoPanelSizer {
  private static measureHost: HTMLElement | null = null;

  private static getMeasureHost(): HTMLElement {
    if (!this.measureHost) {
      let host = document.getElementById('sp-measure-host');
      if (!host) {
        host = document.createElement('div');
        host.id = 'sp-measure-host';
        host.setAttribute('aria-hidden', 'true');
        host.style.cssText =
          'position: fixed; top: -99999px; left: -99999px; visibility: hidden; pointer-events: none; z-index: -9999; opacity: 0;';
        document.body.appendChild(host);
      }
      this.measureHost = host;
    }
    return this.measureHost;
  }

  /**
   * Calculates and sets the maximum required height for Faction Information Panels.
   */
  public static syncFactionPanelHeights(): number {
    const playerPanel = document.getElementById('player-faction-infobox');
    const aiPanel = document.getElementById('ai-faction-infobox');
    const host = this.getMeasureHost();

    // Determine target width (measured or responsive default)
    const targetWidth = playerPanel && playerPanel.clientWidth > 0
      ? playerPanel.clientWidth
      : Math.min(436, Math.max(300, window.innerWidth * 0.42));

    let maxHeight = 0;

    FACTION_CYCLE.forEach(race => {
      let title = '';
      let sub = '';
      let desc = '';
      let doctrine = '';
      let roster = '';

      if (race === 'random') {
        title = '🎲 RANDOM ARMY';
        sub = 'DYNAMIC MYSTERY FORCE';
        desc = 'Roll an unpredictable strike force dynamically upon tactical deployment. Test your command mastery across all 10 warhost factions.';
        doctrine = '<strong>DOCTRINE:</strong> Dynamic tactical flexibility • Adapt & Conquer';
        roster = '<span>Mystery Selection</span> • <span>All 10 Warhosts</span> • <span>Tactical Versatility</span>';
      } else {
        const f = FACTIONS[race];
        if (!f) return;
        title = `${f.icon} ${f.name.toUpperCase()}`;
        sub = (f.sub || '').toUpperCase();
        desc = f.desc || '';
        doctrine = `<strong>DOCTRINE:</strong> ${f.doctrine || 'Standard Tactical Doctrine'}`;
        const rosterNames = f.roster && f.roster.length > 0 ? f.roster.map(u => u.name).slice(0, 5).join(' • ') : 'Standard Unit Squads';
        roster = rosterNames;
      }

      host.innerHTML = `
        <div class="sp-faction-infobox player-infobox" style="width: ${targetWidth}px; height: auto; min-height: 0; max-height: none; overflow: visible;">
          <div class="sp-infobox-header">
            <div class="sp-infobox-title-group">
              <h4 class="sp-infobox-title">${title}</h4>
              <div class="sp-infobox-sub">${sub}</div>
            </div>
          </div>
          <div class="sp-infobox-desc" style="height: auto; min-height: 0; max-height: none; -webkit-line-clamp: unset;">${desc}</div>
          <div class="sp-infobox-doctrine" style="height: auto; min-height: 0; max-height: none; -webkit-line-clamp: unset;">${doctrine}</div>
          <div class="sp-infobox-roster" style="height: auto; min-height: 0; max-height: none;">${roster}</div>
        </div>
      `;

      const measured = host.firstElementChild ? (host.firstElementChild as HTMLElement).offsetHeight : 0;
      if (measured > maxHeight) {
        maxHeight = measured;
      }
    });

    host.innerHTML = '';

    // Apply measured maximum height + small padding buffer
    const finalHeight = Math.max(185, maxHeight);
    [playerPanel, aiPanel].forEach(panel => {
      if (panel) {
        panel.style.height = `${finalHeight}px`;
        panel.style.minHeight = `${finalHeight}px`;
        panel.style.maxHeight = `${finalHeight}px`;
      }
    });

    return finalHeight;
  }

  /**
   * Calculates and sets the maximum required height for the Battlefield Biome Information Panel.
   */
  public static syncBiomePanelHeights(): number {
    const biomePanel = document.getElementById('sp-map-infobox');
    const host = this.getMeasureHost();

    const targetWidth = biomePanel && biomePanel.clientWidth > 0
      ? biomePanel.clientWidth
      : Math.min(816, Math.max(320, window.innerWidth - 48));

    let maxHeight = 0;

    MAP_CYCLE.forEach(themeId => {
      let title = '';
      let sub = '';
      let desc = '';
      let atmosphere = '';
      let features = '';

      if (themeId === 'random') {
        title = '🎲 RANDOM BIOME';
        sub = 'DYNAMIC MYSTERY THEATER';
        desc = 'Deploy into an unpredictable planetary theater with dynamic terrain obstacles, tactical hazards, and shifting environmental atmospheric conditions.';
        atmosphere = '<strong>ATMOSPHERE:</strong> Dynamic Environmental Conditions • Adapt to Field Terrain';
        features = '<span>Unpredictable Obstacles</span> • <span>Variable Line of Sight</span> • <span>Dynamic Cover</span>';
      } else {
        const t = THEMES[themeId];
        if (!t) return;
        title = `${t.icon} ${t.name.toUpperCase()}`;
        sub = (t.subtitle || '').toUpperCase();
        desc = t.desc || '';
        const weatherText = t.particleType === 'rain' ? 'Torrential Acid Rain & Low Light' :
                            t.particleType === 'snow' ? 'Sub-Zero Blizzard & Permafrost Hazards' :
                            t.particleType === 'sand' ? 'Blinding Sandstorms & Solar Thermal Heat' :
                            t.particleType === 'stars' ? 'Zero-G Void Conditions & Solar Radiation' :
                            t.particleType === 'astral' ? 'Harmonic Ley Resonances & Prismatic Aura' :
                            t.particleType === 'corruption' ? 'Corrosive Spores & Mutagenic Bio-Toxins' :
                            t.particleType === 'acid' ? 'Atmospheric Digestive Vapors & Caustic Mists' :
                            t.particleType === 'gauss' ? 'Gauss Energy Static & Electromagnetic Flux' :
                            t.particleType === 'rift' ? 'Warp Fire Storms & Dimensional Grav-Anomalies' :
                            'Industrial Smog & Low Atmospheric Visibility';
        atmosphere = `<strong>ATMOSPHERE:</strong> ${weatherText}`;
        const obstacleMap: Record<string, string> = {
          jungle: 'Ancient Titan Ribs • Bio-Spores • Overgrown Temple Ruins',
          snow: 'Glacial Ice Walls • Sub-Zero Chasms • Frozen Relic Outposts',
          desert: 'Fossil Ash Dunes • Canyon Spires • Sunken Vault Ruins',
          city: 'Reinforced Hab-Blocks • Blast Barricades • Gothic Street Avenues',
          tech: 'Orbital Bulkheads • Reactor Cores • Power Conduit Relays',
          astral: 'Prismatic Monoliths • Crystal Clusters • Harmonic Leylines',
          corrupted: 'Mutated Flesh Altars • Barbed Spines • Mutated Tendrils',
          devoured: 'Acid Digestion Pits • Chitin Spires • Subterranean Ducts',
          tomb: 'Gauss Crypt Pylons • Living-Metal Monoliths • Tomb Portals',
          rift: 'Basalt Magma Crags • Dimensional Tears • Molten Void Fissures'
        };
        features = obstacleMap[themeId] || 'Dense Tactical Cover • Strategic Obstacles';
      }

      host.innerHTML = `
        <div class="sp-map-infobox" style="width: ${targetWidth}px; height: auto; min-height: 0; max-height: none; overflow: visible;">
          <div class="sp-infobox-header">
            <div class="sp-infobox-title-group">
              <h4 class="sp-infobox-title">${title}</h4>
              <div class="sp-infobox-sub">${sub}</div>
            </div>
          </div>
          <div class="sp-infobox-desc" style="height: auto; min-height: 0; max-height: none; -webkit-line-clamp: unset;">${desc}</div>
          <div class="sp-infobox-doctrine" style="height: auto; min-height: 0; max-height: none; -webkit-line-clamp: unset;">${atmosphere}</div>
          <div class="sp-infobox-roster" style="height: auto; min-height: 0; max-height: none;">${features}</div>
        </div>
      `;

      const measured = host.firstElementChild ? (host.firstElementChild as HTMLElement).offsetHeight : 0;
      if (measured > maxHeight) {
        maxHeight = measured;
      }
    });

    host.innerHTML = '';

    const finalHeight = Math.max(185, maxHeight);
    if (biomePanel) {
      biomePanel.style.height = `${finalHeight}px`;
      biomePanel.style.minHeight = `${finalHeight}px`;
      biomePanel.style.maxHeight = `${finalHeight}px`;
    }

    return finalHeight;
  }

  /**
   * Calculates and sets the maximum required height for the Mission Information Panel.
   */
  public static syncMissionPanelHeights(): number {
    const missionPanel = document.getElementById('sp-mission-infobox');
    const host = this.getMeasureHost();

    const targetWidth = missionPanel && missionPanel.clientWidth > 0
      ? missionPanel.clientWidth
      : Math.min(816, Math.max(320, window.innerWidth - 48));

    let maxHeight = 0;

    MISSION_CYCLE.forEach(mId => {
      const m = MISSIONS[mId];
      if (!m) return;

      const title = `${m.icon} ${m.name.toUpperCase()}`;
      const sub = (m.subtitle || '').toUpperCase();
      const desc = m.desc || '';
      const params = `<strong>PARAMETERS:</strong> ${m.params}`;
      const features = m.features || '';

      const escortConfigMarkup = m.hasEscortConfig ? `
        <div class="escort-config-inline" style="display: flex;">
          <div class="escort-role-group">
            <span><b>🛡️ Player 1 Stance:</b></span>
            <select><option>Escort VIP</option></select>
          </div>
          <div class="escort-role-group">
            <span><b>💀 AI Opponent Stance:</b></span>
            <select><option>Counter-Stance</option></select>
          </div>
        </div>
      ` : '';

      host.innerHTML = `
        <div class="sp-mission-infobox" style="width: ${targetWidth}px; height: auto; min-height: 0; max-height: none; overflow: visible;">
          <div class="sp-infobox-header">
            <div class="sp-infobox-title-group">
              <h4 class="sp-infobox-title">${title}</h4>
              <div class="sp-infobox-sub">${sub}</div>
            </div>
          </div>
          <div class="sp-infobox-desc" style="height: auto; min-height: 0; max-height: none; -webkit-line-clamp: unset;">${desc}</div>
          <div class="sp-infobox-doctrine" style="height: auto; min-height: 0; max-height: none; -webkit-line-clamp: unset;">${params}</div>
          <div class="sp-infobox-roster" style="height: auto; min-height: 0; max-height: none;">${features}</div>
          ${escortConfigMarkup}
        </div>
      `;

      const measured = host.firstElementChild ? (host.firstElementChild as HTMLElement).offsetHeight : 0;
      if (measured > maxHeight) {
        maxHeight = measured;
      }
    });

    host.innerHTML = '';

    const finalHeight = Math.max(185, maxHeight);
    if (missionPanel) {
      missionPanel.style.height = `${finalHeight}px`;
      missionPanel.style.minHeight = `${finalHeight}px`;
      missionPanel.style.maxHeight = `${finalHeight}px`;
    }

    return finalHeight;
  }

  /**
   * Measures and syncs all information panel heights across Factions, Biomes, and Missions.
   */
  public static syncAllPanelHeights(): void {
    this.syncFactionPanelHeights();
    this.syncBiomePanelHeights();
    this.syncMissionPanelHeights();
  }
}
