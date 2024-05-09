import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import { ChatViewContext, QuickAnswerConfig } from "./ChatViewContext.js";
import { MessageList } from "./components/MessageList.js";
import { useChatViewInfo } from "./hooks/useChatViewInfo.js";
import { SessionList } from "./components/SessionList.js";
import { SearchInput } from "./components/SearchInput.js";
import styleText from "./styles.shadow.css";
import loadStyleText from "./components/loading.shadow.css";
import markdownStyleText from "./components/MessageItem/Markdown/markdown.shadow.css";
import quickAnswerListStyleText from "./components/QuickAnswerList/quickAnswerList.shadow.css";
import CodeBlockStyleText from "./components/MessageItem/Markdown/CodeBlock/CodeBlock.shadow.css";
import "@next-core/theme";
import "./host-context.css";

const { defineElement, property } = createDecorators();

/**
 * AI 对话终端
 */
export
@defineElement("ai.chat-view", {
  styleTexts: [
    styleText,
    loadStyleText,
    markdownStyleText,
    quickAnswerListStyleText,
    CodeBlockStyleText,
  ],
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
   * 只读模式
   */
  @property({
    type: Boolean,
  })
  accessor readonly: boolean | undefined;

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

  /**
   * 快速入口列表
   */
  @property({
    attribute: false,
  })
  accessor quickAnswerConfig: QuickAnswerConfig | undefined;

  render() {
    return (
      <ChatViewComponent
        agentId={this.agentId}
        sessionId={this.sessionId}
        readonly={this.readonly}
        showAvatar={this.showAvatar}
        showSessionList={this.showSessionList}
        showLike={this.showLike}
        quickAnswerConfig={this.quickAnswerConfig}
        enterInterval={this.enterInterval}
      />
    );
  }
}

export interface ChatViewProps {
  agentId: string;
  sessionId?: string;
  readonly?: boolean;
  showAvatar?: boolean;
  showSessionList?: boolean;
  showLike?: boolean;
  quickAnswerConfig?: QuickAnswerConfig;
  enterInterval?: number;
}

export function ChatViewComponent({
  agentId,
  sessionId,
  showAvatar,
  showSessionList = true,
  readonly = false,
  showLike = true,
  quickAnswerConfig,
  enterInterval,
}: ChatViewProps) {
  const {
    sessionEnd,
    sessionLoading,
    activeSessionId,
    msgEnd,
    msgLoading,
    msgList,
    sessionList,
    loading,
    chatting,
    searchStr,
    setAgent,
    handleIsLike,
    handleChat,
    stopChat,
    createSession,
    deleteSession,
    checkSession,
    setSearchStr,
    querySessionHistory,
  } = useChatViewInfo({
    agentId,
    sessionId,
    enterInterval,
  });

  return (
    <ChatViewContext.Provider
      value={{
        sessionEnd,
        sessionLoading,
        activeSessionId,
        sessionList,
        msgEnd,
        msgLoading,
        msgList,
        chatting,
        loading,
        searchStr,
        showLike,
        readonly,
        quickAnswerConfig,
        setAgent,
        handleIsLike,
        handleChat,
        stopChat,
        createSession,
        deleteSession,
        checkSession,
        setSearchStr,
        querySessionHistory,
      }}
    >
      <div className="chat-view-container">
        {showSessionList && (
          <div className="chat-view-selector">
            <SessionList />
          </div>
        )}
        <div className="chat-view-content">
          <MessageList showAvatar={showAvatar} />
          {!readonly && <SearchInput />}
        </div>
      </div>
    </ChatViewContext.Provider>
  );
}
