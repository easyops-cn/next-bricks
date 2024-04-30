import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { wrapBrick } from "@next-core/react-element";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import type { EoTooltip, ToolTipProps } from "@next-bricks/basic/tooltip";
import calculateAutoSizeStyle from "./utils/calculateAutoSizeStyle.js";
import classNames from "classnames";
import { useChatViewContext } from "../ChatViewContext.js";

const WrappedToolTip = wrapBrick<EoTooltip, ToolTipProps>("eo-tooltip");
const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");

export function SearchInput(): React.ReactNode {
  const [value, setValue] = useState<string>("");
  const [active, setActive] = useState<boolean>(false);
  const [expand, setExpand] = useState<boolean>(false);
  const [autoSizeStyle, setAutoSizeStyle] = useState<React.CSSProperties>();
  const [isFillContent, setIsFillContent] = useState<boolean>(false);
  const searchInputBoxRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hadExpanded = useRef<boolean>(false);
  const inputEndRef = useRef<boolean>(false);

  const {
    chatting,
    loading,
    searchStr,
    createSession,
    setSearchStr,
    handleChat,
  } = useChatViewContext();

  const hadValue = useMemo(() => !!value, [value]);
  const defaultSize = useMemo(() => [1, 5], []);
  const disabled = useMemo(() => loading || chatting, [chatting, loading]);

  const computedAutoSize = useCallback(
    (size = defaultSize) => {
      if (hadExpanded.current && expand) return;
      const textareaElement = textareaRef.current as HTMLTextAreaElement;
      if (textareaElement) {
        const textareaStyles = calculateAutoSizeStyle(
          textareaElement,
          size[0],
          size[1]
        );

        setAutoSizeStyle(textareaStyles);
      }
      hadExpanded.current = expand;
    },
    [defaultSize, expand]
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement> | string): void => {
      const value = typeof e === "string" ? e : e.target.value;
      setValue(value);
      textareaRef.current!.value = value;
    },
    []
  );

  const handleCompositionStart = () => {
    inputEndRef.current = true;
  };

  const handleCompositionEnd = () => {
    inputEndRef.current = false;
  };

  const hanldeCreateSession = () => {
    createSession();
  };

  const handleExpand = useCallback(() => {
    setExpand((value) => {
      return !value;
    });
  }, []);

  const handleSubmit = useCallback(() => {
    if (!hadValue || !textareaRef.current || disabled) return;

    handleChat(value);

    setActive(false);
    setExpand(false);
    handleChange("");
    textareaRef.current.blur();
  }, [value, hadValue, disabled, handleChat, handleChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey && !inputEndRef.current) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  useEffect(() => {
    if (searchStr) {
      handleChange(searchStr.trim());
      textareaRef.current?.focus();
      setSearchStr("");
    }
  }, [searchStr, disabled, setSearchStr, handleChange]);

  useEffect(() => {
    computedAutoSize(expand ? [20, 20] : undefined);
  }, [value, expand, computedAutoSize]);

  useEffect(() => {
    const searchInputBox = searchInputBoxRef.current;
    if (searchInputBox) {
      const observe = new ResizeObserver(() => {
        const { width: currentWidth } = searchInputBox.getBoundingClientRect();
        const FIT_CONTENT_WIDTH = 900;

        setIsFillContent(currentWidth < FIT_CONTENT_WIDTH);
      });

      observe.observe(searchInputBox);

      return () => {
        observe.disconnect();
      };
    }
  }, []);

  useEffect(() => {
    if (!chatting && textareaRef.current) {
      textareaRef.current?.focus();
    }
  }, [chatting]);

  return (
    <div
      className={classNames("search-input-box", {
        "fill-content": isFillContent,
      })}
      ref={searchInputBoxRef}
    >
      <div
        className={classNames("input-box", {
          active,
          disabled,
          expand,
        })}
      >
        <textarea
          value={value}
          ref={textareaRef}
          style={{
            ...autoSizeStyle,
            paddingRight: expand ? "50px" : "140px",
          }}
          placeholder={chatting ? "回复中,请稍等..." : "提出你的想法..."}
          onFocus={() => setActive(true)}
          onBlur={() => setActive(false)}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
        />
        <span className="suffix-icon">
          <WrappedToolTip content="新增会话">
            <WrappedIcon
              lib="antd"
              icon="plus-circle"
              onClick={hanldeCreateSession}
            />
          </WrappedToolTip>
          {!expand && (
            <WrappedToolTip content="放大">
              <WrappedIcon
                lib="antd"
                icon="arrows-alt"
                onClick={handleExpand}
              />
            </WrappedToolTip>
          )}
          <div className="submit-split"></div>
          <WrappedToolTip content="提交">
            <WrappedIcon
              className={classNames("submit-btn", {
                active: hadValue,
                disabled: !hadValue || disabled,
              })}
              lib={chatting ? "antd" : "easyops"}
              icon={chatting ? "loading" : "release-management-fill"}
              category={chatting ? "" : "menu"}
              spinning={chatting}
              onClick={handleSubmit}
            />
          </WrappedToolTip>
        </span>
        <span className="toolbar-icon">
          {expand && (
            <WrappedToolTip content="缩小">
              <WrappedIcon lib="antd" icon="shrink" onClick={handleExpand} />
            </WrappedToolTip>
          )}
        </span>
      </div>
      {hadValue && (
        <div className="search-input-toolbar">
          <div className="input-tip">Shift + Enter 换行</div>
        </div>
      )}
    </div>
  );
}
