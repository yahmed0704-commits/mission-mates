import Phaser from "phaser";

const MAP_SIZE = 4000;
const MINIMAP_SIZE = 160;
const MINIMAP_SCALE = MINIMAP_SIZE / MAP_SIZE;

export class UIScene extends Phaser.Scene {
  private healthBar!: Phaser.GameObjects.Graphics;
  private healthText!: Phaser.GameObjects.Text;
  private weaponText!: Phaser.GameObjects.Text;
  private ammoText!: Phaser.GameObjects.Text;
  private aliveText!: Phaser.GameObjects.Text;
  private killText!: Phaser.GameObjects.Text;
  private zoneText!: Phaser.GameObjects.Text;
  private zoneDmgText!: Phaser.GameObjects.Text;
  private minimap!: Phaser.GameObjects.Graphics;
  private reloadText!: Phaser.GameObjects.Text;
  private pickupHintText!: Phaser.GameObjects.Text;
  private bloodOverlay!: Phaser.GameObjects.Graphics;
  private lastHealth = 100;

  constructor() {
    super({ key: "UIScene" });
  }

  create() {
    const { width, height } = this.scale;

    // ── Health Bar ────────────────────────────────────────────────────────────
    this.add.text(16, height - 80, "HEALTH", {
      fontFamily: "Arial", fontSize: "11px", color: "#888888", letterSpacing: 2,
    });
    this.healthBar = this.add.graphics();
    this.healthText = this.add.text(16, height - 44, "100", {
      fontFamily: "'Rajdhani', Arial", fontSize: "22px", fontStyle: "bold", color: "#ffffff",
    });

    // ── Weapon Info ────────────────────────────────────────────────────────────
    this.weaponText = this.add.text(width - 16, height - 78, "PISTOL", {
      fontFamily: "'Rajdhani', Arial", fontSize: "20px", fontStyle: "bold", color: "#e85d04",
    }).setOrigin(1, 0);
    this.ammoText = this.add.text(width - 16, height - 50, "12 / 60", {
      fontFamily: "'Rajdhani', Arial", fontSize: "28px", fontStyle: "bold", color: "#ffffff",
    }).setOrigin(1, 0);

    // ── Alive / Kills ─────────────────────────────────────────────────────────
    this.aliveText = this.add.text(width - 16, 16, "👥 20 alive", {
      fontFamily: "Arial", fontSize: "16px", color: "#ffffff",
    }).setOrigin(1, 0);
    this.killText = this.add.text(width - 16, 42, "⚔ 0 kills", {
      fontFamily: "Arial", fontSize: "14px", color: "#f48c06",
    }).setOrigin(1, 0);

    // ── Zone Timer ────────────────────────────────────────────────────────────
    this.zoneText = this.add.text(width / 2, 14, "ZONE CLOSES IN 30s", {
      fontFamily: "Arial", fontSize: "14px", color: "#4488ff", letterSpacing: 1,
    }).setOrigin(0.5, 0);

    // ── Zone Damage Warning ───────────────────────────────────────────────────
    this.zoneDmgText = this.add.text(width / 2, height / 2 - 60, "⚠ OUTSIDE ZONE — TAKING DAMAGE", {
      fontFamily: "'Rajdhani', Arial", fontSize: "20px", fontStyle: "bold", color: "#ff4444",
      stroke: "#000000", strokeThickness: 4,
    }).setOrigin(0.5).setVisible(false);

    // ── Reload Indicator ─────────────────────────────────────────────────────
    this.reloadText = this.add.text(width / 2, height - 100, "RELOADING...", {
      fontFamily: "'Rajdhani', Arial", fontSize: "20px", fontStyle: "bold", color: "#f48c06",
      stroke: "#000000", strokeThickness: 3,
    }).setOrigin(0.5).setVisible(false);

    // ── Pickup Hint ───────────────────────────────────────────────────────────
    this.pickupHintText = this.add.text(width / 2, height - 130, "Walk over weapon to pick up", {
      fontFamily: "Arial", fontSize: "14px", color: "#aaffaa",
      stroke: "#000000", strokeThickness: 3,
    }).setOrigin(0.5).setVisible(false);

    // ── Minimap ───────────────────────────────────────────────────────────────
    this.minimap = this.add.graphics();

    // ── Blood Overlay (flash when hit) ───────────────────────────────────────
    this.bloodOverlay = this.add.graphics();
    this.bloodOverlay.setDepth(100);
    this.bloodOverlay.setAlpha(0);

    // Scale event
    this.scale.on("resize", this.onResize, this);
  }

  private onResize(gameSize: Phaser.Structs.Size) {
    const { width, height } = gameSize;
    this.aliveText.setPosition(width - 16, 16);
    this.killText.setPosition(width - 16, 42);
    this.zoneText.setPosition(width / 2, 14);
    this.zoneDmgText.setPosition(width / 2, height / 2 - 60);
    this.weaponText.setPosition(width - 16, height - 78);
    this.ammoText.setPosition(width - 16, height - 50);
    this.reloadText.setPosition(width / 2, height - 100);
    this.pickupHintText.setPosition(width / 2, height - 130);
    this.healthText.setPosition(16, height - 44);
  }

  update() {
    const reg = this.registry;
    const { width, height } = this.scale;

    const health: number = reg.get("health") ?? 100;
    const maxHealth: number = reg.get("maxHealth") ?? 100;
    const weaponName: string = reg.get("weaponName") ?? "PISTOL";
    const ammo: number = reg.get("ammo") ?? 12;
    const reserves: number = reg.get("reserves") ?? 60;
    const alive: number = reg.get("alive") ?? 20;
    const kills: number = reg.get("kills") ?? 0;
    const zoneTimer: number = reg.get("zoneTimer") ?? 30;
    const zoneShrinking: boolean = reg.get("zoneShrinking") ?? false;
    const inZone: boolean = reg.get("inZone") ?? true;
    const isReloading: boolean = reg.get("isReloading") ?? false;
    const nearWeapon: boolean = reg.get("nearWeapon") ?? false;

    // ── Health bar ────────────────────────────────────────────────────────────
    this.healthBar.clear();
    const barW = 220;
    const barH = 14;
    const barX = 16;
    const barY = height - 58;
    this.healthBar.fillStyle(0x222222, 0.9);
    this.healthBar.fillRoundedRect(barX, barY, barW, barH, 4);
    const ratio = Math.max(0, health / maxHealth);
    const barColor = ratio > 0.6 ? 0x22c55e : ratio > 0.3 ? 0xf59e0b : 0xef4444;
    this.healthBar.fillStyle(barColor, 1);
    this.healthBar.fillRoundedRect(barX, barY, barW * ratio, barH, 4);
    this.healthText.setText(`${Math.ceil(health)}`);

    // Blood flash if taking damage
    if (health < this.lastHealth) {
      this.bloodOverlay.clear();
      this.bloodOverlay.fillStyle(0xff0000, 0.35);
      this.bloodOverlay.fillRect(0, 0, width, height);
      this.tweens.add({
        targets: this.bloodOverlay,
        alpha: { from: 1, to: 0 },
        duration: 500,
        ease: "Quad.easeOut",
      });
    }
    this.lastHealth = health;

    // ── Weapon / Ammo ─────────────────────────────────────────────────────────
    this.weaponText.setText(weaponName.toUpperCase());
    this.ammoText.setText(`${ammo} / ${reserves}`);
    this.ammoText.setColor(ammo === 0 ? "#ff4444" : "#ffffff");

    // ── Alive / Kills ─────────────────────────────────────────────────────────
    this.aliveText.setText(`👥 ${alive} alive`);
    this.killText.setText(`⚔ ${kills} kill${kills !== 1 ? "s" : ""}`);

    // ── Zone ──────────────────────────────────────────────────────────────────
    const timerSec = Math.ceil(zoneTimer);
    if (zoneShrinking) {
      this.zoneText.setText(`🔵 ZONE SHRINKING`).setColor("#ff6644");
    } else {
      this.zoneText.setText(`🔵 ZONE CLOSES IN ${timerSec}s`).setColor("#4488ff");
    }

    // ── Zone damage warning ───────────────────────────────────────────────────
    this.zoneDmgText.setVisible(!inZone);
    if (!inZone) {
      this.zoneDmgText.setAlpha(0.7 + Math.sin(Date.now() / 200) * 0.3);
    }

    // ── Reload / Pickup ───────────────────────────────────────────────────────
    this.reloadText.setVisible(isReloading);
    this.pickupHintText.setVisible(nearWeapon && !isReloading);

    // ── Minimap ───────────────────────────────────────────────────────────────
    const mmX = 16;
    const mmY = height - 270;
    const botPositions: Array<{ x: number; y: number; dead: boolean }> = reg.get("botPositions") ?? [];
    const playerPos: { x: number; y: number } = reg.get("playerPos") ?? { x: MAP_SIZE / 2, y: MAP_SIZE / 2 };
    const zoneCenter: { x: number; y: number } = reg.get("zoneCenter") ?? { x: MAP_SIZE / 2, y: MAP_SIZE / 2 };
    const zoneRadius: number = reg.get("zoneRadius") ?? 1900;

    this.minimap.clear();
    // Background
    this.minimap.fillStyle(0x0a1a0a, 0.85);
    this.minimap.fillRect(mmX, mmY, MINIMAP_SIZE, MINIMAP_SIZE);
    this.minimap.lineStyle(1, 0x334433, 1);
    this.minimap.strokeRect(mmX, mmY, MINIMAP_SIZE, MINIMAP_SIZE);

    // Zone circle
    const zoneMapX = mmX + zoneCenter.x * MINIMAP_SCALE;
    const zoneMapY = mmY + zoneCenter.y * MINIMAP_SCALE;
    const zoneMapR = zoneRadius * MINIMAP_SCALE;
    this.minimap.lineStyle(1.5, 0x4488ff, 0.9);
    this.minimap.strokeCircle(zoneMapX, zoneMapY, zoneMapR);

    // Bots
    for (const bot of botPositions) {
      if (bot.dead) continue;
      const bx = mmX + bot.x * MINIMAP_SCALE;
      const by = mmY + bot.y * MINIMAP_SCALE;
      this.minimap.fillStyle(0xee3333, 1);
      this.minimap.fillCircle(bx, by, 2.5);
    }

    // Player
    const px = mmX + playerPos.x * MINIMAP_SCALE;
    const py = mmY + playerPos.y * MINIMAP_SCALE;
    this.minimap.fillStyle(0xffffff, 1);
    this.minimap.fillCircle(px, py, 3.5);
    this.minimap.lineStyle(1, 0xe85d04, 1);
    this.minimap.strokeCircle(px, py, 3.5);
  }
}
