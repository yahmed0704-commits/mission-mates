import Phaser from "phaser";

const MAP_SIZE = 4000;
const MINIMAP_SIZE = 180;
const MINIMAP_SCALE = MINIMAP_SIZE / MAP_SIZE;
export class UIScene extends Phaser.Scene {
  // HUD elements
  private healthBar!: Phaser.GameObjects.Graphics;
  private healthText!: Phaser.GameObjects.Text;
  private weaponText!: Phaser.GameObjects.Text;
  private ammoText!: Phaser.GameObjects.Text;
  private aliveText!: Phaser.GameObjects.Text;
  private killText!: Phaser.GameObjects.Text;
  private zoneText!: Phaser.GameObjects.Text;
  private zoneTimerBar!: Phaser.GameObjects.Graphics;
  private zoneDmgBanner!: Phaser.GameObjects.Text;
  private zoneVignette!: Phaser.GameObjects.Graphics;
  private minimap!: Phaser.GameObjects.Graphics;
  private reloadText!: Phaser.GameObjects.Text;
  private pickupHintText!: Phaser.GameObjects.Text;
  private bloodOverlay!: Phaser.GameObjects.Graphics;
  private controlsHint!: Phaser.GameObjects.Text;
  private lastHealth = 100;

  // Controls hint timer
  private controlsTimer = 8;
  private controlsHintDone = false;

  // Zone data for timer bar
  private zoneMaxTime = 32;

  constructor() {
    super({ key: "UIScene" });
  }

  create() {
    this.controlsTimer = 8;
    this.controlsHintDone = false;
    this.lastHealth = 100;

    const { width, height } = this.scale;
    this.buildHUD(width, height);
    this.scale.on("resize", this.onResize, this);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // HUD
  // ─────────────────────────────────────────────────────────────────────────────
  private buildHUD(width: number, height: number) {
    // ── Bottom-left: Health ───────────────────────────────────────────────────
    const hBg = this.add.graphics();
    hBg.fillStyle(0x000000, 0.55);
    hBg.fillRoundedRect(10, height - 92, 248, 82, 8);

    this.add.text(22, height - 86, "HEALTH", {
      fontFamily: "Arial", fontSize: "11px", color: "#888888", letterSpacing: 2,
    });
    this.healthBar = this.add.graphics();
    this.healthText = this.add.text(22, height - 46, "100", {
      fontFamily: "'Rajdhani', Arial", fontSize: "26px", fontStyle: "bold", color: "#ffffff",
    });

    // ── Bottom-right: Weapon / Ammo ───────────────────────────────────────────
    const wBg = this.add.graphics();
    wBg.fillStyle(0x000000, 0.55);
    wBg.fillRoundedRect(width - 186, height - 92, 176, 82, 8);

    this.add.text(width - 22, height - 86, "WEAPON", {
      fontFamily: "Arial", fontSize: "11px", color: "#888888", letterSpacing: 2,
    }).setOrigin(1, 0);
    this.weaponText = this.add.text(width - 22, height - 70, "PISTOL", {
      fontFamily: "'Rajdhani', Arial", fontSize: "20px", fontStyle: "bold", color: "#e85d04",
    }).setOrigin(1, 0);
    this.add.text(width - 22, height - 50, "AMMO", {
      fontFamily: "Arial", fontSize: "10px", color: "#666666", letterSpacing: 2,
    }).setOrigin(1, 0);
    this.ammoText = this.add.text(width - 22, height - 40, "12 / 60", {
      fontFamily: "'Rajdhani', Arial", fontSize: "22px", fontStyle: "bold", color: "#ffffff",
    }).setOrigin(1, 0);

    // ── Top-right: Alive / Kills ──────────────────────────────────────────────
    const sBg = this.add.graphics();
    sBg.fillStyle(0x000000, 0.55);
    sBg.fillRoundedRect(width - 148, 10, 138, 56, 8);

    this.aliveText = this.add.text(width - 22, 18, "🟠 20 players left", {
      fontFamily: "Arial", fontSize: "13px", color: "#ffffff",
    }).setOrigin(1, 0);
    this.killText = this.add.text(width - 22, 40, "⭐ 0 tags", {
      fontFamily: "Arial", fontSize: "13px", color: "#f48c06",
    }).setOrigin(1, 0);

    // ── Top-center: Zone ──────────────────────────────────────────────────────
    const zoneBg = this.add.graphics();
    zoneBg.fillStyle(0x000000, 0.55);
    zoneBg.fillRoundedRect(width / 2 - 130, 8, 260, 46, 8);

    this.zoneText = this.add.text(width / 2, 16, "🔵 SAFE ZONE closes in 32s", {
      fontFamily: "Arial", fontSize: "13px", fontStyle: "bold", color: "#66aaff",
    }).setOrigin(0.5, 0);

    // Zone timer bar (thin strip under zone text)
    this.zoneTimerBar = this.add.graphics();

    // ── Zone damage: red vignette border ──────────────────────────────────────
    this.zoneVignette = this.add.graphics().setDepth(88).setAlpha(0);

    // ── Zone damage banner ────────────────────────────────────────────────────
    this.zoneDmgBanner = this.add.text(width / 2, 64, "⚠  YOU ARE OUTSIDE THE SAFE ZONE — MOVE BACK IN!", {
      fontFamily: "'Rajdhani', Arial", fontSize: "17px", fontStyle: "bold",
      color: "#ff3333", stroke: "#000000", strokeThickness: 4,
      backgroundColor: "#000000aa", padding: { x: 14, y: 6 },
    }).setOrigin(0.5, 0).setDepth(89).setVisible(false);

    // ── Reload ────────────────────────────────────────────────────────────────
    this.reloadText = this.add.text(width / 2, height - 120, "⟳  RELOADING...", {
      fontFamily: "'Rajdhani', Arial", fontSize: "22px", fontStyle: "bold", color: "#f48c06",
      stroke: "#000000", strokeThickness: 3,
    }).setOrigin(0.5).setVisible(false).setDepth(50);

    // ── Pickup hint ───────────────────────────────────────────────────────────
    this.pickupHintText = this.add.text(width / 2, height - 148, "▲ Walk over the item to pick it up", {
      fontFamily: "Arial", fontSize: "14px", color: "#88ff88",
      stroke: "#000000", strokeThickness: 3,
    }).setOrigin(0.5).setVisible(false).setDepth(50);

    // ── Minimap (bottom-left, above health) ───────────────────────────────────
    this.minimap = this.add.graphics().setDepth(10);

    // ── Blood flash overlay ───────────────────────────────────────────────────
    this.bloodOverlay = this.add.graphics().setDepth(100).setAlpha(0);

    // ── Controls hint (fades after ~8s) ──────────────────────────────────────
    this.controlsHint = this.add.text(width / 2, height - 174, 
      "RIGHT-CLICK (hold) = Move   ·   LEFT-CLICK = Shoot   ·   Walk over items = Pick up   ·   R = Reload", {
      fontFamily: "Arial", fontSize: "12px", color: "#dddddd",
      stroke: "#000000", strokeThickness: 3,
    }).setOrigin(0.5).setDepth(50).setAlpha(1);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Resize
  // ─────────────────────────────────────────────────────────────────────────────
  private onResize(gameSize: Phaser.Structs.Size) {
    const { width, height } = gameSize;
    this.aliveText.setPosition(width - 22, 18);
    this.killText.setPosition(width - 22, 40);
    this.zoneText.setPosition(width / 2, 16);
    this.zoneDmgBanner.setPosition(width / 2, 64);
    this.weaponText.setPosition(width - 22, height - 70);
    this.ammoText.setPosition(width - 22, height - 40);
    this.reloadText.setPosition(width / 2, height - 120);
    this.pickupHintText.setPosition(width / 2, height - 148);
    this.healthText.setPosition(22, height - 46);
    this.controlsHint.setPosition(width / 2, height - 174);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Update
  // ─────────────────────────────────────────────────────────────────────────────
  update(_time: number, delta: number) {
    const dt = delta / 1000;
    const reg = this.registry;
    const { width, height } = this.scale;

    // ── Controls hint fade ────────────────────────────────────────────────────
    if (!this.controlsHintDone) {
      this.controlsTimer -= dt;
      if (this.controlsTimer <= 2) {
        const a = Math.max(0, this.controlsTimer / 2);
        this.controlsHint.setAlpha(a);
        if (this.controlsTimer <= 0) {
          this.controlsHint.setVisible(false);
          this.controlsHintDone = true;
        }
      }
    }

    // ── Read registry ─────────────────────────────────────────────────────────
    const health: number        = reg.get("health") ?? 100;
    const maxHealth: number     = reg.get("maxHealth") ?? 100;
    const weaponName: string    = reg.get("weaponName") ?? "PISTOL";
    const ammo: number          = reg.get("ammo") ?? 12;
    const reserves: number      = reg.get("reserves") ?? 60;
    const alive: number         = reg.get("alive") ?? 20;
    const kills: number         = reg.get("kills") ?? 0;
    const zoneTimer: number     = reg.get("zoneTimer") ?? 32;
    const zoneMaxTime: number   = reg.get("zoneMaxTime") ?? 32;
    const zoneShrinking: boolean = reg.get("zoneShrinking") ?? false;
    const inZone: boolean       = reg.get("inZone") ?? true;
    const isReloading: boolean  = reg.get("isReloading") ?? false;
    const nearWeapon: boolean   = reg.get("nearWeapon") ?? false;
    const botPositions: Array<{ x: number; y: number; dead: boolean }> = reg.get("botPositions") ?? [];
    const playerPos: { x: number; y: number } = reg.get("playerPos") ?? { x: MAP_SIZE / 2, y: MAP_SIZE / 2 };
    const zoneCenter: { x: number; y: number } = reg.get("zoneCenter") ?? { x: MAP_SIZE / 2, y: MAP_SIZE / 2 };
    const zoneRadius: number    = reg.get("zoneRadius") ?? 1900;

    // ── Health bar ────────────────────────────────────────────────────────────
    this.healthBar.clear();
    const barW = 220, barH = 14, barX = 22, barY = height - 62;
    this.healthBar.fillStyle(0x333333, 0.9);
    this.healthBar.fillRoundedRect(barX, barY, barW, barH, 4);
    const ratio = Math.max(0, health / maxHealth);
    const barColor = ratio > 0.6 ? 0x22c55e : ratio > 0.3 ? 0xf59e0b : 0xef4444;
    this.healthBar.fillStyle(barColor, 1);
    this.healthBar.fillRoundedRect(barX, barY, barW * ratio, barH, 4);
    this.healthText.setText(`${Math.ceil(health)}`);

    // Blood flash
    if (health < this.lastHealth) {
      this.bloodOverlay.clear();
      this.bloodOverlay.fillStyle(0xff0000, 0.4);
      this.bloodOverlay.fillRect(0, 0, width, height);
      this.tweens.killTweensOf(this.bloodOverlay);
      this.tweens.add({ targets: this.bloodOverlay, alpha: { from: 1, to: 0 }, duration: 600, ease: "Quad.easeOut" });
    }
    this.lastHealth = health;

    // ── Weapon / Ammo ─────────────────────────────────────────────────────────
    this.weaponText.setText(weaponName.toUpperCase());
    this.ammoText.setText(`${ammo}  /  ${reserves}`);
    this.ammoText.setColor(ammo === 0 ? "#ff5555" : "#ffffff");

    // ── Alive / Kills ─────────────────────────────────────────────────────────
    this.aliveText.setText(`🟠 ${alive} player${alive !== 1 ? "s" : ""} left`);
    this.killText.setText(`⭐ ${kills} tag${kills !== 1 ? "s" : ""}`);

    // ── Zone text ─────────────────────────────────────────────────────────────
    const timerSec = Math.ceil(zoneTimer);
    if (zoneShrinking) {
      this.zoneText.setText("🔵 SAFE ZONE IS SHRINKING — MOVE IN!").setColor("#ff6644");
    } else {
      this.zoneText.setText(`🔵 SAFE ZONE closes in ${timerSec}s`).setColor("#66aaff");
    }

    // Zone timer bar (thin strip under zone text, 260px wide)
    this.zoneTimerBar.clear();
    const zbX = width / 2 - 130;
    const zbY = 36;
    const zbW = 260;
    const zbH = 4;
    const maxT = Math.max(1, zoneMaxTime);
    const tRatio = Math.max(0, Math.min(1, zoneTimer / maxT));
    this.zoneTimerBar.fillStyle(0x223344, 0.7);
    this.zoneTimerBar.fillRoundedRect(zbX, zbY, zbW, zbH, 2);
    this.zoneTimerBar.fillStyle(zoneShrinking ? 0xff6644 : 0x4488ff, 1);
    this.zoneTimerBar.fillRoundedRect(zbX, zbY, zbW * tRatio, zbH, 2);

    // ── Zone damage: vignette + banner ────────────────────────────────────────
    if (!inZone) {
      const pulse = 0.45 + Math.sin(Date.now() / 250) * 0.2;
      this.zoneVignette.clear();
      this.zoneVignette.setAlpha(pulse);
      const vT = 40; // vignette thickness
      this.zoneVignette.fillStyle(0xff0000, 0.6);
      this.zoneVignette.fillRect(0, 0, width, vT);
      this.zoneVignette.fillRect(0, height - vT, width, vT);
      this.zoneVignette.fillRect(0, 0, vT, height);
      this.zoneVignette.fillRect(width - vT, 0, vT, height);

      this.zoneDmgBanner.setVisible(true);
      this.zoneDmgBanner.setAlpha(0.8 + Math.sin(Date.now() / 180) * 0.2);
    } else {
      this.zoneVignette.setAlpha(0);
      this.zoneDmgBanner.setVisible(false);
    }

    // ── Reload / Pickup ───────────────────────────────────────────────────────
    this.reloadText.setVisible(isReloading);
    this.pickupHintText.setVisible(nearWeapon && !isReloading);

    // ── Minimap ───────────────────────────────────────────────────────────────
    const mmX = 16;
    const mmY = height - 92 - MINIMAP_SIZE - 12;

    this.minimap.clear();

    // Background + border
    this.minimap.fillStyle(0x071507, 0.88);
    this.minimap.fillRect(mmX, mmY, MINIMAP_SIZE, MINIMAP_SIZE);
    this.minimap.lineStyle(1.5, 0x445544, 1);
    this.minimap.strokeRect(mmX, mmY, MINIMAP_SIZE, MINIMAP_SIZE);

    // "MAP" label
    this.minimap.fillStyle(0x000000, 0.55);
    this.minimap.fillRect(mmX, mmY, 32, 14);
    // (can't draw text in Graphics — label is added in create once; skip for now)

    // Zone safe area
    const zoneMapX = mmX + zoneCenter.x * MINIMAP_SCALE;
    const zoneMapY = mmY + zoneCenter.y * MINIMAP_SCALE;
    const zoneMapR = zoneRadius * MINIMAP_SCALE;
    this.minimap.lineStyle(2, inZone ? 0x4488ff : 0xff4422, 1);
    this.minimap.strokeCircle(zoneMapX, zoneMapY, zoneMapR);
    // Shade outside zone on minimap
    this.minimap.fillStyle(0xff0000, 0.06);
    this.minimap.fillRect(mmX, mmY, MINIMAP_SIZE, MINIMAP_SIZE);

    // Enemy bots — bigger, brighter red dots
    for (const bot of botPositions) {
      if (bot.dead) continue;
      const bx = mmX + bot.x * MINIMAP_SCALE;
      const by = mmY + bot.y * MINIMAP_SCALE;
      this.minimap.fillStyle(0xff3333, 1);
      this.minimap.fillCircle(bx, by, 3.5);
      // White outline so they're visible on dark bg
      this.minimap.lineStyle(0.8, 0xffffff, 0.6);
      this.minimap.strokeCircle(bx, by, 3.5);
    }

    // Player — white dot with orange ring
    const px2 = mmX + playerPos.x * MINIMAP_SCALE;
    const py2 = mmY + playerPos.y * MINIMAP_SCALE;
    this.minimap.fillStyle(0xffffff, 1);
    this.minimap.fillCircle(px2, py2, 4.5);
    this.minimap.lineStyle(1.5, 0xe85d04, 1);
    this.minimap.strokeCircle(px2, py2, 4.5);
  }
}
