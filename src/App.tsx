import { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import { gameConfig } from "./game/config";

const TIPS = [
  { key: "RIGHT-CLICK + HOLD",      val: "Move your character toward the mouse cursor" },
  { key: "LEFT-CLICK",              val: "Shoot in the direction of the mouse" },
  { key: "Walk over glowing items", val: "Automatically picks up better weapons" },
  { key: "Blue ring = SAFE ZONE",   val: "Outside it, you take damage — run back in!" },
  { key: "20 players start",        val: "Outlast everyone to win 🏆" },
];

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const [tutorialDone, setTutorialDone] = useState(false);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      ...gameConfig,
      parent: containerRef.current,
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;

    const tryFocus = () => {
      const canvas = containerRef.current?.querySelector("canvas");
      if (canvas) {
        canvas.setAttribute("tabindex", "0");
        canvas.style.outline = "none";
      }
    };

    const poll = setInterval(() => {
      const canvas = containerRef.current?.querySelector("canvas");
      if (canvas) { clearInterval(poll); tryFocus(); }
    }, 100);

    return () => {
      clearInterval(poll);
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  // Auto-close countdown
  useEffect(() => {
    if (tutorialDone) return;
    if (countdown <= 0) { dismiss(); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, tutorialDone]);

  const dismiss = () => {
    setTutorialDone(true);
    // focus canvas so keyboard + mouse events work immediately
    const canvas = containerRef.current?.querySelector("canvas") as HTMLCanvasElement | null;
    if (canvas) canvas.focus();
  };

  return (
    <div
      ref={containerRef}
      style={{ width: "100vw", height: "100vh", overflow: "hidden", background: "#0a0c0f", cursor: "crosshair" }}
    >
      {!tutorialDone && (
        <div
          onClick={dismiss}
          style={{
            position: "absolute", inset: 0, zIndex: 9999,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,0.55)",
            cursor: "pointer",
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "#080a0d",
              border: "2.5px solid #e85d04",
              borderRadius: 14,
              padding: "28px 36px 20px",
              width: 520,
              maxWidth: "92vw",
              boxShadow: "0 8px 48px rgba(0,0,0,0.8)",
              fontFamily: "Arial, sans-serif",
            }}
          >
            <div style={{
              textAlign: "center", fontSize: 26, fontWeight: "bold",
              color: "#e85d04", letterSpacing: 3, marginBottom: 20,
              fontFamily: "'Rajdhani', Arial, sans-serif",
            }}>
              HOW TO PLAY &nbsp;🎮
            </div>

            {TIPS.map((t, i) => (
              <div key={i} style={{
                background: i % 2 === 0 ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.3)",
                borderRadius: 6, padding: "8px 14px", marginBottom: 6,
              }}>
                <div style={{ color: "#ffffff", fontSize: 14, fontWeight: "bold" }}>▸ {t.key}</div>
                <div style={{ color: "#aaaaaa", fontSize: 12, marginTop: 2 }}>{t.val}</div>
              </div>
            ))}

            <button
              onClick={dismiss}
              style={{
                display: "block", width: "100%", marginTop: 18,
                padding: "11px 0", background: "#e85d04", border: "none",
                borderRadius: 8, color: "#fff", fontSize: 16, fontWeight: "bold",
                fontFamily: "'Rajdhani', Arial, sans-serif", letterSpacing: 1,
                cursor: "pointer",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#ff7a1a")}
              onMouseLeave={e => (e.currentTarget.style.background = "#e85d04")}
            >
              ▶&nbsp; GOT IT, LET'S GO!
            </button>

            <div style={{ textAlign: "center", color: "#444", fontSize: 11, marginTop: 8 }}>
              auto-closes in {countdown}s
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
