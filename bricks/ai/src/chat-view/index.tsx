import React, { forwardRef } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import {
  ChatViewContext,
  QuickAnswerConfig,
  snippet,
} from "./ChatViewContext.js";
import { MessageList } from "./components/MessageList.js";
import { useChatViewInfo } from "./hooks/useChatViewInfo.js";
import { SessionList } from "./components/SessionList.js";
import { SearchInput, SearchInputRef } from "./components/SearchInput.js";
import "@next-core/theme";
import "./host-context.css";
import "./index.css";
import { commandBrickConf } from "./ChatViewContext";
import { UseBrickConf } from "@next-core/types";
import { ChatBody } from "./ChatService.js";

const { defineElement, property, method } = createDecorators();

type InputToolbarBrick = { useBrick: UseBrickConf };

export interface ChatViewProps {
  agentId: string;
  robotId: string;
  sessionId?: string;
  readonly?: boolean;
  showAvatar?: boolean;
  showSessionList?: boolean;
  showLike?: boolean;
  showShare?: boolean;
  quickAnswerConfig?: QuickAnswerConfig;
  snippetList?: snippet[];
  enterInterval?: number;
  debug?: boolean;
  commandBricks?: commandBrickConf;
  answerLanguage?: string;
  inputToolbarBrick?: InputToolbarBrick;
}

export function LegacyChatViewComponent(
  {
    agentId,
    robotId,
    sessionId,
    showAvatar,
    showSessionList = true,
    readonly = false,
    showLike = true,
    showShare = true,
    quickAnswerConfig,
    snippetList,
    enterInterval,
    debug = false,
    commandBricks,
    answerLanguage,
    inputToolbarBrick,
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
    updateSession,
    checkSession,
    setSearchStr,
    querySessionHistory,
  } = useChatViewInfo({
    agentId,
    robotId,
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
        showShare,
        readonly,
        quickAnswerConfig,
        snippetList,
        commandBricks,
        setAgent,
        handleIsLike,
        handleChat,
        stopChat,
        createSession,
        deleteSession,
        updateSession,
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
          {!readonly && (
            <SearchInput inputToolbarBrick={inputToolbarBrick} ref={ref} />
          )}
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
   * 机器人id
   */
  @property()
  accessor robotId!: string;

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
   * 是否展示分享能力
   * @default true
   */
  @property({
    type: Boolean,
  })
  accessor showShare: boolean | undefined;

  /**
   * 输入间隔，设置为 -1 使用新的方式对大段消息进行模拟打字效果节流输出
   *
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
   * 常用语列表
   */
  @property({
    attribute: false,
  })
  accessor snippetList: snippet[] | undefined;

  /**
   * 自定义语言配置
   */
  @property({
    attribute: false,
  })
  accessor commandBricks: commandBrickConf | undefined;

  /**
   * 输入框工具栏 useBrick
   */
  @property({
    attribute: false,
  })
  accessor inputToolbarBrick: InputToolbarBrick | undefined;

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
  sendMsg(msg: string | ChatBody): void {
    this.#ref.current?.sendMsg(msg);
  }

  render() {
    return (
      <ChatViewComponent
        agentId={this.agentId}
        robotId={this.robotId}
        debug={this.debug}
        sessionId={this.sessionId}
        readonly={this.readonly}
        showAvatar={this.showAvatar}
        showSessionList={this.showSessionList}
        showLike={this.showLike}
        showShare={this.showShare}
        quickAnswerConfig={this.quickAnswerConfig}
        snippetList={this.snippetList}
        enterInterval={this.enterInterval}
        commandBricks={this.commandBricks}
        answerLanguage={this.answerLanguage}
        inputToolbarBrick={this.inputToolbarBrick}
        ref={this.#ref}
      />
    );
  }
}
