# ⚔️ ASCENSION TACTICS 3D (Grimdark Tactics)

A high-performance, browser-based **Warhammer 40,000 / Grimdark** tactical skirmish game built with **Three.js** and **TypeScript**. Features **10 Distinct Playable Factions**, procedural high-detail 3D miniatures on beveled wargaming bases, tactical line-of-sight analysis, deterministic over-the-shoulder action cameras, realistic vehicle kinematics, and an interactive Codex.

---

## 🛡️ Playable Factions (10 Armies)

1. **The Ascendants (Space Marines / Adeptus Astartes)**
   * *Aesthetics*: Cobalt blue power armor, gold trim, purity seals, and jump packs.
   * *Playstyle*: Elite `3+` armor saves, versatile 18" bolt rifles, heavy devastators, and fast assault squads.
   * *Units*: Castellan Vorn, Tactical Squad, Assault Squad, Devastator Squad, Predator Tank.

2. **The Forsaken (Chaos Space Marines / Heretic Astartes)**
   * *Aesthetics*: Crimson red armor, warped horn spires, brass trim, and daemon blades.
   * *Playstyle*: Aggressive close-range firefights, brutal melee charges, and cultist meatshields.
   * *Units*: Lord Malakar, Chaos Legionaries, Raptor Jump Pack Squad, Cultist Mob, Chaos Predator.

3. **The Devourers (Tyranids / Hive Fleet)**
   * *Aesthetics*: Bio-chitin carapace, bone scything talons, and chitinous appendages.
   * *Playstyle*: Fast swarm advances, rending bio-claws, and bio-plasma heavy artillery.
   * *Units*: Hive Tyrant, Tyranid Warriors, Genestealers, Termagant Swarms, Carnifex.

4. **The Concordat (T'au Empire / Hunter Cadre)**
   * *Aesthetics*: Ochre sand plating, angular sensor antennae, and plasma glow lenses.
   * *Playstyle*: Extreme long-range pulse rifles (24"), rail snipers (28"), and hover battlesuits.
   * *Units*: Commander Shas'O, Fire Warriors, Stealth Battlesuits, Pathfinders, Hammerhead Gunship.

5. **The Directorate (Astra Militarum / Imperial Guard)**
   * *Aesthetics*: Olive drab flak armor, fabric fatigues, angular rimmed helmets, and continuous tracked armor.
   * *Playstyle*: Industrial mass infantry fire, heavy ordnance weapon teams, scout sentinels, and devastating long-range siege artillery.
   * *Units*: Field Marshal Vance, Shock Troopers, Heavy Ordnance Teams, Sentinel Walkers, Basilisk Siege Howitzers, Directorate Battle Tanks.

6. **The Riftborn (Chaos Daemons / Warp Entities)**
   * *Aesthetics*: Obsidian horns, twisting demonic limbs, hellblades, and glowing warpfire emanations.
   * *Playstyle*: Terrifying melee disruption, unnatural resilience, and reality-warping speed.
   * *Units*: Daemon Prince, Bloodletter Packs, Plaguebearer Phalanxes, Daemonette Stalkers, Greater Daemons.

7. **The Ghar (Orks / Greenskins)**
   * *Aesthetics*: Bulky green muscle, scrap-iron armor plates, and crude mechanical weaponry.
   * *Playstyle*: Overwhelming numbers, high damage melee choppas, and reckless dakka.
   * *Units*: Warboss, Ork Boyz, Nobz, Stormboyz, Battlewagons.

8. **The Revenant (Necrons / Undying Dynasties)**
   * *Aesthetics*: Skeletal living metal, Gauss green energy cores, and ancient hieroglyphic armor.
   * *Playstyle*: Reanimation protocols, devastating Gauss flayers, and indestructible monolith walkers.
   * *Units*: Overlord, Necron Warriors, Immortals, Skorpekh Destroyers, Heavy Destroyers.

9. **The Elyri (Aeldari / Craftworld Eldar)**
   * *Aesthetics*: Sleek wraithbone crests, gemstone inlays, and aerodynamic jump fins.
   * *Playstyle*: Unrivaled agility, pinpoint Shuriken weaponry, and specialized aspect warriors.
   * *Units*: Autarch, Guardian Defenders, Dire Avengers, Howling Banshees, Wraithguard.

10. **The Veykari (Drukhari / Dark Eldar)**
    * *Aesthetics*: Spiked obsidian armor, barbed blade crests, and toxic emerald blades.
    * *Playstyle*: Lightning-fast hit-and-run raids, splinter cannons, and combat drug enhancements.
    * *Units*: Archon, Kabalite Warriors, Wyches, Incubi, Ravager Skimmers.

---

## 🎮 Game Modes & Missions

* **Extermination (Standard Skirmish)**: Annihilate the enemy force down to the last squad.
* **Domination**: Capture and hold 3 strategic relay objectives across the central sectors.
* **VIP Escort**: Defend or assassinate a VIP Courier navigating across hazardous contested terrain.

---

## 🕹️ Controls & Camera Navigation

### Mouse & Keyboard
| Action | Input | Description |
| :--- | :--- | :--- |
| **Select / Move / Attack** | Left Click | Select unit, target movement tile (blue), or engage enemy (red). |
| **Inspect / Camera Pan** | Left Click + Drag | Pan the tactical camera across the battlefield. |
| **Camera Orbit** | Right Click + Drag | Orbit the camera around the target point. |
| **In-Place Camera Rotation** | `Ctrl` / `Shift` / `Alt` + Right Click + Drag | Rotate camera orientation in place without changing camera position ($X, Y, Z$). |
| **Camera Zoom** | Mouse Wheel | Smoothly zoom in / out. |
| **On-the-Spot Camera Height** | `Ctrl` / `Shift` / `Alt` + Mouse Wheel | Adjust camera vertical height ($Y$) on the spot without changing pitch or horizontal position. |
| **Camera Preset Angles** | Tactical / Iso / Top / Cinematic | Quick preset buttons on the UI for tactical overview, 45° isometric, top-down, or cinematic framing. |

---

## ⚙️ Engine Architecture & Key Features

* **Deterministic Action Camera**:
  * The camera smoothly interpolates into dramatic over-the-shoulder framing and **fully settles before the unit begins moving or attacking**.
  * Unit actions strictly await camera arrival callbacks before starting animations or dice rolls.
  * Restores smoothly to the player's saved tactical vantage upon action resolution.

* **Tracked Vehicle Physics & Animations**:
  * Grounded chassis geometry with stable height ($Y = 0.20$) eliminating inappropriate walking gaits or bobbing on heavy tanks.
  * Continuous road wheels physically rotate around their axle ($X$-axis) proportional to linear distance travelled ($\Delta\theta = \Delta\text{dist} / R$).

* **Geometry & Material Cache**:
  * Shared geometry and material caching system minimizing WebGL draw calls and eliminating per-frame instantiation garbage collection pauses.

* **Screen-Space Anchored HUD**:
  * Round banner and mission info remain cleanly anchored at the top edge of the screen regardless of camera transformations or viewport resizing.

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** (v18+)
* **npm**

### Installation & Run
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

---

## 📜 License
MIT License.
