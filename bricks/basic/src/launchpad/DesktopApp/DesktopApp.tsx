import React from "react";
import classNames from "classnames";
import { wrapBrick } from "@next-core/react-element";
import { MicroApp } from "@next-core/types";
import styles from "./DesktopApp.module.css";
import defaultAppIcon from "../../images/default-app-icon.png";
import { getImageUrl } from "../utils/getImageUrl.js";
import type { Link, LinkProps } from "../../link/index.jsx";
import { GeneralIcon, GeneralIconProps } from "@next-bricks/icons/general-icon";

const WrappedLink = wrapBrick<Link, LinkProps>("basic.general-link");
const WrappedGeneralIcon = wrapBrick<GeneralIcon, GeneralIconProps>(
  "icons.general-icon"
);

interface DesktopAppProps {
  app: MicroApp;
  isFavorite?: boolean;
  showAddIcon?: boolean;
  onAddClick?: () => void;
  onClick?: () => void;
  size?: string;
}

export function DesktopApp({
  app,
  onAddClick,
  onClick,
  isFavorite,
  showAddIcon,
  size,
}: DesktopAppProps): React.ReactElement {
  const installing = app.installStatus === "running";

  const handleAppClick = (e: React.MouseEvent): void => {
    e.stopPropagation();
    if (installing) {
      e.preventDefault();
    }
    onClick?.();
  };

  const handleAddIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onAddClick?.();
  };

  return (
    <>
      <WrappedLink
        className={classNames(
          styles.appLink,
          styles[size as string],
          app.iconBackground === "circle" ? styles.circle : styles.square,
          {
            [styles.installing]: installing,
          }
        )}
        url={app.homepage}
        onClick={handleAppClick}
      >
        <img
          className={styles.appIcon}
          src={getImageUrl(app, defaultAppIcon)}
        />

        {showAddIcon && isFavorite && (
          <WrappedGeneralIcon
            className={classNames(
              styles.addIcon,
              app.iconBackground === "circle"
                ? styles.circleIcon
                : styles.squareIcon
            )}
            icon="plus"
            lib="antd"
            theme="outlined"
            onClick={handleAddIconClick}
          />
        )}
      </WrappedLink>
      <span className={styles.appName}>
        {installing && (
          <WrappedGeneralIcon
            style={{ paddingRight: 5 }}
            icon="loading-3-quarters"
            lib="antd"
            theme="outlined"
          />
        )}
        {app.localeName}
      </span>
    </>
  );
}
