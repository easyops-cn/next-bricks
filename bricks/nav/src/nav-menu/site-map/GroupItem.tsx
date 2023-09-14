import React, { useEffect, useState } from "react";
import type {
  SidebarMenuSimpleItem,
  SidebarMenuGroup,
} from "@next-shared/general/types";
import { wrapBrick } from "@next-core/react-element";
import { StarIcon, OnFavoriteCallback } from "./ItemTag.js";
import { Link, LinkProps } from "@next-bricks/basic/link";
import { collectService } from "./CollectService.js";
import { processGroupItems } from "./processor.js";
import classNames from "classnames";

const WrappedLink = wrapBrick<Link, LinkProps>("eo-link");

interface GroupViewProps {
  groups: SidebarMenuGroup[];
  groupId: string;
  selectedKey?: string[];
  onFavorite: OnFavoriteCallback;
}

export const itemColumnWidth = 240;

export function GroupView(props: GroupViewProps): React.ReactElement {
  const { groupId, selectedKey, onFavorite } = props;
  const groupMenus = processGroupItems(props.groups);

  return (
    <div className="group-view">
      {groupMenus.map((item, index) => {
        return (
          <div key={index}>
            {index !== 0 && <div className="divider" />}
            {item.groupFrom === "default" ? (
              <DefaultGroup
                groupId={groupId}
                selectedKey={selectedKey}
                groups={item.groups}
                onFavorite={onFavorite}
              />
            ) : (
              <CustomGroup
                groupId={groupId}
                selectedKey={selectedKey}
                groups={item.groups}
                onFavorite={onFavorite}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

interface BaseGroupProps {
  groupId: string;
  selectedKey?: string[];
  onFavorite: OnFavoriteCallback;
  groups: SidebarMenuGroup[];
}
export function DefaultGroup(props: BaseGroupProps): React.ReactElement {
  const { groupId, onFavorite, selectedKey, groups } = props;

  const groupRef = React.useRef<HTMLDivElement>(null);
  const [columnCount, setColumnCount] = useState<number>();

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === groupRef.current) {
          const width = entry.contentRect.width;

          setColumnCount(Math.floor(width / itemColumnWidth));
        }
      }
    });

    resizeObserver.observe(groupRef.current as HTMLDivElement);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div
      className="group"
      ref={groupRef}
      style={{ columnCount, columnWidth: itemColumnWidth }}
    >
      {groups.map((group) => (
        <div key={group.key} className="group-item">
          <div className="title">{group.title}</div>
          <div className="content">
            {group.items.map((item) => (
              <GroupItem
                key={item.key}
                groupId={groupId}
                selectedKey={selectedKey}
                data={item as SidebarMenuSimpleItem}
                onFavorite={onFavorite}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function CustomGroup(props: BaseGroupProps): React.ReactElement {
  const { groupId, onFavorite, selectedKey, groups } = props;

  return (
    <div className="custom-group">
      {groups.map((group) => (
        <div key={group.key}>
          <div className="title">{group.title}</div>
          <div
            className="custom-content"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(auto-fit, minmax(${itemColumnWidth}px, 1fr))`,
            }}
          >
            {group.items.map((item) => (
              <GroupItem
                key={item.key}
                selectedKey={selectedKey}
                groupId={groupId}
                data={item as SidebarMenuSimpleItem}
                onFavorite={onFavorite}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

interface GroupItemProps {
  data: SidebarMenuSimpleItem;
  selectedKey?: string[];
  groupId: string;
  onFavorite: OnFavoriteCallback;
}
export function GroupItem(props: GroupItemProps): React.ReactElement {
  const { data, groupId, onFavorite, selectedKey } = props;

  return (
    <WrappedLink
      key={data.key}
      icon={data.icon}
      url={data.to as string}
      href={data.href}
      target={data.target as LinkProps["target"]}
      className={classNames("item-link", {
        active: selectedKey?.includes(data.key as string),
      })}
    >
      <span className="ellipsis">{data.text}</span>
      <span className="icon-wrapper">
        <StarIcon
          active={collectService.isCollected(groupId, data)}
          groupId={groupId}
          data={data}
          onFavorite={onFavorite}
        />
      </span>
    </WrappedLink>
  );
}
