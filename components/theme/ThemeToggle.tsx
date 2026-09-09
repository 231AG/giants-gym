"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "giants:theme";

type Theme = "light" | "dark";

function getTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export default function ThemeToggle({ mobile = false }: { mobile?: boolean }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    setTheme(getTheme());
  }, []);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
    setTheme(nextTheme);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      className={mobile ? "flex w-full items-center justify-between border-t border-rule py-5 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-ash" : "flex items-center gap-3 py-2 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-ash transition-colors hover:text-bone"}
    >
      <span>{theme === "light" ? "LIGHT MODE" : "DARK MODE"}</span>
      <span aria-hidden className="border border-rule px-2 py-1 text-[0.6rem] text-volt">
        {theme === "light" ? "ON" : "OFF"}
      </span>
    </button>
  );
}

export { STORAGE_KEY };
