import { fetchEventSource } from "@microsoft/fetch-event-source";
import { getBasePath } from "@next-core/runtime";
import moment from "moment";

export interface SSEMessageItem {
  ctime: string;
  mtime: string;
  conversationId?: string;
  messages: Array<{
    content: {
      type: string;
      text: string;
    };
    role: string;
  }>;
}

export interface QueueItem {
  topic: string;
  message?: SSEMessageItem;
}

export class ChatService {
  #ctrl?: AbortController;
  #agentId: string;
  #enterInterval: number;
  #charting = false;
  #isStartEmitEvent = false;
  #emitTimer: NodeJS.Timeout | undefined;
  #messageQueue: Array<QueueItem> = [];
  #subscribers: Record<string, Array<(msg?: SSEMessageItem) => void>> = {};
  #conversationId?: string;

  constructor({
    agentId,
    enterInterval = 50,
  }: {
    agentId: string;
    enterInterval: number;
  }) {
    this.#agentId = agentId;
    this.#enterInterval = enterInterval;
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

  setConversationId(id?: string) {
    this.#conversationId = id;
  }

  async getSessionList() {
    // const response = await fetch(
    //   `${getBasePath()}api/gateway/easyops.api.aiops_chat.conversation/conversation/list/${this.#agentId}`,
    // )
    // console.log(response);
  }

  async chat(str: string): Promise<void> {
    //  http://172.30.0.57:8107
    this.#ctrl = new AbortController();
    let hadMatchMessage = false;
    this.#charting = true;
    await fetchEventSource(
      `${getBasePath()}api/gateway/easyops.api.aiops_chat.manage.LLMStreamChat/stream_chat`,
      {
        method: "POST",
        signal: this.#ctrl.signal,
        body: JSON.stringify({
          agentId: this.#agentId,
          conversationId: this.#conversationId,
          messages: [
            {
              role: "user",
              content: [
                {
                  text: str,
                  type: "text",
                },
              ],
            },
          ],
        }),
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
          } catch (e) {
            // eslint-disable-next-line no-console
            console.log("数据格式错误", e);
          }
          this.#conversationId = result.conversationId;
          this.enqueue({
            topic: "add",
            message: result,
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
                ctime: moment().format("YYYY-MM-DD HH:mm:ss"),
                mtime: moment().format("YYYY-MM-DD HH:mm:ss"),
                messages: [
                  {
                    role: "assistant",
                    content: {
                      text: "无法识别",
                      type: "markdown",
                    },
                  },
                ],
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
        this.notifySubscribers(messageItem);
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
