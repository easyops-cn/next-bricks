import React, { useCallback, useMemo } from "react";
import {
  MessageItem,
  MessageItemContent,
  useChatViewContext,
} from "../../ChatViewContext.js";
import { GuideItem } from "./GuideItem.js";
import { MarkdownItem } from "./Markdown/index.js";
import { TableItem } from "./TableItem.js";
import { ChatItemLoading } from "../Loading.js";
import { TextItem } from "./TextItem.js";
import { Toolbar } from "./Toolbar.js";
import { Time } from "./Time.js";
// import { ContentTip } from "./ContentTip.js";
import { MsgItemContext } from "./MsgItemContext.js";
import {
  DEFAULT_TYPE,
  RELATED_QUESTIONS_TYPE,
} from "../../hooks/useChatViewInfo.js";

const NOT_AGENT_MATCH = "no_agent";

export function MessageNode(props: MessageItem): React.ReactNode {
  const { content, created, role, agentId, type: itemType, chatting } = props;
  const isUser = useMemo(() => role === "user", [role]);
  const { quickAnswerConfig } = useChatViewContext();

  const getContentNode = useCallback((content: MessageItemContent) => {
    const { type, text, examplePrompts } = content;
    switch (type) {
      case "guide":
        return <GuideItem text={text} prompts={examplePrompts} />;
      case "text":
        return <TextItem text={text} />;
      case "table":
        return <TableItem text={text} />;
      case "load":
        return <ChatItemLoading />;
      case "markdown":
      default:
        return <MarkdownItem text={text} />;
    }
  }, []);

  const messageNode = useMemo(
    () => getContentNode(content),
    [content, getContentNode]
  );

  const agentList = useMemo(
    () => quickAnswerConfig?.list ?? [],
    [quickAnswerConfig]
  );

  const matchAgent = useMemo(() => {
    return agentList.find((item) => item.id === agentId);
  }, [agentList, agentId]);

  const getMsgNode = useCallback(() => {
    switch (itemType) {
      case RELATED_QUESTIONS_TYPE:
        return (
          <>
            <div className="message-top">
              <div style={{ color: "gray" }}>推荐提问</div>
            </div>
            <div className="message-content">
              <div className="wrapper">
                {chatting ? (
                  <div className="content">
                    <ChatItemLoading />
                  </div>
                ) : (
                  <>{messageNode}</>
                )}
              </div>
            </div>
          </>
        );
      case DEFAULT_TYPE:
      default:
        return (
          <>
            <div className="message-top">
              {isUser
                ? "我"
                : !agentId || agentId === NOT_AGENT_MATCH || !matchAgent
                  ? "AI助手"
                  : matchAgent.name}
              <Time time={created} />
            </div>
            <div className="message-content">
              <div className="wrapper">
                <div className="content">{messageNode}</div>
                <Toolbar {...props} />
              </div>
            </div>
          </>
        );
    }
  }, [
    itemType,
    isUser,
    agentId,
    matchAgent,
    created,
    chatting,
    messageNode,
    props,
  ]);

  return (
    <MsgItemContext.Provider value={props}>
      <div className="message-box">{getMsgNode()}</div>
    </MsgItemContext.Provider>
  );
}
