import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import type { AbstractForm } from "./Form.js";
import { UseSingleBrickConf } from "@next-core/types";

const { method, property } = createDecorators();

export abstract class FormItemElementBase extends ReactNextElement {
  accessor #_notRender = false;
  accessor #validate = "normal";
  accessor #bindFormItem = false;

  get isFormItemElement(): true {
    return true;
  }

  set validateState(value: string) {
    this.#validate = value;
    this._render();
  }
  get validateState() {
    return this.#validate;
  }

  /**
   * 控制该表单项是否隐藏
   * @default false
   * @group ui
   */
  set notRender(value: boolean) {
    this.hidden = value;
    this.#_notRender = value;
    this._render();
  }
  get notRender(): boolean {
    return this.#_notRender;
  }

  get $bindFormItem() {
    return this.#bindFormItem;
  }
  set $bindFormItem(value: boolean) {
    this.#bindFormItem = value;
    this._render();
  }

  @property({
    attribute: false,
  })
  accessor helpBrick: { useBrick: UseSingleBrickConf } | undefined;

  @method()
  setNotRender(value: boolean) {
    this.notRender = value;
  }

  @method()
  getFormElement(): AbstractForm | null {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let element: AbstractForm | null = this as unknown as AbstractForm;
    while ((element = element.parentNode as AbstractForm | null)) {
      if (!element || element.isFormElement) {
        break;
      }
    }
    return element as AbstractForm | null;
  }
}
