import React from "react";
import { CSSTransition } from "react-transition-group";
import { getHistory } from "@next-core/runtime";
import {
  useDesktopDirContext,
  DirWithCoordinates,
} from "../DesktopDirContext.js";
import { DesktopCell } from "../DesktopCell/DesktopCell.js";
import { useLaunchpadSettingsContext } from "../LaunchpadSettingsContext.js";
import styles from "./DesktopDirContent.module.css";
import { MicroApp } from "@next-core/types";

interface DesktopDirContentProps extends DirWithCoordinates {
  arrowWidthPercent: number;
}

export function DesktopDirContent(
  props: DesktopDirContentProps
): React.ReactElement {
  const { columns, rows } = useLaunchpadSettingsContext();
  const { setDesktopDir } = useDesktopDirContext();
  const [entering, setEntering] = React.useState(false);
  const [appCursor, setAppCursor] = React.useState(props.activeIndex);

  const items = props.dir.items.slice(0, columns * rows);
  // 展开的文件夹容器的大小即 DOM 容器的大小，以其中心为基准，变换至鼠标点击的位置，
  // 以模拟出一种从鼠标点击处展开的动画效果。
  const translateX =
    props.coordinates.x - document.documentElement.clientWidth / 2;
  const translateY =
    props.coordinates.y - document.documentElement.clientHeight / 2;

  React.useEffect(() => {
    const onKeydown = (event: KeyboardEvent): void => {
      event.stopPropagation();
      event.preventDefault();
      const key =
        event.key ||
        /* istanbul ignore next: compatibility */ event.keyCode ||
        /* istanbul ignore next: compatibility */ event.which;
      if (key === "Escape" || key === 27) {
        setDesktopDir?.(undefined);
      } else if (key === "Enter" || key === 13) {
        if (appCursor >= 0 && appCursor < items.length) {
          const item = items[appCursor];
          if (item.type === "app") {
            getHistory().push((item.app as MicroApp).homepage);
          } else {
            window.open(item.url);
          }
        }
      } else {
        let offset = 0;
        if (key === "ArrowRight" || key === 39) {
          offset = 1;
        } else if (key === "ArrowLeft" || key === 37) {
          offset = appCursor === -1 ? items.length : -1;
        } else if (key === "ArrowDown" || key === 40) {
          offset = appCursor === -1 ? 1 : columns;
        } else if (key === "ArrowUp" || key === 38) {
          offset = appCursor === -1 ? items.length : -columns;
        }
        if (offset !== 0) {
          const next = appCursor + offset;
          if (next >= 0 && next < items.length) {
            setAppCursor(next);
          }
        }
      }
    };
    document.addEventListener("keydown", onKeydown);
    return () => {
      document.removeEventListener("keydown", onKeydown);
    };
  }, [props.dir, appCursor, columns, rows, setDesktopDir]);

  const handleCloseDir = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setDesktopDir?.(undefined);
  };

  const handleEntering = (): void => {
    setEntering(true);
  };

  const rowsInDir = Math.ceil(items.length / columns);

  return (
    <CSSTransition
      in={true}
      timeout={150}
      appear={true}
      classNames="no-rules-class-name"
      onEntering={handleEntering}
    >
      <div
        className={styles.dirContainer}
        onClick={handleCloseDir}
        style={{
          padding: `0 ${props.arrowWidthPercent}% 36px`,
          transform: entering
            ? "none"
            : `translate(${translateX}px,${translateY}px) scale(0.01)`,
        }}
      >
        <div className={styles.dirName}>{props.dir.name}</div>
        <div
          className={styles.dirContent}
          style={{
            height: `${((rowsInDir + 0.2) * 100) / (rows + 1)}%`,
            gridTemplateColumns: `repeat(${columns},1fr)`,
            gridTemplateRows: `repeat(${rowsInDir},1fr)`,
          }}
        >
          {items.map((item, index) => (
            <DesktopCell
              key={item.id}
              item={item}
              active={appCursor === index}
            />
          ))}
        </div>
      </div>
    </CSSTransition>
  );
}
