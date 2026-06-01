import Phaser from "phaser";

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "MenuScene" });
  }

  create() {
    const { width, height } = this.scale;
    const cx = width / 2;
    const cy = height / 2;

    // Background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0a1a0a, 0x0a1a0a, 0x051005, 0x051005, 1);
    bg.fillRect(0, 0, width, height);

    // Decorative grid lines
    const grid = this.add.graphics();
    grid.lineStyle(1, 0x1a2a1a, 0.5);
    for (let x = 0; x < width; x += 60) {
      grid.lineBetween(x, 0, x, height);
    }
    for (let y = 0; y < height; y += 60) {
      grid.lineBetween(0, y, width, y);
    }

    // Title "MISSION MATES"
    this.add.text(cx, cy - 160, "MISSION MATES", {
      fontFamily: "'Rajdhani', 'Barlow', Arial",
      fontSize: "72px",
      fontStyle: "bold",
      color: "#e85d04",
      stroke: "#000000",
      strokeThickness: 6,
      shadow: { offsetX: 0, offsetY: 0, color: "#e85d04", blur: 30, fill: true },
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(cx, cy - 90, "BATTLE ROYALE", {
      fontFamily: "'Rajdhani', 'Barlow', Arial",
      fontSize: "28px",
      fontStyle: "bold",
      color: "#f48c06",
      letterSpacing: 12,
    }).setOrigin(0.5);

    // Divider
    const divider = this.add.graphics();
    divider.lineStyle(2, 0xe85d04, 0.8);
    divider.lineBetween(cx - 200, cy - 55, cx + 200, cy - 55);

    // Stats row
    const stats = [
      { icon: "👥", label: "20 PLAYERS" },
      { icon: "⚔️", label: "4 WEAPONS" },
      { icon: "🔵", label: "SHRINKING ZONE" },
    ];
    stats.forEach((s, i) => {
      const x = cx + (i - 1) * 200;
      this.add.text(x, cy - 10, s.icon, { fontSize: "28px" }).setOrigin(0.5);
      this.add.text(x, cy + 24, s.label, {
        fontFamily: "Arial",
        fontSize: "13px",
        color: "#aaaaaa",
        letterSpacing: 2,
      }).setOrigin(0.5);
    });

    // Play button
    const btnBg = this.add.graphics();
    const btnX = cx - 120;
    const btnY = cy + 80;
    const btnW = 240;
    const btnH = 56;

    btnBg.fillStyle(0xe85d04, 1);
    btnBg.fillRoundedRect(btnX, btnY, btnW, btnH, 6);

    const playBtn = this.add.text(cx, cy + 108, "▶  PLAY NOW", {
      fontFamily: "'Rajdhani', 'Barlow', Arial",
      fontSize: "22px",
      fontStyle: "bold",
      color: "#ffffff",
      letterSpacing: 3,
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    // Button hover
    playBtn.on("pointerover", () => {
      btnBg.clear();
      btnBg.fillStyle(0xff7a1a, 1);
      btnBg.fillRoundedRect(btnX, btnY, btnW, btnH, 6);
      playBtn.setScale(1.04);
    });
    playBtn.on("pointerout", () => {
      btnBg.clear();
      btnBg.fillStyle(0xe85d04, 1);
      btnBg.fillRoundedRect(btnX, btnY, btnW, btnH, 6);
      playBtn.setScale(1);
    });
    playBtn.on("pointerdown", () => {
      this.cameras.main.fadeOut(400, 0, 0, 0);
      this.cameras.main.once("camerafadeoutcomplete", () => {
        this.scene.start("GameScene");
      });
    });

    // Controls help
    const controlLines = [
      "LEFT CLICK — Shoot    |    RIGHT CLICK (hold) — Move    |    Mouse — Aim",
      "WASD — Move (keyboard)    |    Walk over weapons to pick up    |    R — Reload",
    ];
    controlLines.forEach((line, i) => {
      this.add.text(cx, cy + 175 + i * 22, line, {
        fontFamily: "Arial",
        fontSize: "13px",
        color: "#667788",
      }).setOrigin(0.5);
    });

    // Pulse animation on title
    this.tweens.add({
      targets: this.children.list[4], // title text
      alpha: { from: 1, to: 0.85 },
      yoyo: true,
      repeat: -1,
      duration: 1800,
      ease: "Sine.easeInOut",
    });
  }
}
