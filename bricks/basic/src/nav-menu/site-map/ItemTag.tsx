import React, { useMemo, useCallback } from "react";
import { wrapBrick } from "@next-core/react-element";
import { Link, LinkProps } from "../../link/index.js";
import type { Target } from "../../interface.js";
import { EoTooltip, ToolTipProps } from "../../tooltip/index.js";
import classNames from "classnames";
import { SidebarMenuSimpleItem } from "@next-shared/general/types";
import { K, NS, locales } from "../i18n.js";
import { collectService } from "./CollectService.js";
import { useTranslation, initializeReactI18n } from "@next-core/i18n/react";

import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
initializeReactI18n(NS, locales);
const WrappedLink = wrapBrick<Link, LinkProps>("eo-link");
const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");
const WrappedTooltip = wrapBrick<EoTooltip, ToolTipProps>("eo-tooltip");

interface CellItemProps {
  data: SidebarMenuSimpleItem;
  suffix?: React.ReactNode;
  className?: string;
}

export type OnFavoriteCallback = (collectList: SidebarMenuSimpleItem[]) => void;

export function ItemTag(props: CellItemProps): React.ReactElement {
  const { data, suffix, className } = props;

  return (
    <WrappedLink
      className={classNames("tag-container", className)}
      url={data.to as string}
      href={data.href}
      target={data.target as Target}
    >
      <span className="tag-text ellipsis">{data.text}</span>
      <span className="tag-suffix">{suffix}</span>
    </WrappedLink>
  );
}

interface QuickVisitTagProps extends CellItemProps {
  groupId: string;
  onFavorite?: OnFavoriteCallback;
}

export function QuickVisitItem(props: QuickVisitTagProps): React.ReactElement {
  const { t } = useTranslation(NS);
  const { data, onFavorite, groupId } = props;

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      collectService.removeItemFromFavorite(groupId, data);
      onFavorite?.(collectService.getFavoritesById(groupId));
    },
    [groupId, data, onFavorite],
  );

  const suffixGroups = useMemo(
    () => (
      <div className="operation">
        <WrappedTooltip
          content={t(K.REMOVE_ITEM_FROM_QUICK_ACCESS)}
          hoist
          className="close"
        >
          <WrappedIcon lib="antd" icon="close" onClick={handleRemove} />
        </WrappedTooltip>
      </div>
    ),
    [t, handleRemove],
  );

  return (
    <ItemTag className="visit-container" suffix={suffixGroups} data={data} />
  );
}

interface StarIconProps {
  onFavorite?: OnFavoriteCallback;
  className?: string;
  groupId: string;
  data: SidebarMenuSimpleItem;
  active?: boolean;
}

export function StarIcon({
  onFavorite,
  className,
  groupId,
  data,
  active,
}: StarIconProps): React.ReactElement {
  const { t } = useTranslation(NS);
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    collectService.toggleFavorite(groupId, data);
    onFavorite?.(collectService.getFavoritesById(groupId));
  };

  return (
    <WrappedTooltip
      content={
        active
          ? t(K.REMOVE_ITEM_FROM_QUICK_ACCESS)
          : t(K.ADD_ITEM_TO_QUICK_ACCESS)
      }
      className={classNames("star-icon", className)}
    >
      <WrappedIcon
        onClick={handleClick}
        className={classNames({ active })}
        lib="antd"
        icon="star"
        {...(active ? { theme: "filled" } : {})}
      />
    </WrappedTooltip>
  );
}

interface RecommendItemProps extends CellItemProps {
  active?: boolean;
  groupId: string;
  onFavorite?: OnFavoriteCallback;
}

export function RecommendItem(props: RecommendItemProps): React.ReactElement {
  const { data, className, groupId, onFavorite, active } = props;

  const suffixGroups = useMemo(
    () => (
      <StarIcon
        groupId={groupId}
        active={active}
        className="star"
        data={data}
        onFavorite={onFavorite}
      />
    ),
    [data, groupId, onFavorite, active],
  );

  return (
    <ItemTag
      className={classNames("recommend-container", className)}
      suffix={suffixGroups}
      data={data}
    />
  );
}
