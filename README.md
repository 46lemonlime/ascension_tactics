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

## 🌍 Battlefield Environments (10 Playable Maps)

Ascension Tactics features **10 distinct battlefields**, each rendered with unique procedural 3D obstacle architecture, environmental weather particle simulations, and strategic Line-of-Sight layouts:

1. **Jungle Death World (Alien Primeval Biosphere)**
   * *Visuals*: Towering gnarled jungle trees, dense canopy foliage, overgrown cane weeds, bleached creature skeletons, and hanging creepers.
   * *Atmosphere*: Downward jungle precipitation, humid green lighting, and reduced long-range sight lines.
2. **Glacial Frost World (Permafrost Ridges & Ice Chasms)**
   * *Visuals*: Granite mountain peaks capped in snow, translucent glacial ice spires, and deep snow drifts.
   * *Atmosphere*: Fluttering snowflakes, pale blue ice fog, and elevated ridge choke points.
3. **Desert Wastes (Ash Dunes & Canyon Spires)**
   * *Visuals*: Stratified rock crags, wind-carved sandstone towers, saguaro cacti, and shifting ash dunes.
   * *Atmosphere*: High-velocity sandstorms, warm golden lighting, and sweeping open firing lanes.
4. **Gothic Hive City (Industrial Ruins & Streets)**
   * *Visuals*: Concrete multi-story ruined building walls, hazard-striped barricades, structural rebar, and fallen stone pillars.
   * *Atmosphere*: Smoggy grey haze, sharp urban corners, and dense cover blocks.
5. **Space-Tech / Void Station (Orbital Reactor & Bulkheads)**
   * *Visuals*: Reinforced metal blast bulkheads with cyan conduits, glowing plasma reactor cores, amber fuel tanks, and beacon antenna towers.
   * *Atmosphere*: Deep space void backdrop with drifting stars and orbital corridor choke points.
6. **Astral Crystal Spire (Harmonic Prisms & Floating Monoliths)**
   * *Visuals*: Prismatic cyan and violet crystal clusters, wraithbone gateway monoliths, and floating resonant energy rings.
   * *Atmosphere*: Shimmering cosmic particle motes and ethereal amethyst lighting.
7. **Corrupted Flesh-World (Mutated Terrain & Dark Tendrils)**
   * *Visuals*: Pulsing demonic bone horns, occult altars with staring ocular cysts, and writhing tendril columns.
   * *Atmosphere*: Crimson spore miasma, dark blood fog, and disturbing organic terrain.
8. **Devoured World (Stripped Desolation & Digestion Pits)**
   * *Visuals*: Acid digestion vents with glowing green bile pools, ribbed bio-conduit spires, and stripped bedrock craters.
   * *Atmosphere*: Rising toxic digestion mist and vibrant neon green acid pools.
9. **Tomb World (Living Metal Crypts & Monoliths)**
   * *Visuals*: Stepped living-metal pyramid pylons with floating Gauss apex crystals, obsidian stasis portals, and Gauss energy coils.
   * *Atmosphere*: Snapping emerald Gauss spark motes and deep obsidian metal architecture.
10. **Warp Rift World (Dimensional Fissures & Molten Void)**
    * *Visuals*: Volcanic basalt crags shattered by molten fissures, anti-gravity floating rock spires, and warp vortex monoliths.
    * *Atmosphere*: Rising fiery embers, warp purple energy auras, and bubbling molten veins.

---

## 🎮 Pre-Battle Selection Flow (5 Distinct Stages)

Ascension Tactics features a complete 5-stage setup sequence prior to tactical deployment:

```mermaid
flowchart LR
    A["1. Select Factions"] --> B["2. Select Battlefield Biome"]
    B --> C["3. Select Mission"]
    C --> D["4. Battle Settings"]
    D --> E["5. Army Composition"]
    E --> F["6. Tactical Deployment"]
    F --> G["7. Warzone Battle"]
```

### Stage 1 — Select Factions
* Independent carousels for **Player 1** and the **AI Opponent** across all 10 playable factions or **Random Selection**.
* Auto-sizing dynamic lore dossiers detailing combat doctrine, squad rosters, unique mechanics, and strategic strengths/weaknesses.

### Stage 2 — Select Battlefield Biome
* 3-card landscape preview carousel of all 10 planetary theaters or **Random Biome**.
* Atmospheric hazard profiles, weather particle previews, and environmental cover descriptions.

### Stage 3 — Select Mission & Objectives
* **Extermination**: Total sector purge. Victory by complete annihilation or squad superiority at round limit.
* **Domination**: Strategic capture and control of 3 central frontline beacons (Alpha, Bravo, Charlie).
  * **Victory Points To Win Selector**: Choose from `1000` (Default), `1500`, `2000`, or `2500` Victory Points. Live score tracking in HUD with instant victory upon reaching the target.
* **VIP Escort**: Asymmetric extraction versus interception.
  * **VIP Owner Selector**: Choose `PLAYER` (you protect and extract your Sacred Relic Courier from south to north while AI intercepts) or `AI` (AI escorts its VIP from north to south while you intercept).

### Stage 4 — Battle Settings
* **Point Limit**: Authoritative army recruitment cap (`1000 PTS`, `2000 PTS` [Default], `3000 PTS`, `4000 PTS`).
* **Max Combat Rounds**: Match round limit (`5`, `8` [Default], `10`, `15`, `20`, or `Unlimited ∞`).
* **Match Time Limit**: Overall game clock (`10m`, `15m` [Default], `20m`, `30m`, `45m`, `60m`, or `Unlimited ∞`).
* **Turn Time Limit**: Per-turn countdown timer (`30s`, `45s`, `60s` [Default], `90s`, `120s`, or `Unlimited ∞`).

### Stage 5 — Tactical Army Composition
* **Interactive Roster Recruitment**: Browse full faction unit datasheets with points cost, squad sizes, movement, range, damage, wounds, and armor saves.
* **Live Budget Bar**: Real-time tracking of points used vs. point limit with visual warning upon reaching or exceeding cap.
* **Affordability Constraints**: Unit increment buttons ($+$) dynamically disable when the cost exceeds remaining points.
* **Selected Summary Dock**: Review all recruited squads with model counts, total cost breakdown, and quick item-level removal ($✕$) controls.
* **Validation**: Disallows deployment progression unless at least 1 unit is recruited and total points are within the match point limit.
* **Independent AI Recruitment**: AI automatically drafts a strategic army composition tailored to its chosen faction and the matching point limit.

---

## ⏱️ In-Battle HUD Timers & Telemetry

* **Round Counter Badge**: Displays `ROUND X / MAX_ROUNDS` (e.g. `ROUND 1 / 8`).
* **Turn Countdown Timer**: Active turn timer (`⏳ 60s`) with automatic red pulse warning when under 15 seconds remaining. Automatically advances turn when expired.
* **Game Clock**: Live match timer (`⏱️ MM:SS / MAX_TIME`) tracking total engagement duration.
* **Dynamic Mission HUD**: Renders live objective statuses (e.g. `Score: 🟦 420/1000 VP vs 🟨 310/1000 VP` in Domination).

---

## 🕹️ Controls & Keyboard Shortcuts

### Mouse Interactions
| Action | Input | Description |
| :--- | :--- | :--- |
| **Select / Move / Attack** | Left Click | Select friendly unit, target valid movement tile (cyan), or engage enemy (red). |
| **Inspect / Pan Camera** | Left Click + Drag | Pan the tactical camera across the battlefield. |
| **Orbit Camera** | Right Click + Drag | Orbit and pitch the camera around the focus point. |
| **In-Place Rotation** | `Shift` + Left Drag / `Ctrl` + Right Drag | Rotate orientation on the spot without translating position. |
| **Camera Zoom** | Mouse Wheel | Smoothly zoom in / out. |
| **Vertical Height Adjustment** | `Ctrl` + Mouse Wheel | Adjust camera vertical altitude ($Y$) without altering pitch or position. |
| **Undeploy Unit** | Right Click (Deployment) | Recall placed squad card back to the deployment dock. |

### Keyboard Shortcuts
| Key | Action | Description |
| :--- | :--- | :--- |
| **`F11`** | **Toggle Fullscreen** | Toggle fullscreen mode on/off seamlessly (with keyboard lock support). |
| **`ESC`** | **Game Menu / Dismiss** | Open or close the centered Game Menu modal, confirmation dialogs, or camera popup. |
| **`Space`** | **End Turn** | Advance to the enemy turn during player battle phase. |
| **`Ctrl + Z`** | **Camera Undo** | Restore previous camera position and orientation. |
| **`1` / `2` / `3`** | **Camera Presets** | Switch camera between Command (Isometric 45°), Top-Down (90°), and Cinematic. |
| **`Q` / `E`** | **Rotate Camera** | Rotate the camera view left / right in 22.5° increments. |
| **`M`** | **Move Mode** | Enter squad movement mode for the currently selected unit. |
| **`F` / `A`** | **Shoot / Attack Mode** | Enter targeting mode for the currently selected unit. |

---

## ⚙️ Engine Architecture & UI Systems

* **Cinematic Title Screen & Main Menu**:
  * Full-viewport panoramic orbital citadel vista overlooking deep space nebulae, starfield, and planetary curvature with the monolithic Ascension "A" monument.
  * Master 3D embossed gold branding with horizontal golden wings framing `TACTICS`.
  * Chamfered metallic action buttons: `SINGLE PLAYER` (primary warzone deployment), `MULTIPLAYER` (coming soon lock badge), and `LEARN MORE` (field manual & codex).
  * Minimalist HUD framing with bottom-right interactive volume/audio toggle.

* **Top-Right In-Battle Navigation Bar**:
  * **Combat Log**: Toggle battle telemetry and dice roll history panel.
  * **Tactical Map**: Toggle radar minimap visibility with smooth layout reflow for targeting bars.
  * **Camera Options**: Switch camera presets (Command / Top / Cinematic) and toggle Action Camera tracking.
  * **Fullscreen**: Dedicated button and `F11` shortcut with live state icon sync and `ESC` isolation.
  * **Game Menu**: Centered dialog for restarting matches, returning to faction select, and accessing manual/codex.

* **Unit Information Frame & Utility Capability System**:
  * Reorganized upper stats into **3 equal columns**: `ATTACK` (Accuracy, Strength, Attacks), `DEFENSE` (Evasion, Dexterity, Agility), and `UTILITY` (Movement, Awareness, Morale).
  * Interactive inspection buttons: `[WEP]` (Weapon Popup), `[ARM]` (Armour & Coverage Popup), and `[UTIL]` (Utility Popup).
  * Categorical capability modeling: `MovementType` (`ground | vehicle | fly | colossus`) and `AwarenessType` (`sensory | vision | psychic`).
  * Unit identity card with active squad model count badges, proportional HP bars, and tactical Energy bars.

* **Screen-Space Anchored HUD**:
  * **End Turn Button**: Fixed to the bottom-right corner of the viewport, independent of camera state.
  * **Targeting Status & LoS Bar**: Automatically reflows based on map visibility.
  * **Gothic Aesthetic Theme**: Custom scrollbars, glowing gold borders, and dark crystalline glassmorphism backdrops.

* **Deterministic Action Camera**:
  * The camera smoothly interpolates into dramatic over-the-shoulder framing and **fully settles before the unit begins moving or attacking**.
  * Unit actions strictly await camera arrival callbacks before starting animations or dice rolls.
  * Restores smoothly to the player's saved tactical vantage upon action resolution.

* **Tracked Vehicle Physics & Animations**:
  * Grounded chassis geometry with stable height ($Y = 0.20$) eliminating inappropriate walking gaits or bobbing on heavy tanks.
  * Continuous road wheels physically rotate around their axle ($X$-axis) proportional to linear distance travelled ($\Delta\theta = \Delta\text{dist} / R$).

* **Geometry & Material Cache**:
  * Shared geometry and material caching system minimizing WebGL draw calls and eliminating per-frame instantiation garbage collection pauses.

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
