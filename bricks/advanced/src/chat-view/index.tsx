import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import { ChatViewContext } from "./ChatViewContext.js";
import { MessageList } from "./components/MessageList.js";
import { useChatViewInfo } from "./hooks/useChatViewInfo.js";
import { SessionList } from "./components/SessionList.js";
import { SearchInput } from "./components/SearchInput.js";
import { ChatViewToolbar } from "./components/ChatViewToolbar.js";
import styleText from "./styles.shadow.css";
import "@next-core/theme";

const { defineElement, property } = createDecorators();

/**
 * AI 对话终端
 */
export
@defineElement("advanced.chat-view", {
  styleTexts: [styleText],
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
   * 是否展示聊天工具栏
   */
  @property({
    type: Boolean,
  })
  accessor showToolbar: boolean | undefined;

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

  render() {
    return (
      <ChatViewComponent
        agentId={this.agentId}
        sessionId={this.sessionId}
        showToolbar={this.showToolbar}
        showAvatar={this.showAvatar}
        showSessionList={this.showSessionList}
        showLike={this.showLike}
      />
    );
  }
}

export interface ChatViewProps {
  agentId: string;
  sessionId?: string;
  showToolbar?: boolean;
  showAvatar?: boolean;
  showSessionList?: boolean;
  showLike?: boolean;
}

export function ChatViewComponent({
  agentId,
  showToolbar,
  showAvatar,
  showSessionList = true,
  showLike = true,
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
    updateSession,
    setSearchStr,
  } = useChatViewInfo({
    agentId,
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
          {showToolbar && <ChatViewToolbar />}
          <div className="chat-view">
            <MessageList showAvatar={showAvatar} />
            <SearchInput />
          </div>
        </div>
      </div>
    </ChatViewContext.Provider>
  );
}
