import { PubSub } from "../utils/PubSub.js";
import { isEmpty } from "lodash";

interface FormStoreOptions {
  onValuesChanged?: (data: any) => void;
}

interface FieldDetail {
  name: string;
  label?: string;
  originProps?: Record<string, any>;
  validate: Validate;
  [k: string]: any;
}

export interface MessageBody {
  message: string;
  type: string;
}

export interface WatchOptions {
  needValidate?: boolean;
}

interface Validate {
  required?: boolean;
  pattern?: string;
  min?: number;
  max?: number;
  message?: {
    required?: string;
    pattern?: string;
    min?: string;
    max?: string;
  };
  validator?: (value: any) => MessageBody | string;
}

let uid = 0;

class Field {
  field: string;
  detail: FieldDetail;
  constructor(name: string, detail: FieldDetail) {
    this.field = name;
    this.detail = detail;
  }
}

export class FormStore extends PubSub {
  static uid: number;
  static instance: Map<number, FormStore> = new Map();
  static getInstance(options?: FormStoreOptions): FormStore {
    if (!this.instance.get(uid)) {
      this.uid = uid;
      this.instance.set(this.uid, new FormStore(options));
      uid += 1;
    }
    return this.instance.get(this.uid) as FormStore;
  }

  #fields: Map<string, Field> = new Map();
  #options: FormStoreOptions | undefined;
  #formData!: Record<string, unknown>;
  #initData: Record<string, unknown> | undefined;

  constructor(options?: FormStoreOptions) {
    super();
    this.#formData = {};
    this.#options = options;
  }

  setField(name: string, detail: FieldDetail) {
    this.#fields.set(name, new Field(name, detail));
  }
  #getAllFields() {
    return [...this.#fields.keys()];
  }

  getAllValues() {
    return this.#formData;
  }

  setInitValue(values: Record<string, unknown>, isEmitValuseChange = true) {
    this.#initData = values;
    this.setFieldsValue(values, isEmitValuseChange);
  }

  setFieldsValueByInitData(name: string) {
    const value = this.#initData?.[name];
    if (value) {
      this.#formData[name] = value;
      this.publish(`${name}.init.value`, value);
    }
  }

  setFieldsValue(values: Record<string, unknown>, isEmitValuseChange = true) {
    const allFields = this.#getAllFields();
    const newFormData: Record<string, unknown> = {
      ...this.#formData,
    };
    Object.entries(values).forEach(([k, v]) => {
      if (allFields.includes(k)) {
        newFormData[k] = v;
        this.#initData && (this.#initData[k] = v);
        this.publish(`${k}.init.value`, v);
      }
    });
    this.#formData = newFormData;

    if (isEmitValuseChange) {
      this.#options?.onValuesChanged?.({
        changedValues: values,
        allValues: this.getAllValues(),
      });
    }
  }

  resetFields(name?: string) {
    if (name) {
      this.#formData[name] = null;
      this.publish(`${name}.reset.fields`, null);
    } else {
      this.#formData = {};
      this.publish("reset.fields", null);
    }
  }

  getFieldsValue(name?: string) {
    if (name) {
      return this.#formData[name];
    }
    return this.getAllValues();
  }

  validateFields(
    callback: (err: boolean, value: any) => void
  ): boolean | Record<string, unknown> {
    const allFields = this.#getAllFields();
    const results: Array<MessageBody | undefined> = [];
    allFields.forEach((name) => {
      const field = this.#fields.get(name);
      if (field) {
        results.push(this.validateField(field.detail));
      }
    });

    if (results.some((result) => result?.type !== "normal")) {
      callback(true, results);
      return false;
    } else {
      callback(false, this.#formData);
      return this.#formData;
    }
  }

  validateField(field: string | FieldDetail) {
    const fieldDetail =
      typeof field === "string" ? this.#fields.get(field)?.detail : field;
    if (!fieldDetail) return;
    const { name, label, validate } = fieldDetail;
    const validateValue = this.#formData[name];

    const messageBody = (message: string, type = "error") => {
      return {
        type,
        message,
      };
    };

    const getName = () => label ?? name;

    const valid = (validate: Validate, value: string): MessageBody => {
      const { required, pattern, message, min, max, validator } = validate;
      const label = getName();

      if (
        required &&
        (typeof value === "object"
          ? isEmpty(value)
          : typeof value === "number"
          ? false
          : !value)
      ) {
        return messageBody(message?.required || `${label}为必填项`);
      }

      if (pattern) {
        const reg = new RegExp(pattern);
        if (!reg.test(value)) {
          return messageBody(
            message?.pattern || `${label}没有匹配正则 ${pattern}`
          );
        }
      }

      if (min && (!value || value.length < min)) {
        return messageBody(message?.min || `${label}至少包含 ${min} 个字符`);
      }

      if (max && value && value.length > max) {
        return messageBody(message?.max || `${label}不能超过 ${max} 个字符`);
      }

      if (validator) {
        const result = validator(value);
        if (result)
          return typeof result === "string"
            ? messageBody(result, result ? "error" : "normal")
            : (result as MessageBody);
      }

      return messageBody("", "normal");
    };

    const result = valid(validate, validateValue as string);
    this.publish(`${name}.validate`, result);
    return result;
  }

  getValueFromEvent(e: React.ChangeEvent): any {
    if (!e || !e.target) {
      return e;
    }
    const target = e.target as HTMLInputElement;
    return target.type === "checkbox" ? target.checked : target.value;
  }

  resetValidateState() {
    this.publish(`reset.validate`, null);
  }

  onWatch(
    name: string,
    event: React.ChangeEvent,
    callback?: (v: string) => void,
    options?: WatchOptions
  ) {
    const field = this.#fields.get(name);

    if (field) {
      const value = this.getValueFromEvent(event);

      this.setFieldsValue({
        [name]: value,
      });

      if (options?.needValidate ?? true) {
        this.validateField(field.detail);
      }
      callback?.(value);
    }
  }
}
