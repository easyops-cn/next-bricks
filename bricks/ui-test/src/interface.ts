export type NodeType = "suite" | "block" | "command";

export interface NodeItem {
  type: string;
  children?: NodeItem[];
  label?: string;
  name?: string;
  params?: any;
}

export interface CommandParamsField {
  label: string;
  description?: string;
  required?: boolean;
  default?: any;
  type:
    | "number"
    | "string"
    | "boolean"
    | "object"
    | "array"
    | "function"
    | "mixed";
  enum?: (string | number | EnumItem)[];
}
export interface CommandDoc {
  name: string;
  description?: string;
  params?: CommandParamsField[];
  category: "query" | "action" | "assertion" | "other";
  from: "cypress" | "third-party" | "custom";
  chain: "parent" | "child" | "dual";
  keywords?: string[];
}

export interface EnumItem {
  label: string;
  value: unknown;
}
