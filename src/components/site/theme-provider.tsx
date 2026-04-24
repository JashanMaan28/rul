"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "rul-theme";
const DEFAULT_THEME: Theme = "dark";

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: Theme;
  setTheme: (t: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStoredTheme(): Theme {
  if (typeof window === "undefined") return DEFAULT_THEME;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : DEFAULT_THEME;
}

function applyTheme(theme: Theme, disableTransition: boolean) {
  const root = document.documentElement;
  let cleanup: (() => void) | null = null;
  if (disableTransition) {
    const style = document.createElement("style");
    style.appendChild(
      document.createTextNode(
        "*,*::before,*::after{transition:none!important;animation-duration:0s!important}",
      ),
    );
    document.head.appendChild(style);
    cleanup = () => {
      // Force reflow so the no-transition rule applies before we remove it.
      window.getComputedStyle(root).getPropertyValue("opacity");
      document.head.removeChild(style);
    };
  }
  root.setAttribute("data-theme", theme);
  cleanup?.();
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(DEFAULT_THEME);
  const didMount = useRef(false);

  useEffect(() => {
    const initial = readStoredTheme();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- post-hydration sync of localStorage-stored theme into React state
    setThemeState(initial);
    applyTheme(initial, false);
    didMount.current = true;
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next, true);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme: theme, setTheme }),
    [theme, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    // Allow pre-mount reads (e.g. SSR) to fall back gracefully.
    return {
      theme: DEFAULT_THEME,
      resolvedTheme: DEFAULT_THEME,
      setTheme: () => undefined,
    };
  }
  return ctx;
}

/**
 * Inline script that sets `data-theme` before first paint to prevent a flash
 * on hard navigation. Rendered in the server-side <head> of the root layout,
 * so it runs before React hydration.
 */
export function ThemeScript() {
  const js = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}');if(t!=='light'&&t!=='dark'){t='${DEFAULT_THEME}';}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','${DEFAULT_THEME}');}})();`;
  return <script dangerouslySetInnerHTML={{ __html: js }} />;
}
