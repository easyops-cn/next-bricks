import React, { useCallback, useMemo } from "react";
import { MessageItem, MessageItemContent } from "../../ChatViewContext.js";
import { GuideItem } from "./GuideItem.js";
import { MarkdownItem } from "./MarkdownItem.js";
import { TableItem } from "./TableItem.js";
import { ChatItemLoading } from "../Loading.js";
import { TextItem } from "./TextItem.js";
import { Toolbar } from "./Toolbar.js";
import { Time } from "./Time.js";
import { ContentTip } from "./ContentTip.js";

export function MessageNode(props: MessageItem): React.ReactNode {
  const { content, ctime, role } = props;
  const isUser = useMemo(() => role === "user", [role]);

  const getContentNode = useCallback(
    (content: MessageItemContent, key: number) => {
      const { type, text, examplePrompts } = content;
      switch (type) {
        case "guide":
          return <GuideItem key={key} text={text} prompts={examplePrompts} />;
        case "markdown":
          return <MarkdownItem key={key} text={text} />;
        case "table":
          return <TableItem key={key} text={text} />;
        case "load":
          return <ChatItemLoading loading />;
        case "text":
        default:
          return <TextItem key={key} text={text} />;
      }
    },
    []
  );

  const messageNode = useMemo(
    () => content.map(getContentNode),
    [content, getContentNode]
  );

  return (
    <div className="message-box">
      <div className="message-top">
        {isUser ? "我" : "AI助手"}
        <Time time={ctime} />
      </div>
      <div className="message-content">
        <div className="content">
          {messageNode}
          <ContentTip {...props} />
          <Toolbar {...props} />
        </div>
      </div>
    </div>
  );
}
