import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import { ChatViewContext } from "./ChatViewContext.js";
import { MessageList } from "./components/MessageList.js";
import { useChatViewInfo } from "./hooks/useChatViewInfo.js";
import { SessionList } from "./components/SessionList.js";
import { SearchInput } from "./components/SearchInput.js";
// import { ChatViewToolbar } from "./components/ChatViewToolbar.js";
import styleText from "./styles.shadow.css";
import loadStyleText from "./components/loading.shadow.css";
import markdownStyleText from "./components/MessageItem/markdown.shadow.css";
import "@next-core/theme";

const { defineElement, property } = createDecorators();

/**
 * AI 对话终端
 */
export
@defineElement("ai.chat-view", {
  styleTexts: [styleText, loadStyleText, markdownStyleText],
})
class ChatView extends ReactNextElement {
  @property()
  accessor sessionId: string | undefined;

  /**
   * 智能体id
   */
  @property()
  accessor agentId!: string;

  /**
   * 是否展示对话用户头像
   * @default true
   */
  @property({
    type: Boolean,
  })
  accessor showAvatar: boolean | undefined;

  /**
   * 是否展示历史会话信息
   * @default true
   */
  @property({
    type: Boolean,
  })
  accessor showSessionList: boolean | undefined;

  /**
   * 是否展示点赞能力
   * @default true
   */
  @property({
    type: Boolean,
  })
  accessor showLike: boolean | undefined;

  /**
   * 输入间隔
   * @default 50
   */
  @property({
    type: Number,
  })
  accessor enterInterval: number | undefined;

  render() {
    return (
      <ChatViewComponent
        agentId={this.agentId}
        sessionId={this.sessionId}
        showAvatar={this.showAvatar}
        showSessionList={this.showSessionList}
        showLike={this.showLike}
        enterInterval={this.enterInterval}
      />
    );
  }
}

export interface ChatViewProps {
  agentId: string;
  sessionId?: string;
  showAvatar?: boolean;
  showSessionList?: boolean;
  showLike?: boolean;
  enterInterval?: number;
}

export function ChatViewComponent({
  agentId,
  showAvatar,
  showSessionList = true,
  showLike = true,
  enterInterval,
}: ChatViewProps) {
  const {
    activeSessionId,
    msgList,
    msgItem,
    sessionList,
    loading,
    chartting,
    searchStr,
    handleChat,
    createSession,
    updateSession,
    setSearchStr,
  } = useChatViewInfo({
    agentId,
    enterInterval,
  });

  return (
    <ChatViewContext.Provider
      value={{
        activeSessionId,
        sessionList,
        msgList,
        msgItem,
        chartting,
        loading,
        searchStr,
        showLike,
        handleChat,
        createSession,
        updateSession,
        setSearchStr,
      }}
    >
      <div className="chat-view-container">
        {showSessionList && (
          <div className="chat-view-selector">
            <SessionList />
          </div>
        )}
        <div className="chat-view-content">
          <div className="chat-view">
            <MessageList showAvatar={showAvatar} />
            <SearchInput />
          </div>
        </div>
      </div>
    </ChatViewContext.Provider>
  );
}
