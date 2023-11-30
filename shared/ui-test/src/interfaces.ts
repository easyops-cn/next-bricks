export interface BrickAction {
  name: string;
  params?: any;
}

export interface SelectorConf {
  type: "css-selector" | "testid";
  value: string;
  multiple?: boolean;
  field?: string;
}

export interface BrickTarget {
  selectors: SelectorConf[];
  actions: BrickAction[];
  // 某组 doms 是否在构件之外的如下拉菜单,下拉选择框等
  isolate?: boolean;
}

export interface BrickCommandConf {
  brick: string;
  shadowDom?: boolean;
  targets: BrickTarget[];
}
