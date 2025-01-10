import React, { useCallback, useEffect, useRef } from "react";
import { useChatViewContext } from "../ChatViewContext";
import classNames from "classnames";
import { debounce } from "lodash";
import { SessionItem as SessionItemProps } from "../ChatService";
import { CommonLoading } from "./Loading.js";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import { wrapBrick } from "@next-core/react-element";
import { unwrapProvider } from "@next-core/utils/general";
import type { showDialog as _showDialog } from "@next-bricks/basic/data-providers/show-dialog/show-dialog";
import type { showNotification as _showNotification } from "@next-bricks/basic/data-providers/show-notification/show-notification";
import { EoTooltip, ToolTipProps } from "@next-bricks/basic/tooltip";
import type {
  Modal,
  ModalProps,
  ModalEvents,
  ModalMapEvents,
} from "@next-bricks/containers/modal";
import type { Input, InputProps } from "@next-bricks/form/input";
import {
  Form,
  FormEvents,
  FormMapEvents,
  FormProps,
} from "@next-bricks/form/form";
import { NEW_SESSION_ID } from "../hooks/useChatViewInfo";

const WrappedToolTip = wrapBrick<EoTooltip, ToolTipProps>("eo-tooltip");

const showNotification = unwrapProvider<typeof _showNotification>(
  "basic.show-notification"
);
const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");
const showDialog = unwrapProvider<typeof _showDialog>("basic.show-dialog");

const WrappedModal = wrapBrick<Modal, ModalProps, ModalEvents, ModalMapEvents>(
  "eo-modal",
  {
    onClose: "close",
    onConfirm: "confirm",
    onCancel: "cancel",
    onOpen: "open",
  }
);
const WrappedForm = wrapBrick<Form, FormProps, FormEvents, FormMapEvents>(
  "eo-form",
  {
    onValuesChange: "values.change",
    onValidateSuccess: "validate.success",
    onValidateError: "validate.error",
  }
);
const WrappedInput = wrapBrick<Input, InputProps>("eo-input");

const SESSION_ITEM_HEIGHT = 42;
const BUFFER_NUMBER = 5;
const CACHE_HEIGHT = 100;

export function SessionList(): React.ReactNode {
  const {
    sessionEnd,
    sessionLoading,
    sessionList,
    querySessionHistory,
    updateSession,
  } = useChatViewContext();
  const sessionWrapperRef = useRef<HTMLDivElement>(null);
  const sessionListRef = useRef<HTMLDivElement>(null);
  const searchQueryRef = useRef<string>("");
  const editModalRef = useRef<Modal>(null);
  const editFormRef = useRef<Form>(null);
  const editRawDataRef = useRef<Partial<SessionItemProps>>(undefined);
  const editConversationIdRef = useRef<string>("");

  const getFitLimit = () => {
    let limit = 20;
    const sessionWrapper = sessionWrapperRef.current;
    if (sessionWrapper) {
      // limit = 视图高度 % 单条高度 + 缓冲长度
      limit =
        Math.floor(sessionWrapper.clientHeight / SESSION_ITEM_HEIGHT) +
        BUFFER_NUMBER;
    }
    return limit;
  };

  useEffect(() => {
    querySessionHistory(getFitLimit());
  }, []);

  const checkSessionList = useCallback(() => {
    if (sessionLoading || sessionEnd) return;
    const sessionList = sessionListRef.current;
    if (sessionList) {
      const { scrollTop, scrollHeight, clientHeight } = sessionList;
      // 如果滚动的高度 + 视图高度 + 缓冲高度 > 视图的滚动高度，请求新的数据
      if (scrollTop + clientHeight + CACHE_HEIGHT > scrollHeight) {
        querySessionHistory();
      }
    }
  }, [querySessionHistory, sessionLoading, sessionEnd]);

  const handleScroll = debounce(checkSessionList, 200);

  const handleChange = useCallback((e: any) => {
    searchQueryRef.current = e.target.value;
  }, []);

  const handleSearch = useCallback(() => {
    querySessionHistory(getFitLimit(), searchQueryRef.current);
  }, []);

  const handleSearchEnter = useCallback((e: any) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  }, []);

  const handleEditSession = useCallback(
    (conversationId: string, rawData: Partial<SessionItemProps>) => {
      // 从item传上来的已知数据
      editConversationIdRef.current = conversationId;
      editRawDataRef.current = rawData;
      editFormRef.current?.setInitValue({ ...rawData });
      editModalRef.current?.open();
    },
    []
  );

  const handleEditModalConfirm = useCallback(() => {
    editFormRef.current?.validate();
  }, []);

  const handleEditFormSubmit = useCallback(
    async (e: any) => {
      // 调用接口，更新数据后要关掉modal
      const result = await updateSession(
        editConversationIdRef.current,
        e.detail
      );
      showNotification({
        message: `修改会话${result ? "成功" : "失败"}`,
        type: result ? "success" : "error",
      });
      if (result) {
        editModalRef.current?.close();
      }
    },
    [editConversationIdRef.current, editModalRef.current]
  );

  return (
    <>
      <div className="session-list-wrapper" ref={sessionWrapperRef}>
        <div className="session-title">历史对话</div>
        <div className="session-search-input-box">
          <input
            placeholder={"输入关键词进行搜索"}
            onChange={handleChange}
            onKeyUpCapture={handleSearchEnter}
          />
          <span className="suffix-icon">
            <WrappedToolTip content="搜索">
              <WrappedIcon
                lib="antd"
                icon="search"
                theme="outlined"
                onClick={handleSearch}
              />
            </WrappedToolTip>
          </span>
        </div>
        <div
          className="session-list"
          ref={sessionListRef}
          onScroll={handleScroll}
        >
          {sessionList.map((item, index) => {
            return (
              <SessionItem
                key={index}
                {...item}
                handleEditSession={handleEditSession}
              />
            );
          })}
          {sessionLoading && <CommonLoading />}
          {/* {sessionEnd && <div className="session-end-tip">到底啦</div>} */}
        </div>
      </div>
      <WrappedModal
        ref={editModalRef}
        modalTitle={"编辑会话"}
        width="688px"
        maskClosable={false}
        closeWhenConfirm={false}
        onConfirm={handleEditModalConfirm}
      >
        <WrappedForm
          layout="horizontal"
          ref={editFormRef}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          onValidateSuccess={handleEditFormSubmit}
        >
          <WrappedInput label="标题" name="title"></WrappedInput>
        </WrappedForm>
      </WrappedModal>
    </>
  );
}

function SessionItem({
  title,
  conversationId,
  handleEditSession,
}: SessionItemProps) {
  const { activeSessionId, checkSession, deleteSession } = useChatViewContext();

  const handleCheckSession = useCallback(() => {
    checkSession(conversationId, true);
  }, [conversationId, checkSession]);

  const handleDeleteSession = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      showDialog({
        type: "confirm",
        title: "会话删除确认",
        content: `请输入 {{ expect }} 以确认删除`,
        expect: title.replace(/\s+/g, ""),
      }).then(async () => {
        const result = await deleteSession([conversationId]);
        showNotification({
          message: `删除会话${result ? "成功" : "失败"}`,
          type: result ? "success" : "error",
        });
      });
    },
    [conversationId, deleteSession, title]
  );

  const handleEditSessionItem = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      handleEditSession && handleEditSession(conversationId, { title });
    },
    [conversationId, handleEditSession, title]
  );

  return (
    <div
      key={title}
      className={classNames("session-item", {
        active: conversationId === activeSessionId,
      })}
      onClick={handleCheckSession}
    >
      <div className="content">
        <div className="title" title={title}>
          {title}
        </div>
      </div>
      {conversationId !== NEW_SESSION_ID && (
        <>
          <div className="session-edit-btn" onClick={handleEditSessionItem}>
            <WrappedIcon icon="edit" lib="antd" />
          </div>
          <div className="session-close-btn" onClick={handleDeleteSession}>
            <WrappedIcon icon="close" lib="antd" />
          </div>
        </>
      )}
    </div>
  );
}
