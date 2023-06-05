import React, { useCallback, useEffect, useState } from "react";
import { getRuntime, getHistory } from "@next-core/runtime";
import LaunchpadSvg from "../../images/launchpad.svg";
import { LaunchpadPortal } from "../LaunchpadPortal/LaunchpadPortal.js";
import hotkeys from "hotkeys-js";
import { launchpadService } from "../LaunchpadService.js";
import "../../i18n/index.js";

export function LaunchpadButton(): React.ReactElement {
  const [visible, setVisible] = useState(false);
  const openLaunchpad = (): void => {
    setVisible(true);
  };

  const handleLaunchpadClose = (): void => {
    setVisible(false);
  };
  const handleLaunchpadWillClose = useCallback((): void => {
    getRuntime().toggleLaunchpadEffect(false);
  }, []);

  useEffect(() => {
    const unlisten = getHistory().listen(() => {
      // 当切换页面时，关闭 Launchpad。
      handleLaunchpadWillClose();
      setVisible(false);
    });
    return unlisten;
  }, [handleLaunchpadWillClose]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    hotkeys.filter = function () {
      return true;
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    hotkeys("alt+l", (event) => {
      event.preventDefault();
      setVisible((preVisble) => {
        const curVisble = !preVisble;
        if (!curVisble) handleLaunchpadWillClose();
        return curVisble;
      });
    });

    return () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      hotkeys.unbind("alt+l");
    };
  }, [handleLaunchpadWillClose]);

  useEffect(() => {
    // 当打开/关闭 Launchpad 时，切换背景模糊，切换悬浮展开模式；
    getRuntime().toggleLaunchpadEffect(visible);
  }, [visible]);

  useEffect(() => {
    launchpadService.preFetchLaunchpadInfo();
  }, []);

  return (
    <>
      <a role="button" className="launchpadLink" onClick={openLaunchpad}>
        <LaunchpadSvg />
      </a>
      <LaunchpadPortal
        visible={visible}
        onWillClose={handleLaunchpadWillClose}
        onClose={handleLaunchpadClose}
      />
    </>
  );
}
