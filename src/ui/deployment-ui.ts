import type { UnitDef, Faction } from '../data/types';

export class DeploymentUI {
  private dockElement: HTMLElement | null;
  private statusElement: HTMLElement | null;
  private startBtn: HTMLButtonElement | null;
  private autoBtn: HTMLButtonElement | null;

  public selectedRosterIndex: number | null = null;
  public onSelectRosterUnit?: (index: number) => void;
  public onAutoDeploy?: () => void;
  public onStartBattle?: () => void;

  constructor() {
    this.dockElement = document.getElementById('deployment-dock');
    this.statusElement = document.getElementById('deployment-status');
    this.startBtn = document.getElementById('btn-start-battle') as HTMLButtonElement;
    this.autoBtn = document.getElementById('btn-auto-deploy') as HTMLButtonElement;

    if (this.autoBtn) {
      this.autoBtn.addEventListener('click', () => {
        if (this.onAutoDeploy) this.onAutoDeploy();
      });
    }

    if (this.startBtn) {
      this.startBtn.addEventListener('click', () => {
        if (this.onStartBattle) this.onStartBattle();
      });
    }
  }

  public show(show: boolean): void {
    const container = document.getElementById('deployment-panel');
    if (container) {
      container.style.display = show ? 'flex' : 'none';
    }
  }

  public renderRoster(roster: UnitDef[], deployedFlags: boolean[], faction: Faction | undefined): void {
    if (!this.dockElement) return;
    this.dockElement.innerHTML = '';

    const remainingCount = deployedFlags.filter(d => !d).length;
    if (this.statusElement) {
      this.statusElement.textContent = `Deploying: ${roster.length - remainingCount}/${roster.length} Deployed`;
    }

    if (this.startBtn) {
      this.startBtn.disabled = remainingCount > 0;
      this.startBtn.classList.toggle('btn-primary-glow', remainingCount === 0);
    }

    roster.forEach((unitDef, idx) => {
      const card = document.createElement('div');
      const isDeployed = deployedFlags[idx];
      const isSelected = this.selectedRosterIndex === idx;

      card.className = `roster-card ${isDeployed ? 'card-deployed' : ''} ${isSelected ? 'card-selected' : ''}`;
      card.innerHTML = `
        <div class="roster-card-role">${unitDef.role.toUpperCase()}</div>
        <div class="roster-card-name">${unitDef.name}</div>
        <div class="roster-card-stats">
          <span>W${unitDef.wounds}</span> • <span>T${unitDef.toughness}</span> • <span>${unitDef.armorSave}+</span>
        </div>
        ${isDeployed ? '<div class="deployed-tag">DEPLOYED</div>' : ''}
      `;

      card.addEventListener('click', () => {
        if (isDeployed) return;
        this.selectedRosterIndex = idx;
        if (this.onSelectRosterUnit) this.onSelectRosterUnit(idx);
        this.renderRoster(roster, deployedFlags, faction);
      });

      this.dockElement!.appendChild(card);
    });
  }

  public clearSelection(): void {
    this.selectedRosterIndex = null;
  }
}
