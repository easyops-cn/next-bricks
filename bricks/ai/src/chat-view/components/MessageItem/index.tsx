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
import { ContentTip } from "./ContentTip.js";
import { MsgItemContext } from "./MsgItemContext.js";

const NOT_AGENT_MATCH = "no_agent";

export function MessageNode(props: MessageItem): React.ReactNode {
  const { content, created, role, agentId } = props;
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

  return (
    <MsgItemContext.Provider value={props}>
      <div className="message-box">
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

            <ContentTip {...props} />
            <Toolbar {...props} />
          </div>
        </div>
      </div>
    </MsgItemContext.Provider>
  );
}
