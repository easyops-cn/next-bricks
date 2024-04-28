import { createContext, useContext } from "react";
import { MessageItem } from "../../ChatViewContext";

export const MsgItemContext = createContext<MessageItem>({} as MessageItem);

export const useMsgItemContext = (): MessageItem => useContext(MsgItemContext);
