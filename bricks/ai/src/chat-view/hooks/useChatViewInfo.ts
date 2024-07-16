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

export const NEW_SESSION_ID = "new_session_id";
export const RELATED_QUESTIONS_TYPE = "RELATED_QUESTIONS";
export const DEFAULT_TYPE = "TEXT";

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
  const sessionSearchQuery = useRef<string | undefined>();
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
              type: DEFAULT_TYPE,
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
              type: DEFAULT_TYPE,
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

  const updateSession = useCallback(
    async (id: string, data: Partial<SessionItem>): Promise<boolean> => {
      const result = await chatService.updateSession(id, data);
      if (result && data?.title) {
        // 如果成功修改title，需要修改本地展示
        setSessionList((list: any) => {
          return list.map((item: any) => ({
            ...item,
            title: item.conversationId === id ? data.title : item?.title,
          }));
        });
      }
      return result;
    },
    [activeSessionId, chatService, chatting, defaultNewSessionItem, stopChat]
  );

  const querySessionHistory = useCallback(
    async (limit?: number, query?: string) => {
      setSessionLoading(true);
      const list = await chatService.getSessionHistory(limit, query);
      let newSessionList = list;
      if (!activeSessionId) {
        // 如果没有 activeSessionId, 默认新增会话
        setActiveSessionId(NEW_SESSION_ID);
        setMsgList([]);
      }
      if (!query || sessionSearchQuery.current === query) {
        // 如果没有搜索或者搜索关键词相同，则直接拼接
        newSessionList = [...sessionList].concat(newSessionList);
      } else {
        // 如果搜索关键词不同
        setSessionEnd(false);
      }

      if (!activeSessionId) {
        // 如果没有 activeSessionId, 补充一个新增会话项
        newSessionList = [defaultNewSessionItem].concat(newSessionList);
      }

      sessionSearchQuery.current = query;
      setSessionList(newSessionList);
      setSessionLoading(false);
    },
    [
      chatService,
      activeSessionId,
      sessionList,
      defaultNewSessionItem,
      sessionSearchQuery,
    ]
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
        return list
          .filter((item) => item.type !== RELATED_QUESTIONS_TYPE)
          .concat([
            {
              role: "user",
              content: {
                type: "markdown",
                text: inputMsg,
              },
              created: moment().format("YYYY-MM-DD HH:mm:ss"),
              type: DEFAULT_TYPE,
            },
            {
              role: "assistant",
              content: {
                type: "load",
                text: "",
              },
              chatting: true,
              created: "Now",
              type: DEFAULT_TYPE,
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
    } else {
      // 因为在sessionList内部会有一次querySessionHistory的初始调用，设置activeSessionId等
      // 此处兼容处理不显示sessionList时的场景（如，嵌入iframe）
      querySessionHistory(30);
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

      const msgItemData = {
        type: DEFAULT_TYPE,
        ...msgItem,
      };

      if (activeSessionId === NEW_SESSION_ID && msgItemData.conversationId) {
        // 如果当前会话属于新建会话，更新会话历史数据
        setSessionList((list) => {
          return list.map((item) => ({
            ...item,
            conversationId:
              item.conversationId === NEW_SESSION_ID
                ? msgItemData.conversationId!
                : item.conversationId,
          }));
        });
        setActiveSessionId(msgItemData.conversationId);
      }

      if (
        !chatingMessageItem.current ||
        (msgItemData.type === chatingMessageItem.current?.type &&
          msgItemData.taskId === chatingMessageItem.current?.taskId)
      ) {
        // 当初次触发chat,或者chat过程中持续对同一type同一taskId的消息进行处理
        chatingText.current = chatingText.current + msgItemData.delta.content;
        chatingMessageItem.current = {
          ...msgItemData,
          role: "assistant",
          content: {
            type: "markdown",
            text: chatingText.current,
          },
          chatting: true,
          created: moment(msgItemData?.created).format("YYYY-MM-DD HH:mm:ss"),
        };
        setMsgList((list) => {
          list.pop();
          return list.concat(chatingMessageItem.current!);
        });
      } else if (
        msgItemData.type === chatingMessageItem.current?.type &&
        msgItemData.taskId !== chatingMessageItem.current?.taskId
      ) {
        // 对于同一type不同taskId的消息，需要分开消息框展示
        chatingText.current = msgItemData.delta.content;
        chatingMessageItem.current = {
          ...msgItemData,
          role: "assistant",
          content: {
            type: "markdown",
            text: chatingText.current,
          },
          chatting: true,
          created: moment(msgItemData?.created).format("YYYY-MM-DD HH:mm:ss"),
        };
        setMsgList((list) => {
          return list
            .map((item) => ({ ...item, chatting: false }))
            .concat(chatingMessageItem.current! as any);
        });
      } else if (msgItemData.type !== chatingMessageItem.current?.type) {
        // 当消息type发生变化，需要拆分
        switch (msgItemData.type) {
          case RELATED_QUESTIONS_TYPE:
          default:
            chatingText.current = msgItemData.delta.content;
            chatingMessageItem.current = {
              ...msgItemData,
              role: "assistant",
              content: {
                type: "markdown",
                text: chatingText.current,
              },
              chatting: true,
              created: moment(msgItemData?.created).format(
                "YYYY-MM-DD HH:mm:ss"
              ),
            };
            setMsgList((list) => {
              return list
                .map((item) => ({ ...item, chatting: false }))
                .filter((item) => item.type !== RELATED_QUESTIONS_TYPE)
                .concat(chatingMessageItem.current! as any);
            });
        }
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
    updateSession,
    checkSession,
    setSearchStr,
    querySessionHistory,
    handleIsLike,
  };
}
