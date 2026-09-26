export interface HelpNote {
  id: string;
  category: string;
  title: string;
  message: string;
  timestamp?: number;
}

export const HELP_NOTES: Record<string, HelpNote> = {
  deployment: {
    id: 'deployment_select_squad',
    category: 'Deployment',
    title: 'Deployment',
    message: 'Click squad card — Click the glowing southern zone to deploy your squad.'
  },
  movement: {
    id: 'movement_advance',
    category: 'Movement',
    title: 'Movement',
    message: 'Select an active squad and click a valid destination tile within range to advance.'
  },
  combat: {
    id: 'combat_target_attack',
    category: 'Combat',
    title: 'Combat',
    message: 'Select an enemy within range to attack. Hover to verify Line of Sight and weapon range.'
  },
  end_turn: {
    id: 'turn_flow_end_turn',
    category: 'Turn Flow',
    title: 'End Turn',
    message: 'Once all orders are complete, click End Turn in the cockpit to pass initiative.'
  }
};

export class HelpNotesSystem {
  public enabled: boolean = true;
  public history: HelpNote[] = [];
  private displayedIds: Set<string> = new Set();
  private toastElement: HTMLElement | null = null;
  private toastTitle: HTMLElement | null = null;
  private toastBody: HTMLElement | null = null;
  private popupList: HTMLElement | null = null;
  private toggleSwitch: HTMLElement | null = null;
  private toggleState: HTMLElement | null = null;
  private toastTimeout: any = null;

  constructor() {
    this.toastElement = document.getElementById('help-note-toast');
    this.toastTitle = document.getElementById('help-note-toast-title');
    this.toastBody = document.getElementById('help-note-toast-body');
    this.popupList = document.getElementById('help-notes-history-list');
    this.toggleSwitch = document.getElementById('pop-help-notes-toggle');
    this.toggleState = document.getElementById('pop-help-notes-state');

    const closeBtn = document.getElementById('help-note-toast-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.dismissToast();
      });
    }

    if (this.toggleSwitch) {
      this.toggleSwitch.addEventListener('click', () => {
        this.toggleEnabled();
      });
    }

    this.renderHistory();
  }

  public show(note: HelpNote, autoDismissSeconds: number = 10): boolean {
    if (!this.enabled) return false;

    // Record to history only on first display
    if (!this.displayedIds.has(note.id)) {
      this.displayedIds.add(note.id);
      this.history.push({
        ...note,
        timestamp: Date.now()
      });
      this.renderHistory();
    }

    // Display on-screen toast
    if (this.toastElement && this.toastTitle && this.toastBody) {
      this.toastTitle.textContent = (note.title || note.category || 'TACTICAL HINT').toUpperCase();
      this.toastBody.textContent = note.message;
      this.toastElement.style.display = 'flex';

      if (this.toastTimeout) {
        clearTimeout(this.toastTimeout);
      }
      if (autoDismissSeconds > 0) {
        this.toastTimeout = setTimeout(() => {
          this.dismissToast();
        }, autoDismissSeconds * 1000);
      }
    }

    return true;
  }

  public dismissToast(): void {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
      this.toastTimeout = null;
    }
    if (this.toastElement) {
      this.toastElement.style.display = 'none';
    }
  }

  public toggleEnabled(): boolean {
    this.setEnabled(!this.enabled);
    return this.enabled;
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (this.toggleSwitch) {
      this.toggleSwitch.classList.toggle('active', this.enabled);
    }
    if (this.toggleState) {
      this.toggleState.textContent = this.enabled ? 'ON' : 'OFF';
    }
    if (!this.enabled) {
      this.dismissToast();
    }
  }

  public clearHistory(): void {
    this.history = [];
    this.displayedIds.clear();
    this.dismissToast();
    this.renderHistory();
  }

  public renderHistory(): void {
    if (!this.popupList) return;

    if (this.history.length === 0) {
      this.popupList.innerHTML = `
        <div class="help-notes-empty">
          <span class="help-notes-empty-icon">💡</span>
          <div class="help-notes-empty-title">NO HELP NOTES RECORDED</div>
          <div class="help-notes-empty-sub">Tactical guidance and phase hints will appear here as you play.</div>
        </div>
      `;
      return;
    }

    this.popupList.innerHTML = '';
    // Display in chronological order
    this.history.forEach(item => {
      const el = document.createElement('div');
      el.className = 'help-note-history-item';
      
      const timeStr = item.timestamp ? new Date(item.timestamp).toTimeString().substring(0, 8) : '';
      
      el.innerHTML = `
        <div class="help-note-item-header">
          <span class="help-note-item-badge">${(item.category || item.title).toUpperCase()}</span>
          ${timeStr ? `<span class="help-note-item-time">${timeStr}</span>` : ''}
        </div>
        <div class="help-note-item-msg">${item.message}</div>
      `;
      this.popupList!.appendChild(el);
    });
  }
}
