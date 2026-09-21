export class CombatLogUI {
  private container: HTMLElement;
  private listElement: HTMLElement;
  private maxEntries: number = 80;

  constructor() {
    this.container = document.getElementById('combat-log-container') || document.body;
    let list = document.getElementById('combat-log-list');
    if (!list) {
      list = document.createElement('div');
      list.id = 'combat-log-list';
      list.className = 'combat-log-list';
      this.container.appendChild(list);
    }
    this.listElement = list;
    activeLogUI = this;
  }

  public log(message: string, type: 'info' | 'combat' | 'morale' | 'alert' | 'success' = 'info'): void {
    const entry = document.createElement('div');
    entry.className = `combat-log-entry log-${type}`;
    
    const timeSpan = document.createElement('span');
    timeSpan.className = 'log-time';
    const now = new Date();
    timeSpan.textContent = `[${now.toTimeString().substring(0, 8)}] `;
    
    const textSpan = document.createElement('span');
    textSpan.className = 'log-text';
    textSpan.innerHTML = message;

    entry.appendChild(timeSpan);
    entry.appendChild(textSpan);

    this.listElement.appendChild(entry);

    // Prune old entries
    while (this.listElement.children.length > this.maxEntries) {
      if (this.listElement.firstChild) {
        this.listElement.removeChild(this.listElement.firstChild);
      }
    }

    this.listElement.scrollTop = this.listElement.scrollHeight;
  }

  public clear(): void {
    this.listElement.innerHTML = '';
  }
}

let activeLogUI: CombatLogUI | null = null;

export function logCombat(message: string, type: 'info' | 'combat' | 'morale' | 'alert' | 'success' = 'info'): void {
  if (activeLogUI) {
    activeLogUI.log(message, type);
  } else {
    console.log(`[COMBAT-LOG] (${type}) ${message}`);
  }
}
