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
import { DragContext } from "./constants.js";
import { useTranslation } from "@next-core/i18n/react";
import { collectService } from "./CollectService.js";
import { flatMenuItems } from "./processor.js";
import { DRAG_DIRECTION } from "./constants.js";
import classNames from "classnames";
import { throttle } from "lodash";

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

export function findDropElement(element: HTMLElement): HTMLElement | undefined {
  let node = element;

  while (node) {
    if (node.draggable || node.className === "indicate-wrapper") {
      return node;
    }

    node = node.parentElement as HTMLElement;
  }
}

export function isValidDragAction(
  dragElement: HTMLElement,
  dropElement: HTMLElement,
): boolean {
  return (
    dragElement &&
    dropElement &&
    !(
      dragElement.dataset.to === dropElement.dataset.to &&
      dragElement.dataset.text === dropElement.dataset.text
    )
  );
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
  const [dragElement, setDragElement] = useState<HTMLElement>();
  const [overElement, setOverElement] = useState<HTMLElement>();
  const [allowDrag, setAllowDrag] = useState<boolean>();
  const [direction, setDirection] = useState<DRAG_DIRECTION>();

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

  const handleDragStart = (e: React.DragEvent): void => {
    setDragElement(e.target as HTMLElement);
  };

  const handleDragOver = useMemo(
    () =>
      throttle((e: React.DragEvent): void => {
        e.preventDefault();

        const dropElement = findDropElement(e.target as HTMLElement);
        setOverElement(dropElement);

        if (
          dropElement &&
          isValidDragAction(dropElement, dragElement as HTMLElement)
        ) {
          if (dropElement.className === "indicate-wrapper") {
            setDirection(dropElement.dataset.direction as DRAG_DIRECTION);
          } else {
            const { width, left } = dropElement.getBoundingClientRect();

            const right = e.clientX > left + width / 2;
            setDirection(right ? DRAG_DIRECTION.Right : DRAG_DIRECTION.Left);
          }
        } else {
          setDirection(undefined);
        }
      }),
    [dragElement],
  );

  const handleDragEnd = (): void => {
    setDragElement(undefined);
    setDirection(undefined);
    setAllowDrag(false);
  };

  const handleAllowDrag = (enable: boolean): void => {
    setAllowDrag(enable);
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
              <DragContext.Provider
                value={{
                  groupId,
                  overElement,
                  direction,
                  allowDrag,
                  onDragStart: handleDragStart,
                  onDragOver: handleDragOver,
                  onDragEnd: handleDragEnd,
                  onAllowDrag: handleAllowDrag,
                  onFavoriteUpdate: handleFavorite,
                }}
              >
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
              </DragContext.Provider>
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
