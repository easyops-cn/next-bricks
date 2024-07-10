import { createContext, useContext } from "react";
import { AgentDetailItem } from "./components/QuickAnswerList/index.js";
import { ChatBody, SessionItem } from "./ChatService.js";
import { UseBrickConf } from "@next-core/types";

export type Role = "guide" | "user" | "assistant";

export type commandBrickConf = Record<
  string,
  { useBrick: UseBrickConf; showOriginData?: boolean }
>;

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
  robotId?: string;
  chatting?: boolean;
  tag?: {
    isLike?: boolean;
  };
  type?: string;
}

export interface QuickAnswerConfig {
  tip: string;
  list: AgentDetailItem[];
}

export interface snippet {
  content: string;
  name: string;
}

interface ChatViewContextProps {
  sessionEnd: boolean;
  sessionLoading: boolean;
  activeSessionId?: string;
  sessionList: SessionItem[];
  msgEnd: boolean;
  msgLoading: boolean;
  msgList: MessageItem[];
  loading: boolean;
  chatting: boolean;
  searchStr: string;
  showLike: boolean;
  showShare: boolean;
  readonly: boolean;
  quickAnswerConfig?: QuickAnswerConfig;
  snippetList?: snippet[];
  commandBricks?: commandBrickConf;
  setAgent: (id: string) => void;
  handleIsLike: (id: string, isLike: boolean) => Promise<boolean>;
  handleChat: (str: string | ChatBody) => void;
  stopChat: () => void;
  checkSession: (id?: string, isInit?: boolean) => void;
  createSession: () => void;
  deleteSession: (ids: string[]) => Promise<boolean>;
  setSearchStr: (str: string) => void;
  querySessionHistory: (limit?: number) => void;
}

export const ChatViewContext = createContext<ChatViewContextProps>(
  {} as ChatViewContextProps
);

export const useChatViewContext = (): ChatViewContextProps =>
  useContext(ChatViewContext);
