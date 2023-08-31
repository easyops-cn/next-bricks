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
