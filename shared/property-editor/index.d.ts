import type {
  Form,
  onFieldValueChange,
  onFieldInit,
  onFieldInitialValueChange,
  onFormInitialValuesChange,
  onFormValidateSuccess,
} from "@formily/core";
import type { createSchemaField, ISchema } from "@formily/react";

export interface EditorComponentProps<
  T = ReturnType<typeof createSchemaField>,
> {
  advancedMode?: boolean;
  SchemaFieldComponent: T;
  formilySchemaFormatter: (
    data: any,
    // Todo(sailor): fix the type of options
    options?: boolean | { isDefault: boolean }
  ) => ISchema;
  form: Form<any>;
  effects: {
    onFieldInit: typeof onFieldInit;
    onFieldValueChange: typeof onFieldValueChange;
    onFieldInitialValueChange: typeof onFieldInitialValueChange;
    onFormValuesChange: typeof onFormValuesChange;
    onFormInitialValuesChange: typeof onFormInitialValuesChange;
    onFormValidateSuccess: typeof onFormValidateSuccess;
    onSubmit: (listener: (value: any, form: Form) => any) => void;
    onAdvancedChange: (
      listener: (advancedMode: boolean, form: Form) => any
    ) => void;
    // support any effects
  };
  scope: {
    advancedMode: boolean;
    dataList: DataItem[];
    childSlots: SelectOptions;
    extraLibs: SelectOptions;
    links: any;
    tokenClick: (token: CustomEvent<string>) => void;
    triggerAction: (action: string) => void;
  };
}

export interface DataItem {
  name: string;
  value: string;
  definition: DefinitionItem[];
  [k: string]: any;
}

export interface DefinitionItem {
  name: string;
  type: string;
  enum: string;
  fields: DefinitionItem[];
}

export type SelectOptions = { label: string; value: string }[];
