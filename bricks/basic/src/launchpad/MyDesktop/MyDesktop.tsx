import React, { createRef, useEffect, useMemo, useRef, useState } from "react";
import { wrapBrick } from "@next-core/react-element";
import { DesktopCell } from "../DesktopCell/DesktopCell.js";
import styles from "./MyDesktop.module.css";
import { FavoriteDesktopCell } from "../FavoriteDesktopCell/FavoriteDesktopCell.js";
import classNames from "classnames";
import { launchpadService } from "../LaunchpadService.js";
// import { Spin } from "antd";
import { isEmpty } from "lodash";
import { SiteMap } from "../site-map/SiteMap.js";
import { Link, LinkProps } from "../../link/index.js";
import { GeneralIcon, GeneralIconProps } from "@next-bricks/icons/general-icon";

const WrappedLink = wrapBrick<Link, LinkProps>("basic.general-link");
const WrappedGeneralIcon = wrapBrick<GeneralIcon, GeneralIconProps>(
  "icons.general-icon"
);

interface MyDesktopProps {
  desktopCount: number;
  arrowWidthPercent: number;
}

enum ModeType {
  Favorities = "favorities",
  Sitemap = "sitemap",
}

let remberMode = ModeType.Sitemap;

export function MyDesktop(props: MyDesktopProps, ref: any): React.ReactElement {
  const [recentlyVisitedList] = useState(launchpadService.getAllVisitors());
  const [favoriteList, setFavoriteList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [firstRendered, setFirstRendered] = useState(true);
  const [mode, setMode] = useState<ModeType>(remberMode);
  const siteMapRef = createRef<HTMLDivElement>();
  const deskContainerRef = useRef<HTMLDivElement>(null);
  const [siteMapHeight, setSiteMapHeight] = useState<number>();

  const getFavoriteList = async () => {
    setIsLoading(true);
    const favoriteList = await launchpadService.fetchFavoriteList();
    setIsLoading(false);
    setFavoriteList(favoriteList as any);
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

  const handleOnSetAsFavorite = async () => {
    await getFavoriteList();
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

  useEffect(() => {
    !isLoading && firstRendered && setFirstRendered(false);
  }, [isLoading, firstRendered]);

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
        {firstRendered && isLoading && (
          // TODO:fix
          // <Spin
          //   indicator={antIcon}
          //   spinning={isLoading}
          //   delay={500}
          //   className={styles.spin}
          // />
          <WrappedGeneralIcon
            className={styles.spin}
            lib="antd"
            icon="loading"
            theme="outlined"
            style={{ fontSize: "2.5rem" }}
          />
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
  }, [favoriteList, isLoading, firstRendered]);

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
      // eslint-disable-next-line react/no-unknown-property
      test-id="my-destop"
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
