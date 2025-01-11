import React, { useEffect, useState } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import { unwrapProvider } from "@next-core/utils/general";
import "@next-core/theme";
import { getHistory, getRuntime } from "@next-core/runtime";
import type { lockBodyScroll as _lockBodyScroll } from "@next-bricks/basic/data-providers/lock-body-scroll/lock-body-scroll";
import hotkeys from "hotkeys-js";
import classNames from "classnames";
import LaunchpadSvg from "../images/launchpad.svg";
import styleText from "./styles.shadow.css";
import platformCategoryStyleText from "./PlatformCategory.shadow.css";
import { Launchpad } from "./Launchpad";
import {
  deferredFavorites,
  deferredLaunchpadInfo,
  deferredPlatformCategories,
} from "./useLaunchpadInfo";
import launchpadStyleText from "./Launchpad.shadow.css";
import "./host-context.css";

const { defineElement } = createDecorators();

const lockBodyScroll = unwrapProvider<typeof _lockBodyScroll>(
  "basic.lock-body-scroll"
);

/**
 * 构件 `eo-launchpad-button-v2`
 * @insider
 */
export
@defineElement("eo-launchpad-button-v2", {
  styleTexts: [styleText, platformCategoryStyleText, launchpadStyleText],
})
class EoLaunchpadButtonV2 extends ReactNextElement {
  disconnectedCallback(): void {
    super.disconnectedCallback();
    lockBodyScroll(this, false);
  }

  render() {
    return <EoLaunchpadButtonV2Component host={this} />;
  }
}

export function EoLaunchpadButtonV2Component({ host }: { host: HTMLElement }) {
  const [initialized, setInitialized] = useState(false);
  const [active, setActive] = useState(false);
  const toggleLaunchpad = (): void => {
    setActive((previous) => !previous);
  };

  useEffect(() => {
    // 当切换页面时，关闭 Launchpad。
    const unlisten = getHistory().listen(() => {
      setActive(false);
    });
    return unlisten;
  }, []);

  useEffect(() => {
    // 打开一次 launchpad 后，保留 DOM。
    if (active && !initialized) {
      setInitialized(true);
    }
  }, [active, initialized]);

  // istanbul ignore next
  useEffect(() => {
    hotkeys.filter = function () {
      return true;
    };

    // 快捷打开/关闭 Launchpad
    hotkeys("alt+l", (event) => {
      event.preventDefault();
      setActive((previous) => !previous);
    });

    // 按 Esc 关闭 Launchpad
    hotkeys("esc", () => {
      setActive(false);
    });

    return () => {
      hotkeys.unbind("alt+l");
      hotkeys.unbind("esc");
    };
  }, []);

  useEffect(() => {
    lockBodyScroll(host, active);
  }, [active, host]);

  useEffect(() => {
    deferredLaunchpadInfo.schedulePrefetch();
    deferredFavorites.schedulePrefetch();
    getRuntime()?.getFeatureFlags()["launchpad-show-platform-category"] &&
      deferredPlatformCategories.schedulePrefetch();
  }, []);

  return (
    <>
      <a
        role="button"
        className={classNames("launchpad-button", { active })}
        onClick={toggleLaunchpad}
      >
        <LaunchpadSvg />
      </a>
      <div
        className={classNames("mask", { active })}
        onClick={toggleLaunchpad}
      ></div>
      {initialized && <Launchpad active={active} />}
    </>
  );
}
