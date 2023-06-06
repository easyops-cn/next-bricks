import React from "react";
import { DesktopCell } from "../DesktopCell/DesktopCell.js";
import { useLaunchpadSettingsContext } from "../LaunchpadSettingsContext.js";
import styles from "./Desktop.module.css";
import { DesktopData } from "../interfaces.js";

interface DesktopProps {
  desktop: DesktopData;
  desktopCount: number;
  arrowWidthPercent: number;
  activeIndex: number;
}

export function Desktop(props: DesktopProps): React.ReactElement {
  const { columns, rows } = useLaunchpadSettingsContext();

  return (
    <div
      className={styles.desktop}
      style={{
        padding: `0 ${props.arrowWidthPercent / props.desktopCount}%`,
        gridTemplateColumns: `repeat(${columns},1fr)`,
        gridTemplateRows: `repeat(${rows},1fr)`,
      }}
    >
      {props.desktop.items.map((item, index) => (
        <DesktopCell
          key={index}
          item={item}
          active={index === props.activeIndex}
        />
      ))}
    </div>
  );
}
