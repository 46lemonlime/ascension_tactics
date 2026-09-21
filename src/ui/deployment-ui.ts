import type { DeploymentCard, Faction } from '../data/types';
import { UNIT_ROSTER } from '../data/units';

export class DeploymentUI {
  private panel: HTMLElement | null;
  private container: HTMLElement | null;
  private startBtn: HTMLButtonElement | null;
  private autoBtn: HTMLButtonElement | null;

  public selectedCardKey: string | null = null;
  public onSelectCard?: (cardKey: string) => void;
  public onAutoDeploy?: () => void;
  public onStartBattle?: () => void;

  constructor() {
    this.panel = document.getElementById('deployment-panel');
    this.container = document.getElementById('deploy-cards-container');
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
    if (this.panel) {
      this.panel.style.display = show ? 'flex' : 'none';
    }
  }

  public renderRoster(roster: DeploymentCard[], selectedKey: string | null = null): void {
    if (!this.container) return;
    this.selectedCardKey = selectedKey;
    this.container.innerHTML = '';

    const allPlaced = roster.length > 0 && roster.every(c => c.placed);
    if (this.startBtn) {
      this.startBtn.disabled = !allPlaced;
    }

    const factionIcons: Record<string, string> = {
      hero: '👑',
      infantry: '🛡️',
      fast: '⚡',
      heavy: '💥',
      vehicle: '🤖',
      monster: '👾'
    };

    roster.forEach(card => {
      const uDef = UNIT_ROSTER[card.type];
      const role = uDef?.role || 'infantry';
      const icon = factionIcons[role] || '⚔️';

      const cardEl = document.createElement('div');
      cardEl.className = `deploy-card ${card.placed ? 'placed' : ''} ${card.key === this.selectedCardKey ? 'selected' : ''}`;
      cardEl.setAttribute('data-key', card.key);

      cardEl.innerHTML = `
        <div class="deploy-card-icon">${icon}</div>
        <div class="deploy-card-name">${card.name}</div>
        <div class="deploy-card-role">${role.toUpperCase()}</div>
        <div class="deploy-card-status">${card.placed ? '✓ DEPLOYED' : 'UNPLACED'}</div>
      `;

      cardEl.addEventListener('click', () => {
        this.selectedCardKey = card.key;
        if (this.onSelectCard) this.onSelectCard(card.key);
        this.renderRoster(roster, this.selectedCardKey);
      });

      this.container!.appendChild(cardEl);
    });
  }

  public clearSelection(): void {
    this.selectedCardKey = null;
  }
}

