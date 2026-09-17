import {
  createDecorators,
  NextElement,
  type EventEmitter,
} from "@next-core/element";
import styleText from "./styles.shadow.css";

const { defineElement, event, method } = createDecorators();

/**
 * 批处理事件代理。
 *
 * 注意和 eo-event-agent 的区别：
 *
 * 触发条件：
 * - eo-event-agent 每次触发事件都会立即派发该事件。
 * - eo-batch-agent 当多次触发同一类型事件时，只会在当前宏任务结束后触发一次该类型事件。
 *
 * 方法参数
 * - eo-event-agent trigger() 方法的参数会作为 EVENT.detail 传递给 trigger 事件。
 * - eo-batch-agent trigger() 方法的参数必须是字符串，表示事件类型，trigger 事件详情 为 `{ type: string }` 形式。
 *   因此，如果希望在事件回调时消费其他信息，需通过 context/state 进行传递。
 * @en Batch event agent.
 *
 * Differences from eo-event-agent:
 *
 * Trigger conditions:
 * - eo-event-agent dispatches the event immediately every time it is triggered.
 * - eo-batch-agent triggers an event of the same type only once after the current macro task ends, no matter how many times it is triggered.
 *
 * Method parameters
 * - The parameters of eo-event-agent's trigger() method are passed to the trigger event as EVENT.detail.
 * - The parameters of eo-batch-agent's trigger() method must be a string, indicating the event type; the trigger event detail is in the form of `{ type: string }`.
 *   Therefore, if you want to consume other information in the event callback, you need to pass it through context/state.
 */
export
@defineElement("eo-batch-agent", {
  styleTexts: [styleText],
})
class EoBatchAgent extends NextElement {
  #enqueued = new Set<string>();

  /**
   * 事件被触发。
   * @en The event is triggered.
   */
  @event({ type: "trigger" })
  accessor #triggerEvent!: EventEmitter<{ type: string }>;

  /**
   * 触发事件。
   * @en Trigger an event.
   */
  @method()
  trigger(type: string): void {
    if (this.#enqueued.has(type)) {
      return;
    }
    this.#enqueued.add(type);
    queueMicrotask(() => {
      this.#enqueued.delete(type);
      this.#triggerEvent.emit({ type });
    });
  }

  protected _render() {
    // Do nothing
  }
}
