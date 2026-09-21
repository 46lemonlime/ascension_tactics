import type { Unit, UnitDef } from '../data/types';

export class DatasheetUI {
  private panel: HTMLElement | null;

  constructor() {
    this.panel = document.getElementById('unit-datasheet');
  }

  public showUnit(unit: Unit, unitDef: UnitDef, onAction?: (action: string) => void): void {
    if (!this.panel) return;
    this.panel.style.display = 'block';

    const curHp = unit.wounds !== undefined ? unit.wounds : (unit.hp || 5);
    const maxHp = unit.maxWounds !== undefined ? unit.maxWounds : (unit.maxhp || 5);
    const hpPercent = Math.max(0, Math.min(100, (curHp / maxHp) * 100));

    const curMorale = typeof unit.morale === 'object' ? unit.morale.current : (unit.morale || 7);
    const maxMorale = typeof unit.morale === 'object' ? unit.morale.max : (unit.maxMorale || 7);
    const moralePercent = Math.max(0, Math.min(100, (curMorale / maxMorale) * 100));

    let moraleBadgeClass = 'badge-steady';
    if (unit.moraleState === 'shaken') moraleBadgeClass = 'badge-shaken';
    if (unit.moraleState === 'broken') moraleBadgeClass = 'badge-broken';

    const squadSize = unit.squadSize || unitDef.squadSize || 1;
    const squadInfo = squadSize > 1 ? `Squad: ${unit.squadCasualties?.filter(c => !c).length || squadSize} / ${squadSize} Operatives` : 'Single Model';

    this.panel.innerHTML = `
      <div class="datasheet-header">
        <div class="datasheet-title-group">
          <div class="datasheet-unit-name">${unitDef.name}</div>
          <div class="datasheet-subtitle">${(unitDef.role || 'Operative').toUpperCase()} • ${squadInfo}</div>
        </div>
        <div class="datasheet-morale-badge ${moraleBadgeClass}">${(unit.moraleState || 'steady').toUpperCase()}</div>
      </div>

      <div class="datasheet-stats-grid">
        <div class="stat-box">
          <span class="stat-label">MOVE</span>
          <span class="stat-val">${unitDef.movement || unitDef.m || 6}"</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">TOUGHNESS</span>
          <span class="stat-val">T${unitDef.toughness || unitDef.t || 4}</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">SAVE</span>
          <span class="stat-val">${unitDef.armorSave || unitDef.sv || 3}+</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">WOUNDS</span>
          <span class="stat-val">${curHp}/${maxHp}</span>
        </div>
      </div>

      <div class="datasheet-bars">
        <div class="bar-container">
          <div class="bar-label"><span>Integrity</span><span>${curHp}/${maxHp}</span></div>
          <div class="bar-track"><div class="bar-fill hp-fill" style="width: ${hpPercent}%"></div></div>
        </div>
        <div class="bar-container">
          <div class="bar-label"><span>Morale</span><span>${curMorale}/${maxMorale}</span></div>
          <div class="bar-track"><div class="bar-fill morale-fill" style="width: ${moralePercent}%"></div></div>
        </div>
      </div>

      <div class="datasheet-weapons">
        <div class="weapons-header">WEAPONRY</div>
        ${(unitDef.weapons || []).map(w => `
          <div class="weapon-row">
            <span class="w-name">${w.name}</span>
            <span class="w-spec">${w.range > 1 ? `${w.range}"` : 'Melee'} | A${w.attacks} S${w.strength} AP${w.ap} D${w.damage}</span>
          </div>
        `).join('')}
      </div>

      <div class="datasheet-actions">
        ${(unit.player === 1 || unit.team === 'player') && !unit.hasMoved ? `<button class="btn btn-action" data-act="move">MOVE</button>` : ''}
        ${(unit.player === 1 || unit.team === 'player') && !unit.hasAttacked ? `<button class="btn btn-action" data-act="shoot">FIRE / ATTACK</button>` : ''}
        ${(unit.player === 1 || unit.team === 'player') && unit.moraleState !== 'steady' ? `<button class="btn btn-action btn-rally" data-act="rally">RALLY</button>` : ''}
      </div>
    `;

    // Hook up buttons
    if (onAction) {
      const btns = this.panel.querySelectorAll<HTMLButtonElement>('.btn-action');
      btns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const act = btn.getAttribute('data-act');
          if (act) onAction(act);
        });
      });
    }
  }

  public hide(): void {
    if (this.panel) {
      this.panel.style.display = 'none';
      this.panel.innerHTML = '';
    }
  }
}
