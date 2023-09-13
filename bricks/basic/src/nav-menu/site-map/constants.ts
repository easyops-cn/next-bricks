import React from "react";

export enum DRAG_DIRECTION {
  Left = "left",
  Right = "right",
}

export interface ContextOfDragProps {
  groupId: string;
  direction?: DRAG_DIRECTION;
  overElement?: HTMLElement;
  allowDrag?: boolean;
  onAllowDrag?: (enable: boolean) => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  onFavoriteUpdate?: (list: any[]) => void;
}
export const DragContext = React.createContext<ContextOfDragProps>(
  {} as ContextOfDragProps
);
