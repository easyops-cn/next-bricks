// istanbul ignore file
import "@shoelace-style/shoelace/dist/themes/light.css";
import "@shoelace-style/shoelace/dist/themes/dark.css";
import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js";
import "./common.css";


setBasePath(process.env.NODE_ENV === "test" ? "" : __webpack_public_path__);

type SiteTheme = "light" | "dark" | "dark-v2";

function syncTheme(theme: SiteTheme) {
  document.documentElement.classList[theme === "dark" || theme === "dark-v2" ? "add" : "remove"](
    "sl-theme-dark"
  );
}

syncTheme(document.documentElement.dataset.theme as SiteTheme);

window.addEventListener("theme.change", (event) => {
  syncTheme((event as CustomEvent<SiteTheme>).detail);
});
