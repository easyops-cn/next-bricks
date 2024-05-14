import { fetchEventSource } from "@microsoft/fetch-event-source";
import { http } from "@next-core/http";
import { getBasePath } from "@next-core/runtime";
import moment from "moment";

export interface SSEMessageItem {
  conversationId?: string;
  created: number | string;
  delta: {
    content: string;
    role: string;
  };
  taskId?: string;
  agentId?: string;
}

export interface QueueItem {
  topic: string;
  message?: SSEMessageItem;
}

export interface SessionItem {
  conversationId: string;
  isDelete: boolean;
  time: number;
  title: string;
  user: string;
  _row_id: string;
}

export interface ChatItem {
  agentId: string;
  conversationId: string;
  input: string;
  output: string;
  taskId: string;
  time: number;
  inputTime: number;
  user: string;
  _row_id: string;
  tag: {
    isLike?: boolean;
  };
}

export class ChatService {
  #debug: boolean;
  #ctrl?: AbortController;
  #agentId: string;
  #enterInterval: number;
  #charting = false;
  #isStartEmitEvent = false;
  #emitTimer: NodeJS.Timeout | undefined;
  #messageQueue: Array<QueueItem> = [];
  #subscribers: Record<string, Array<(msg?: SSEMessageItem) => void>> = {};
  #conversationId?: string;

  // 会话
  #sessionNextToken?: string;
  #cacheLimit?: number;

  // 消息
  #messageNextToken?: string;

  constructor({
    agentId,
    enterInterval = 50,
    debug = false,
  }: {
    agentId: string;
    enterInterval: number;
    debug: boolean;
  }) {
    this.#agentId = agentId;
    this.#enterInterval = enterInterval;
    this.#debug = debug;
  }

  enqueue(data: QueueItem) {
    this.#messageQueue.push(data);
    this.#startEmitEvent();
  }

  dequeue() {
    return this.#messageQueue.shift();
  }

  #clear() {
    this.#messageQueue.length = 0;
  }

  getMessageQueue() {
    return this.#messageQueue;
  }

  subscribe(topic: string, callback: (msg?: SSEMessageItem) => void) {
    if (!this.#subscribers[topic]) {
      this.#subscribers[topic] = [];
    }
    this.#subscribers[topic].push(callback);
  }

  unsubscribe(topic: string, callback: (msg?: SSEMessageItem) => void) {
    if (this.#subscribers[topic]) {
      this.#subscribers[topic] = this.#subscribers[topic].filter(
        (cb) => cb !== callback
      );
    }
  }

  notifySubscribers(data: QueueItem) {
    const topic = data.topic;
    if (this.#subscribers[topic]) {
      this.#subscribers[topic].forEach((callback) => {
        callback(data?.message);
      });
    }
  }

  async setChatItemIsLike(id: string, isLike: boolean): Promise<boolean> {
    let flag: boolean = false;
    try {
      const { code } = await http.request<{ code: number }>(
        `${getBasePath()}api/gateway/easyops.api.aiops_chat.conversation.CommentDialogue/conversation/comment`,
        {
          method: "POST",
          body: JSON.stringify({
            taskId: id,
            isLike,
          }),
        }
      );
      if (code === 0) {
        flag = true;
      }
    } catch {
      flag = false;
    }
    return flag;
  }

  setAgentId(id: string) {
    this.#agentId = id;
  }

  setConversationId(id?: string) {
    this.#conversationId = id;
  }

  async getSessionHistory(limit?: number): Promise<SessionItem[]> {
    if (limit) {
      this.#cacheLimit = limit;
    }
    try {
      const {
        data: { conversations, next_token },
      } = await http.request<{
        data: {
          conversations: SessionItem[];
          next_token: string;
          previous_token: string;
        };
      }>(
        `${getBasePath()}api/gateway/easyops.api.aiops_chat.conversation.ListConversation/conversation/list`,
        {
          method: "POST",
          body: JSON.stringify({
            limit: this.#cacheLimit ?? 20,
            next_token: this.#sessionNextToken,
          }),
        }
      );
      this.#sessionNextToken = next_token;
      if (!next_token) {
        this.notifySubscribers({ topic: "session.fetch.end" });
      }
      return conversations;
    } catch {
      // eslint-disable-next-line no-console
      console.error("获取会话历史失败");
    }
    return [];
  }

  async getChatHistory(id?: string): Promise<ChatItem[]> {
    if (id) {
      this.setConversationId(id);
      this.#messageNextToken = "";
    }
    if (!this.#conversationId) return [];
    try {
      const {
        data: { conversations, next_token },
      } = await http.request<{
        data: {
          conversations: ChatItem[];
          next_token: string;
          previous_token: string;
        };
      }>(
        `${getBasePath()}api/gateway/easyops.api.aiops_chat.conversation.GetAllDialogue/conversation/get/${this.#conversationId}`,
        {
          method: "POST",
          body: JSON.stringify({
            limit: 15,
            next_token: this.#messageNextToken,
          }),
        }
      );
      this.#messageNextToken = next_token;
      if (!next_token) {
        this.notifySubscribers({ topic: "message.fetch.end" });
      }
      return conversations;
    } catch {
      // eslint-disable-next-line no-console
      console.error("获取消息历史失败");
    }
    return [];
  }

  async deleteSession(id: string[]): Promise<boolean> {
    if (!id.length) return false;
    let flag: boolean = false;
    try {
      const { code } = await http.request<{ code: number }>(
        `${getBasePath()}api/gateway/easyops.api.aiops_chat.conversation.DeleteConversation/conversation/delete`,
        {
          method: "POST",
          body: JSON.stringify({
            conversationIds: id,
          }),
        }
      );
      if (code === 0) {
        flag = true;
      }
    } catch {
      flag = false;
    }
    return flag;
  }

  splitWord(str: string) {
    if (!str) return [];
    // 单词长度小于 5 直接返回, 否则做单词分割处理
    if (str?.length < 5) return [str];
    const list = [];

    if (window.Intl) {
      const segmenterFr = new Intl.Segmenter("zh-Hans-CN", {
        granularity: "word",
      });
      const iterator = segmenterFr.segment(str)[Symbol.iterator]();

      let nextWord = iterator.next();
      while (!nextWord.done) {
        list.push(nextWord.value.segment);
        nextWord = iterator.next();
      }
    } else {
      const customSplit = {
        [Symbol.split](str: string) {
          let pos = 0;
          const result = [];
          let cache = "";
          while (pos < str.length) {
            const matchStr = str.substring(pos, pos + 1);
            // 如果是中文，单个输出
            if (/[\u4e00-\u9fa5]/.test(matchStr)) {
              result.push(cache + matchStr);
              cache = "";
            } else {
              // 否则，遇到空格或者标点符号再分词
              if (!/\s|[，。；《》?!,.:<>？！]]/.test(matchStr)) {
                cache = cache + matchStr;
              } else {
                result.push(cache + matchStr);
                cache = "";
              }
            }
            pos++;
          }
          if (cache) result.push(cache);
          return result;
        },
      };

      str.split(customSplit).forEach((word) => {
        list.push(word);
      });
    }

    return list;
  }

  async chat(str: string): Promise<void> {
    this.#ctrl = new AbortController();
    let hadMatchMessage = false;
    this.#charting = true;
    await fetchEventSource(
      `${getBasePath()}api/gateway/easyops.api.aiops_chat.manage.LLMChatProxy@1.0.0/api/aiops_chat/v1/chat/completions`,
      {
        method: "POST",
        signal: this.#ctrl.signal,
        body: JSON.stringify({
          agentId: this.#agentId,
          conversationId: this.#conversationId,
          input: str,
          stream: true,
          config: {
            debug: this.#debug,
          },
        }),
        headers: {
          "giraffe-contract-name": "easyops.api.aiops_chat.manage.LLMChatProxy",
        },
        onopen: async (response) => {
          if (response.ok) {
            // eslint-disable-next-line no-console
            console.log("open sse service success!");
          } else {
            // eslint-disable-next-line no-console
            console.log("open sse service fail!");
          }
        },
        onmessage: (msg) => {
          const { data } = msg;
          hadMatchMessage = true;
          if (data === "[DONE]") {
            this.#ctrl!.abort();
            return;
          }
          let result = {} as SSEMessageItem;
          try {
            result = JSON.parse(data);
          } catch {
            this.enqueue({
              topic: "add",
              message: {
                created: moment().format("YYYY-MM-DD HH:mm:ss"),
                delta: {
                  role: "assistant",
                  content: `\`【数据格式错误】:\` ${data}`,
                },
                agentId: this.#agentId,
              },
            });
            return;
          }
          if (!this.#conversationId) {
            this.setConversationId(result.conversationId);
          }
          const wordList = this.splitWord(result.delta.content);
          wordList.forEach((word) => {
            this.enqueue({
              topic: "add",
              message: {
                ...result,
                delta: {
                  role: "assistant",
                  content: word,
                },
              },
            });
          });
        },
        onclose: () => {
          // eslint-disable-next-line no-console
          console.log("close");
          // 兜底逻辑，连接结束，并且没有数据返回
          if (!hadMatchMessage) {
            this.enqueue({
              topic: "add",
              message: {
                delta: {
                  role: "assistant",
                  content: "`无法识别`",
                },
                agentId: this.#agentId,
                created: moment().format("YYYY-MM-DD HH:mm:ss"),
              },
            });
          }
          this.#ctrl!.abort();
        },
        onerror: (err) => {
          // eslint-disable-next-line no-console
          console.log("err", err);
          this.#ctrl!.abort();
        },
      }
    );

    this.#charting = false;
  }

  stop() {
    clearInterval(this.#emitTimer);
    this.#ctrl && this.#ctrl?.abort();
    this.#charting = false;
    this.#emitTimer = undefined;
    this.#isStartEmitEvent = false;
    this.#clear();
    this.notifySubscribers({ topic: "stop" });
  }

  #startEmitEvent() {
    if (this.#isStartEmitEvent) return;
    this.#isStartEmitEvent = true;
    // 轮训队列，每隔 #enterInterval(默认 50ms) 推出第一条数据，获取到 text，推送给组件，组件接受后进行渲染
    // 直到聊天结束，并且消息队列数据为空时，停止 emit
    this.#emitTimer = setInterval(() => {
      if (this.#charting || this.getMessageQueue().length) {
        const messageItem = this.dequeue()!;
        messageItem && this.notifySubscribers(messageItem);
      } else {
        clearInterval(this.#emitTimer);
        this.#emitTimer = undefined;
        this.#isStartEmitEvent = false;
        this.notifySubscribers({ topic: "finish" });
      }
    }, this.#enterInterval);
  }
}

// export const chartService = new ChatService();
