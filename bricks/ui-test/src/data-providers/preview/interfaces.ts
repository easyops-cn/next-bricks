export interface InspectTarget {
  element: HTMLElement;
  selector: InspectSelector;
}

export interface InspectSelector {
  type: "testid" | "id";
  value: string;
  tag: string;
}

export interface InspectOutline {
  width: number;
  height: number;
  left: number;
  top: number;
  selector: InspectSelector;
}

export interface RecordStep {
  event: string;
  targets: InspectSelector[];
  text?: string;
}

export interface SelectedRecordStep {
  event: string;
  target: InspectSelector;
  text?: string;
}
