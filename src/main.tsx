import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Suppress Phaser AudioContext unhandled rejections that Vite HMR triggers
// when destroying/recreating the game during development. Not a real bug.
window.addEventListener("unhandledrejection", (e) => {
  const msg: string = e.reason?.message ?? "";
  if (msg.includes("AudioContext")) {
    e.preventDefault();
  }
});

createRoot(document.getElementById("root")!).render(<App />);
