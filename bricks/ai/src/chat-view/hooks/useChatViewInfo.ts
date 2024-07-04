import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MessageItem } from "../ChatViewContext.js";
import moment from "moment";
import {
  ChatBody,
  ChatItem,
  ChatService,
  SessionItem,
  SSEMessageItem,
} from "../ChatService.js";

const NEW_SESSION_ID = "new_session_id";

export function useChatViewInfo({
  agentId,
  robotId,
  sessionId,
  enterInterval = 50,
  debug,
  answerLanguage,
}: {
  agentId: string;
  robotId: string;
  sessionId?: string;
  enterInterval?: number;
  debug: boolean;
  answerLanguage?: string;
}) {
  const [sessionEnd, setSessionEnd] = useState<boolean>(false);
  const [sessionLoading, setSessionLoading] = useState<boolean>(false);
  const [activeSessionId, setActiveSessionId] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [chatting, setChatting] = useState<boolean>(false);
  const [sessionList, setSessionList] = useState<SessionItem[]>([]);

  const [msgLoading, setMsgLoading] = useState<boolean>(false);
  const [msgEnd, setMsgEnd] = useState<boolean>(false);
  const [msgList, setMsgList] = useState<MessageItem[]>([]);
  const [searchStr, setSearchStr] = useState<string>("");
  const chatingText = useRef<string>("");
  const chatingMessageItem = useRef<MessageItem>();
  const chatService = useMemo(
    () =>
      new ChatService({
        agentId,
        robotId,
        enterInterval,
        debug,
        answerLanguage,
      }),
    [agentId, robotId, enterInterval, debug, answerLanguage]
  );

  const defaultNewSessionItem = useMemo(
    () =>
      ({
        conversationId: NEW_SESSION_ID,
        title: "新建会话",
      }) as SessionItem,
    []
  );

  const stopChat = useCallback(() => {
    chatService.stop();
  }, [chatService]);

  const setAgent = useCallback(
    (id: string) => {
      chatService.setAgentId(id);
    },
    [chatService]
  );

  const checkSession = useCallback(
    async (id?: string, isInit = false) => {
      if (isInit && id) {
        // 切换聊天，重制状态
        setMsgEnd(false);
        setMsgLoading(false);
        setLoading(true);
        setMsgList([]);
        setActiveSessionId(id);
        if (chatting) {
          stopChat();
        }
      } else {
        setMsgLoading(true);
      }
      // 如果是新建会话，不需要查询历史
      if (id === NEW_SESSION_ID) {
        // 重置会话id
        chatService.setConversationId();
        setMsgEnd(true);
        setLoading(false);
        return;
      }
      const list = await chatService.getChatHistory(id);
      const computedList = (list: ChatItem[]) => {
        const newList: MessageItem[] = [];
        list.forEach((item) => {
          newList.unshift(
            {
              agentId: item.agentId,
              robotId: item.robotId,
              taskId: item.taskId,
              conversationId: item.conversationId,
              role: "user",
              content: {
                type: "markdown",
                text: item.input,
              },
              key: `user_${item.taskId}`,
              created: item.time,
            },
            {
              agentId: item.agentId,
              taskId: item.taskId,
              conversationId: item.conversationId,
              role: "assistant",
              content: {
                type: "markdown",
                text: item.output,
              },
              key: `assistant_${item.taskId}`,
              created: item.inputTime,
              tag: item.tag,
            }
          );
        });
        return newList.filter((item) => item.content.text);
      };
      setMsgList((preList) => {
        return computedList(list).concat(preList);
      });
      setMsgLoading(false);
      setLoading(false);
    },
    [chatService, chatting, stopChat]
  );

  const deleteSession = useCallback(
    async (ids: string[]): Promise<boolean> => {
      // 需要过滤新建会话, 因为新建会话在本地，还没上报到远端
      const filterIds = ids.filter((item) => item !== NEW_SESSION_ID);
      const result = await chatService.deleteSession(filterIds);
      if (result) {
        let deleteActiveSession = false;
        if (
          activeSessionId &&
          filterIds.includes(activeSessionId) &&
          activeSessionId !== NEW_SESSION_ID
        ) {
          // 如果删除会话包含当前会话，需要重置状态
          deleteActiveSession = true;
          // 清除会话id
          chatService.setConversationId();

          setMsgEnd(false);
          setMsgLoading(false);
          setMsgList([]);

          if (chatting) {
            stopChat();
          }
        }

        setSessionList((list) => {
          const newList = list.filter(
            (item) => !filterIds.includes(item.conversationId!)
          );
          if (deleteActiveSession) {
            // 已经选中的当前会话被删除，新建会话
            const hasNewOne = list.find(
              (item) => item.conversationId === NEW_SESSION_ID
            );
            setLoading(false);

            setActiveSessionId(NEW_SESSION_ID);
            if (hasNewOne) {
              return newList;
            } else {
              return [defaultNewSessionItem].concat(newList);
            }
          }
          return newList;
        });
      }
      return result;
    },
    [activeSessionId, chatService, chatting, defaultNewSessionItem, stopChat]
  );

  const querySessionHistory = useCallback(
    async (limit?: number) => {
      setSessionLoading(true);
      const list = await chatService.getSessionHistory(limit);
      if (!activeSessionId) {
        // 如果没有 activeSessionId, 默认新增会话
        setActiveSessionId(NEW_SESSION_ID);
      }
      setSessionList((preList) => {
        return !activeSessionId
          ? [defaultNewSessionItem].concat([...preList, ...list])
          : preList.concat(list);
      });
      setSessionLoading(false);
    },
    [chatService, activeSessionId, defaultNewSessionItem]
  );

  const handleChat = useCallback(
    async (msg: string | ChatBody) => {
      const inputMsg = typeof msg === "string" ? msg : msg.input;
      if (activeSessionId === NEW_SESSION_ID) {
        // 如果当前会话属于新建会话，更新会话历史数据
        setSessionList((list) => {
          return list.map((item) => ({
            ...item,
            title:
              item.conversationId === NEW_SESSION_ID ? inputMsg : item.title,
          }));
        });
      }
      setChatting(true);
      chatService.chat(msg);
      setMsgList((list) => {
        return list.concat([
          {
            role: "user",
            content: {
              type: "markdown",
              text: inputMsg,
            },
            created: moment().format("YYYY-MM-DD HH:mm:ss"),
          },
          {
            role: "assistant",
            content: {
              type: "load",
              text: "",
            },
            chatting: true,
            created: "Now",
          },
        ]);
      });
    },
    [chatService, activeSessionId]
  );

  const createSession = useCallback(() => {
    chatService.setConversationId();
    setMsgList([]);
    setActiveSessionId(NEW_SESSION_ID);
    const hasNewOne = sessionList.find(
      (item) => item.conversationId === NEW_SESSION_ID
    );
    if (!hasNewOne) {
      setSessionList((preList) => {
        return [defaultNewSessionItem].concat(preList);
      });
    }
  }, [chatService, sessionList, defaultNewSessionItem]);

  const handleIsLike = useCallback(
    async (id: string, isLike: boolean): Promise<boolean> => {
      const result = await chatService.setChatItemIsLike(id, isLike);
      if (result) {
        setMsgList((list) => {
          return list.map((item) => ({
            ...item,
            tag:
              id === item.taskId
                ? {
                    isLike,
                  }
                : item.tag,
          }));
        });
      }
      return result;
    },
    [chatService]
  );

  useEffect(() => {
    if (sessionId) {
      checkSession(sessionId);
    }
  }, [sessionId]);

  useEffect(() => {
    // session listener
    const handleSessionEnd = () => {
      setSessionEnd(true);
    };
    chatService.subscribe("session.fetch.end", handleSessionEnd);

    return () => {
      chatService.subscribe("session.fetch.end", handleSessionEnd);
    };
  }, [chatService]);

  useEffect(() => {
    // chat listener
    const listener = (msgItem?: SSEMessageItem) => {
      if (!msgItem) return;
      if (activeSessionId === NEW_SESSION_ID && msgItem.conversationId) {
        // 如果当前会话属于新建会话，更新会话历史数据
        setSessionList((list) => {
          return list.map((item) => ({
            ...item,
            conversationId:
              item.conversationId === NEW_SESSION_ID
                ? msgItem.conversationId!
                : item.conversationId,
          }));
        });
        setActiveSessionId(msgItem.conversationId);
      }

      if (
        !chatingMessageItem.current ||
        msgItem.taskId === chatingMessageItem.current?.taskId
      ) {
        // 同一taskId的消息处理
        chatingText.current = chatingText.current + msgItem.delta.content;
        // eslint-disable-next-line no-console
        // console.log(chatingText.current);
        chatingMessageItem.current = {
          ...msgItem,
          role: "assistant",
          content: {
            type: "markdown",
            text: chatingText.current,
          },
          chatting: true,
          created: moment(msgItem?.created).format("YYYY-MM-DD HH:mm:ss"),
        };
        setMsgList((list) => {
          list.pop();
          return list.concat(chatingMessageItem.current!);
        });
      } else {
        // 当一次chat过程中，又出现不同taskId的消息，需要分开消息框展示
        chatingText.current = msgItem.delta.content;
        chatingMessageItem.current = {
          ...msgItem,
          role: "assistant",
          content: {
            type: "markdown",
            text: chatingText.current,
          },
          chatting: true,
          created: moment(msgItem?.created).format("YYYY-MM-DD HH:mm:ss"),
        };
        setMsgList((list) => {
          return list
            .map((item) => ({ ...item, chatting: false }))
            .concat(chatingMessageItem.current! as any);
        });
      }
    };
    const reset = () => {
      chatingText.current = "";
      setChatting(false);
      setLoading(false);
      chatingMessageItem.current = undefined;
    };
    const finishListener = () => {
      setMsgList((list) => {
        return list.map((item) => ({
          ...item,
          chatting: false,
        }));
      });
      reset();
    };
    const fetchEndListener = () => {
      setMsgEnd(true);
    };
    const stopListener = () => {
      if (chatingMessageItem.current) {
        const stopMessageItem: MessageItem = {
          ...chatingMessageItem.current,
          content: {
            type: "markdown",
            text:
              chatingMessageItem.current.content.text +
              " \\\n  ` 对话被中断了 `",
          },
        };
        setMsgList((list) => {
          list.pop();
          return msgList.concat(stopMessageItem);
        });
      } else {
        setMsgList((list) => {
          return list.filter((item) => item.content.type !== "load");
        });
      }
      reset();
    };
    chatService.subscribe("add", listener);
    chatService.subscribe("finish", finishListener);
    chatService.subscribe("stop", stopListener);
    chatService.subscribe("message.fetch.end", fetchEndListener);
    return () => {
      chatService.unsubscribe("add", listener);
      chatService.unsubscribe("finish", finishListener);
      chatService.unsubscribe("stop", stopListener);
      chatService.unsubscribe("message.fetch.end", fetchEndListener);
    };
  }, [chatService, activeSessionId, msgList]);

  return {
    sessionEnd,
    sessionLoading,
    loading,
    chatting,
    activeSessionId,
    sessionList,
    searchStr,
    msgEnd,
    msgLoading,
    msgList,
    setAgent,
    handleChat,
    stopChat,
    createSession,
    deleteSession,
    checkSession,
    setSearchStr,
    querySessionHistory,
    handleIsLike,
  };
}
