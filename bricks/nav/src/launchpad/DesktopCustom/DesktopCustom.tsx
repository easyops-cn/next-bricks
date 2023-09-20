import React from "react";
import classNames from "classnames";
import styles from "./DesktopCustom.module.css";
import defaultAppIcon from "../../images/default-app-icon.png";
import type { Link, LinkProps } from "@next-bricks/basic/link";
import { wrapBrick } from "@next-core/react-element";
import { GeneralIcon, GeneralIconProps } from "@next-bricks/icons/general-icon";

const WrappedLink = wrapBrick<Link, LinkProps>("eo-link");
const WrappedGeneralIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");

interface DesktopCustomProps {
  name: string;
  url: string;
  isFavorite?: boolean;
  showAddIcon?: boolean;
  onAddClick: () => void;
  onClick?: () => void;
  size?: string;
  responsive?: boolean;
}

export function DesktopCustom({
  name,
  url,
  showAddIcon,
  isFavorite,
  onClick,
  onAddClick,
  size,
  responsive = true,
}: DesktopCustomProps): React.ReactElement {
  const handleItemClick = (e: React.MouseEvent): void => {
    e.stopPropagation();
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
          styles.circle,
          styles[size as string],
          {
            [styles.responsive]: responsive,
          }
        )}
        href={url}
        target="_blank"
        onClick={handleItemClick}
      >
        <img className={styles.appIcon} src={defaultAppIcon} />
        {showAddIcon && isFavorite && (
          <WrappedGeneralIcon
            className={classNames(styles.addIcon, styles.circleIcon)}
            icon="plus-circle-filled"
            lib="antd"
            theme="outlined"
            onClick={handleAddIconClick}
          />
        )}
      </WrappedLink>
      <span className={styles.appName}>{name}</span>
    </>
  );
}
