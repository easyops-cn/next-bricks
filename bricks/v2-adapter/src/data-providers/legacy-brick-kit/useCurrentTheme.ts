import { getCurrentTheme } from "@next-core/runtime";
import type { SiteTheme } from "@next-core/types";
import { getLegacyReact } from "../dll.js";

export function useCurrentTheme(): SiteTheme {
  const LegacyReact = getLegacyReact();
  const [currentTheme, setCurrentTheme] = LegacyReact.useState(getCurrentTheme);

  LegacyReact.useEffect(() => {
    const listenToThemeChange = (event: Event): void => {
      setCurrentTheme((event as CustomEvent<SiteTheme>).detail);
    };
    window.addEventListener("theme.change", listenToThemeChange);
    return () => {
      window.removeEventListener("theme.change", listenToThemeChange);
    };
  }, []);

  return currentTheme;
}
