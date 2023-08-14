export type NodeType =
  | "before"
  | "beforeEach"
  | "after"
  | "afterEach"
  | "case"
  | "describe"
  | "suite"
  | "preset"
  | "code";

export interface NodeItem {
  type: NodeType;
  children?: NodeItem[];
  alias?: string;
  name?: string;
  params?: Record<string, any>;
}
