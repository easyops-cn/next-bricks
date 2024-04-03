import { createContext, useContext } from "react";
import { AgentDetailItem } from "./components/QuickAnswerList/index.js";

export type Role = "guide" | "user" | "assistant";

export interface MessageItemContent {
  type: "guide" | "text" | "markdown" | "table" | "load";
  text: string;
  examplePrompts?: string[];
}

export interface MessageItem {
  role: Role;
  content: MessageItemContent[];
  ctime?: number | string;
  key?: number;
  chatting?: boolean;
}

export interface SessionItem {
  title: string;
  ctime: number;
  id: string;
  active?: boolean;
}

export interface QuickAnswerConfig {
  tip: string;
  list: AgentDetailItem[];
}

interface ChatViewContextProps {
  activeSessionId: string;
  sessionList: SessionItem[];
  msgList: MessageItem[];
  msgItem?: MessageItem;
  loading: boolean;
  chartting: boolean;
  searchStr: string;
  showLike: boolean;
  quickAnswerConfig?: QuickAnswerConfig;
  handleChat: (str: string) => void;
  updateSession: (id: string) => void;
  createSession: () => void;
  setSearchStr: (str: string) => void;
}

export const ChatViewContext = createContext<ChatViewContextProps>(
  {} as ChatViewContextProps
);

export const useChatViewContext = (): ChatViewContextProps =>
  useContext(ChatViewContext);
