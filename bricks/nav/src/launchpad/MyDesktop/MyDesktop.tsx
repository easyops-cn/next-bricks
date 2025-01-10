import React, { createRef, useEffect, useMemo, useRef, useState } from "react";
import { wrapBrick } from "@next-core/react-element";
import type { Link, LinkProps } from "@next-bricks/basic/link";
import { GeneralIcon, GeneralIconProps } from "@next-bricks/icons/general-icon";
import type { LaunchpadApi_ListCollectionResponseItem } from "@next-api-sdk/user-service-sdk";
import classNames from "classnames";
import { isEmpty } from "lodash";
import { DesktopCell } from "../DesktopCell/DesktopCell.js";
import styles from "./MyDesktop.module.css";
import { FavoriteDesktopCell } from "../FavoriteDesktopCell/FavoriteDesktopCell.js";
import { launchpadService } from "../LaunchpadService.js";
import { SiteMap } from "../site-map/SiteMap.js";

const WrappedLink = wrapBrick<Link, LinkProps>("eo-link");
const WrappedGeneralIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");

interface MyDesktopProps {
  desktopCount: number;
  arrowWidthPercent: number;
}

enum ModeType {
  Favorities = "favorities",
  Sitemap = "sitemap",
}

let remberMode = ModeType.Sitemap;

export function MyDesktop(props: MyDesktopProps): React.ReactElement {
  const [recentlyVisitedList] = useState(launchpadService.getAllVisitors());
  const [favoriteList, setFavoriteList] = useState<
    LaunchpadApi_ListCollectionResponseItem[]
  >([]);
  const [isLoading, setIsLoading] = useState(!launchpadService.favoritesLoaded);
  // const [firstRendered, setFirstRendered] = useState(true);
  const [mode, setMode] = useState<ModeType>(remberMode);
  const siteMapRef = createRef<HTMLDivElement>();
  const deskContainerRef = useRef<HTMLDivElement>(null);
  const [siteMapHeight, setSiteMapHeight] = useState<number>();

  const getFavoriteList = async (eager?: boolean): Promise<void> => {
    const favoriteList = await launchpadService.fetchFavoriteList(eager);
    setIsLoading(false);
    setFavoriteList(favoriteList);
  };

  const handleMode = (e: React.MouseEvent, mode: ModeType): void => {
    e.stopPropagation();
    remberMode = mode;
    setMode(mode);
  };
  useEffect(() => {
    (async () => {
      getFavoriteList();
    })();
  }, []);

  const handleOnSetAsFavorite = (): void => {
    getFavoriteList(true);
  };

  const handleSiteMapLoad = () => {
    const siteMap = siteMapRef.current;
    const deskContainer = deskContainerRef.current;
    if (siteMap && deskContainer) {
      // wait for launchpad open
      Promise.resolve().then(() => {
        const siteMapDom = siteMap.getBoundingClientRect();
        const deskContainerDom = deskContainer.getBoundingClientRect();
        const siteMapHeight = deskContainerDom.bottom - siteMapDom.top;

        setSiteMapHeight(siteMapHeight);
      });
    }
  };

  const renderRecentlyVisited = useMemo(() => {
    return (
      <div className={styles.visited}>
        <div className={styles.title}>最近访问</div>
        <div className={styles.desktop}>
          {recentlyVisitedList?.map((item, index) => (
            <DesktopCell
              size="small"
              key={index}
              item={item}
              showAddIcon={true}
              isFavorite={!launchpadService.isFavorite(item)}
              onSetAsFavorite={handleOnSetAsFavorite}
            />
          ))}
        </div>
      </div>
    );
  }, [recentlyVisitedList, isLoading]);

  const renderMyFavorites = useMemo(() => {
    return (
      <div className={classNames([styles.section, styles.favorites])}>
        {isLoading && (
          <div className={styles.spin}>
            <WrappedGeneralIcon
              lib="antd"
              icon="loading"
              theme="outlined"
              style={{ fontSize: "2.5rem" }}
              spinning
            />
          </div>
        )}
        {!isEmpty(favoriteList) ? (
          <div className={styles.favoriteContainer}>
            {favoriteList?.map((item, index) => (
              <FavoriteDesktopCell key={index} item={item} />
            ))}
          </div>
        ) : (
          !isLoading && (
            <div className={styles.emptyTips}>
              把常用的页面链接加入收藏夹，方便快速访问 ~{" "}
              <WrappedLink
                url="/launchpad-collection"
                style={{ marginLeft: 30 }}
              >
                管理我的收藏
              </WrappedLink>
            </div>
          )
        )}
      </div>
    );
  }, [favoriteList, isLoading]);

  const renderSiteMap = useMemo(() => {
    const categoryList = launchpadService
      .getSitemapList()
      ?.filter((item) => item.apps?.length > 0);

    return (
      <SiteMap
        ref={siteMapRef}
        categoryList={categoryList}
        containerStyle={{
          height: siteMapHeight,
          overflow: "auto",
        }}
        onLoad={handleSiteMapLoad}
      />
    );
  }, [siteMapHeight]);

  return (
    <div
      ref={deskContainerRef}
      style={{
        flex: 1,
        padding: `0 ${
          props.desktopCount ? props.arrowWidthPercent / props.desktopCount : 10
        }%`,
      }}
    >
      {!!recentlyVisitedList?.length && renderRecentlyVisited}
      <div className={styles.modeWrapper}>
        <div className={styles.header}>
          {mode === ModeType.Favorities ? (
            <div className={styles.title}>
              {" "}
              我的收藏
              <WrappedGeneralIcon
                className={styles.modeIcon}
                icon="launchpad-sitmap"
                lib="easyops"
                category="app"
                onClick={(e) => handleMode(e, ModeType.Sitemap)}
              />
            </div>
          ) : (
            <div className={styles.title}>
              系统地图
              <WrappedGeneralIcon
                className={styles.modeIcon}
                icon="launchpad-collection"
                lib="easyops"
                category="app"
                onClick={(e) => handleMode(e, ModeType.Favorities)}
              />
            </div>
          )}
          {mode === ModeType.Favorities && (
            <div className={styles.settingsContainer}>
              <WrappedLink url={"/launchpad-collection"}>
                <WrappedGeneralIcon
                  className={styles.settings}
                  icon="launchpad-setting"
                  lib="easyops"
                  category="app"
                />
                管理收藏
              </WrappedLink>
            </div>
          )}
        </div>

        {mode === ModeType.Favorities ? renderMyFavorites : renderSiteMap}
      </div>
    </div>
  );
}
