import { createProviderClass } from "@next-core/utils/general";
import type { SiteTheme } from "@next-core/types";
import { batchSetAppsLocalTheme } from "@next-core/runtime";

interface ThemeByApps {
  [appId: string]: SiteTheme;
}

export function setThemeByApps(themeByApps: ThemeByApps): void {
  batchSetAppsLocalTheme(themeByApps);
}

customElements.define(
  "basic.set-theme-by-apps",
  createProviderClass(setThemeByApps)
);
