import React from "react";
import classNames from "classnames";
import styles from "./DesktopCell.module.css";
import { DesktopApp } from "../DesktopApp/DesktopApp.js";
import { DesktopDir } from "../DesktopDir/DesktopDir.js";
import { DesktopCustom } from "../DesktopCustom/DesktopCustom.js";
import { launchpadService } from "../LaunchpadService.js";
import { Dialog } from "@next-core/runtime";
import {
  DesktopItem,
  DesktopItemApp,
  DesktopItemCustom,
} from "../interfaces.js";
import { MicroApp } from "@next-core/types";

interface DesktopCellProps {
  item: DesktopItem;
  active?: boolean;
  showAddIcon?: boolean;
  position?: "left" | "center" | "right";
  onSetAsFavorite?: () => void;
  isFavorite?: boolean;
  size?: string;
}

export function DesktopCell(props: DesktopCellProps): React.ReactElement {
  const checkFavoriteUpperLimit = () => {
    const favoriteLength = launchpadService.getFavoritesLength();
    if (favoriteLength >= 25) {
      Dialog.show({
        title: "收藏数量已达上限",
        content: "当前收藏链接数量已达上限（25个），请删除部分链接后再添加。",
        contentStyle: {
          zIndex: 5001,
        },
      });

      return false;
    }
    return true;
  };

  const addItemToFavorite = async () => {
    if (checkFavoriteUpperLimit()) {
      let params: any;
      if (props.item.type === "app") {
        const app = props.item as Partial<DesktopItemApp>;
        params = {
          microAppId: app.id,
          launchpadCollection: {
            type: "microApp",
            name: (app.app as MicroApp).name,
          },
        };
      } else {
        const custom = props.item as DesktopItemCustom;
        params = {
          customItemId: custom.id,
          launchpadCollection: {
            type: "customItem",
            name: custom.name,
          },
        };
      }
      try {
        await launchpadService.setAsFavorite(params);
        props?.onSetAsFavorite?.();
      } catch (e) {
        // Noting to cache
      }
    }
  };

  const handleAppClick = () => {
    const app = (props.item as DesktopItemApp).app;
    launchpadService.pushVisitor("app", app as MicroApp);
  };

  const handleCustomClick = () => {
    const custom = props.item as DesktopItemCustom;
    launchpadService.pushVisitor("custom", custom);
  };

  return (
    <div
      className={classNames(styles.cellWrapper, {
        [styles.positionLeft]: props?.position === "left",
      })}
    >
      <div
        className={classNames(styles.cellItem, styles[props.size as string], {
          [styles.active]: props.active,
        })}
      >
        {props.item.type === "app" ? (
          <DesktopApp
            showAddIcon={props.showAddIcon}
            isFavorite={props.isFavorite}
            app={props.item.app as MicroApp}
            onClick={handleAppClick}
            onAddClick={addItemToFavorite}
            size={props.size}
          />
        ) : props.item.type === "custom" ? (
          <DesktopCustom
            showAddIcon={props.showAddIcon}
            isFavorite={props.isFavorite}
            name={props.item.name}
            url={props.item.url}
            onClick={handleCustomClick}
            onAddClick={addItemToFavorite}
            size={props.size}
          />
        ) : (
          <DesktopDir
            name={props.item.name}
            items={props.item.items}
            size={props.size}
          />
        )}
      </div>
    </div>
  );
}
