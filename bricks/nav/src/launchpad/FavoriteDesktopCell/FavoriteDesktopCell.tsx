import React, { useMemo } from "react";
import classNames from "classnames";
import styles from "./FavoriteDesktopCell.module.css";
import { LaunchpadApi_ListCollectionResponseItem } from "@next-api-sdk/user-service-sdk";
import { launchpadService } from "../LaunchpadService.js";
import { WrappedGeneralIcon, WrappedLink } from "../common/wrapBrick.js";
import { omit } from "lodash";
import type { GeneralIconProps } from "@next-bricks/icons/general-icon";

interface FavoriteDesktopCellProps {
  item: LaunchpadApi_ListCollectionResponseItem;
  onDelete?: (item: LaunchpadApi_ListCollectionResponseItem) => void;
}

export function FavoriteDesktopCell({
  item,
}: FavoriteDesktopCellProps): React.ReactElement {
  const disabled = useMemo(
    () =>
      item.launchpadCollection?.type === "microApp"
        ? !item.microAppId
        : (item.launchpadCollection as any)?.type === "customItem"
        ? !(item as any)?.customItemId
        : false,
    [item]
  );

  const setAsVisitor = () => {
    if (item.launchpadCollection?.type === "link") return;
    launchpadService.setFavoriteAsVisitor(item);
  };
  const handleCellClick = (e: React.MouseEvent) => {
    if (disabled) {
      e.preventDefault();
      return;
    }

    setAsVisitor();

    if (
      (item.launchpadCollection?.link?.startsWith("https://") ||
        item.launchpadCollection?.link?.startsWith("http://")) &&
      !item.launchpadCollection?.link?.startsWith(document.baseURI)
    ) {
      e.preventDefault();
      window.open(item.launchpadCollection.link, "_blank");
    }
  };

  const realLink = useMemo(() => {
    const link = item.launchpadCollection?.link;
    if (item.launchpadCollection?.type === "microApp") return link;
    const baseUrl = document.baseURI;
    if (link?.startsWith(baseUrl)) return link?.replace(baseUrl, "/");
    return item.launchpadCollection?.link;
  }, [item]);

  return (
    <div>
      <div
        className={classNames(styles.cellWrapper, {
          [styles.disabled]: disabled,
        })}
      >
        <WrappedLink
          className={styles.link}
          url={realLink}
          onClick={handleCellClick}
        >
          <>
            <span className={classNames(styles.appLink, styles.square)}>
              <WrappedGeneralIcon
                {...((omit(item?.launchpadCollection?.icon, [
                  "prefix",
                  "type",
                ]) ?? {}) as GeneralIconProps)}
                style={{ fontSize: 18 }}
              />
            </span>
            <span className={styles.name}>
              {item?.launchpadCollection?.name}
            </span>
          </>
        </WrappedLink>
      </div>
    </div>
  );
}
