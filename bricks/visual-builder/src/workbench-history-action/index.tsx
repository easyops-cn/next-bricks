import React, { useRef, useState } from "react";
import { EventEmitter, createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import { handleHttpError } from "@next-core/runtime";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import type { Button, ButtonProps } from "@next-bricks/basic/button";
import type {
  EoEasyopsAvatar,
  EoEasyopsAvatarProps,
} from "@next-bricks/basic/easyops-avatar";
import type {
  Popover,
  PopoverProps,
  PopoverEvents,
  PopoverEventsMapping,
} from "@next-bricks/basic/popover";
import type { Link, LinkProps } from "@next-bricks/basic/link";
import "@next-core/theme";
import moment from "moment";
import styleText from "./styles.shadow.css";
import { useTranslation, initializeReactI18n } from "@next-core/i18n/react";
import { K, NS, locales } from "./i18n.js";
import {
  WorkspaceApi_getChangeHistory,
  NextBuilderModels,
} from "@next-api-sdk/next-builder-sdk";
import { translateHistory } from "./utils.js";

initializeReactI18n(NS, locales);

const { defineElement, property, event } = createDecorators();

const WrappedButton = wrapBrick<Button, ButtonProps>("eo-button");
const WrappedLink = wrapBrick<Link, LinkProps>("eo-link");
const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");
const WrappedEasyopsAvatar = wrapBrick<EoEasyopsAvatar, EoEasyopsAvatarProps>(
  "eo-easyops-avatar"
);
const WrappedPopover = wrapBrick<
  Popover,
  PopoverProps,
  PopoverEvents,
  PopoverEventsMapping
>("eo-popover", {
  onVisibleChange: "visible.change",
  beforeVisibleChange: "before.visible.change",
});

interface HistoryData
  extends Partial<NextBuilderModels.ModelWorkspaceChangeHistory> {
  translation: Record<string, string>;
}

export interface WorkbenchHistoryActionProps {
  appId: string;
  projectId: string;
}

/**
 * 项目变更历史
 */
export
@defineElement("visual-builder.workbench-history-action", {
  styleTexts: [styleText],
})
class WorkbenchHistoryAction
  extends ReactNextElement
  implements WorkbenchHistoryActionProps
{
  @property()
  accessor appId: string;

  @property()
  accessor projectId: string;

  /**
   * 点击历史项标题触发
   */
  @event({ type: "history.item.click" })
  accessor #historyItemClickEvent!: EventEmitter<
    HistoryData & { enableRollback: boolean }
  >;
  #handleHistoryItemClick = (
    data: HistoryData & { enableRollback: boolean }
  ): void => {
    this.#historyItemClickEvent.emit(data);
  };

  /**
   * 点击回滚触发
   */
  @event({ type: "rollback" })
  accessor #rollbackEvent!: EventEmitter<HistoryData>;
  #handleRollback = (data: HistoryData): void => {
    this.#rollbackEvent.emit(data);
  };

  /**
   * 回滚全部
   */
  @event({ type: "rollback.all" })
  accessor #rollbackAllEvent!: EventEmitter<void>;
  #handleRollbackAll = (): void => {
    this.#rollbackAllEvent.emit();
  };

  render() {
    return (
      <WorkbenchHistoryActionComponent
        appId={this.appId}
        projectId={this.projectId}
        onHistoryItemClick={this.#handleHistoryItemClick}
        onRollback={this.#handleRollback}
        onRollbackAll={this.#handleRollbackAll}
      />
    );
  }
}

interface WorkbenchHistoryActionComponentProps
  extends WorkbenchHistoryActionProps {
  onHistoryItemClick?: (
    data: HistoryData & { enableRollback: boolean }
  ) => void;
  onRollback?: (data: HistoryData) => void;
  onRollbackAll?: () => void;
}

export function WorkbenchHistoryActionComponent(
  props: WorkbenchHistoryActionComponentProps
) {
  const { appId, projectId, onHistoryItemClick, onRollback, onRollbackAll } =
    props;
  const { t } = useTranslation(NS);

  const [loading, setLoading] = useState(false);
  const [hideLoadMore, setHideLoadMore] = useState(true);
  const [allLoaded, setAllLoaded] = useState(false);
  const [historyList, setHistoryList] = useState<HistoryData[]>([]);
  const lastTs = useRef<string>("");

  const handleLoadList = (isFirst?: boolean) => {
    setLoading(true);
    WorkspaceApi_getChangeHistory(appId, { ts: lastTs.current, limit: 20 })
      .then((result) => {
        setHistoryList((pre) => {
          const list = result.list.map((v) => ({
            ...v,
            translation: translateHistory(v),
          }));
          return isFirst ? list : pre.concat(list);
        });
        lastTs.current = result.ts;
        setAllLoaded(result.list.length < 20);
        setHideLoadMore(result.list.length < 20);
      })
      .catch((error) => {
        handleHttpError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleBeforeVisibleChange = (e: CustomEvent<boolean>) => {
    if (e.detail) {
      setHideLoadMore(true);
      setAllLoaded(false);
      setHistoryList([]);
      lastTs.current = "";
      handleLoadList(true);
    }
  };

  return (
    <WrappedPopover
      placement="bottom"
      trigger="click"
      arrow={true}
      arrowColor="var(--color-fill-bg-container-4)"
      beforeVisibleChange={handleBeforeVisibleChange}
    >
      <WrappedButton
        slot="anchor"
        shape="circle"
        className="history-action"
        icon={{
          lib: "antd",
          icon: "history",
          theme: "outlined",
        }}
      />
      <div>
        <div className="history-title">History</div>
        <div className="history-list">
          {historyList.length ? (
            <>
              {historyList.map((v, i) => {
                return (
                  <HistoryItem
                    key={`${v.uniqueKey}-${v.ts}`}
                    data={v}
                    enableRollback={i !== 0 && v.action !== "rollback"}
                    current={i === 0}
                    onHistoryItemClick={onHistoryItemClick}
                    onRollback={onRollback}
                  />
                );
              })}
              {!hideLoadMore && (
                <span className="load-more-container">
                  <WrappedLink
                    className="load-more"
                    disabled={loading}
                    onClick={(e) => handleLoadList()}
                  >
                    {t(K.LOAD_MORE)}
                  </WrappedLink>
                </span>
              )}
              {allLoaded && (
                <span className="end-container">
                  The End
                  <WrappedIcon
                    className="rollback-all"
                    lib="antd"
                    icon="rollback"
                    theme="outlined"
                    onClick={(e) => onRollbackAll()}
                  />
                </span>
              )}
            </>
          ) : (
            <div className="empty">{loading ? t(K.LOADING) : t(K.NO_DATA)}</div>
          )}
        </div>
        {/* 点击历史详情会打开 modal 来展示，这里提供一个 slot，编排将 modal 放置在这里，使其成为 popover 的 children，才能防止用户在操作 modal 过程中意外关闭 popover */}
        <slot />
      </div>
    </WrappedPopover>
  );
}

interface HistoryItemProps {
  data: HistoryData;
  enableRollback?: boolean;
  current?: boolean;
  onHistoryItemClick?: (
    data: HistoryData & { enableRollback: boolean }
  ) => void;
  onRollback?: (data: HistoryData) => void;
}

function HistoryItem(props: HistoryItemProps) {
  const { data, enableRollback, current, onHistoryItemClick, onRollback } =
    props;

  const ts = moment(Number(data.ts) / 1000000);
  const duration = moment.duration(ts.diff(moment()));
  const humanizedTime =
    duration.days() <= -1
      ? ts.format("YYYY-MM-DD HH:mm:ss")
      : duration.humanize(true, { ss: 0, s: 60, m: 60, h: 24 });

  return (
    <div className="item-container">
      <div className="item-title">
        <div
          className="title-left"
          onClick={(e) => onHistoryItemClick({ ...data, enableRollback })}
        >
          <div className="topic" title={data.translation.abstract}>
            {data.translation.abstract}
          </div>
          {current && <div className="branch">(current)</div>}
        </div>
        <div className="title-right">
          {enableRollback && (
            <WrappedIcon
              className="rollback"
              lib="antd"
              icon="rollback"
              theme="outlined"
              onClick={(e) => onRollback(data)}
            />
          )}
        </div>
      </div>
      <div className="item-info">
        <WrappedEasyopsAvatar
          className="avatar"
          nameOrInstanceId={data.user}
          size="xs"
        />
        <div className="time">{humanizedTime}</div>
        <div className="operator">{data.user}</div>
      </div>
    </div>
  );
}
