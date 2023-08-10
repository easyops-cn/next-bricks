import { BrickConf, RouteConf } from "@next-core/types";

export type ImportInfo = Map<string, Set<string>>;

export interface BrickSourceNode extends BrickConf {
  ref?: string;
  alias?: string;
  iid?: string;
  deviceOwner?: unknown;
  template?: string;
  prams?: unknown;
}

export type BrickNode = string | BrickNormalNode;

export interface BrickNormalNode
  extends Omit<BrickSourceNode, "children" | "slots"> {
  _isRoute?: false;
  children: (BrickNode | RouteNodeInBrick)[];
}

export type RouteNodeInBrick = RouteNode & {
  _isRoute: true;
};

export type RouteNode = Omit<RouteConf, "context"> & {
  _isRoute?: boolean;
  children?: RouteNode[];
  slot?: string;
  view?: string;
  context?: string;
};
