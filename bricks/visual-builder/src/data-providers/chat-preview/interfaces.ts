export interface InspectTarget extends InspectSelector {
  element: HTMLElement;
  label: string;
}

export interface InspectSelector {
  type: "item";
  uuid: string;
}

export interface InspectOutline extends InspectSelector {
  width: number;
  height: number;
  left: number;
  top: number;
  label: string;
}
