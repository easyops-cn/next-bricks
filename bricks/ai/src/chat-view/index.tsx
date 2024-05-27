import React, { forwardRef } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import { ChatViewContext, QuickAnswerConfig } from "./ChatViewContext.js";
import { MessageList } from "./components/MessageList.js";
import { useChatViewInfo } from "./hooks/useChatViewInfo.js";
import { SessionList } from "./components/SessionList.js";
import { SearchInput, SearchInputRef } from "./components/SearchInput.js";
import "@next-core/theme";
import "./host-context.css";
import "./index.css";
import { commandBrickConf } from "./ChatViewContext";

const { defineElement, property, method } = createDecorators();

export interface ChatViewProps {
  agentId: string;
  sessionId?: string;
  readonly?: boolean;
  showAvatar?: boolean;
  showSessionList?: boolean;
  showLike?: boolean;
  quickAnswerConfig?: QuickAnswerConfig;
  enterInterval?: number;
  debug?: boolean;
  commandBricks?: commandBrickConf;
  answerLanguage?: string;
}

export function LegacyChatViewComponent(
  {
    agentId,
    sessionId,
    showAvatar,
    showSessionList = true,
    readonly = false,
    showLike = true,
    quickAnswerConfig,
    enterInterval,
    debug = false,
    commandBricks,
    answerLanguage,
  }: ChatViewProps,
  ref: React.Ref<SearchInputRef>
) {
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
    debug,
    answerLanguage,
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
        commandBricks,
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
          {!readonly && <SearchInput ref={ref} />}
        </div>
      </div>
    </ChatViewContext.Provider>
  );
}

export const ChatViewComponent = forwardRef(LegacyChatViewComponent);

/**
 * AI 对话终端
 */
export
@defineElement("ai.chat-view", {
  // shadow 模式下，会导致 useBrick 样式丢失
  // 如：commandBricks 配置 cmdb-instances.instance-list
  shadowOptions: false,
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
   * 指定智能体回答代码时所使用的语言
   */
  @property()
  accessor answerLanguage: string | undefined;

  /**
   * 是否为debug模式
   */
  @property({
    type: Boolean,
  })
  accessor debug: boolean | undefined;

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

  /**
   * 自定义语言配置
   */
  @property({
    attribute: false,
  })
  accessor commandBricks: commandBrickConf | undefined;

  #ref = React.createRef<SearchInputRef>();

  /**
   *
   * @description 调用方法进行提问
   */
  @method()
  insertQuestion(args: { value: string }): void {
    const { value } = args;
    if (!value) return;
    this.#ref.current?.handleInsertQuestion(value);
  }

  /**
   * @description 外部提问
   */
  @method()
  sendMsg(msg: string): void {
    this.#ref.current?.sendMsg(msg);
  }

  render() {
    return (
      <ChatViewComponent
        agentId={this.agentId}
        debug={this.debug}
        sessionId={this.sessionId}
        readonly={this.readonly}
        showAvatar={this.showAvatar}
        showSessionList={this.showSessionList}
        showLike={this.showLike}
        quickAnswerConfig={this.quickAnswerConfig}
        enterInterval={this.enterInterval}
        commandBricks={this.commandBricks}
        answerLanguage={this.answerLanguage}
        ref={this.#ref}
      />
    );
  }
}
