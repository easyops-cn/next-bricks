import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MessageItem, SessionItem } from "../ChatViewContext.js";
import { mockList2, mockmsgList } from "../mockList.js";
import moment from "moment";
import { ChatService, SSEMessageItem } from "../ChatService.js";

export function useChatViewInfo({
  agentId,
  enterInterval = 50,
}: {
  agentId: string;
  enterInterval?: number;
}) {
  const [activeSessionId, setActiveSessionid] = useState<string>("1");
  const [loading, setLoading] = useState<boolean>(false);
  const [chatting, setChatting] = useState<boolean>(false);
  const [sessionList, setSessionList] = useState<SessionItem[]>([]);
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

  useEffect(() => {
    // mock
    // setMsgList(mockmsgList);
  }, []);

  useEffect(() => {
    // chatService.getSessionList();
    // mock
    setSessionList([
      {
        title: "会话一",
        id: "1",
        ctime: 1710731756,
        active: true,
      },
      // {
      //   title: "会话二",
      //   id: "2",
      //   ctime: 1710731756,
      // },
    ]);
  }, []);

  useEffect(() => {
    const listener = (msgItem?: SSEMessageItem) => {
      if (!msgItem) return;
      chatingText.current =
        chatingText.current +
        msgItem.messages.map((item) => item.content.text).toString();
      // eslint-disable-next-line no-console
      console.log(chatingText.current);
      chatingMessageItem.current = {
        role: "assistant",
        content: [
          {
            type: "markdown",
            text: chatingText.current,
          },
        ],
        key: Math.random(),
        ctime: msgItem?.ctime,
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
    const stopListener = () => {
      setMsgList((list) => {
        if (chatingMessageItem.current) {
          chatingMessageItem.current?.content.push({
            type: "markdown",
            text: "` 对话被中断了 `",
          });
          return list.concat(chatingMessageItem.current);
        }
        return list;
      });
      reset();
    };
    chatService.subscribe("add", listener);
    chatService.subscribe("finish", finishListener);
    chatService.subscribe("stop", stopListener);
    return () => {
      chatService.unsubscribe("add", listener);
      chatService.unsubscribe("finish", finishListener);
      chatService.unsubscribe("stop", stopListener);
    };
  }, [chatService]);

  const handleChat = useCallback(
    async (str: string) => {
      setChatting(true);
      chatService.chat(str);
      setMsgList((list) => {
        return list.concat({
          role: "user",
          content: [
            {
              type: "text",
              text: str,
            },
          ],
          ctime: moment().format("YYYY-MM-DD HH:mm:ss"),
        });
      });
      setMsgItem({
        role: "assistant",
        content: [
          {
            type: "load",
            text: "",
          },
        ],
        ctime: "Now",
      });
    },
    [chatService]
  );

  const stopChat = useCallback(() => {
    chatService.stop();
  }, [chatService]);

  const createSession = useCallback(() => {
    setMsgList([]);
    chatService.setConversationId();
  }, [chatService]);

  const updateSession = useCallback(async (id: string) => {
    setLoading(true);
    setMsgList([]);
    setActiveSessionid(id);
    const mockSearch = async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(id === "1" ? mockmsgList : mockList2);
        }, 5000);
      });
    };
    const list = await mockSearch();
    setMsgList(list as any);
    setLoading(false);
  }, []);

  return {
    loading,
    chatting,
    activeSessionId,
    sessionList,
    searchStr,
    msgList,
    msgItem,
    handleChat,
    stopChat,
    createSession,
    updateSession,
    setSearchStr,
  };
}
