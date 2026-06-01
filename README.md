# Mission Mates 🎮

  A 20-player browser survival game built with **Phaser 3**, **React**, and **Vite**. No downloads, no server — runs entirely in the browser.

  ---

  ## Play it

  > Open the hosted URL and click **GOT IT, LET'S GO!** to start. Outlast all 19 bots to win.

  ---

  ## Controls

  | Input | Action |
  |-------|--------|
  | **Right-click + hold** | Move toward cursor |
  | **Left-click** | Shoot |
  | **Walk over glowing item** | Auto-pick up weapon |
  | **R** | Reload |

  ---

  ## Features

  - 🟠 20 players (1 human + 19 AI bots) on a 4000×4000 map
  - 🔵 Shrinking safe zone with 6 phases — stay inside or lose health
  - 🔫 3 weapons with different damage/ammo: Pistol, Shotgun, Rifle
  - 🗺️ Live minimap with zone ring, enemy dots, and player position
  - ❤️ Health bar with blood-flash on damage
  - ⚠️ Red vignette border + warning banner when outside the safe zone
  - 🎮 Tutorial overlay on every game start (auto-closes in 10s)
  - 🏆 Win / eliminated end screen

  ---

  ## Tech stack

  | Layer | Library |
  |-------|---------|
  | Game engine | Phaser 3.90 |
  | UI / overlay | React 18 + Vite |
  | Language | TypeScript |
  | Graphics | Phaser Graphics API (no image assets) |

  ---

  ## Run locally

  ```bash
  npm install
  npm run dev
  ```

  Then open http://localhost:5173.

  ---

  ## Deploy on Replit

  1. Fork or import this repo into a new Replit project
  2. Set the **Install command**: `npm install`
  3. Set the **Start command**: `npm run dev -- --host 0.0.0.0 --port $PORT`
  4. Click **Run** — Replit will open the hosted URL automatically

  For a production build instead:
  ```
  npm run build && npx vite preview --host 0.0.0.0 --port $PORT
  ```

  ---

  ## Project structure

  ```
  src/
  ├── main.tsx                  — React entry point
  ├── App.tsx                   — Canvas host + tutorial HTML overlay
  ├── index.css                 — Global reset
  └── game/
      ├── config.ts             — Phaser game config
      └── scenes/
          ├── MenuScene.ts      — Title / start screen
          ├── GameScene.ts      — Main game logic (player, bots, zone, weapons)
          └── UIScene.ts        — HUD overlay (health, ammo, minimap, zone bar)
  ```
  