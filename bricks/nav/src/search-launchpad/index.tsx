import React, { useCallback, useRef, useState } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import classNames from "classnames";
import { LaunchpadsContext } from "../launchpad-button-v2/LaunchpadContext";
import { useLaunchpadInfo } from "../launchpad-button-v2/useLaunchpadInfo";
import { MenuGroup } from "../launchpad-button-v2/MenuGroup";
import { GeneralIcon, GeneralIconProps } from "@next-bricks/icons/general-icon";
import "./host-context.css";

export const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");

const { defineElement } = createDecorators();

/**
 * launchpad 搜索
 * @insider
 */
export
@defineElement("eo-search-launchpad", {
  styleTexts: [styleText],
})
class EoSearchLaunchpad extends ReactNextElement {
  render() {
    return <EoSearchLaunchpadComponent />;
  }
}

export function EoSearchLaunchpadComponent() {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const handleClickSearchBox = useCallback(() => {
    searchInputRef.current?.focus();
  }, []);

  const [active, setActive] = useState(false);

  const {
    loading,
    q,
    setQ,
    menuGroups,
    loadingFavorites,
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

  return (
    <LaunchpadsContext.Provider
      value={{
        searching,
        loadingFavorites,
        pushRecentVisit,
        toggleStar,
        isStarred,
      }}
    >
      <div className="container">
        <div className="search-box" onClick={handleClickSearchBox}>
          <WrappedIcon
            lib="fa"
            icon="magnifying-glass"
            className="search-icon"
          />
          <input
            ref={searchInputRef}
            placeholder="搜索产品/微应用"
            value={q}
            onChange={handleSearch}
            className="search-input"
            onFocus={() => setActive(true)}
            onBlur={() => setActive(false)}
          />
          <WrappedIcon
            lib="antd"
            theme="filled"
            icon="close-circle"
            className={classNames("search-clear", { searching })}
            onClick={clearSearch}
            onMouseDown={(e) => e.preventDefault()}
          />
        </div>
        <div
          className={classNames("dropdown", { "dropdown-active": active })}
          onMouseDown={(e) => e.preventDefault()}
        >
          <div className={classNames("dropdown-content", { loading })}>
            <Loading loading={loading} />
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
        </div>
      </div>
    </LaunchpadsContext.Provider>
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
