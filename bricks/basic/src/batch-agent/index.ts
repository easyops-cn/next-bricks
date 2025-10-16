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
 * 当多次触发同一类型事件时，只会在当前宏任务结束后触发一次该类型事件。
 */
export
@defineElement("eo-batch-agent", {
  styleTexts: [styleText],
})
class EoBatchAgent extends NextElement {
  #enqueued = new Set<string>();

  /**
   * 事件被触发。
   */
  @event({ type: "trigger" })
  accessor #triggerEvent!: EventEmitter<{ type: string }>;

  /**
   * 触发事件。
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
