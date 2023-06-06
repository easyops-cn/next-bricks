import React from "react";
import { wrapBrick } from "@next-core/react-element";
import { CSSTransition } from "react-transition-group";
import { handleHttpError } from "@next-core/runtime";
import { MicroApp } from "@next-core/types";
import { SearchBar } from "../SearchBar/SearchBar.js";
import { DesktopSlider } from "../DesktopSlider/DesktopSlider.js";
import { DesktopDirContext, DirWithCoordinates } from "../DesktopDirContext.js";
import { LaunchpadSettingsContext } from "../LaunchpadSettingsContext.js";
import { DesktopDirContent } from "../DesktopDirContent/DesktopDirContent.js";
import { launchpadService } from "../LaunchpadService.js";
import { GeneralIcon, GeneralIconProps } from "@next-bricks/icons/general-icon";
import styles from "./Launchpad.module.css";

const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>(
  "icons.general-icon"
);

export interface LaunchpadProps {
  onWillClose?: () => void;
}

export function Launchpad(props: LaunchpadProps): React.ReactElement {
  const { settings, desktops } = launchpadService.getBaseInfo();

  const getFilterMicroApps = (): MicroApp[] =>
    // 过滤掉状态为开发中的小产品
    launchpadService
      .getBaseInfo()
      .microApps // 兼容较老版本接口未返回 `status` 的情况。
      .filter(
        (item) =>
          item &&
          (!item.status ||
            item.status === "enabled" ||
            item.status === "developing")
      );

  const [q, setQ] = React.useState("");
  const [microApps, setMicroApps] = React.useState(getFilterMicroApps());
  const [desktopDir, setDesktopDir] = React.useState<DirWithCoordinates>();
  const [loading, setLoading] = React.useState<boolean>(
    launchpadService.isFetching
  );

  React.useEffect((): (() => void) => {
    let fetchLaunchpadTimer: NodeJS.Timer;

    const startFetchLaunchpadInfo = async (): Promise<void> => {
      const updateState = (): void => {
        clearInterval(fetchLaunchpadTimer);
        setLoading(false);
        setMicroApps(getFilterMicroApps());
      };
      try {
        const hadFetch = await launchpadService.fetchLaunchpadInfo();
        if (hadFetch) {
          updateState();
        } else {
          setLoading(true);
          fetchLaunchpadTimer = setInterval(() => {
            if (!launchpadService.isFetching) {
              updateState();
            }
          }, 300);
        }
      } catch (error) {
        props.onWillClose?.();
        handleHttpError(error);
      }
    };
    if (window.STANDALONE_MICRO_APPS) {
      startFetchLaunchpadInfo();
    } else {
      launchpadService.init();
    }

    return (): void => {
      clearInterval(fetchLaunchpadTimer);
    };
  }, []);

  React.useEffect(() => {
    const onKeydown = (event: KeyboardEvent): void => {
      const key =
        event.key ||
        /* istanbul ignore next: compatibility */ event.keyCode ||
        /* istanbul ignore next: compatibility */ event.which;
      if (key === "Escape" || key === 27) {
        props.onWillClose?.();
      }
    };
    window.addEventListener("keydown", onKeydown);
    return () => {
      window.removeEventListener("keydown", onKeydown);
    };
  }, [props.onWillClose]);

  const handleChange = (value: string): void => {
    setQ(value);
  };

  const arrowWidthPercent = 9;

  return (
    <LaunchpadSettingsContext.Provider value={settings}>
      <DesktopDirContext.Provider
        value={{
          desktopDir,
          setDesktopDir,
        }}
      >
        <div className={styles.launchpad} onClick={props.onWillClose}>
          {loading ? (
            <div className={styles.loadingWrapper}>
              <WrappedIcon
                icon="loading"
                lib="antd"
                theme="outlined"
                color="cyan"
                style={{
                  fontSize: 58,
                }}
              />
            </div>
          ) : (
            <>
              <CSSTransition
                in={!desktopDir}
                timeout={100}
                classNames={{
                  enter: styles.fadeEnter,
                  enterActive: styles.fadeEnterActive,
                  exit: styles.fadeExit,
                  exitActive: styles.fadeExitActive,
                  exitDone: styles.fadeExitDone,
                }}
              >
                <div className={styles.launchpadContainer}>
                  <SearchBar onChange={handleChange} />
                  <DesktopSlider
                    q={q}
                    microApps={microApps}
                    desktops={desktops}
                    arrowWidthPercent={arrowWidthPercent}
                  />
                </div>
              </CSSTransition>
              {desktopDir && (
                <DesktopDirContent
                  {...desktopDir}
                  arrowWidthPercent={arrowWidthPercent}
                />
              )}
            </>
          )}
        </div>
      </DesktopDirContext.Provider>
    </LaunchpadSettingsContext.Provider>
  );
}
