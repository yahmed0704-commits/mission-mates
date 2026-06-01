import { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import { gameConfig } from "./game/config";

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      ...gameConfig,
      parent: containerRef.current,
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;

    // Give the canvas tabIndex so it can receive keyboard focus
    const tryFocus = () => {
      const canvas = containerRef.current?.querySelector("canvas");
      if (canvas) {
        canvas.setAttribute("tabindex", "0");
        canvas.style.outline = "none";
        canvas.focus();
        setFocused(true);
      }
    };

    // Poll briefly until canvas is ready, then focus
    const poll = setInterval(() => {
      const canvas = containerRef.current?.querySelector("canvas");
      if (canvas) {
        clearInterval(poll);
        tryFocus();
      }
    }, 100);

    return () => {
      clearInterval(poll);
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  const handleClick = () => {
    const canvas = containerRef.current?.querySelector("canvas");
    if (canvas) {
      canvas.focus();
      setFocused(true);
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      style={{ width: "100vw", height: "100vh", overflow: "hidden", background: "#0a0c0f", cursor: "crosshair" }}
    >
      {!focused && (
        <div style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center",
          justifyContent: "center", zIndex: 999, pointerEvents: "none",
        }}>
          <div style={{
            background: "rgba(0,0,0,0.7)", border: "2px solid #e85d04",
            borderRadius: 8, padding: "12px 28px", color: "#e85d04",
            fontFamily: "Arial", fontSize: 16, fontWeight: "bold", letterSpacing: 2,
          }}>
            CLICK TO FOCUS
          </div>
        </div>
      )}
    </div>
  );
}
