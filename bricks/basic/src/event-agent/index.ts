import {
  createDecorators,
  NextElement,
  type EventEmitter,
} from "@next-core/element";
import styleText from "./styles.shadow.css";

const { defineElement, event, method } = createDecorators();

/**
 * 事件代理。
 * @en Event agent.
 */
export
@defineElement("eo-event-agent", {
  styleTexts: [styleText],
})
class EoEventAgent extends NextElement {
  /**
   * 事件被触发。
   * @en The event is triggered.
   */
  @event({ type: "trigger" })
  accessor #triggerEvent!: EventEmitter<unknown>;

  /**
   * 触发一次事件，传递的参数为事件详情。
   * @en Trigger an event once; the passed parameter is the event detail.
   */
  @method()
  trigger(detail: unknown): void {
    this.#triggerEvent.emit(detail);
  }

  protected _render() {
    // Do nothing
  }
}
