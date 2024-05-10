export interface InspectTarget extends InspectSelector {
  element: HTMLElement;
}

export interface InspectSelector {
  type: "item";
  uuid: string;
  label: string;
}

export interface InspectOutline extends InspectSelector {
  width: number;
  height: number;
  left: number;
  top: number;
}
