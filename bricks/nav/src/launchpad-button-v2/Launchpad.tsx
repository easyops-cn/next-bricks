import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import classNames from "classnames";
import { WrappedIcon, WrappedLink } from "./wrapped-bricks";
import { useLaunchpadInfo } from "./useLaunchpadInfo.js";
import { MenuGroup, SidebarMenuItem } from "./MenuGroup.js";
import { LaunchpadsContext } from "./LaunchpadContext.js";
import { PlatformCategoryItem, SidebarMenuItemData } from "./interfaces";
import {
  PlatformItem,
  PlatformCategorySidebarMenuItem,
} from "./PlatformCategory";
import { getRuntime } from "@next-core/runtime";

export function Launchpad({ active }: { active?: boolean }) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const handleClickSearchBox = useCallback(() => {
    searchInputRef.current?.focus();
  }, []);
  const [platform, setPlatform] = useState("#all");

  const showPlatformCategory = React.useMemo(
    () => getRuntime()?.getFeatureFlags()["launchpad-show-platform-category"],
    []
  );

  const showScenarioCenter = React.useMemo(
    () => getRuntime()?.getFeatureFlags()["launchpad-show-scenario-center"],
    []
  );

  const showSolutionCenter = React.useMemo(
    () => getRuntime()?.getFeatureFlags()["launchpad-show-solution-center"],
    []
  );

  const {
    loading,
    q,
    setQ,
    menuGroups,
    favorites,
    loadingFavorites,
    recentVisits,
    pushRecentVisit,
    toggleStar,
    isStarred,
    platformCategories,
  } = useLaunchpadInfo(active);
  const searching = !!q;

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQ(e.target.value);
    },
    [setQ]
  );

  const clearSearch = useCallback(() => {
    setQ("");
  }, [setQ]);

  useEffect(() => {
    if (active) {
      searchInputRef.current?.focus();
    }
  }, [active]);

  const handlePlatformCategoryClick = useCallback(
    (item: PlatformCategoryItem) => {
      setPlatform(item.id);
    },
    []
  );

  const curCategory = useMemo(() => {
    return platformCategories.find((v) => v.id === platform);
  }, [platform, platformCategories]);

  return (
    <div className={classNames("launchpad", { active })}>
      <LaunchpadsContext.Provider
        value={{
          searching,
          loadingFavorites,
          pushRecentVisit,
          toggleStar,
          isStarred,
        }}
      >
        <div className="sidebar">
          <div className="union">
            <div className="quick-nav">
              <div className="quick-nav-label">快捷访问</div>
              {/* <Loading loading={loading || loadingFavorites} /> */}
              <ul className="sidebar-menu quick-nav-menu">
                {favorites.map((item, index) => (
                  <SidebarMenuItem
                    key={index}
                    item={item as SidebarMenuItemData}
                  />
                ))}
              </ul>
            </div>

            {showPlatformCategory && (
              <div className="platform-nav">
                <div className="platform-nav-label">平台</div>
                <ul className="sidebar-menu platform-nav-menu">
                  {platformCategories.map((item, index) => (
                    <PlatformCategorySidebarMenuItem
                      key={index}
                      onClick={handlePlatformCategoryClick}
                      item={item}
                      active={platform === item.id}
                    />
                  ))}
                </ul>
              </div>
            )}
          </div>
          {showScenarioCenter && (
            <div className="scenario-nav">
              <WrappedLink type="plain" url={"/portal/scenario"}>
                <div className="scenario-nav-label">场景中心</div>
                <WrappedIcon lib="antd" icon="right" theme="outlined" />
              </WrappedLink>
            </div>
          )}

          {showSolutionCenter && (
            <div className="solution-nav">
              <WrappedLink type="plain" url={"/portal/solution"}>
                <div className="solution-nav-label">解决方案</div>
                <WrappedIcon lib="antd" icon="right" theme="outlined" />
              </WrappedLink>
            </div>
          )}
        </div>
        <div className={classNames("content", { loading })}>
          <Loading loading={loading} />
          {platform !== "#all" && (
            <div className="platform-category-name">{curCategory?.name}</div>
          )}
          <div className="search-box" onClick={handleClickSearchBox}>
            <WrappedIcon
              lib="fa"
              icon="magnifying-glass"
              className="search-icon"
            />
            <input
              ref={searchInputRef}
              placeholder="通过关键字搜索"
              value={q}
              onChange={handleSearch}
              className="search-input"
            />
            <WrappedIcon
              lib="antd"
              theme="filled"
              icon="close-circle"
              className={classNames("search-clear", { searching })}
              onClick={clearSearch}
            />
          </div>
          {platform === "#all" && (
            <div className={classNames({ empty: recentVisits.length === 0 })}>
              <div className="recent-visits-label">最近访问</div>
              <ul className="recent-visits">
                {recentVisits.map((item, index) => (
                  <li key={index}>
                    <WrappedLink
                      onClick={() => pushRecentVisit(item)}
                      {...(item.type === "app"
                        ? {
                            url: item.url,
                          }
                        : {
                            href: item.url,
                            target: "_blank",
                          })}
                    >
                      <span>{item.name}</span>
                    </WrappedLink>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {platform === "#all" && (
            <ul className="menu-groups">
              {menuGroups.map((group) => (
                <MenuGroup
                  key={group.name}
                  name={group.name}
                  items={group.items}
                />
              ))}
            </ul>
          )}
          {platform !== "#all" && (
            <ul
              className={classNames("platform-items", {
                empty: curCategory?.items.length === 0,
              })}
            >
              {curCategory?.items.map((item, index) => (
                <PlatformItem item={item} key={index} />
              ))}
            </ul>
          )}
        </div>
      </LaunchpadsContext.Provider>
    </div>
  );
}

function Loading({ loading }: { loading: boolean }) {
  return (
    loading && (
      <div className="spinner">
        <WrappedIcon lib="fa" icon="spinner" spinning />
      </div>
    )
  );
}
