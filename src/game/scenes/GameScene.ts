import Phaser from "phaser";

// ─── Constants ──────────────────────────────────────────────────────────────
const MAP_SIZE = 4000;
const PLAYER_SPEED = 240;
const BOT_SPEED = 160;
const PLAYER_RADIUS = 16;
const BOT_RADIUS = 14;
const BULLET_RADIUS = 4;
const DETECT_RANGE = 370;
const PICKUP_RANGE = 65;
const BOT_COUNT = 19;

// ─── Weapon Definitions ──────────────────────────────────────────────────────
type WeaponKey = "PISTOL" | "AR" | "SHOTGUN" | "SNIPER";

interface WeaponDef {
  name: string;
  damage: number;
  fireRate: number;
  ammo: number;
  maxAmmo: number;
  reserves: number;
  range: number;
  bulletSpeed: number;
  spread: number;
  pellets: number;
  color: number;
  reloadTime: number;
}

const WEAPONS: Record<WeaponKey, WeaponDef> = {
  PISTOL:  { name:"Pistol",  damage:28, fireRate:350, ammo:12, maxAmmo:12, reserves:60, range:380, bulletSpeed:700, spread:0.08, pellets:1, color:0xbbbbbb, reloadTime:1200 },
  AR:      { name:"AR-15",   damage:22, fireRate:110, ammo:30, maxAmmo:30, reserves:90, range:580, bulletSpeed:920, spread:0.04, pellets:1, color:0x44dd44, reloadTime:1800 },
  SHOTGUN: { name:"Shotgun", damage:20, fireRate:800, ammo:6,  maxAmmo:6,  reserves:30, range:270, bulletSpeed:660, spread:0.20, pellets:6, color:0xff8800, reloadTime:2400 },
  SNIPER:  { name:"Sniper",  damage:90, fireRate:1600,ammo:5,  maxAmmo:5,  reserves:20, range:1350,bulletSpeed:1800,spread:0.006,pellets:1, color:0xff4444, reloadTime:2800 },
};

// ─── Zone Phases ─────────────────────────────────────────────────────────────
const ZONE_PHASES = [
  { radius: 1900, waitTime: 32, shrinkTime: 28, damage: 2  },
  { radius: 1300, waitTime: 25, shrinkTime: 22, damage: 3  },
  { radius:  900, waitTime: 20, shrinkTime: 18, damage: 5  },
  { radius:  600, waitTime: 15, shrinkTime: 14, damage: 8  },
  { radius:  280, waitTime: 12, shrinkTime: 11, damage: 15 },
  { radius:   60, waitTime:  8, shrinkTime:  9, damage: 25 },
];

// ─── Interfaces ───────────────────────────────────────────────────────────────
interface BulletData {
  ownedByPlayer: boolean;
  range: number;
  startX: number;
  startY: number;
  damage: number;
}

interface WeaponPickup {
  gfx: Phaser.GameObjects.Graphics;
  label: Phaser.GameObjects.Text;
  key: WeaponKey;
  x: number;
  y: number;
  collected: boolean;
}

interface BotState {
  sprite: Phaser.Physics.Arcade.Image;
  gfx: Phaser.GameObjects.Graphics;
  health: number;
  maxHealth: number;
  weaponKey: WeaponKey;
  ammo: number;
  lastFireTime: number;
  state: "wander" | "chase" | "shoot" | "flee_zone";
  wanderTarget: Phaser.Math.Vector2;
  wanderTimer: number;
  isDead: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function rand(min: number, max: number) {
  return Phaser.Math.Between(min, max);
}
function randFloat(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
function dist(ax: number, ay: number, bx: number, by: number) {
  return Math.hypot(bx - ax, by - ay);
}

// ─── Main Scene ───────────────────────────────────────────────────────────────
export class GameScene extends Phaser.Scene {
  // Player
  private player!: Phaser.Physics.Arcade.Image;
  private playerGfx!: Phaser.GameObjects.Graphics;
  private playerHealth = 100;
  private playerMaxHealth = 100;
  private playerWeaponKey: WeaponKey = "PISTOL";
  private playerAmmo = 12;
  private playerReserves = 60;
  private lastPlayerFireTime = 0;
  private isReloading = false;
  private reloadTimer = 0;
  private killCount = 0;

  // Input
  private wasd!: Record<string, Phaser.Input.Keyboard.Key>;
  private fireHeld = false;

  // World
  private worldGfx!: Phaser.GameObjects.Graphics;
  private zoneGfx!: Phaser.GameObjects.Graphics;
  private buildings: Array<{ x: number; y: number; w: number; h: number }> = [];
  private buildingGroup!: Phaser.Physics.Arcade.StaticGroup;
  private treeGroup!: Phaser.Physics.Arcade.StaticGroup;
  private weaponPickups: WeaponPickup[] = [];

  // Bots
  private bots: BotState[] = [];

  // Bullets
  private playerBullets!: Phaser.Physics.Arcade.Group;
  private botBullets!: Phaser.Physics.Arcade.Group;

  // Zone
  private zoneCenterX = MAP_SIZE / 2;
  private zoneCenterY = MAP_SIZE / 2;
  private zoneCurrentRadius = ZONE_PHASES[0].radius;
  private zoneTargetRadius = ZONE_PHASES[0].radius;
  private zonePhase = 0;
  private zoneTimer = ZONE_PHASES[0].waitTime;
  private zoneShrinking = false;
  private zoneDamageTimer = 0;

  // Game state
  private gameOver = false;
  private gameWon = false;

  constructor() {
    super({ key: "GameScene" });
  }

  // ─── Preload ────────────────────────────────────────────────────────────────
  preload() {
    // We generate textures in create() — nothing to load from disk
  }

  // ─── Create ─────────────────────────────────────────────────────────────────
  create() {
    this.gameOver = false;
    this.gameWon = false;
    this.killCount = 0;
    this.playerHealth = 100;
    this.playerWeaponKey = "PISTOL";
    this.playerAmmo = WEAPONS.PISTOL.ammo;
    this.playerReserves = WEAPONS.PISTOL.reserves;
    this.isReloading = false;
    this.zonePhase = 0;
    this.zoneCurrentRadius = ZONE_PHASES[0].radius;
    this.zoneTargetRadius = ZONE_PHASES[0].radius;
    this.zoneTimer = ZONE_PHASES[0].waitTime;
    this.zoneShrinking = false;

    this.generateTextures();
    this.buildWorld();
    this.buildingGroup = this.createBuildingPhysics();
    this.treeGroup = this.createTreePhysics();
    this.spawnWeaponPickups();
    this.createPlayer();
    this.createBots();
    this.createBulletGroups();
    this.setupCollision();
    this.setupCamera();
    this.setupInput();
    this.setupZone();

    // Launch HUD
    this.scene.launch("UIScene");

    // Fade in
    this.cameras.main.fadeIn(600, 0, 0, 0);
  }

  // ─── Texture Generation ──────────────────────────────────────────────────────
  private generateTextures() {
    const make = (key: string, w: number, h: number, fn: (g: Phaser.GameObjects.Graphics) => void) => {
      if (this.textures.exists(key)) return;
      const g = this.make.graphics({ add: false });
      fn(g);
      g.generateTexture(key, w, h);
      g.destroy();
    };

    // Player texture — orange circle
    make("tex_player", PLAYER_RADIUS * 2, PLAYER_RADIUS * 2, (g) => {
      g.fillStyle(0xe85d04, 1);
      g.fillCircle(PLAYER_RADIUS, PLAYER_RADIUS, PLAYER_RADIUS - 1);
      g.lineStyle(2, 0xff9933, 1);
      g.strokeCircle(PLAYER_RADIUS, PLAYER_RADIUS, PLAYER_RADIUS - 1);
    });

    // Bot texture — red circle
    make("tex_bot", BOT_RADIUS * 2, BOT_RADIUS * 2, (g) => {
      g.fillStyle(0xcc2222, 1);
      g.fillCircle(BOT_RADIUS, BOT_RADIUS, BOT_RADIUS - 1);
      g.lineStyle(2, 0xff5555, 1);
      g.strokeCircle(BOT_RADIUS, BOT_RADIUS, BOT_RADIUS - 1);
    });

    // Player bullet
    make("tex_bullet_p", BULLET_RADIUS * 2, BULLET_RADIUS * 2, (g) => {
      g.fillStyle(0xffee44, 1);
      g.fillCircle(BULLET_RADIUS, BULLET_RADIUS, BULLET_RADIUS);
    });

    // Bot bullet
    make("tex_bullet_b", BULLET_RADIUS * 2, BULLET_RADIUS * 2, (g) => {
      g.fillStyle(0xff6633, 1);
      g.fillCircle(BULLET_RADIUS, BULLET_RADIUS, BULLET_RADIUS);
    });

    // Tree
    make("tex_tree", 40, 40, (g) => {
      g.fillStyle(0x1a5c1a, 0.9);
      g.fillCircle(20, 20, 18);
      g.fillStyle(0x22aa22, 0.6);
      g.fillCircle(20, 20, 12);
    });

    // Building — used as static body reference
    make("tex_building", 4, 4, (g) => {
      g.fillStyle(0x334455, 1);
      g.fillRect(0, 0, 4, 4);
    });
  }

  // ─── World Building ──────────────────────────────────────────────────────────
  private buildWorld() {
    // Ground
    this.worldGfx = this.add.graphics().setDepth(0);
    const TILE = 80;
    for (let ty = 0; ty < MAP_SIZE; ty += TILE) {
      for (let tx = 0; tx < MAP_SIZE; tx += TILE) {
        const shade = ((tx / TILE + ty / TILE) % 2 === 0) ? 0x1a3a1a : 0x1c3c1c;
        this.worldGfx.fillStyle(shade, 1);
        this.worldGfx.fillRect(tx, ty, TILE, TILE);
      }
    }

    // Roads (lighter strips)
    this.worldGfx.fillStyle(0x283828, 0.6);
    this.worldGfx.fillRect(0, MAP_SIZE / 2 - 40, MAP_SIZE, 80);
    this.worldGfx.fillRect(MAP_SIZE / 2 - 40, 0, 80, MAP_SIZE);

    // Map border
    this.worldGfx.lineStyle(12, 0x000000, 1);
    this.worldGfx.strokeRect(0, 0, MAP_SIZE, MAP_SIZE);

    // Buildings
    const buildingDefs = this.generateBuildings();
    const buildingGfx = this.add.graphics().setDepth(1);
    for (const b of buildingDefs) {
      // Shadow
      buildingGfx.fillStyle(0x000000, 0.3);
      buildingGfx.fillRect(b.x + 6, b.y + 6, b.w, b.h);
      // Wall exterior
      buildingGfx.fillStyle(0x445566, 1);
      buildingGfx.fillRect(b.x, b.y, b.w, b.h);
      // Wall highlight top
      buildingGfx.fillStyle(0x556677, 1);
      buildingGfx.fillRect(b.x, b.y, b.w, 8);
      // Interior
      buildingGfx.fillStyle(0x3a4a55, 1);
      buildingGfx.fillRect(b.x + 8, b.y + 8, b.w - 16, b.h - 16);
      // Door opening
      const doorX = b.x + b.w / 2 - 16;
      buildingGfx.fillStyle(0x1a2a1a, 1);
      buildingGfx.fillRect(doorX, b.y + b.h - 8, 32, 8);
    }
    this.buildings = buildingDefs;

    // Trees
    const treeGfx = this.add.graphics().setDepth(1);
    const treePositions = this.generateTrees();
    for (const t of treePositions) {
      treeGfx.fillStyle(0x0a2a0a, 0.4);
      treeGfx.fillCircle(t.x + 3, t.y + 3, t.r);
      treeGfx.fillStyle(0x1a5a1a, 1);
      treeGfx.fillCircle(t.x, t.y, t.r);
      treeGfx.fillStyle(0x2a7a2a, 0.6);
      treeGfx.fillCircle(t.x - 4, t.y - 4, t.r * 0.6);
    }
  }

  private generateBuildings() {
    const defs: Array<{ x: number; y: number; w: number; h: number }> = [];
    const configs = [
      // Large compound top-left
      { x: 300, y: 300, w: 180, h: 120 },
      { x: 300, y: 460, w: 80,  h: 100 },
      { x: 420, y: 360, w: 80,  h: 60  },
      // Top-right cluster
      { x: 3200, y: 250, w: 160, h: 100 },
      { x: 3400, y: 200, w: 100, h: 140 },
      { x: 3180, y: 390, w: 200, h: 80  },
      // Bottom-left
      { x: 280, y: 3300, w: 140, h: 100 },
      { x: 460, y: 3250, w: 100, h: 120 },
      { x: 280, y: 3430, w: 220, h: 80  },
      // Bottom-right village
      { x: 3150, y: 3200, w: 160, h: 120 },
      { x: 3350, y: 3150, w: 120, h: 100 },
      { x: 3100, y: 3350, w: 240, h: 80  },
      { x: 3380, y: 3280, w: 100, h: 140 },
      // Center buildings
      { x: 1800, y: 1700, w: 140, h: 100 },
      { x: 1980, y: 1680, w: 80,  h: 120 },
      { x: 2080, y: 1700, w: 120, h: 100 },
      { x: 1820, y: 1840, w: 180, h: 80  },
      { x: 2060, y: 1840, w: 140, h: 80  },
      // Mid corridors
      { x: 900,  y: 1400, w: 120, h: 100 },
      { x: 1050, y: 1380, w: 80,  h: 120 },
      { x: 3000, y: 1500, w: 140, h: 100 },
      { x: 2950, y: 1620, w: 180, h: 80  },
      { x: 1000, y: 2500, w: 150, h: 100 },
      { x: 3000, y: 2600, w: 130, h: 110 },
      // Isolated shacks
      { x: 1400, y: 600,  w: 100, h: 80  },
      { x: 2600, y: 700,  w: 90,  h: 90  },
      { x: 600,  y: 2000, w: 110, h: 85  },
      { x: 3300, y: 2000, w: 110, h: 85  },
    ];
    return configs;
  }

  private generateTrees() {
    const trees: Array<{ x: number; y: number; r: number }> = [];
    const safeZones = this.buildings.map(b => ({
      cx: b.x + b.w / 2, cy: b.y + b.h / 2, r: Math.max(b.w, b.h)
    }));

    let attempts = 0;
    while (trees.length < 70 && attempts < 1000) {
      attempts++;
      const margin = 100;
      const tx = rand(margin, MAP_SIZE - margin);
      const ty = rand(margin, MAP_SIZE - margin);
      const tr = rand(14, 26);

      // Avoid buildings
      const blocked = safeZones.some(sz => dist(tx, ty, sz.cx, sz.cy) < sz.r + tr + 20);
      // Avoid spawn area
      if (blocked || dist(tx, ty, MAP_SIZE / 2, MAP_SIZE / 2) < 300) continue;
      // Avoid roads
      if (Math.abs(tx - MAP_SIZE / 2) < 80 || Math.abs(ty - MAP_SIZE / 2) < 80) continue;

      trees.push({ x: tx, y: ty, r: tr });
    }
    return trees;
  }

  // ─── Physics Groups ──────────────────────────────────────────────────────────
  private createBuildingPhysics(): Phaser.Physics.Arcade.StaticGroup {
    const group = this.physics.add.staticGroup();
    for (const b of this.buildings) {
      const rect = this.add.rectangle(b.x + b.w / 2, b.y + b.h / 2, b.w, b.h, 0x445566, 0);
      rect.setDepth(1.5);
      this.physics.add.existing(rect, true);
      group.add(rect, true);
    }
    return group;
  }

  private createTreePhysics(): Phaser.Physics.Arcade.StaticGroup {
    const group = this.physics.add.staticGroup();
    const trees = this.generateTrees();
    for (const t of trees) {
      const circle = this.add.circle(t.x, t.y, t.r * 0.7, 0x1a5a1a, 0);
      circle.setDepth(1.5);
      this.physics.add.existing(circle, true);
      (circle.body as Phaser.Physics.Arcade.StaticBody).setCircle(t.r * 0.7);
      group.add(circle, true);
    }
    return group;
  }

  // ─── Weapon Pickups ──────────────────────────────────────────────────────────
  private spawnWeaponPickups() {
    const pickupConfigs: Array<{ x: number; y: number; key: WeaponKey }> = [
      // Center area
      { x: 2050, y: 1920, key: "AR" },
      { x: 1900, y: 1920, key: "SHOTGUN" },
      { x: 2100, y: 1750, key: "SNIPER" },
      { x: 1820, y: 1750, key: "AR" },
      // Scattered
      { x: 450,  y: 350,  key: "AR" },
      { x: 3250, y: 280,  key: "SNIPER" },
      { x: 400,  y: 3380, key: "AR" },
      { x: 3200, y: 3280, key: "SHOTGUN" },
      { x: 1000, y: 1450, key: "SHOTGUN" },
      { x: 3050, y: 1560, key: "AR" },
      { x: 1050, y: 2550, key: "SNIPER" },
      { x: 3050, y: 2650, key: "AR" },
      { x: 1450, y: 650,  key: "SHOTGUN" },
      { x: 2650, y: 750,  key: "AR" },
      { x: 650,  y: 2050, key: "SNIPER" },
      { x: 3350, y: 2050, key: "SHOTGUN" },
    ];

    const gfxLayer = this.add.graphics().setDepth(2);

    for (const cfg of pickupConfigs) {
      const def = WEAPONS[cfg.key];
      const pw = 28, ph = 14;

      gfxLayer.fillStyle(def.color, 0.9);
      gfxLayer.fillRoundedRect(cfg.x - pw / 2, cfg.y - ph / 2, pw, ph, 3);
      gfxLayer.lineStyle(1, 0xffffff, 0.4);
      gfxLayer.strokeRoundedRect(cfg.x - pw / 2, cfg.y - ph / 2, pw, ph, 3);

      const label = this.add.text(cfg.x, cfg.y, def.name, {
        fontFamily: "Arial", fontSize: "9px", color: "#ffffff",
      }).setOrigin(0.5).setDepth(2.1);

      this.weaponPickups.push({
        gfx: gfxLayer,
        label,
        key: cfg.key,
        x: cfg.x,
        y: cfg.y,
        collected: false,
      });
    }
  }

  // ─── Player ──────────────────────────────────────────────────────────────────
  private createPlayer() {
    const sx = MAP_SIZE / 2 + rand(-200, 200);
    const sy = MAP_SIZE / 2 + rand(-200, 200);

    this.player = this.physics.add.image(sx, sy, "tex_player")
      .setDepth(5)
      .setCollideWorldBounds(true);
    (this.player.body as Phaser.Physics.Arcade.Body).setCircle(PLAYER_RADIUS, 0, 0);

    this.playerGfx = this.add.graphics().setDepth(6);
  }

  // ─── Bots ─────────────────────────────────────────────────────────────────────
  private createBots() {
    const weaponKeys: WeaponKey[] = ["PISTOL", "AR", "SHOTGUN", "SNIPER"];
    const spawnPoints = this.generateBotSpawnPoints();

    for (let i = 0; i < BOT_COUNT; i++) {
      const sp = spawnPoints[i] ?? { x: rand(200, MAP_SIZE - 200), y: rand(200, MAP_SIZE - 200) };
      const wKey = weightedWeaponPick();

      const sprite = this.physics.add.image(sp.x, sp.y, "tex_bot")
        .setDepth(4)
        .setCollideWorldBounds(true);
      (sprite.body as Phaser.Physics.Arcade.Body).setCircle(BOT_RADIUS, 0, 0);

      const gfx = this.add.graphics().setDepth(4.5);

      this.bots.push({
        sprite,
        gfx,
        health: 100,
        maxHealth: 100,
        weaponKey: wKey,
        ammo: WEAPONS[wKey].ammo,
        lastFireTime: 0,
        state: "wander",
        wanderTarget: new Phaser.Math.Vector2(sp.x, sp.y),
        wanderTimer: randFloat(2, 5),
        isDead: false,
      });
    }
  }

  private generateBotSpawnPoints() {
    const points: Array<{ x: number; y: number }> = [];
    const rings = [
      { minR: 800,  maxR: 1400 },
      { minR: 1400, maxR: 1900 },
    ];
    const cx = MAP_SIZE / 2, cy = MAP_SIZE / 2;
    for (let i = 0; i < BOT_COUNT; i++) {
      const ring = rings[i % rings.length];
      const angle = (i / BOT_COUNT) * Math.PI * 2 + randFloat(0, 0.4);
      const r = randFloat(ring.minR, ring.maxR);
      points.push({
        x: Phaser.Math.Clamp(cx + Math.cos(angle) * r, 200, MAP_SIZE - 200),
        y: Phaser.Math.Clamp(cy + Math.sin(angle) * r, 200, MAP_SIZE - 200),
      });
    }
    return points;
  }

  // ─── Bullet Groups ────────────────────────────────────────────────────────────
  private createBulletGroups() {
    this.playerBullets = this.physics.add.group({
      defaultKey: "tex_bullet_p",
      maxSize: 80,
    });
    this.botBullets = this.physics.add.group({
      defaultKey: "tex_bullet_b",
      maxSize: 200,
    });
  }

  // ─── Collision ────────────────────────────────────────────────────────────────
  private setupCollision() {
    // Player vs buildings
    this.physics.add.collider(this.player, this.buildingGroup);
    this.physics.add.collider(this.player, this.treeGroup);

    // Player bullets vs buildings → destroy bullet
    this.physics.add.collider(this.playerBullets, this.buildingGroup, (bullet) => {
      (bullet as Phaser.Physics.Arcade.Image).setActive(false).setVisible(false);
      (bullet as Phaser.Physics.Arcade.Image).body?.stop();
    });
    this.physics.add.collider(this.playerBullets, this.treeGroup, (bullet) => {
      (bullet as Phaser.Physics.Arcade.Image).setActive(false).setVisible(false);
    });

    // Bot bullets vs buildings → destroy bullet
    this.physics.add.collider(this.botBullets, this.buildingGroup, (bullet) => {
      (bullet as Phaser.Physics.Arcade.Image).setActive(false).setVisible(false);
      (bullet as Phaser.Physics.Arcade.Image).body?.stop();
    });
    this.physics.add.collider(this.botBullets, this.treeGroup, (bullet) => {
      (bullet as Phaser.Physics.Arcade.Image).setActive(false).setVisible(false);
    });

    // Player bullets vs bots
    this.physics.add.overlap(
      this.playerBullets,
      this.bots.map((b) => b.sprite),
      (bullet, botSprite) => {
        const bul = bullet as Phaser.Physics.Arcade.Image;
        const data = bul.getData("d") as BulletData | undefined;
        if (!data) return;
        bul.setActive(false).setVisible(false);

        const bot = this.bots.find((b) => b.sprite === botSprite);
        if (!bot || bot.isDead) return;
        bot.health -= data.damage;
        this.showDamageNumber(bot.sprite.x, bot.sprite.y, data.damage, false);
        if (bot.health <= 0) {
          this.killBot(bot);
        }
      }
    );

    // Bot bullets vs player
    this.physics.add.overlap(
      this.botBullets,
      this.player,
      (player, bullet) => {
        const bul = bullet as Phaser.Physics.Arcade.Image;
        const data = bul.getData("d") as BulletData | undefined;
        if (!data) return;
        bul.setActive(false).setVisible(false);

        this.playerHealth -= data.damage;
        this.showDamageNumber(this.player.x, this.player.y, data.damage, true);
        if (this.playerHealth <= 0) {
          this.playerHealth = 0;
          this.triggerGameOver(false);
        }
      }
    );
  }

  // ─── Camera ───────────────────────────────────────────────────────────────────
  private setupCamera() {
    this.cameras.main.setBounds(0, 0, MAP_SIZE, MAP_SIZE);
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.cameras.main.setZoom(1.2);
  }

  // ─── Input ────────────────────────────────────────────────────────────────────
  private setupInput() {
    const kb = this.input.keyboard!;
    this.wasd = {
      W: kb.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: kb.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: kb.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: kb.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      R: kb.addKey(Phaser.Input.Keyboard.KeyCodes.R),
      F: kb.addKey(Phaser.Input.Keyboard.KeyCodes.F),
    };

    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => {
      if (p.leftButtonDown()) this.fireHeld = true;
    });
    this.input.on("pointerup", () => { this.fireHeld = false; });

    // Prevent context menu so right-click-to-move works
    this.sys.game.canvas.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  // ─── Zone ─────────────────────────────────────────────────────────────────────
  private setupZone() {
    this.zoneGfx = this.add.graphics().setDepth(3);
  }

  // ─── Update ───────────────────────────────────────────────────────────────────
  update(time: number, delta: number) {
    if (this.gameOver) return;
    const dt = delta / 1000;

    this.updatePlayer(time, delta);
    this.updateBots(time, delta);
    this.updateBullets();
    this.updateZone(dt);
    this.updateRegistry();
    this.drawPlayerGfx();
    this.drawBotsGfx();
    this.drawZone();
    this.checkWinCondition();
  }

  // ─── Player Update ────────────────────────────────────────────────────────────
  private updatePlayer(time: number, delta: number) {
    const body = this.player.body as Phaser.Physics.Arcade.Body;

    // World-space mouse position (used for aiming + right-click movement)
    const worldMouse = this.cameras.main.getWorldPoint(
      this.input.mousePointer.x,
      this.input.mousePointer.y
    );

    // Movement — WASD keyboard OR right-click-hold to move toward cursor
    const rightHeld = this.input.mousePointer.rightButtonDown();
    const kbVx = (this.wasd.A.isDown ? -1 : 0) + (this.wasd.D.isDown ? 1 : 0);
    const kbVy = (this.wasd.W.isDown ? -1 : 0) + (this.wasd.S.isDown ? 1 : 0);
    const kbMag = Math.hypot(kbVx, kbVy);

    if (kbMag > 0) {
      // Keyboard movement takes priority
      body.setVelocity((kbVx / kbMag) * PLAYER_SPEED, (kbVy / kbMag) * PLAYER_SPEED);
    } else if (rightHeld) {
      // Right-click held → move toward cursor
      const dx = worldMouse.x - this.player.x;
      const dy = worldMouse.y - this.player.y;
      const d = Math.hypot(dx, dy);
      if (d > 8) {
        body.setVelocity((dx / d) * PLAYER_SPEED, (dy / d) * PLAYER_SPEED);
      } else {
        body.setVelocity(0, 0);
      }
    } else {
      body.setVelocity(0, 0);
    }

    // Aim toward mouse always
    this.player.setRotation(
      Phaser.Math.Angle.Between(this.player.x, this.player.y, worldMouse.x, worldMouse.y)
    );

    // Reload
    if (this.isReloading) {
      this.reloadTimer -= delta;
      if (this.reloadTimer <= 0) {
        this.isReloading = false;
        const def = WEAPONS[this.playerWeaponKey];
        const needed = def.maxAmmo - this.playerAmmo;
        const take = Math.min(needed, this.playerReserves);
        this.playerAmmo += take;
        this.playerReserves -= take;
      }
    } else {
      // Manual reload — keyboard R or middle-click
      const rDown = Phaser.Input.Keyboard.JustDown(this.wasd.R);
      if (rDown && this.playerAmmo < WEAPONS[this.playerWeaponKey].maxAmmo) {
        this.startReload();
      }
      // Auto reload when empty
      if (this.playerAmmo === 0 && this.playerReserves > 0) this.startReload();
    }

    // Pickup — keyboard F OR auto-pickup when walking over weapon
    if (Phaser.Input.Keyboard.JustDown(this.wasd.F)) {
      this.tryPickup();
    } else {
      this.tryAutoPickup();
    }

    // Shoot — left click held
    if (this.fireHeld && !this.isReloading) {
      this.playerShoot(time, worldMouse.x, worldMouse.y);
    }
  }

  private startReload() {
    this.isReloading = true;
    this.reloadTimer = WEAPONS[this.playerWeaponKey].reloadTime;
  }

  private playerShoot(time: number, targetX: number, targetY: number) {
    const def = WEAPONS[this.playerWeaponKey];
    if (time - this.lastPlayerFireTime < def.fireRate) return;
    if (this.playerAmmo <= 0) return;

    this.lastPlayerFireTime = time;
    this.playerAmmo--;

    const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, targetX, targetY);
    this.spawnBullets(
      this.playerBullets, "tex_bullet_p",
      this.player.x, this.player.y,
      angle, def, true
    );

    // Muzzle flash
    this.cameras.main.shake(30, 0.003);
  }

  private tryPickup() {
    let nearest: WeaponPickup | null = null;
    let nearestDist = PICKUP_RANGE;

    for (const wp of this.weaponPickups) {
      if (wp.collected) continue;
      const d = dist(this.player.x, this.player.y, wp.x, wp.y);
      if (d < nearestDist) {
        nearest = wp;
        nearestDist = d;
      }
    }

    if (nearest) {
      this.collectWeapon(nearest);
    }
  }

  // Auto-pickup when player walks directly over a weapon (no key needed)
  private tryAutoPickup() {
    const AUTO_RANGE = 28;
    for (const wp of this.weaponPickups) {
      if (wp.collected) continue;
      if (dist(this.player.x, this.player.y, wp.x, wp.y) < AUTO_RANGE) {
        this.collectWeapon(wp);
        break;
      }
    }
  }

  private collectWeapon(wp: WeaponPickup) {
    wp.collected = true;
    wp.label.setVisible(false);
    this.playerWeaponKey = wp.key;
    this.playerAmmo = WEAPONS[wp.key].ammo;
    this.playerReserves = WEAPONS[wp.key].reserves;
    this.isReloading = false;
  }

  // ─── Bot Update ───────────────────────────────────────────────────────────────
  private updateBots(time: number, delta: number) {
    const dt = delta / 1000;

    for (const bot of this.bots) {
      if (bot.isDead) continue;

      const bx = bot.sprite.x;
      const by = bot.sprite.y;
      const px = this.player.x;
      const py = this.player.y;
      const distToPlayer = dist(bx, by, px, py);
      const inZone = dist(bx, by, this.zoneCenterX, this.zoneCenterY) < this.zoneCurrentRadius;

      // ── State transitions ──
      if (!inZone) {
        bot.state = "flee_zone";
      } else if (distToPlayer < DETECT_RANGE) {
        if (distToPlayer < WEAPONS[bot.weaponKey].range * 0.9) {
          bot.state = "shoot";
        } else {
          bot.state = "chase";
        }
      } else {
        if (bot.state !== "wander") bot.state = "wander";
      }

      const body = bot.sprite.body as Phaser.Physics.Arcade.Body;

      // ── State actions ──
      if (bot.state === "flee_zone") {
        const angleToCenter = Phaser.Math.Angle.Between(bx, by, this.zoneCenterX, this.zoneCenterY);
        body.setVelocity(Math.cos(angleToCenter) * BOT_SPEED, Math.sin(angleToCenter) * BOT_SPEED);
        bot.sprite.setRotation(angleToCenter);

      } else if (bot.state === "chase") {
        const angleToPlayer = Phaser.Math.Angle.Between(bx, by, px, py);
        body.setVelocity(Math.cos(angleToPlayer) * BOT_SPEED, Math.sin(angleToPlayer) * BOT_SPEED);
        bot.sprite.setRotation(angleToPlayer);

      } else if (bot.state === "shoot") {
        body.setVelocity(0, 0);
        const angleToPlayer = Phaser.Math.Angle.Between(bx, by, px, py);
        bot.sprite.setRotation(angleToPlayer);

        // Shoot with fire rate
        if (time - bot.lastFireTime > WEAPONS[bot.weaponKey].fireRate * 1.5) {
          if (bot.ammo > 0) {
            bot.lastFireTime = time;
            bot.ammo--;
            this.spawnBullets(
              this.botBullets, "tex_bullet_b",
              bx, by,
              angleToPlayer + randFloat(-0.15, 0.15),
              WEAPONS[bot.weaponKey], false
            );
          } else {
            // Bot reloads instantly (simplified)
            bot.ammo = WEAPONS[bot.weaponKey].maxAmmo;
          }
        }

      } else {
        // Wander
        bot.wanderTimer -= dt;
        if (bot.wanderTimer <= 0) {
          bot.wanderTimer = randFloat(2, 6);
          const angle = randFloat(0, Math.PI * 2);
          const d2 = randFloat(100, 400);
          bot.wanderTarget = new Phaser.Math.Vector2(
            Phaser.Math.Clamp(bx + Math.cos(angle) * d2, 100, MAP_SIZE - 100),
            Phaser.Math.Clamp(by + Math.sin(angle) * d2, 100, MAP_SIZE - 100)
          );
        }
        const angleToWander = Phaser.Math.Angle.Between(bx, by, bot.wanderTarget.x, bot.wanderTarget.y);
        const dToWander = dist(bx, by, bot.wanderTarget.x, bot.wanderTarget.y);
        if (dToWander > 30) {
          body.setVelocity(Math.cos(angleToWander) * BOT_SPEED * 0.7, Math.sin(angleToWander) * BOT_SPEED * 0.7);
          bot.sprite.setRotation(angleToWander);
        } else {
          body.setVelocity(0, 0);
        }
      }
    }
  }

  // ─── Bullet Spawning ─────────────────────────────────────────────────────────
  private spawnBullets(
    group: Phaser.Physics.Arcade.Group,
    textureKey: string,
    x: number, y: number,
    angle: number,
    def: WeaponDef,
    fromPlayer: boolean
  ) {
    const spread = def.spread;

    for (let i = 0; i < def.pellets; i++) {
      const bulletAngle = angle + randFloat(-spread, spread);
      const bullet = group.get(x, y, textureKey) as Phaser.Physics.Arcade.Image | null;
      if (!bullet) continue;

      bullet
        .setActive(true)
        .setVisible(true)
        .setDepth(4.5)
        .setPosition(x, y);

      const data: BulletData = { ownedByPlayer: fromPlayer, range: def.range, startX: x, startY: y, damage: def.damage };
      bullet.setData("d", data);

      const bx = Math.cos(bulletAngle) * def.bulletSpeed;
      const by = Math.sin(bulletAngle) * def.bulletSpeed;
      (bullet.body as Phaser.Physics.Arcade.Body).setVelocity(bx, by);
      bullet.setRotation(bulletAngle);
    }
  }

  // ─── Bullet Update ────────────────────────────────────────────────────────────
  private updateBullets() {
    const killBullet = (bullet: Phaser.GameObjects.GameObject) => {
      const b = bullet as Phaser.Physics.Arcade.Image;
      if (!b.active) return;
      const data = b.getData("d") as BulletData | undefined;
      if (data && dist(b.x, b.y, data.startX, data.startY) > data.range) {
        b.setActive(false).setVisible(false);
        (b.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);
      }
    };
    this.playerBullets.getChildren().forEach(killBullet);
    this.botBullets.getChildren().forEach(killBullet);
  }

  // ─── Zone Update ─────────────────────────────────────────────────────────────
  private updateZone(dt: number) {
    if (this.zonePhase >= ZONE_PHASES.length - 1) return;

    this.zoneTimer -= dt;

    if (!this.zoneShrinking && this.zoneTimer <= 0) {
      // Start shrinking to next phase
      this.zoneShrinking = true;
      this.zonePhase++;
      this.zoneTargetRadius = ZONE_PHASES[this.zonePhase].radius;
      this.zoneTimer = ZONE_PHASES[this.zonePhase].shrinkTime;
    } else if (this.zoneShrinking && this.zoneTimer <= 0) {
      // Done shrinking
      this.zoneCurrentRadius = this.zoneTargetRadius;
      this.zoneShrinking = false;
      const next = this.zonePhase + 1;
      if (next < ZONE_PHASES.length) {
        this.zoneTimer = ZONE_PHASES[next].waitTime;
      }
    }

    if (this.zoneShrinking) {
      const phase = ZONE_PHASES[this.zonePhase];
      const prevRadius = ZONE_PHASES[this.zonePhase - 1]?.radius ?? phase.radius;
      const progress = 1 - this.zoneTimer / phase.shrinkTime;
      this.zoneCurrentRadius = Phaser.Math.Linear(prevRadius, this.zoneTargetRadius, progress);
    }

    // Apply zone damage
    this.zoneDamageTimer -= dt;
    if (this.zoneDamageTimer <= 0) {
      this.zoneDamageTimer = 1; // every second
      const dmg = ZONE_PHASES[this.zonePhase].damage;

      // Player
      if (dist(this.player.x, this.player.y, this.zoneCenterX, this.zoneCenterY) > this.zoneCurrentRadius) {
        this.playerHealth = Math.max(0, this.playerHealth - dmg);
        if (this.playerHealth <= 0) this.triggerGameOver(false);
      }

      // Bots
      for (const bot of this.bots) {
        if (bot.isDead) continue;
        if (dist(bot.sprite.x, bot.sprite.y, this.zoneCenterX, this.zoneCenterY) > this.zoneCurrentRadius) {
          bot.health -= dmg * 1.5;
          if (bot.health <= 0) this.killBot(bot);
        }
      }
    }
  }

  // ─── Drawing ─────────────────────────────────────────────────────────────────
  private drawPlayerGfx() {
    this.playerGfx.clear();
    const px = this.player.x;
    const py = this.player.y;
    const angle = this.player.rotation;

    // Aim line
    const gunLen = PLAYER_RADIUS + 8;
    this.playerGfx.lineStyle(3, 0xffd700, 0.8);
    this.playerGfx.lineBetween(px, py, px + Math.cos(angle) * gunLen, py + Math.sin(angle) * gunLen);

    // Health bar above player
    this.drawHealthBar(this.playerGfx, px - 22, py - PLAYER_RADIUS - 10, 44, 5, this.playerHealth / this.playerMaxHealth, 0x22c55e);
  }

  private drawBotsGfx() {
    for (const bot of this.bots) {
      bot.gfx.clear();
      if (bot.isDead) continue;
      const bx = bot.sprite.x;
      const by = bot.sprite.y;
      const angle = bot.sprite.rotation;

      // Aim line
      bot.gfx.lineStyle(2, 0xff4444, 0.6);
      const gl = BOT_RADIUS + 6;
      bot.gfx.lineBetween(bx, by, bx + Math.cos(angle) * gl, by + Math.sin(angle) * gl);

      // Health bar
      this.drawHealthBar(bot.gfx, bx - 18, by - BOT_RADIUS - 9, 36, 4, bot.health / bot.maxHealth, 0xee4444);
    }
  }

  private drawHealthBar(g: Phaser.GameObjects.Graphics, x: number, y: number, w: number, h: number, ratio: number, color: number) {
    g.fillStyle(0x111111, 0.8);
    g.fillRect(x, y, w, h);
    g.fillStyle(color, 1);
    g.fillRect(x, y, w * Math.max(0, ratio), h);
  }

  private drawZone() {
    this.zoneGfx.clear();
    // Safe zone circle
    this.zoneGfx.lineStyle(3, 0x4488ff, 0.9);
    this.zoneGfx.strokeCircle(this.zoneCenterX, this.zoneCenterY, this.zoneCurrentRadius);
    // Inner glow
    this.zoneGfx.lineStyle(8, 0x2244ff, 0.2);
    this.zoneGfx.strokeCircle(this.zoneCenterX, this.zoneCenterY, this.zoneCurrentRadius);

    if (this.zoneShrinking) {
      this.zoneGfx.lineStyle(2, 0xff6644, 0.7);
      this.zoneGfx.strokeCircle(this.zoneCenterX, this.zoneCenterY, this.zoneTargetRadius);
    }
  }

  // ─── Damage Numbers ───────────────────────────────────────────────────────────
  private showDamageNumber(x: number, y: number, dmg: number, isPlayer: boolean) {
    const txt = this.add.text(x + randFloat(-20, 20), y - PLAYER_RADIUS - 10, `-${dmg}`, {
      fontFamily: "'Rajdhani', Arial",
      fontSize: isPlayer ? "18px" : "14px",
      fontStyle: "bold",
      color: isPlayer ? "#ff4444" : "#ffdd00",
      stroke: "#000000",
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(20);

    this.tweens.add({
      targets: txt,
      y: txt.y - 40,
      alpha: 0,
      duration: 900,
      ease: "Quad.easeOut",
      onComplete: () => txt.destroy(),
    });
  }

  // ─── Kill Bot ────────────────────────────────────────────────────────────────
  private killBot(bot: BotState) {
    if (bot.isDead) return;
    bot.isDead = true;
    bot.sprite.setActive(false).setVisible(false);
    bot.gfx.clear();
    (bot.sprite.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);
    this.killCount++;

    // Death effect
    const deathGfx = this.add.graphics().setDepth(3);
    deathGfx.fillStyle(0xcc2222, 0.6);
    deathGfx.fillCircle(bot.sprite.x, bot.sprite.y, BOT_RADIUS * 1.5);
    this.tweens.add({
      targets: deathGfx,
      alpha: 0,
      scaleX: 2.5,
      scaleY: 2.5,
      duration: 600,
      ease: "Quad.easeOut",
      onComplete: () => deathGfx.destroy(),
    });

    // Maybe drop their weapon
    if (Math.random() < 0.6 && bot.weaponKey !== "PISTOL") {
      this.spawnDroppedWeapon(bot.sprite.x, bot.sprite.y, bot.weaponKey);
    }
  }

  private spawnDroppedWeapon(x: number, y: number, key: WeaponKey) {
    const def = WEAPONS[key];
    const gfx = this.add.graphics().setDepth(2);
    const pw = 28, ph = 14;
    gfx.fillStyle(def.color, 0.85);
    gfx.fillRoundedRect(x - pw / 2, y - ph / 2, pw, ph, 3);

    const label = this.add.text(x, y, def.name, {
      fontFamily: "Arial", fontSize: "9px", color: "#ffffff",
    }).setOrigin(0.5).setDepth(2.1);

    this.weaponPickups.push({ gfx, label, key, x, y, collected: false });
  }

  // ─── Win Condition ────────────────────────────────────────────────────────────
  private checkWinCondition() {
    const aliveBots = this.bots.filter((b) => !b.isDead).length;
    if (aliveBots === 0 && !this.gameOver) {
      this.triggerGameOver(true);
    }
  }

  // ─── Game Over ────────────────────────────────────────────────────────────────
  private triggerGameOver(won: boolean) {
    if (this.gameOver) return;
    this.gameOver = true;
    this.gameWon = won;

    this.scene.pause("UIScene");
    this.cameras.main.shake(400, won ? 0.003 : 0.015);

    const { width, height } = this.scale;
    const cx = this.cameras.main.scrollX + width / 2;
    const cy = this.cameras.main.scrollY + height / 2;

    const overlay = this.add.graphics().setDepth(50);
    overlay.fillStyle(0x000000, 0.75);
    overlay.fillRect(this.cameras.main.scrollX, this.cameras.main.scrollY, width, height);

    if (won) {
      this.add.text(cx, cy - 100, "🏆 WINNER WINNER", {
        fontFamily: "'Rajdhani', 'Barlow', Arial",
        fontSize: "58px", fontStyle: "bold",
        color: "#f48c06",
        stroke: "#000", strokeThickness: 6,
        shadow: { offsetX: 0, offsetY: 0, color: "#f48c06", blur: 30, fill: true },
      }).setOrigin(0.5).setDepth(51);

      this.add.text(cx, cy - 30, "CHICKEN DINNER! 🍗", {
        fontFamily: "'Rajdhani', 'Barlow', Arial",
        fontSize: "42px", fontStyle: "bold",
        color: "#ffffff",
        stroke: "#000", strokeThickness: 4,
      }).setOrigin(0.5).setDepth(51);
    } else {
      this.add.text(cx, cy - 100, "☠ ELIMINATED", {
        fontFamily: "'Rajdhani', 'Barlow', Arial",
        fontSize: "58px", fontStyle: "bold",
        color: "#ef4444",
        stroke: "#000", strokeThickness: 6,
      }).setOrigin(0.5).setDepth(51);

      this.add.text(cx, cy - 30, "You were taken out", {
        fontFamily: "Arial", fontSize: "22px", color: "#aaaaaa",
      }).setOrigin(0.5).setDepth(51);
    }

    const aliveBots = this.bots.filter((b) => !b.isDead).length;
    const placement = aliveBots + 1;

    this.add.text(cx, cy + 30, `⚔  ${this.killCount} Kills   |   #${placement} Placement`, {
      fontFamily: "Arial", fontSize: "18px", color: "#cccccc",
    }).setOrigin(0.5).setDepth(51);

    // Play Again button
    const btnBg = this.add.graphics().setDepth(51);
    const btnX = cx - 100;
    const btnY = cy + 75;
    btnBg.fillStyle(0xe85d04, 1);
    btnBg.fillRoundedRect(btnX, btnY, 200, 48, 6);

    const playAgain = this.add.text(cx, cy + 99, "▶  PLAY AGAIN", {
      fontFamily: "'Rajdhani', Arial", fontSize: "20px", fontStyle: "bold", color: "#fff",
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(52);

    playAgain.on("pointerover", () => { btnBg.clear(); btnBg.fillStyle(0xff7a1a,1); btnBg.fillRoundedRect(btnX,btnY,200,48,6); });
    playAgain.on("pointerout",  () => { btnBg.clear(); btnBg.fillStyle(0xe85d04,1); btnBg.fillRoundedRect(btnX,btnY,200,48,6); });
    playAgain.on("pointerdown", () => {
      this.scene.stop("UIScene");
      this.cameras.main.fadeOut(400, 0, 0, 0);
      this.cameras.main.once("camerafadeoutcomplete", () => {
        this.scene.restart();
      });
    });

    // Menu button
    const menuBg = this.add.graphics().setDepth(51);
    const mbX = cx - 80;
    const mbY = cy + 138;
    menuBg.fillStyle(0x334455, 1);
    menuBg.fillRoundedRect(mbX, mbY, 160, 40, 6);

    const menuBtn = this.add.text(cx, cy + 158, "Main Menu", {
      fontFamily: "Arial", fontSize: "16px", color: "#aaaaaa",
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(52);

    menuBtn.on("pointerdown", () => {
      this.scene.stop("UIScene");
      this.cameras.main.fadeOut(400, 0, 0, 0);
      this.cameras.main.once("camerafadeoutcomplete", () => {
        this.scene.stop("GameScene");
        this.scene.start("MenuScene");
      });
    });
  }

  // ─── Registry Update (for UIScene) ───────────────────────────────────────────
  private updateRegistry() {
    const nearWeapon = this.weaponPickups.some(
      (wp) => !wp.collected && dist(this.player.x, this.player.y, wp.x, wp.y) < PICKUP_RANGE
    );

    const inZone = dist(this.player.x, this.player.y, this.zoneCenterX, this.zoneCenterY) <= this.zoneCurrentRadius;

    this.registry.set("health", this.playerHealth);
    this.registry.set("maxHealth", this.playerMaxHealth);
    this.registry.set("weaponName", WEAPONS[this.playerWeaponKey].name);
    this.registry.set("ammo", this.playerAmmo);
    this.registry.set("reserves", this.playerReserves);
    this.registry.set("kills", this.killCount);
    this.registry.set("alive", this.bots.filter((b) => !b.isDead).length + 1);
    this.registry.set("zoneTimer", this.zoneTimer);
    this.registry.set("zoneShrinking", this.zoneShrinking);
    this.registry.set("inZone", inZone);
    this.registry.set("isReloading", this.isReloading);
    this.registry.set("nearWeapon", nearWeapon);
    this.registry.set("playerPos", { x: this.player.x, y: this.player.y });
    this.registry.set("zoneCenter", { x: this.zoneCenterX, y: this.zoneCenterY });
    this.registry.set("zoneRadius", this.zoneCurrentRadius);
    this.registry.set("botPositions", this.bots.map((b) => ({ x: b.sprite.x, y: b.sprite.y, dead: b.isDead })));
  }
}

// Weighted weapon pick for bots
function weightedWeaponPick(): WeaponKey {
  const r = Math.random();
  if (r < 0.30) return "PISTOL";
  if (r < 0.60) return "AR";
  if (r < 0.80) return "SHOTGUN";
  return "SNIPER";
}
