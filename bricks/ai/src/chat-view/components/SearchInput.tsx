import React, {
  ChangeEvent,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
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
import { AgentDetailItem } from "./QuickAnswerList/index";
import { ChatBody } from "../ChatService.js";
import { ReactUseMultipleBricks } from "@next-core/react-runtime";

export interface SearchInputRef {
  handleInsertQuestion: (value: string) => void;
  sendMsg: (msg: string | ChatBody) => void;
}

const WrappedToolTip = wrapBrick<EoTooltip, ToolTipProps>("eo-tooltip");
const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");

const PREFIX_WORD = "@";

export function LegacySearchInput(
  props: any,
  ref: React.Ref<SearchInputRef>
): React.ReactNode {
  const [value, setValue] = useState<string>("");
  const [active, setActive] = useState<boolean>(false);
  const [expand, setExpand] = useState<boolean>(false);
  const [autoSizeStyle, setAutoSizeStyle] = useState<React.CSSProperties>();
  const [isFillContent, setIsFillContent] = useState<boolean>(false);

  // mention
  const [mentionOpen, setMentionOpen] = useState<boolean>(false);
  const [matchPrefixIndex, setMatchPrefixIndex] = useState<number>(-1);
  const [matchAgentList, setMatchMentionList] = useState<AgentDetailItem[]>([]);
  const [matchMentionsIndex, setMatchMentionsIndex] = useState<number>(0);

  const mentionsRef = useRef<HTMLDivElement>(null);
  const searchInputBoxRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hadExpanded = useRef<boolean>(false);
  const inputEndRef = useRef<boolean>(false);

  const {
    chatting,
    loading,
    searchStr,
    quickAnswerConfig,
    createSession,
    setSearchStr,
    handleChat,
    setAgent,
  } = useChatViewContext();

  const agentList = useMemo(
    () => quickAnswerConfig?.list ?? [],
    [quickAnswerConfig]
  );

  const hadValue = useMemo(() => !!value, [value]);
  const defaultSize = useMemo(() => [1, 5], []);
  const disabled = useMemo(() => loading || chatting, [chatting, loading]);

  const matchPrefixInfo = useMemo(() => {
    const textareaElement = textareaRef.current!;
    if (matchPrefixIndex >= 0 && value) {
      const currentFocusIndex = textareaElement.selectionStart;
      let matchWord = "";
      for (let i = matchPrefixIndex + 1; i < currentFocusIndex; i++) {
        // 匹配中文英文数字
        if (/[\u4e00-\u9fa5]|\w|\d/.test(value[i]) || inputEndRef.current) {
          matchWord = matchWord + value[i];
        } else {
          setMatchPrefixIndex(-1);
          return false;
        }
      }
      return {
        start: matchPrefixIndex + 1,
        end: currentFocusIndex,
        word: matchWord,
      };
    }
    return false;
  }, [matchPrefixIndex, value]);

  const handleAgentItemSelect = useCallback(
    (item: AgentDetailItem) => {
      if (matchPrefixInfo) {
        const { start, end } = matchPrefixInfo;
        const valueList = value.split("");
        const trimName = item.name.replace(/\s+/g, "") + " ";
        const focusIndex = start + trimName.length;
        valueList.splice(start, end - start, trimName);
        setValue(valueList.join(""));
        setMatchPrefixIndex(-1);

        setTimeout(() => {
          textareaRef.current!.selectionStart = focusIndex;
          textareaRef.current!.selectionEnd = focusIndex;
          textareaRef.current!.focus();
        }, 0);
      }
    },
    [matchPrefixInfo, value]
  );

  const isShowMentions = useMemo(() => {
    return matchAgentList.length && mentionOpen;
  }, [matchAgentList, mentionOpen]);

  const mentions = useMemo(() => {
    return isShowMentions ? (
      <div className="mentions-list-wrapper" ref={mentionsRef}>
        <div className="content">
          <div className="mentions-title">Agents</div>
          <div className="mentions-list">
            {matchAgentList.slice(0, 10).map((item, index) => {
              return (
                <div
                  className={classNames("mentions-item", {
                    active: index === matchMentionsIndex,
                  })}
                  key={index}
                  onClick={() => handleAgentItemSelect(item)}
                >
                  <WrappedIcon
                    className="icon"
                    {...item.icon}
                    style={{
                      color: `var(--theme-${item.icon.color}-color)`,
                      background: `var(--theme-${item.icon.color}-background)`,
                    }}
                  />
                  <div className="name">{item.name}</div>
                  <div className="description">{item.description}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    ) : null;
  }, [
    matchAgentList,
    matchMentionsIndex,
    isShowMentions,
    handleAgentItemSelect,
  ]);

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

  const matchFirstAgent = useCallback(
    (value: string) => {
      const regex = /@([\u4e00-\u9fa5|\w|\d]+)/g;

      // 在字符串中循环匹配正则表达式
      let match: RegExpExecArray | null;
      while ((match = regex.exec(value)) !== null) {
        if (match) {
          const agent = agentList?.find(
            (item) => item.name.replace(/\s+/g, "") === match![1]
          );
          agent && setAgent(agent.id);
          if (agent) break;
        }
      }
    },
    [agentList, setAgent]
  );

  const handleDispatchQuestion = useCallback(
    (val: string) => {
      matchFirstAgent(val);
      handleChat(val);

      setActive(false);
      setExpand(false);
      handleChange("");
      textareaRef.current?.blur();
    },
    [handleChat, handleChange, matchFirstAgent]
  );

  const handleSubmit = useCallback(() => {
    if (!hadValue || !textareaRef.current || disabled) return;
    handleDispatchQuestion(value);
  }, [value, hadValue, disabled, handleDispatchQuestion]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey && !inputEndRef.current) {
        e.preventDefault();
        if (isShowMentions) {
          handleAgentItemSelect(matchAgentList[matchMentionsIndex]);
        } else {
          handleSubmit();
        }
      }
      if (isShowMentions) {
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setMatchMentionsIndex((index) => Math.max(0, index - 1));
        }
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setMatchMentionsIndex((index) =>
            Math.min(matchAgentList.length - 1, index + 1)
          );
        }
      }
    },
    [
      handleSubmit,
      handleAgentItemSelect,
      isShowMentions,
      matchAgentList,
      matchMentionsIndex,
    ]
  );

  const handleKeyUp = useCallback(
    (e: React.KeyboardEvent) => {
      const textareaElement = textareaRef.current!;

      const selectionIndex = textareaElement.selectionStart;
      const prefixWord = textareaElement.value[selectionIndex - 1];
      const beforeSelectionText = textareaElement.value.slice(
        0,
        selectionIndex
      );
      const index = beforeSelectionText.lastIndexOf(PREFIX_WORD);

      if (
        e.key === "Escape" ||
        (!isShowMentions &&
          ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.key) !==
            -1)
      ) {
        setMatchPrefixIndex(-1);
        return;
      }

      if (prefixWord === PREFIX_WORD) {
        setMatchPrefixIndex(selectionIndex - 1);
      } else {
        setMatchPrefixIndex(index);
      }
    },
    [isShowMentions]
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

  useEffect(() => {
    if (agentList?.length && matchPrefixInfo) {
      const filterList =
        matchPrefixInfo.word === ""
          ? agentList
          : agentList.filter((item) =>
              item.name.includes(matchPrefixInfo.word)
            );

      setMatchMentionList(filterList);
      setMatchMentionsIndex(0);
      setMentionOpen(true);
    } else {
      setMatchMentionList([]);
      setMentionOpen(false);
    }
  }, [matchPrefixInfo, agentList]);

  useEffect(() => {
    if (matchMentionsIndex >= 0 && mentionsRef.current) {
      const element = mentionsRef.current.querySelector(
        ".mentions-item.active"
      );
      element?.scrollIntoView({ block: "nearest" });
    }
  }, [matchMentionsIndex]);

  useEffect(() => {
    const handleDocumentClick = (e: any) => {
      const mentionsElemnt = mentionsRef.current;
      if (mentionsElemnt && !mentionsElemnt.contains(e.composedPath()[0])) {
        setMentionOpen(false);
      }
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  useImperativeHandle(ref, () => ({
    handleInsertQuestion: (value: string) => {
      handleDispatchQuestion(value);
    },
    sendMsg: (msg: string | ChatBody) => {
      handleChat(msg);
    },
  }));

  return (
    <div
      className={classNames("search-input-box", {
        "fill-content": isFillContent,
      })}
      ref={searchInputBoxRef}
    >
      {mentions}
      {props.inputToolbarBrick && (
        <div className="input-toobar">
          <ReactUseMultipleBricks {...props.inputToolbarBrick} />
        </div>
      )}
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
          onKeyUpCapture={handleKeyUp}
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

export const SearchInput = forwardRef(LegacySearchInput);
