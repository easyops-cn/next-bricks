import React, {
  useMemo,
  useCallback,
  useRef,
  useState,
  useEffect,
  useContext,
  DragEvent,
} from "react";
import { wrapBrick } from "@next-core/react-element";
import { Link, LinkProps } from "@next-bricks/basic/link";

import { EoTooltip, ToolTipProps } from "@next-bricks/basic/tooltip";
import classNames from "classnames";
import { SidebarMenuSimpleItem } from "@next-shared/general/types";
import { K, NS, locales } from "../i18n.js";
import { collectService } from "./CollectService.js";
import { useTranslation, initializeReactI18n } from "@next-core/i18n/react";
import { DRAG_DIRECTION, DragContext } from "./constants.js";

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

interface PlaceholderCompProps {
  data: SidebarMenuSimpleItem;
  direction: DRAG_DIRECTION;
  onDragOver?: (e: DragEvent) => void;
}
export function PlaceholderDropComp({
  data,
  onDragOver,
  direction,
}: PlaceholderCompProps) {
  const { groupId, onFavoriteUpdate } = useContext(DragContext);
  const handleDrop = (e: DragEvent) => {
    const formData = JSON.parse(e.dataTransfer.getData("application/json"));

    const newDataList = collectService.moveFavoriteTo(groupId, {
      from: formData,
      to: data,
      direction,
    });

    onFavoriteUpdate?.(newDataList);
  };

  return (
    <div
      className="indicate-wrapper"
      data-direction={direction}
      data-to={data.to}
      onDragEnter={(e) =>
        ((e.target as HTMLElement).style.background = "var(--palette-blue-1)")
      }
      onDragLeave={(e) =>
        ((e.target as HTMLElement).style.background = "transparent")
      }
      data-text={data.text}
      onDragOver={onDragOver}
      onDrop={handleDrop}
    />
  );
}

export function ItemTag(props: CellItemProps): React.ReactElement {
  const { data, suffix, className } = props;

  const {
    allowDrag,
    onDragStart,
    overElement,
    direction,
    onDragEnd,
    onDragOver,
  } = useContext(DragContext);
  const containerRef = useRef<any>(null);

  const [isDragIng, setIsDragIng] = useState(false);

  const isActive = useMemo(
    () =>
      overElement &&
      overElement.dataset.to == data.to &&
      overElement.dataset.text === overElement.dataset.text,
    [overElement, data]
  );

  const handleDragStart = (e: React.DragEvent) => {
    if (!allowDrag) {
      e.preventDefault();
    } else {
      setIsDragIng(true);
      e.dataTransfer?.setData("application/json", JSON.stringify(data));
      onDragStart?.(e);
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setIsDragIng(false);
    onDragEnd?.(e);
  };

  const handleOver = (e: React.DragEvent) => {
    e.dataTransfer.dropEffect = "none";
    onDragOver?.(e);
  };

  return (
    <>
      {isActive && direction === DRAG_DIRECTION.Left && (
        <PlaceholderDropComp
          data={data}
          onDragOver={onDragOver}
          direction={DRAG_DIRECTION.Left}
        />
      )}
      <WrappedLink
        data-to={data.to}
        data-text={data.text}
        ref={containerRef}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleOver}
        className={classNames("tag-container", className, {
          "is-drag": isDragIng,
        })}
        url={data.to as string}
        href={data.href}
        target={data.target as LinkProps["target"]}
      >
        <span className="tag-text ellipsis" title={data.text}>
          {data.text}
        </span>
        <span className="tag-suffix" onClick={(e) => e.preventDefault()}>
          {suffix}
        </span>
      </WrappedLink>

      {isActive && direction === DRAG_DIRECTION.Right && (
        <PlaceholderDropComp
          data={data}
          onDragOver={onDragOver}
          direction={DRAG_DIRECTION.Right}
        />
      )}
    </>
  );
}

interface QuickVisitTagProps extends CellItemProps {
  groupId: string;
  onFavorite?: OnFavoriteCallback;
}

export function QuickVisitItem(props: QuickVisitTagProps): React.ReactElement {
  const { t } = useTranslation(NS);
  const { onAllowDrag } = useContext(DragContext);
  const { data, onFavorite, groupId } = props;
  const suffixRef = useRef<any>();
  const iconRef = useRef<any>();

  const handleRemove = useCallback(() => {
    collectService.removeItemFromFavorite(groupId, data);
    onFavorite?.(collectService.getFavoritesById(groupId));
  }, [groupId, data, onFavorite]);

  const handleMouseDown = () => {
    onAllowDrag?.(true);
  };

  useEffect(() => {
    const icon = iconRef.current;
    icon.addEventListener("click", handleRemove);

    return () => {
      icon.removeEventListener("click", handleRemove);
    };
  }, [handleRemove]);

  useEffect(() => {
    const suffix = suffixRef.current;
    const handleClick = (e: MouseEvent) => {
      e.preventDefault();
    };
    suffix.addEventListener("click", handleClick);

    return () => {
      suffix.removeEventListener("click", handleClick);
    };
  }, []);

  const suffixGroups = useMemo(
    () => (
      <div className="operation" ref={suffixRef}>
        <WrappedTooltip
          content={t(K.REMOVE_ITEM_FROM_QUICK_ACCESS)!}
          hoist
          placement="bottom"
          className="close"
        >
          <WrappedIcon lib="antd" icon="close" ref={iconRef} />
        </WrappedTooltip>
        <span className="drag-wrapper" onMouseDown={handleMouseDown}>
          :::
        </span>
      </div>
    ),
    [t, handleRemove]
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
  const iconRef = useRef<any>();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    collectService.toggleFavorite(groupId, data);
    onFavorite?.(collectService.getFavoritesById(groupId));
  };

  useEffect(() => {
    // workaround for prevent Link jump when click.
    const icon = iconRef.current;
    icon.addEventListener("click", handleClick);

    return () => {
      icon.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <WrappedTooltip
      content={
        active
          ? t(K.REMOVE_ITEM_FROM_QUICK_ACCESS)!
          : collectService.checkMaxCapacity(groupId)
            ? t(K.MAX_COLLECT_COUNT_TIPS)!
            : t(K.ADD_ITEM_TO_QUICK_ACCESS)!
      }
      className={classNames("star-icon", className)}
    >
      <WrappedIcon
        ref={iconRef}
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
    [data, groupId, onFavorite, active]
  );

  return (
    <ItemTag
      className={classNames("recommend-container", className)}
      suffix={suffixGroups}
      data={data}
    />
  );
}
