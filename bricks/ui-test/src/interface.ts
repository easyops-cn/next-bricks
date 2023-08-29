import type { GeneralIconProps } from "@next-bricks/icons/general-icon";

export enum NodeType {
  Suite = "suite",
  Block = "block",
  Command = "command",
}

export interface NodeItem {
  type: NodeType;
  children?: NodeItem[];
  label?: string;
  name: string;
  params?: any[];
}

export interface CommandParam {
  label: string;
  type: CommandParamType;
  description?: string;
  required?: boolean;
  default?: unknown;
  enum?: (string | number | EnumItem)[];
}

export interface CommandDoc {
  name: string;
  category: CommandCategory;
  from: CommandFrom;
  chain: CommandChain;
  description?: string;
  params?: CommandParam[];
  overloads?: CommandOverload[];
  keywords?: string[];
  icon?: CommandIcon;
}

export interface CommandOverload {
  label: string;
  params?: CommandParam[];
}

export type CommandCategory = "query" | "action" | "assertion" | "other";
export type CommandFrom = "cypress" | "third-party" | "custom";
export type CommandChain = "parent" | "child" | "dual";

export type CommandParamType =
  | "number"
  | "string"
  | "boolean"
  | "object"
  | "array"
  | "function"
  | "mixed";

export interface EnumItem {
  label: string;
  value: unknown;
}

export type CommandIcon = GeneralIconProps & {
  color?: string;
};
