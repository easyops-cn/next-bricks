import {
  BrickCommandConf,
  SelectorConf,
  BrickTarget,
} from "@next-shared/ui-test";

export interface InspectTarget {
  host?: InspectSelector;
  element: HTMLElement;
  selectors: InspectSelector[];
}

export interface InspectSelector {
  type: "testid" | "id" | "css-selector";
  value: string;
  tag: string;
  isolate?: boolean;
  eq?: number;
}

export interface InspectOutline {
  width: number;
  height: number;
  left: number;
  top: number;
  selectors: InspectSelector[];
}

export interface RecordStep {
  event: string;
  targets: InspectSelector[][];
  text?: string;
}

export interface SelectedRecordStep {
  event: string;
  target: InspectSelector[];
  text?: string;
}

export interface RelatedCommand {
  name: string;
  params?: unknown[];
}

export interface RuntimeSelectorConf extends SelectorConf {
  eq?: number;
  isolate?: boolean;
  element?: HTMLElement;
}

export interface RuntimeBrickTarget extends Omit<BrickTarget, "selectors"> {
  selectors: RuntimeSelectorConf[];
}

export interface RuntimeBrickCommandConf
  extends Omit<BrickCommandConf, "targets"> {
  element?: HTMLElement;
  targets: RuntimeBrickTarget[];
}
