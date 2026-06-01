# Mission Mates

  A fun 20-player browser survival game built with Phaser 3, React, and Vite.

  ## How to Play

  | Control | Action |
  |---------|--------|
  | **RIGHT-CLICK + HOLD** | Move your player toward the cursor |
  | **LEFT-CLICK** | Shoot toward the cursor |
  | **Walk over glowing items** | Auto-pick up a weapon |
  | **R key** | Reload manually |
  | **WASD** | Move (keyboard alternative) |

  ## Objective

  20 players start across a large map. A **blue safe zone** slowly shrinks. Stay inside it — outside you take damage. Last player standing wins!

  ## Features

  - 20 players: you + 19 bots with AI
  - 4 weapon types: Pistol, AR, Shotgun, Sniper
  - Shrinking safe zone with 6 phases
  - In-game tutorial overlay on first launch
  - Full HUD: health bar, zone timer, minimap, ammo
  - Red vignette warning when outside the safe zone
  - Auto-pickup: walk over items to collect them

  ## Tech Stack

  - [Phaser 3](https://phaser.io/) — game engine
  - [React](https://react.dev/) + [Vite](https://vitejs.dev/) — app shell
  - TypeScript

  ## Development

  ```bash
  npm install
  npm run dev
  ```

  ## License

  MIT
  