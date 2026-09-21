import type { Unit, UnitDef } from '../data/types';

export class DatasheetUI {
  private panel: HTMLElement | null;

  constructor() {
    this.panel = document.getElementById('unit-datasheet');
  }

  public showUnit(unit: Unit, unitDef: UnitDef, onAction?: (action: string) => void): void {
    if (!this.panel) return;
    this.panel.style.display = 'block';

    const hpPercent = Math.max(0, Math.min(100, (unit.wounds / unit.maxWounds) * 100));
    const moralePercent = Math.max(0, Math.min(100, (unit.morale / unit.maxMorale) * 100));

    let moraleBadgeClass = 'badge-steady';
    if (unit.moraleState === 'shaken') moraleBadgeClass = 'badge-shaken';
    if (unit.moraleState === 'broken') moraleBadgeClass = 'badge-broken';

    const squadInfo = unit.squadSize > 1 ? `Squad: ${unit.squadCasualties.filter(c => !c).length} / ${unit.squadSize} Operatives` : 'Single Model';

    this.panel.innerHTML = `
      <div class="datasheet-header">
        <div class="datasheet-title-group">
          <div class="datasheet-unit-name">${unitDef.name}</div>
          <div class="datasheet-subtitle">${unitDef.role.toUpperCase()} • ${squadInfo}</div>
        </div>
        <div class="datasheet-morale-badge ${moraleBadgeClass}">${unit.moraleState.toUpperCase()}</div>
      </div>

      <div class="datasheet-stats-grid">
        <div class="stat-box">
          <span class="stat-label">MOVE</span>
          <span class="stat-val">${unitDef.movement}"</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">TOUGHNESS</span>
          <span class="stat-val">T${unitDef.toughness}</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">SAVE</span>
          <span class="stat-val">${unitDef.armorSave}+</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">WOUNDS</span>
          <span class="stat-val">${unit.wounds}/${unit.maxWounds}</span>
        </div>
      </div>

      <div class="datasheet-bars">
        <div class="bar-container">
          <div class="bar-label"><span>Integrity</span><span>${unit.wounds}/${unit.maxWounds}</span></div>
          <div class="bar-track"><div class="bar-fill hp-fill" style="width: ${hpPercent}%"></div></div>
        </div>
        <div class="bar-container">
          <div class="bar-label"><span>Morale</span><span>${unit.morale}/${unit.maxMorale}</span></div>
          <div class="bar-track"><div class="bar-fill morale-fill" style="width: ${moralePercent}%"></div></div>
        </div>
      </div>

      <div class="datasheet-weapons">
        <div class="weapons-header">WEAPONRY</div>
        ${unitDef.weapons.map(w => `
          <div class="weapon-row">
            <span class="w-name">${w.name}</span>
            <span class="w-spec">${w.range > 1 ? `${w.range}"` : 'Melee'} | A${w.attacks} S${w.strength} AP${w.ap} D${w.damage}</span>
          </div>
        `).join('')}
      </div>

      <div class="datasheet-actions">
        ${unit.player === 1 && !unit.hasMoved ? `<button class="btn btn-action" data-act="move">MOVE</button>` : ''}
        ${unit.player === 1 && !unit.hasAttacked ? `<button class="btn btn-action" data-act="shoot">FIRE / ATTACK</button>` : ''}
        ${unit.player === 1 && unit.moraleState !== 'steady' ? `<button class="btn btn-action btn-rally" data-act="rally">RALLY</button>` : ''}
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
