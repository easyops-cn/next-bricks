import React, { useMemo, useState } from "react";
import type {
  SidebarMenuGroup,
  SidebarMenuSimpleItem,
} from "@next-shared/general/types";
import { wrapBrick } from "@next-core/react-element";
import { QuickVisitItem, RecommendItem } from "./ItemTag.js";
import { GroupView } from "./GroupItem.js";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import { K, NS } from "../i18n.js";
import { useTranslation } from "@next-core/i18n/react";
import { collectService } from "./CollectService.js";
import { flatMenuItems } from "./processor.js";
import classNames from "classnames";

const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");

export interface InputEvents {
  change: CustomEvent<string>;
}

export interface InputEventsMap {
  onValueChange: "change";
}

const WrappedInput = wrapBrick<any, any, InputEvents, InputEventsMap>(
  "eo-input",
  {
    onValueChange: "change",
  },
);

interface SiteMapItemProps {
  menuGroup: SidebarMenuGroup;
  selectedKey?: string[];
}

export function SiteMapItem(props: SiteMapItemProps) {
  const { t } = useTranslation(NS);
  const { menuGroup } = props;
  const groupId = menuGroup.groupId as string;

  const [favoriteList, setFavoriteList] = useState(
    collectService.getFavoritesById(groupId),
  );
  const flatItems = useMemo(() => flatMenuItems(menuGroup), [menuGroup]);
  const [q, setQ] = useState<string>();
  const [filter, setFilters] = useState<SidebarMenuSimpleItem[]>([]);

  const handleFavorite = (collectList: SidebarMenuSimpleItem[]) => {
    setFavoriteList(collectList);
  };

  const handleSearch = (e: CustomEvent<string>): void => {
    const v = e.detail;
    setQ(e.detail);

    setFilters(
      !v
        ? flatItems
        : flatItems.filter((item) =>
            item.text.toLowerCase().includes(e.detail.toLowerCase()),
          ),
    );
  };

  return (
    <div className="site-map">
      <WrappedInput
        className="search-input"
        style={{ width: "100%" }}
        onValueChange={handleSearch}
        placeholder={t(K.SEARCH_ITEM_PLACEHOLDER)}
      >
        <WrappedIcon slot="prefix" lib="antd" icon="search" />
      </WrappedInput>

      {!q && (
        <div>
          <div
            className={classNames("visit-access", {
              hasData: favoriteList.length,
            })}
          >
            <span className="title">{t(K.QUICK_ACCESS)}</span>
            {favoriteList.length !== 0 && (
              <div className="tag-wrapper">
                {favoriteList.map((item) => (
                  <QuickVisitItem
                    onFavorite={handleFavorite}
                    groupId={groupId}
                    key={item.key}
                    data={item}
                  />
                ))}
              </div>
            )}

            {favoriteList.length === 0 && (
              <div className="no-data-tips">
                {t(K.NO_DATA_TIPS_IN_QUICK_ACCESS)}
              </div>
            )}
          </div>

          <GroupView
            groupId={groupId}
            groups={menuGroup.items as SidebarMenuGroup[]}
            onFavorite={handleFavorite}
          />
        </div>
      )}

      {q && (
        <div className="search-panel">
          <span className="title">{t(K.SITE_MAP_SEARCH_RECOMMEND)}</span>
          {filter.length ? (
            <div className="recommend-wrapper">
              {filter.map((item) => (
                <RecommendItem
                  key={item.key}
                  groupId={groupId}
                  data={item}
                  onFavorite={handleFavorite}
                  active={collectService.isCollected(groupId, item)}
                />
              ))}
            </div>
          ) : (
            <div className="no-data-tips">{t(K.NO_DATA_SEARCH_INFO)}</div>
          )}
        </div>
      )}
    </div>
  );
}
