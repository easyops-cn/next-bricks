import { fetchEventSource } from "@microsoft/fetch-event-source";
import { http } from "@next-core/http";
import { getBasePath } from "@next-core/runtime";
import moment from "moment";
import _ from "lodash";

export interface SSEMessageItem {
  conversationId?: string;
  created: number | string;
  delta: {
    content: string;
    role: string;
  };
  taskId?: string;
  agentId?: string;
  robotId?: string;
  type?: string;
  error?: string;
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
  robotId: string;
  handleEditSession?: (
    conversationId: string,
    rawData: Partial<SessionItem>
  ) => void;
}

export interface ChatItem {
  agentId: string;
  robotId: string;
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

export interface ChatBody {
  agentId?: string;
  conversationId?: string;
  input: string;
  stream?: boolean;
  config?: Record<string, any>;
  [k: string]: any;
}

export class ChatService {
  #debug: boolean;
  #ctrl?: AbortController;
  #agentId: string;
  #robotId: string;
  #enterInterval: number;
  #chatting = false;
  #isStartEmitEvent = false;
  #emitTimer: NodeJS.Timeout | undefined;
  #messageQueue: Array<QueueItem> = [];
  #subscribers: Record<string, Array<(msg?: SSEMessageItem) => void>> = {};
  #conversationId?: string;
  #answerLanguage?: string | undefined;

  // 会话
  #sessionNextToken?: string;
  #cacheLimit?: number;
  #cacheQuery?: string;

  // 消息
  #messageNextToken?: string;

  #useSpiltWord = false;

  constructor({
    agentId,
    robotId,
    enterInterval = 50,
    debug = false,
    answerLanguage,
    useSpiltWord,
  }: {
    agentId: string;
    robotId: string;
    enterInterval: number;
    debug: boolean;
    answerLanguage?: string;
    useSpiltWord?: boolean;
  }) {
    this.#agentId = agentId;
    this.#robotId = robotId;
    this.#enterInterval = enterInterval;
    this.#debug = debug;
    this.#useSpiltWord = useSpiltWord ?? false;
    this.#answerLanguage = answerLanguage;
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

  async getSessionHistory(
    limit?: number,
    query?: string
  ): Promise<SessionItem[]> {
    if (limit) {
      this.#cacheLimit = limit;
    }
    if (!_.isNil(query)) {
      if (this.#cacheQuery !== query) {
        // 说明进行了搜索，需要重置token
        this.#sessionNextToken = undefined;
      }
      this.#cacheQuery = query;
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
            query: this.#cacheQuery,
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
            limit: 1000,
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

  async updateSession(
    id: string,
    data: Partial<SessionItem>
  ): Promise<boolean> {
    if (!id) return false;
    let flag: boolean = false;
    try {
      const { code } = await http.request<{ code: number }>(
        `${getBasePath()}api/gateway/easyops.api.aiops_chat.conversation.UpdateConversation/conversation/update/${id}`,
        {
          method: "POST",
          body: JSON.stringify({
            updateData: data,
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

  getCustomSplit() {
    return {
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
  }

  splitWord(str: string): string[] {
    if (!str) return [];
    // 单词长度小于 5 直接返回, 否则做单词分割处理
    if (str?.length < 5) return [str];
    let list = [];

    // 只要是命令字，且命令字不等于easy_cmd_progress的时候就直接返回
    if (
      /^```easy_cmd_.*?```[^`]*$/s.test(str) &&
      !/easy_cmd_progress/.test(str)
    ) {
      return [str];
    }

    if (window.Intl) {
      try {
        const segmenterFr = new Intl.Segmenter("zh-Hans-CN", {
          granularity: "word",
        });
        const iterator = segmenterFr.segment(str)[Symbol.iterator]();

        let nextWord = iterator.next();
        while (!nextWord.done) {
          list.push(nextWord.value.segment);
          nextWord = iterator.next();
        }
      } catch {
        list = [];
        const customSplit = this.getCustomSplit();
        str.split(customSplit).forEach((word) => {
          list.push(word);
        });
      }
    } else {
      const customSplit = this.getCustomSplit();
      str.split(customSplit).forEach((word) => {
        list.push(word);
      });
    }

    return list;
  }

  async chat(msg: string | ChatBody): Promise<void> {
    this.#ctrl = new AbortController();
    let hadMatchMessage = false;
    let hadUsefulMessage = false;
    this.#chatting = true;
    await fetchEventSource(
      `${getBasePath()}api/gateway/easyops.api.aiops_chat.manage.LLMChatProxy@1.0.0/api/aiops_chat/v1/chat/completions`,
      {
        method: "POST",
        signal: this.#ctrl.signal,
        openWhenHidden: true,
        body: JSON.stringify({
          agentId: this.#agentId,
          robotId: this.#robotId,
          conversationId: this.#conversationId,
          stream: true,
          config: {
            debug: this.#debug,
            ...(this.#answerLanguage ? { lang: this.#answerLanguage } : {}),
          },
          ...(typeof msg === "string"
            ? {
                input: msg,
              }
            : msg),
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
            if (!hadUsefulMessage) {
              this.enqueue({
                topic: "add",
                message: {
                  created: moment().format("YYYY-MM-DD HH:mm:ss"),
                  delta: {
                    role: "assistant",
                    content: "",
                  },
                  agentId: this.#agentId,
                  robotId: this.#robotId,
                },
              });
            }
            this.#ctrl!.abort();
            return;
          }
          hadUsefulMessage = true;
          let result = {} as SSEMessageItem;
          try {
            result = JSON.parse(data);

            if (!this.#conversationId) {
              this.setConversationId(result.conversationId);
            }
            if (this.#useSpiltWord) {
              const wordList = this.splitWord(result.delta.content);

              // 一段消息最多拆分为 50-100 段内容
              let chunkedWords = wordList;
              const maxChunks = 100;
              if (wordList.length > maxChunks) {
                const minChunks = 50;
                const chunkSize = Math.ceil(
                  wordList.length /
                    (Math.floor(Math.random() * (maxChunks - minChunks + 1)) +
                      minChunks)
                );
                chunkedWords = _.chunk(wordList, chunkSize).map((chunk) =>
                  chunk.join("")
                );
              }

              chunkedWords.forEach((word) => {
                // wordList.forEach((word) => {
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
            } else {
              this.enqueue({
                topic: "add",
                message: {
                  ...result,
                  delta: {
                    role: "assistant",
                    content: result.delta.content,
                  },
                },
              });
            }
          } catch {
            result = JSON.parse(data);

            const SENSITIVE_WORDS_ERROR =
              "input messages contains sensitive words";
            const EXCEED_TOKENS_ERROR = "exceed tokens resource limit";
            let content = `\`【数据格式错误】:\` ${data}`;

            if (result?.error?.includes(SENSITIVE_WORDS_ERROR)) {
              content =
                "触发敏感词限制，请换一个问题，或找管理员修改敏感词配置";
            } else if (result?.error?.includes(EXCEED_TOKENS_ERROR)) {
              content = "超过资源配额限制，请找管理员增加资源配额";
            }

            this.enqueue({
              topic: "add",
              message: {
                created: moment().format("YYYY-MM-DD HH:mm:ss"),
                delta: {
                  role: "assistant",
                  content: content,
                },
                agentId: this.#agentId,
                robotId: this.#robotId,
              },
            });
            this.#ctrl!.abort();
            return;
          }
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
                robotId: this.#robotId,
                created: moment().format("YYYY-MM-DD HH:mm:ss"),
              },
            });
          }
          this.#ctrl!.abort();
        },
        onerror: (err) => {
          throw err;
        },
      }
    );

    this.#chatting = false;
  }

  stop() {
    clearTimeout(this.#emitTimer);
    this.#ctrl?.abort();
    this.#chatting = false;
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
    const callback = () => {
      if (this.#chatting || this.#messageQueue.length) {
        const messageItem = this.dequeue()!;
        messageItem && this.notifySubscribers(messageItem);
        this.#emitTimer = setTimeout(
          callback,
          getRandomInterval(this.#enterInterval, this.#messageQueue.length)
        );
      } else {
        clearTimeout(this.#emitTimer);
        this.#emitTimer = undefined;
        this.#isStartEmitEvent = false;
        this.notifySubscribers({ topic: "finish" });
      }
    };

    this.#emitTimer = setTimeout(
      callback,
      getRandomInterval(this.#enterInterval, this.#messageQueue.length)
    );
  }
}

function getRandomInterval(
  enterInterval: number,
  messagesInQueue: number
): number {
  // 如果设置了 enterInterval >= 0，使用该值作为间隔
  if (enterInterval >= 0) {
    return enterInterval;
  }
  // 否则，根据消息队列中的消息数量动态调整间隔时间
  // 当队列中消息很多时，尽快输出内容
  if (messagesInQueue > 50) {
    return 16;
  }
  const value = Math.floor(Math.random() * 11);
  // 当队列消息不多时，20% 的概率返回 50ms，80% 的概率返回 50-300ms 之间的随机数
  return value < 9 ? 50 : Math.floor(Math.random() * 251) + 50;
}

// export const chartService = new ChatService();
