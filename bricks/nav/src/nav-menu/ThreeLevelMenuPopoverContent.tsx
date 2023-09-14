import React, { useMemo, useState, useRef } from "react";
import classnames from "classnames";
import { renderLinkCom } from "./utils.js";
import { uniq } from "lodash";
import type {
  SidebarMenuGroup,
  SidebarMenuItem,
  SidebarMenuSimpleItem,
} from "@next-shared/general/types";
import { wrapBrick } from "@next-core/react-element";
import type { ReactNextElement } from "@next-core/react-element";
import type { Popover, PopoverProps } from "@next-bricks/basic/popover";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import { JsonStorage } from "@next-shared/general/JsonStorage";
import { K, NS, locales } from "./i18n.js";
import { useTranslation, initializeReactI18n } from "@next-core/i18n/react";

initializeReactI18n(NS, locales);
const WrappedPopover = wrapBrick<Popover, PopoverProps>("eo-popover");
interface SearchProps {
  value?: string;
  placeholder?: string;
  autoFocus?: boolean;
  clearable?: boolean;
  trim?: boolean;
  debounceTime?: number;
}

interface SearchEvents {
  change: CustomEvent<string>;
  search: CustomEvent<string>;
}

interface SearchEventsMap {
  onChange: "change";
  onSearch: "search";
}
const WrappedSearch = wrapBrick<
  ReactNextElement,
  SearchProps,
  SearchEvents,
  SearchEventsMap
>("eo-search", {
  onChange: "change",
  onSearch: "search",
});

const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");

interface ThreeLevelMenuPopoverContentProps {
  menuItem: SidebarMenuGroup;
  selectedKey: string[];
}
const LOCAL_STORAGE_PREFIX = "threeLevelCategoryMenu";
const maxVisitorLength = 6;
export function ThreeLevelMenuPopoverContent(
  props: ThreeLevelMenuPopoverContentProps
): React.ReactElement {
  const { t } = useTranslation(NS);
  const { menuItem, selectedKey } = props;
  const items = menuItem.items as SidebarMenuGroup[];
  const [searchResult, setSearchResult] = useState<SidebarMenuSimpleItem[]>([]);
  const [searchKey, setSearchKey] = useState("");
  const triggerRef = useRef<HTMLDivElement>(null);
  const nameSpace = `${LOCAL_STORAGE_PREFIX}_${menuItem.title}`;
  const storage = useMemo(() => new JsonStorage(localStorage), []);
  const searchHistory = (storage.getItem(nameSpace) as string[]) || [];

  const handleSearch = (e: CustomEvent<string>) => {
    setSearchKey(e.detail);
    if (e.detail) {
      const list = uniq([e.detail, ...searchHistory]);
      if (list.length > maxVisitorLength) {
        list.pop();
      }
      storage.setItem(nameSpace, list);
      setSearchResult(
        items
          .flatMap((i) => (i.items as SidebarMenuSimpleItem[]) || [])
          .filter((i) =>
            (i.text as string)
              .toLowerCase()
              .includes((e.detail as string).trim().toLowerCase())
          )
      );
    } else {
      setSearchResult([]);
    }
  };

  const popoverTriggerClick = () => {
    triggerRef.current?.click();
  };

  return (
    <div className={"three-level-menu-container"}>
      <div
        className="three-level-menu-search-container"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <WrappedSearch
          placeholder={t(K.SEARCH_BY_MENU_NAME) as string}
          onSearch={handleSearch}
          onFocus={popoverTriggerClick}
          onBlur={popoverTriggerClick}
        />
        <WrappedPopover
          trigger="click"
          placement={"bottom-start"}
          anchorDisplay="block"
          distance={0}
        >
          <div slot="anchor" ref={triggerRef}></div>
          {
            <div className="three-level-menu-search-result">
              {!!searchResult.length &&
                searchResult.map((i) => renderLinkCom(i, { width: "100%" }))}
              {searchKey && !searchResult.length && (
                <div
                  style={{
                    height: "100px",
                    textAlign: "center",
                    lineHeight: "100px",
                  }}
                >
                  {t(K.NO_DATA)}
                </div>
              )}
            </div>
          }
        </WrappedPopover>
      </div>
      {!!searchHistory.length && (
        <div className="three-level-menu-search-history-container">
          <div className="three-level-menu-search-history-title">
            {t(K.SEARCH_HISTORY)}
            <WrappedIcon
              lib="antd"
              theme="outlined"
              icon="delete"
              className="three-level-menu-search-history-icon"
            />
          </div>
          <div>
            {searchHistory.map((h) => (
              <span key={h} className="three-level-menu-search-history-text">
                {h}
              </span>
            ))}
          </div>
        </div>
      )}
      <div
        className={"three-level-menu-item-container"}
        style={{
          gridTemplateColumns: `repeat(${
            items.length > 4 ? 4 : items.length
          },1fr)`,
        }}
      >
        {items.map((item: SidebarMenuGroup, index: number) => (
          <div key={index}>
            <div className="three-level-menu-item-title-container">
              <span className="three-level-menu-item-title-icon"></span>
              <span className="three-level-menu-item-title">{item.title}</span>
            </div>
            {item.items?.map((i) => (
              <span
                key={i.key}
                className={classnames({
                  active: i.key ? selectedKey.includes(i.key) : false,
                })}
              >
                {renderLinkCom(i as SidebarMenuSimpleItem, { width: "100%" })}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
