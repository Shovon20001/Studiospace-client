"use client";
import { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

// Challenge 3: full-system light/dark theme, persisted in localStorage
export default function ThemeToggle() {
  const [theme, setTheme] = useState("studiolight");

  useEffect(() => {
    setTheme(document.documentElement.getAttribute("data-theme") || "studiolight");
  }, []);

  const flip = () => {
    const next = theme === "studiodark" ? "studiolight" : "studiodark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("ss-theme", next); } catch {}
    setTheme(next);
  };

  return (
    <button onClick={flip} className="btn btn-ghost btn-circle btn-sm" aria-label={theme === "studiodark" ? "Switch to light theme" : "Switch to dark theme"}>
      {theme === "studiodark" ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
    </button>
  );
}
