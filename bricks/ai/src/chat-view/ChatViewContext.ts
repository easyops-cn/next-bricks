import { createContext, useContext } from "react";
import { AgentDetailItem } from "./components/QuickAnswerList/index.js";
import { SessionItem } from "./ChatService.js";

export type Role = "guide" | "user" | "assistant";

export interface MessageItemContent {
  type: "guide" | "text" | "markdown" | "table" | "load";
  text: string;
  examplePrompts?: string[];
}

export interface MessageItem {
  role: Role;
  content: MessageItemContent;
  created?: number | string;
  key?: number | string;
  conversationId?: string;
  taskId?: string;
  agentId?: string;
  chatting?: boolean;
}

export interface QuickAnswerConfig {
  tip: string;
  list: AgentDetailItem[];
}

interface ChatViewContextProps {
  sessionEnd: boolean;
  sessionLoading: boolean;
  activeSessionId?: string;
  sessionList: SessionItem[];
  msgEnd: boolean;
  msgLoading: boolean;
  msgList: MessageItem[];
  msgItem?: MessageItem;
  loading: boolean;
  chatting: boolean;
  searchStr: string;
  showLike: boolean;
  quickAnswerConfig?: QuickAnswerConfig;
  handleChat: (str: string) => void;
  stopChat: () => void;
  checkSession: (id?: string, isInit?: boolean) => void;
  createSession: () => void;
  setSearchStr: (str: string) => void;
  querySessionHistory: (limit?: number) => void;
}

export const ChatViewContext = createContext<ChatViewContextProps>(
  {} as ChatViewContextProps
);

export const useChatViewContext = (): ChatViewContextProps =>
  useContext(ChatViewContext);
