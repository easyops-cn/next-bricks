import { createProviderClass } from "@next-core/utils/general";
import "./body-scroll.css";
const locks = new Set();

function getScrollbarWidth() {
  const documentWidth = document.documentElement.clientWidth;
  return Math.abs(window.innerWidth - documentWidth);
}

export function lockBodyScroll(curElement: HTMLElement, lock: boolean): void {
  if (lock) {
    locks.add(curElement);
    // istanbul ignore else
    if (!document.body.classList.contains("disable-scroll")) {
      const scrollbarWidth = getScrollbarWidth();
      document.body.classList.add("disable-scroll");
      document.body.style.setProperty(
        "--body-scroll-lock-size",
        `${scrollbarWidth}px`
      );
    }
  } else {
    locks.delete(curElement);
    // istanbul ignore else
    if (locks.size === 0) {
      document.body.classList.remove("disable-scroll");
      document.body.style.removeProperty("--body-scroll-lock-size");
    }
  }
}

customElements.define(
  "basic.lock-body-scroll",
  createProviderClass(lockBodyScroll)
);
