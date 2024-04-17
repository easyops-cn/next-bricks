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
  const { content, created, role } = props;
  const isUser = useMemo(() => role === "user", [role]);

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
        return <ChatItemLoading loading />;
      case "markdown":
      default:
        return <MarkdownItem text={text} />;
    }
  }, []);

  const messageNode = useMemo(
    () => getContentNode(content),
    [content, getContentNode]
  );

  return (
    <div className="message-box">
      <div className="message-top">
        {isUser ? "我" : "AI助手"}
        <Time time={created} />
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
