import type { Unit, UnitDef, WeaponProfileDetail, ArmourProfileDetail, UtilityProfileDetail } from '../data/types';
import { getUnitWeaponProfile, getUnitWeaponProfiles, getUnitArmourProfile, getUnitUtilityProfile } from '../data/registry';

export class DatasheetUI {
  private panel: HTMLElement | null;

  // Equipment Buttons & Icons
  private weaponBtn: HTMLElement | null;
  private weaponsListEl: HTMLElement | null;
  private armourBtn: HTMLElement | null;
  private utilityBtn: HTMLElement | null;
  private wepIconEl: HTMLElement | null;
  private armIconEl: HTMLElement | null;
  private utilIconEl: HTMLElement | null;

  // Attack Stats
  private statAccEl: HTMLElement | null;
  private statStrEl: HTMLElement | null;
  private statAtkEl: HTMLElement | null;

  // Defense Stats
  private statEvaEl: HTMLElement | null;
  private statDexEl: HTMLElement | null;
  private statAgiEl: HTMLElement | null;

  // Utility Stats & Icon
  private statMovEl: HTMLElement | null;
  private statAwaEl: HTMLElement | null;
  private statMorEl: HTMLElement | null;

  // Unit Identity
  private iconEl: HTMLElement | null;
  private modelsBadgeEl: HTMLElement | null;
  private nameEl: HTMLElement | null;
  private roleEl: HTMLElement | null;
  private hpFillEl: HTMLElement | null;
  private hpLabelEl: HTMLElement | null;
  private energyFillEl: HTMLElement | null;
  private energyLabelEl: HTMLElement | null;

  // Weapon Popup Elements
  private weaponPopup: HTMLElement | null;
  private wepCloseBtn: HTMLElement | null;
  private wepNameEl: HTMLElement | null;
  private wepRangeEl: HTMLElement | null;
  private wepStrEl: HTMLElement | null;
  private wepPenEl: HTMLElement | null;
  private wepDmgEl: HTMLElement | null;
  private wepAtkEl: HTMLElement | null;
  private wepDmgTypeEl: HTMLElement | null;
  private wepEffectiveEl: HTMLElement | null;
  private wepWeakEl: HTMLElement | null;
  private wepSpecialEl: HTMLElement | null;

  // Armour Popup Elements
  private armourPopup: HTMLElement | null;
  private armCloseBtn: HTMLElement | null;
  private armNameEl: HTMLElement | null;
  private armValEl: HTMLElement | null;
  private armToughEl: HTMLElement | null;
  private armResEl: HTMLElement | null;
  private armCovEl: HTMLElement | null;
  private armProtectEl: HTMLElement | null;
  private armVulnEl: HTMLElement | null;
  private armSpecialEl: HTMLElement | null;

  // Utility Popup Elements
  private utilityPopup: HTMLElement | null;
  private utilCloseBtn: HTMLElement | null;
  private utilNameEl: HTMLElement | null;
  private utilMovementTypeEl: HTMLElement | null;
  private utilAwarenessTypeEl: HTMLElement | null;

  // Pinned popup state
  private pinnedPopup: 'weapon' | 'armour' | 'utility' | null = null;
  private pinnedWeaponIndex: number | null = null;
  private activeWeaponIndex: number | null = null;
  private currentWeaponProfile: WeaponProfileDetail | null = null;
  private currentWeaponProfiles: WeaponProfileDetail[] = [];
  private currentArmourProfile: ArmourProfileDetail | null = null;
  private currentUtilityProfile: UtilityProfileDetail | null = null;

  constructor() {
    this.panel = document.getElementById('datasheet');

    // Equipment Buttons & Icons
    this.weaponBtn = document.getElementById('ds-weapon-btn');
    this.weaponsListEl = document.getElementById('ds-weapons-list');
    this.armourBtn = document.getElementById('ds-armour-btn');
    this.utilityBtn = document.getElementById('ds-utility-btn');
    this.wepIconEl = document.getElementById('ds-wep-icon');
    this.armIconEl = document.getElementById('ds-arm-icon');
    this.utilIconEl = document.getElementById('ds-util-icon');

    // Attack
    this.statAccEl = document.getElementById('ds-stat-acc');
    this.statStrEl = document.getElementById('ds-stat-str');
    this.statAtkEl = document.getElementById('ds-stat-atk');

    // Defense
    this.statEvaEl = document.getElementById('ds-stat-eva');
    this.statDexEl = document.getElementById('ds-stat-dex');
    this.statAgiEl = document.getElementById('ds-stat-agi');

    // Utility
    this.statMovEl = document.getElementById('ds-stat-mov');
    this.statAwaEl = document.getElementById('ds-stat-awa');
    this.statMorEl = document.getElementById('ds-stat-mor');

    // Identity
    this.iconEl = document.getElementById('ds-icon');
    this.modelsBadgeEl = document.getElementById('ds-models-badge');
    this.nameEl = document.getElementById('ds-name');
    this.roleEl = document.getElementById('ds-role');
    this.hpFillEl = document.getElementById('ds-hp-fill');
    this.hpLabelEl = document.getElementById('ds-hp-label');
    this.energyFillEl = document.getElementById('ds-energy-fill');
    this.energyLabelEl = document.getElementById('ds-energy-label');

    // Weapon Popup
    this.weaponPopup = document.getElementById('weapon-popup');
    this.wepCloseBtn = document.getElementById('wep-popup-close');
    this.wepNameEl = document.getElementById('wep-popup-name');
    this.wepRangeEl = document.getElementById('wep-popup-range');
    this.wepStrEl = document.getElementById('wep-popup-strength');
    this.wepPenEl = document.getElementById('wep-popup-penetration');
    this.wepDmgEl = document.getElementById('wep-popup-damage');
    this.wepAtkEl = document.getElementById('wep-popup-attacks');
    this.wepDmgTypeEl = document.getElementById('wep-popup-damage-type');
    this.wepEffectiveEl = document.getElementById('wep-popup-effective');
    this.wepWeakEl = document.getElementById('wep-popup-weak');
    this.wepSpecialEl = document.getElementById('wep-popup-special');

    // Armour Popup
    this.armourPopup = document.getElementById('armour-popup');
    this.armCloseBtn = document.getElementById('arm-popup-close');
    this.armNameEl = document.getElementById('arm-popup-name');
    this.armValEl = document.getElementById('arm-popup-armour');
    this.armToughEl = document.getElementById('arm-popup-toughness');
    this.armResEl = document.getElementById('arm-popup-resistance');
    this.armCovEl = document.getElementById('arm-popup-coverage');
    this.armProtectEl = document.getElementById('arm-popup-protection');
    this.armVulnEl = document.getElementById('arm-popup-vulnerable');
    this.armSpecialEl = document.getElementById('arm-popup-special');

    // Utility Popup
    this.utilityPopup = document.getElementById('utility-popup');
    this.utilCloseBtn = document.getElementById('util-popup-close');
    this.utilNameEl = document.getElementById('util-popup-name');
    this.utilMovementTypeEl = document.getElementById('util-popup-movement-type');
    this.utilAwarenessTypeEl = document.getElementById('util-popup-awareness-type');

    this.initEventListeners();
  }

  private initEventListeners(): void {
    // Weapon Button Events (fallback if standalone button exists)
    if (this.weaponBtn) {
      this.weaponBtn.addEventListener('mouseenter', () => {
        if (!this.pinnedPopup) {
          this.openWeaponPopup(0, false);
        }
      });
      this.weaponBtn.addEventListener('mouseleave', () => {
        if (this.pinnedPopup !== 'weapon') {
          this.closeWeaponPopup(false);
        }
      });
      this.weaponBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.pinnedPopup === 'weapon' && this.pinnedWeaponIndex === 0) {
          this.closePopups();
        } else {
          this.openWeaponPopup(0, true);
        }
      });
    }

    // Armour Button Events
    if (this.armourBtn) {
      this.armourBtn.addEventListener('mouseenter', () => {
        if (!this.pinnedPopup) {
          this.openPopup('armour', false);
        }
      });
      this.armourBtn.addEventListener('mouseleave', () => {
        if (this.pinnedPopup !== 'armour') {
          this.closePopup('armour');
        }
      });
      this.armourBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.pinnedPopup === 'armour') {
          this.closePopups();
        } else {
          this.openPopup('armour', true);
        }
      });
    }

    // Utility Button Events
    if (this.utilityBtn) {
      this.utilityBtn.addEventListener('mouseenter', () => {
        if (!this.pinnedPopup) {
          this.openPopup('utility', false);
        }
      });
      this.utilityBtn.addEventListener('mouseleave', () => {
        if (this.pinnedPopup !== 'utility') {
          this.closePopup('utility');
        }
      });
      this.utilityBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.pinnedPopup === 'utility') {
          this.closePopups();
        } else {
          this.openPopup('utility', true);
        }
      });
    }

    // Close Button Events
    if (this.wepCloseBtn) {
      this.wepCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closePopups();
      });
    }
    if (this.armCloseBtn) {
      this.armCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closePopups();
      });
    }
    if (this.utilCloseBtn) {
      this.utilCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closePopups();
      });
    }

    // Document click to close pinned popups if clicked outside
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#unit-frame-container')) {
        this.closePopups();
      }
    });
  }

  public openWeaponPopup(weaponIndex: number, pin: boolean = false): void {
    // Reset non-weapon buttons and popups
    if (this.armourBtn) this.armourBtn.classList.remove('active');
    if (this.utilityBtn) this.utilityBtn.classList.remove('active');
    if (this.armourPopup) this.armourPopup.style.display = 'none';
    if (this.utilityPopup) this.utilityPopup.style.display = 'none';

    this.activeWeaponIndex = weaponIndex;

    if (this.weaponPopup) {
      this.populateWeaponPopup(weaponIndex);
      this.weaponPopup.style.display = 'block';
    }

    if (pin) {
      this.pinnedPopup = 'weapon';
      this.pinnedWeaponIndex = weaponIndex;
    }

    // Mark only the clicked/active weapon button as active
    if (this.weaponsListEl) {
      const btns = this.weaponsListEl.querySelectorAll('.weapon-btn');
      btns.forEach((b, i) => {
        if (pin && i === weaponIndex) {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });
    }
  }

  public closeWeaponPopup(force: boolean = false): void {
    if (!force && this.pinnedPopup === 'weapon') {
      return;
    }
    if (this.weaponPopup) {
      this.weaponPopup.style.display = 'none';
    }
    if (this.weaponsListEl) {
      this.weaponsListEl.querySelectorAll('.weapon-btn').forEach(b => b.classList.remove('active'));
    }
    if (this.weaponBtn) {
      this.weaponBtn.classList.remove('active');
    }
    this.activeWeaponIndex = null;
    if (force || this.pinnedPopup === 'weapon') {
      this.pinnedPopup = null;
      this.pinnedWeaponIndex = null;
    }
  }

  public openPopup(type: 'weapon' | 'armour' | 'utility', pin: boolean = false): void {
    if (type === 'weapon') {
      this.openWeaponPopup(0, pin);
      return;
    }

    // Reset buttons
    this.closeWeaponPopup(true);
    if (this.armourBtn) this.armourBtn.classList.remove('active');
    if (this.utilityBtn) this.utilityBtn.classList.remove('active');

    // Reset popups
    if (this.armourPopup) this.armourPopup.style.display = 'none';
    if (this.utilityPopup) this.utilityPopup.style.display = 'none';

    if (type === 'armour') {
      if (this.armourPopup) {
        this.populateArmourPopup();
        this.armourPopup.style.display = 'block';
      }
      if (pin) {
        this.pinnedPopup = 'armour';
        if (this.armourBtn) this.armourBtn.classList.add('active');
      }
    } else if (type === 'utility') {
      if (this.utilityPopup) {
        this.populateUtilityPopup();
        this.utilityPopup.style.display = 'block';
      }
      if (pin) {
        this.pinnedPopup = 'utility';
        if (this.utilityBtn) this.utilityBtn.classList.add('active');
      }
    }
  }

  public closePopup(type: 'weapon' | 'armour' | 'utility'): void {
    if (type === 'weapon') {
      this.closeWeaponPopup(false);
      return;
    }
    if (type === 'armour' && this.armourPopup) {
      this.armourPopup.style.display = 'none';
      if (this.armourBtn) this.armourBtn.classList.remove('active');
      if (this.pinnedPopup === 'armour') this.pinnedPopup = null;
    } else if (type === 'utility' && this.utilityPopup) {
      this.utilityPopup.style.display = 'none';
      if (this.utilityBtn) this.utilityBtn.classList.remove('active');
      if (this.pinnedPopup === 'utility') this.pinnedPopup = null;
    }
  }

  public closePopups(): void {
    this.closeWeaponPopup(true);
    this.closePopup('armour');
    this.closePopup('utility');
    this.pinnedPopup = null;
    this.pinnedWeaponIndex = null;
    this.activeWeaponIndex = null;
  }

  private populateWeaponPopup(weaponIndex?: number): void {
    if (!this.weaponPopup) return;
    const idx = weaponIndex !== undefined && weaponIndex >= 0 ? weaponIndex : 0;
    const w = this.currentWeaponProfiles[idx] || this.currentWeaponProfile;

    if (!w) return;

    this.weaponPopup.classList.remove('dual-weapons');

    const isMelee = w.type === 'melee' || w.range === 0;
    const typeLabel = isMelee ? 'MELEE WEAPON' : 'RANGED WEAPON';
    const typeClass = isMelee ? 'melee' : 'ranged';

    const html = `
      <div class="popup-header">
        <div class="popup-tag">${typeLabel} PROFILE</div>
        <div class="popup-title-row">
          <span class="popup-name" id="wep-popup-name">${w.name}</span>
          <button type="button" class="popup-close-btn" id="wep-popup-close" title="Close" aria-label="Close">✕</button>
        </div>
      </div>
      <div class="popup-divider"></div>
      <div class="weapon-popup-entries single-entry">
        <div class="weapon-loadout-card ${typeClass}">
          <div class="weapon-loadout-card-header">
            <span class="weapon-type-pill ${typeClass}">${typeLabel}</span>
            <span class="weapon-loadout-name">${w.icon || (typeClass === 'melee' ? '⚔️' : '🔫')} ${w.name}</span>
          </div>
          <div class="popup-stats-table">
            <div class="popup-stat-row">
              <span class="popup-stat-label">Range</span>
              <span class="popup-stat-value">${w.range}</span>
            </div>
            <div class="popup-stat-row">
              <span class="popup-stat-label">Strength</span>
              <span class="popup-stat-value">${w.strength}</span>
            </div>
            <div class="popup-stat-row">
              <span class="popup-stat-label">Penetration</span>
              <span class="popup-stat-value">${w.penetration}</span>
            </div>
            <div class="popup-stat-row">
              <span class="popup-stat-label">Damage</span>
              <span class="popup-stat-value">${w.damage}</span>
            </div>
            <div class="popup-stat-row">
              <span class="popup-stat-label">Attacks</span>
              <span class="popup-stat-value">${w.attacks}</span>
            </div>
          </div>
          
          <div class="popup-section-header">DAMAGE TYPE</div>
          <div class="popup-type-badge">${w.damageType}</div>

          ${w.effectiveAgainst && w.effectiveAgainst.length > 0 ? `
            <div class="popup-section-header">EFFECTIVE AGAINST</div>
            <ul class="popup-list effective-list">
              ${w.effectiveAgainst.map(eff => `<li><span class="popup-list-icon check">✓</span> ${eff}</li>`).join('')}
            </ul>
          ` : ''}

          ${w.weakAgainst && w.weakAgainst.length > 0 ? `
            <div class="popup-section-header">WEAK AGAINST</div>
            <ul class="popup-list weak-list">
              ${w.weakAgainst.map(weak => `<li><span class="popup-list-icon cross">✕</span> ${weak}</li>`).join('')}
            </ul>
          ` : ''}

          <div class="popup-section-header">SPECIAL</div>
          <div class="popup-special-text">${w.special}</div>
        </div>
      </div>
    `;

    this.weaponPopup.innerHTML = html;

    const closeBtn = document.getElementById('wep-popup-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closePopups();
      });
    }
  }


  private populateArmourPopup(): void {
    if (!this.currentArmourProfile) return;
    const a = this.currentArmourProfile;

    if (this.armNameEl) this.armNameEl.textContent = a.name;
    if (this.armValEl) this.armValEl.textContent = `${a.armour}`;
    if (this.armToughEl) this.armToughEl.textContent = `${a.toughness}`;
    if (this.armResEl) this.armResEl.textContent = `${a.resistance}`;
    if (this.armCovEl) this.armCovEl.textContent = `${a.coverage}`;

    if (this.armProtectEl) {
      this.armProtectEl.innerHTML = a.protectionAgainst
        .map(p => `<li><span class="popup-list-icon check">✓</span> ${p}</li>`)
        .join('');
    }

    if (this.armVulnEl) {
      this.armVulnEl.innerHTML = a.vulnerableTo
        .map(v => `<li><span class="popup-list-icon cross">✕</span> ${v}</li>`)
        .join('');
    }

    if (this.armSpecialEl) this.armSpecialEl.textContent = a.special;
  }

  private populateUtilityPopup(): void {
    if (!this.currentUtilityProfile) return;
    const u = this.currentUtilityProfile;

    if (this.utilNameEl) this.utilNameEl.textContent = 'TACTICAL UTILITY';
    if (this.utilMovementTypeEl) this.utilMovementTypeEl.textContent = u.movementTypeDisplay;
    if (this.utilAwarenessTypeEl) this.utilAwarenessTypeEl.textContent = u.awarenessTypeDisplay;
  }

  public showUnit(unit: Unit, unitDef: UnitDef): void {
    if (!this.panel) return;
    this.panel.style.display = 'flex';

    // Retrieve full equipment and utility profiles
    this.currentWeaponProfiles = getUnitWeaponProfiles(unitDef);
    this.currentWeaponProfile = this.currentWeaponProfiles[0] || getUnitWeaponProfile(unitDef);
    this.currentArmourProfile = getUnitArmourProfile(unitDef);
    this.currentUtilityProfile = getUnitUtilityProfile(unitDef);

    // If a popup is already pinned, refresh its content for the newly selected unit
    if (this.pinnedPopup === 'weapon' && this.pinnedWeaponIndex !== null) {
      this.populateWeaponPopup(this.pinnedWeaponIndex);
    } else if (this.pinnedPopup === 'armour') {
      this.populateArmourPopup();
    } else if (this.pinnedPopup === 'utility') {
      this.populateUtilityPopup();
    }

    // --- 1. ATTACK TIER (Accuracy, Strength, Attacks + Weapon Icon) ---
    // Accuracy derived from BS (BS 2 -> Acc 5, BS 3 -> Acc 4, BS 4 -> Acc 3)
    const accuracy = Math.max(1, 7 - (unitDef.bs || 3));
    const strength = unitDef.s || 4;
    const attacks = this.currentWeaponProfile.attacks || 2;

    if (this.wepIconEl) this.wepIconEl.textContent = this.currentWeaponProfile.icon || (this.currentWeaponProfiles.length > 1 ? '⚔️' : '🔫');
    if (this.statAccEl) this.statAccEl.textContent = `${accuracy}`;
    if (this.statStrEl) this.statStrEl.textContent = `${strength}`;
    if (this.statAtkEl) this.statAtkEl.textContent = `${attacks}`;

    // --- 2. DEFENSE TIER (Evasion, Dexterity, Agility + Armour Icon) ---
    // Evasion derived from size/stealth (4 standard)
    const evasion = Math.max(2, 6 - (unitDef.size || 1));
    // Dexterity derived from WS (WS 2 -> Dex 5, WS 3 -> Dex 4)
    const dexterity = Math.max(1, 7 - (unitDef.ws || 3));
    // Agility derived from Movement speed
    const agility = Math.min(6, Math.max(2, Math.floor((unitDef.m || 6) / 2)));

    if (this.armIconEl) this.armIconEl.textContent = this.currentArmourProfile.icon || '🛡️';
    if (this.statEvaEl) this.statEvaEl.textContent = `${evasion}`;
    if (this.statDexEl) this.statDexEl.textContent = `${dexterity}`;
    if (this.statAgiEl) this.statAgiEl.textContent = `${agility}`;

    // --- 3. UTILITY TIER (Movement, Awareness, Morale) ---
    const move = this.currentUtilityProfile.movement;
    const awareness = this.currentUtilityProfile.awareness;
    const curMorale = typeof unit.morale === 'object' ? unit.morale.current : (unit.morale || this.currentUtilityProfile.morale);

    if (this.utilIconEl) this.utilIconEl.textContent = this.currentUtilityProfile.icon || '🧭';
    if (this.statMovEl) this.statMovEl.textContent = `${move}`;
    if (this.statAwaEl) this.statAwaEl.textContent = `${awareness}`;
    if (this.statMorEl) this.statMorEl.textContent = `${curMorale}`;

    // --- 4. UNIT IDENTITY TIER (Portrait, Name, Role, HP Bar, Energy Bar) ---
    const curHp = unit.wounds !== undefined ? unit.wounds : (unit.hp || 5);
    const maxHp = unit.maxWounds !== undefined ? unit.maxWounds : (unit.maxhp || 5);
    const hpPercent = Math.max(0, Math.min(100, (curHp / maxHp) * 100));

    const squadSize = unit.squadSize || unitDef.squadSize || 1;
    const casualtiesCount = unit.squadCasualties?.filter(c => c).length || 0;
    const activeModels = Math.max(1, squadSize - casualtiesCount);

    // Render dynamic weapon buttons with squad quantities and isolated popups
    if (this.weaponsListEl) {
      this.weaponsListEl.innerHTML = '';
      this.currentWeaponProfiles.forEach((w, idx) => {
        const qty = (w as any).quantity ?? (w as any).count ?? activeModels;
        const label = w.type === 'melee' ? 'MEL' : (this.currentWeaponProfiles.length > 1 ? 'RNG' : 'WEP');
        const icon = w.icon || (w.type === 'melee' ? '⚔️' : '🔫');

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `equip-image-btn weapon-btn ${this.pinnedPopup === 'weapon' && this.pinnedWeaponIndex === idx ? 'active' : ''}`;
        btn.setAttribute('data-weapon-index', `${idx}`);
        btn.title = `Inspect ${w.name} (${qty} equipped)`;
        btn.setAttribute('aria-label', `Inspect ${w.name} (${qty} equipped)`);
        btn.innerHTML = `
          <div class="equip-img-box weapon-box">
            <span class="equip-img-label">${label}</span>
            <span class="equip-img-icon">${icon}</span>
            <span class="weapon-qty-badge">${qty}</span>
          </div>
        `;

        btn.addEventListener('mouseenter', () => {
          if (this.pinnedPopup !== 'weapon' || this.pinnedWeaponIndex !== idx) {
            this.openWeaponPopup(idx, false);
          }
        });
        btn.addEventListener('mouseleave', () => {
          if (this.pinnedPopup !== 'weapon') {
            this.closeWeaponPopup(false);
          } else if (this.pinnedWeaponIndex !== null && this.pinnedWeaponIndex !== idx) {
            this.openWeaponPopup(this.pinnedWeaponIndex, true);
          }
        });
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (this.pinnedPopup === 'weapon' && this.pinnedWeaponIndex === idx) {
            this.closePopups();
          } else {
            this.openWeaponPopup(idx, true);
          }
        });

        this.weaponsListEl!.appendChild(btn);
      });
    }

    if (this.nameEl) this.nameEl.textContent = unit.name || unitDef.name;
    if (this.roleEl) this.roleEl.textContent = unitDef.title || 'Combat Unit';

    if (this.modelsBadgeEl) {
      this.modelsBadgeEl.textContent = `${activeModels}x`;
    }

    if (this.iconEl) {
      this.iconEl.textContent = unitDef.icon || (unit.player === 1 ? '🛡️' : '💀');
    }

    // HP Bar
    if (this.hpFillEl) {
      this.hpFillEl.style.width = `${hpPercent}%`;
      if (unit.player === 2) {
        this.hpFillEl.classList.add('enemy');
      } else {
        this.hpFillEl.classList.remove('enemy');
      }
    }
    if (this.hpLabelEl) {
      this.hpLabelEl.textContent = `${curHp}/${maxHp} HP`;
    }

    // Energy Bar (Tactical Energy / Action Reserve)
    const hasMoved = unit.hasMoved;
    const hasAttacked = unit.hasAttacked;
    let energyVal = 100;
    if (hasMoved && hasAttacked) energyVal = 0;
    else if (hasAttacked) energyVal = 20;
    else if (hasMoved) energyVal = 50;

    if (this.energyFillEl) {
      this.energyFillEl.style.width = `${energyVal}%`;
    }
    if (this.energyLabelEl) {
      this.energyLabelEl.textContent = `${energyVal}/100 Energy`;
    }
  }

  public hide(): void {
    if (this.panel) {
      this.panel.style.display = 'none';
    }
    this.closePopups();
  }
}


