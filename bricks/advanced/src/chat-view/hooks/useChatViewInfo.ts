import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MessageItem, SessionItem } from "../ChatViewContext.js";
import { mockList2, mockmsgList } from "../mockList.js";
import moment from "moment";
import { ChatService, SSEMessageItem } from "../ChatService.js";

export function useChatViewInfo({ agentId }: { agentId: string }) {
  const [activeSessionId, setActiveSessionid] = useState<string>("1");
  const [loading, setLoading] = useState<boolean>(false);
  const [chartting, setChatting] = useState<boolean>(false);
  const [sessionList, setSessionList] = useState<SessionItem[]>([]);
  const [msgList, setMsgList] = useState<MessageItem[]>([]);
  const [msgItem, setMsgItem] = useState<MessageItem>();
  const [searchStr, setSearchStr] = useState<string>("");
  const chartingText = useRef<string>("");
  const chartingMessageItem = useRef<MessageItem>();
  const chartService = useMemo(
    () =>
      new ChatService({
        agentId,
      }),
    [agentId]
  );

  useEffect(() => {
    // mock
    // setMsgList(mockmsgList);
  }, []);

  useEffect(() => {
    // chartService.getSessionList();
    // mock
    setSessionList([
      {
        title: "会话一",
        id: "1",
        ctime: 1710731756,
        active: true,
      },
    ]);
  }, []);

  useEffect(() => {
    const listener = (msgItem?: SSEMessageItem) => {
      if (!msgItem) return;
      chartingText.current =
        chartingText.current +
        msgItem.messages.map((item) => item.content.text).toString();
      // eslint-disable-next-line no-console
      console.log(chartingText.current);
      chartingMessageItem.current = {
        role: "assistant",
        content: [
          {
            type: "markdown",
            text: chartingText.current,
          },
        ],
        key: Math.random(),
        ctime: msgItem?.ctime,
      };
      setMsgItem(chartingMessageItem.current);
    };
    const finishListener = () => {
      setMsgList((list) => {
        return list.concat(chartingMessageItem.current!);
      });
      chartingText.current = "";
      setMsgItem(undefined);
      setChatting(false);
    };
    chartService.subscribe("add", listener);
    chartService.subscribe("finish", finishListener);
    return () => {
      chartService.unsubscribe("add", listener);
      chartService.unsubscribe("finish", finishListener);
    };
  }, [chartService]);

  const handleChat = useCallback(
    async (str: string) => {
      setChatting(true);
      chartService.chat(str);
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
    [chartService]
  );

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
    chartting,
    activeSessionId,
    sessionList,
    searchStr,
    msgList,
    msgItem,
    handleChat,
    updateSession,
    setSearchStr,
  };
}
