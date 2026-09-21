import type { Unit, UnitDef } from '../data/types';
import { FACTIONS } from '../data/factions';

export class DatasheetUI {
  private panel: HTMLElement | null;
  private iconEl: HTMLElement | null;
  private modelsBadgeEl: HTMLElement | null;
  private nameEl: HTMLElement | null;
  private factionEl: HTMLElement | null;
  private statsEl: HTMLElement | null;

  constructor() {
    this.panel = document.getElementById('datasheet');
    this.iconEl = document.getElementById('ds-icon');
    this.modelsBadgeEl = document.getElementById('ds-models-badge');
    this.nameEl = document.getElementById('ds-name');
    this.factionEl = document.getElementById('ds-faction');
    this.statsEl = document.getElementById('ds-stats');
  }

  public showUnit(unit: Unit, unitDef: UnitDef): void {
    if (!this.panel) return;
    this.panel.style.display = 'flex';

    const curHp = unit.wounds !== undefined ? unit.wounds : (unit.hp || 5);
    const maxHp = unit.maxWounds !== undefined ? unit.maxWounds : (unit.maxhp || 5);
    const hpPercent = Math.max(0, Math.min(100, (curHp / maxHp) * 100));

    const curMorale = typeof unit.morale === 'object' ? unit.morale.current : (unit.morale || 7);
    const maxMorale = typeof unit.morale === 'object' ? unit.morale.max : (unit.maxMorale || 7);

    const squadSize = unit.squadSize || unitDef.squadSize || 1;
    const casualtiesCount = unit.squadCasualties?.filter(c => c).length || 0;
    const activeModels = Math.max(1, squadSize - casualtiesCount);

    if (this.nameEl) this.nameEl.textContent = unit.name || unitDef.name;

    const factionName = (unit as any).factionId || (unit.player === 1 ? 'Strike Force' : 'Enemy Host');
    if (this.factionEl) this.factionEl.textContent = factionName.toUpperCase();

    if (this.modelsBadgeEl) {
      this.modelsBadgeEl.textContent = `${activeModels}x`;
    }

    if (this.iconEl) {
      this.iconEl.textContent = unit.player === 1 ? '🛡️' : '💀';
    }

    if (this.statsEl) {
      const move = unitDef.movement || unitDef.m || 6;
      const toughness = unitDef.toughness || unitDef.t || 4;
      const save = unitDef.armorSave || unitDef.sv || 3;
      const weaponList = (unitDef.weapons || []).map(w => `${w.name} (${w.range > 1 ? `${w.range}"` : 'Melee'})`).join(', ');

      this.statsEl.innerHTML = `
        <div class="stat-badge">M: <b>${move}"</b></div>
        <div class="stat-badge">T: <b>T${toughness}</b></div>
        <div class="stat-badge">Sv: <b>${save}+</b></div>
        <div class="stat-badge">
          W: <b>${curHp}/${maxHp}</b>
          <div class="hp-bar-bg">
            <div class="hp-bar-fill ${unit.player === 2 ? 'enemy' : ''}" style="width:${hpPercent}%;"></div>
          </div>
        </div>
        <div class="stat-badge">Morale: <b>${curMorale}/${maxMorale} (${(unit.moraleState || 'steady').toUpperCase()})</b></div>
        ${weaponList ? `<div class="stat-badge" style="font-size:11px;">Weapons: <b>${weaponList}</b></div>` : ''}
      `;
    }
  }

  public hide(): void {
    if (this.panel) {
      this.panel.style.display = 'none';
    }
  }
}

