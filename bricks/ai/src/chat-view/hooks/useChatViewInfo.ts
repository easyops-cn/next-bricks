import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MessageItem } from "../ChatViewContext.js";
import moment from "moment";
import {
  ChatItem,
  ChatService,
  SessionItem,
  SSEMessageItem,
} from "../ChatService.js";

const NEW_SESSION_ID = "new_session_id";

export function useChatViewInfo({
  agentId,
  enterInterval = 50,
}: {
  agentId: string;
  enterInterval?: number;
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
  const [msgItem, setMsgItem] = useState<MessageItem>();
  const [searchStr, setSearchStr] = useState<string>("");
  const chatingText = useRef<string>("");
  const chatingMessageItem = useRef<MessageItem>();
  const chatService = useMemo(
    () =>
      new ChatService({
        agentId,
        enterInterval,
      }),
    [agentId, enterInterval]
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
        setLoading(false);
        return;
      }
      const list = await chatService.getChatHistory(id);
      const computedList = (list: ChatItem[]) => {
        const newList: MessageItem[] = [];
        list.forEach((item) => {
          newList.unshift(
            {
              taskId: item.taskId,
              role: "user",
              content: {
                type: "text",
                text: item.input,
              },
              key: `user_${item.taskId}`,
              created: item.time,
            },
            {
              taskId: item.taskId,
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
      } else {
        await checkSession(activeSessionId);
      }
      setSessionList((preList) => {
        return !activeSessionId
          ? [defaultNewSessionItem].concat([...preList, ...list])
          : preList.concat(list);
      });
      setSessionLoading(false);
    },
    [chatService, activeSessionId, defaultNewSessionItem, checkSession]
  );

  const handleChat = useCallback(
    async (str: string) => {
      if (activeSessionId === NEW_SESSION_ID) {
        // 如果当前会话属于新建会话，更新会话历史数据
        setSessionList((list) => {
          return list.map((item) => ({
            ...item,
            title: item.conversationId === NEW_SESSION_ID ? str : item.title,
          }));
        });
      }
      setChatting(true);
      chatService.chat(str);
      setMsgList((list) => {
        return list.concat({
          role: "user",
          content: {
            type: "text",
            text: str,
          },
          created: moment().format("YYYY-MM-DD HH:mm:ss"),
        });
      });
      setMsgItem({
        role: "assistant",
        content: {
          type: "load",
          text: "",
        },
        created: "Now",
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
      chatingText.current = chatingText.current + msgItem.delta.content;
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
      // eslint-disable-next-line no-console
      // console.log(chatingText.current);
      chatingMessageItem.current = {
        role: "assistant",
        content: {
          type: "markdown",
          text: chatingText.current,
        },
        key: Math.random(),
        created: moment(msgItem?.created).format("YYYY-MM-DD HH:mm:ss"),
      };
      setMsgItem(chatingMessageItem.current);
    };
    const reset = () => {
      chatingText.current = "";
      setMsgItem(undefined);
      setChatting(false);
      chatingMessageItem.current = undefined;
    };
    const finishListener = () => {
      setMsgList((list) => {
        return list.concat(chatingMessageItem.current!);
      });
      reset();
    };
    const fetchEndListener = () => {
      setMsgEnd(true);
    };
    const stopListener = () => {
      setMsgList((list) => {
        if (chatingMessageItem.current) {
          chatingMessageItem.current.content = {
            type: "markdown",
            text:
              chatingMessageItem.current.content.text +
              " \\\n  ` 对话被中断了 `",
          };
          return list.concat(chatingMessageItem.current);
        }
        return list;
      });
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
  }, [chatService, activeSessionId]);

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
    msgItem,
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
