import React, { useCallback, useEffect, useRef } from "react";
import classNames from "classnames";
import { WrappedIcon, WrappedLink } from "./wrapped-bricks";
import { useLaunchpadInfo } from "./useLaunchpadInfo.js";
import { MenuGroup, SidebarMenuItem } from "./MenuGroup.js";
import { LaunchpadsContext } from "./LaunchpadContext.js";
import { SidebarMenuItemData } from "./interfaces";

export function Launchpad({ active }: { active?: boolean }) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const handleClickSearchBox = useCallback(() => {
    searchInputRef.current?.focus();
  }, []);

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
          <div className="quick-nav">
            <div className="quick-nav-label">快捷访问</div>
            {/* <Loading loading={loading || loadingFavorites} /> */}
            <ul className="sidebar-menu">
              {favorites.map((item, index) => (
                <SidebarMenuItem
                  key={index}
                  item={item as SidebarMenuItemData}
                />
              ))}
            </ul>
          </div>
        </div>
        <div className={classNames("content", { loading })}>
          <Loading loading={loading} />
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
          <ul className="menu-groups">
            {menuGroups.map((group) => (
              <MenuGroup
                key={group.name}
                name={group.name}
                items={group.items}
              />
            ))}
          </ul>
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
