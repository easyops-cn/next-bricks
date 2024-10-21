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
import { uniqueId } from "lodash";
import { InstanceApi_postSearchV3 } from "@next-api-sdk/cmdb-sdk";

export const NEW_SESSION_ID = "new_session_id";
export const RELATED_QUESTIONS_TYPE = "RELATED_QUESTIONS";
export const DEFAULT_TYPE = "TEXT";

const GENERAL_TEXT_TYPES: readonly string[] = [
  "TEXT",
  "tool_call",
  "tool_response",
];

export function isGeneralTextType(type: string | undefined) {
  return GENERAL_TEXT_TYPES.includes(type ?? "TEXT");
}

function isGeneralSameType(a: string | undefined, b: string | undefined) {
  return a === b || (isGeneralTextType(a) && isGeneralTextType(b));
}

export function useChatViewInfo({
  agentId,
  robotId,
  sessionId,
  enterInterval = 50,
  debug,
  answerLanguage,
  useSpiltWord,
  showToolCalls,
}: {
  agentId: string;
  robotId: string;
  sessionId?: string;
  enterInterval?: number;
  debug: boolean;
  answerLanguage?: string;
  useSpiltWord?: boolean;
  showToolCalls?: boolean;
}) {
  const [sessionEnd, setSessionEnd] = useState<boolean>(false);
  const [sessionLoading, setSessionLoading] = useState<boolean>(false);
  const [activeSessionId, setActiveSessionId] = useState<string | undefined>(
    sessionId || NEW_SESSION_ID
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [chatting, setChatting] = useState<boolean>(false);
  const [sessionList, setSessionList] = useState<SessionItem[]>([]);

  const [msgLoading, setMsgLoading] = useState<boolean>(false);
  const [msgEnd, setMsgEnd] = useState<boolean>(false);
  const [msgList, setMsgList] = useState<MessageItem[]>([]);
  const [searchStr, setSearchStr] = useState<string>("");
  const chattingMessageItem = useRef<MessageItem>();
  const sessionSearchQuery = useRef<string | undefined>();
  const haveCreatedSession = useRef<boolean>(false);
  const [toolNames, setToolNames] = useState<Map<string, string | null>>(
    new Map()
  );
  const toolNameRequests = useRef<Map<string, Promise<void>>>(new Map());

  const fetchToolName = useCallback((toolId: string) => {
    // 不要重复查询工具名称
    if (toolNameRequests.current.has(toolId)) {
      return;
    }
    const promise = InstanceApi_postSearchV3("LLM_TOOL@EASYOPS", {
      query: {
        id: toolId,
      },
      fields: ["name"],
    }).then(
      (res) => {
        const list = res.list as { name: string }[];
        const name = list.length > 0 ? list[0].name : null;
        setToolNames((pre) => {
          const newMap = new Map(pre);
          newMap.set(toolId, name);
          return newMap;
        });
      },
      (error) => {
        // eslint-disable-next-line no-console
        console.error("fetch tool name error", error);
      }
    );
    toolNameRequests.current.set(toolId, promise);
  }, []);

  const chatService = useMemo(
    () =>
      new ChatService({
        agentId,
        robotId,
        enterInterval,
        debug,
        answerLanguage,
        useSpiltWord,
      }),
    [agentId, robotId, enterInterval, debug, answerLanguage, useSpiltWord]
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
              key: uniqueId("msg-"),
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
              key: uniqueId("msg-"),
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
      } else if (activeSessionId && !haveCreatedSession.current) {
        // 对于初始化时有activeSessionId的场景，也需要补充一个新增会话项
        const hasNewOne = sessionList.find(
          (item) => item.conversationId === NEW_SESSION_ID
        );
        if (!hasNewOne) {
          newSessionList = [defaultNewSessionItem].concat(newSessionList);
        }
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
      haveCreatedSession.current,
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
        haveCreatedSession.current = true;
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
              key: uniqueId("msg-"),
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
              key: uniqueId("msg-"),
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
    const listener = (_msgItem?: SSEMessageItem) => {
      if (!_msgItem) return;

      const msgItemData = {
        type: DEFAULT_TYPE,
        ..._msgItem,
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

      // 如果未开启显示工具调用过程，则忽略工具调用相关消息
      if (
        !showToolCalls &&
        (msgItemData.type === "tool_call" ||
          msgItemData.type === "tool_response")
      ) {
        return;
      }

      if (msgItemData.type === "tool_call") {
        for (const toolId of msgItemData.delta.tool_calls!.map(
          (call) => call.function.name
        )) {
          fetchToolName(toolId);
        }
      }

      let generalSameType = false;
      const isStart = !chattingMessageItem.current;
      const isUpdate =
        !isStart &&
        (generalSameType =
          isGeneralSameType(
            msgItemData.type,
            chattingMessageItem.current!.type
          ) && msgItemData.taskId === chattingMessageItem.current!.taskId);

      const thisMessage = (chattingMessageItem.current = {
        ...msgItemData,
        role: "assistant",
        content: {
          type: "markdown",
          // 只有普通文本类型才更新聊天文本内容，其他如 `tool_response` 不更新。
          text:
            msgItemData.type == null || msgItemData.type === "TEXT"
              ? `${isUpdate ? chattingMessageItem.current!.content.text : ""}${msgItemData.delta.content}`
              : (chattingMessageItem.current?.content.text ?? ""),
        },
        chatting: true,
        toolCalls:
          msgItemData.type === "tool_call"
            ? [
                ...(chattingMessageItem.current?.toolCalls ?? []),
                ...msgItemData.delta.tool_calls!,
              ]
            : msgItemData.type === "tool_response"
              ? chattingMessageItem.current?.toolCalls?.map((call) =>
                  call.id === msgItemData.delta.tool_call_id
                    ? {
                        ...call,
                        response: msgItemData.delta.content,
                      }
                    : call
                )
              : chattingMessageItem.current?.toolCalls,
        created: moment(msgItemData?.created).format("YYYY-MM-DD HH:mm:ss"),
        key: chattingMessageItem.current?.key ?? uniqueId("msg-"),
      });

      setMsgList((list) => {
        if (isStart || isUpdate) {
          list.pop();
          return list.concat(thisMessage);
        }
        return (
          generalSameType
            ? list
            : list.filter((item) => item.type !== RELATED_QUESTIONS_TYPE)
        )
          .map<MessageItem>((item) => ({ ...item, chatting: false }))
          .concat(thisMessage);
      });
    };
    const reset = () => {
      setChatting(false);
      setLoading(false);
      chattingMessageItem.current = undefined;
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
      if (chattingMessageItem.current) {
        const stopMessageItem: MessageItem = {
          ...chattingMessageItem.current,
          content: {
            type: "markdown",
            text:
              chattingMessageItem.current.content.text +
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
  }, [chatService, activeSessionId, msgList, showToolCalls, fetchToolName]);

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
    toolNames,
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
