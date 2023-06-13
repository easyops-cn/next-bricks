import { createContext, useContext } from "react";
import { WorkbenchNodeData } from "../../interfaces.js";

export enum dragStatusEnum {
  inside = "inside",
  top = "top",
  bottom = "bottom",
}

interface WorkbenchTreeDndContext {
  allow?: boolean;
  allowDragToRoot?: boolean;
  dragElement?: HTMLElement;
  dragOverElement?: HTMLElement;
  dragStatus?: dragStatusEnum;
  onDragStart?: (
    e: React.DragEvent<HTMLElement>,
    node: WorkbenchNodeData
  ) => void;
  onDragOver?: (e: React.DragEvent<HTMLElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLElement>) => void;
}

export const WorkbenchTreeDndContext = createContext<WorkbenchTreeDndContext>(
  {} as WorkbenchTreeDndContext
);

export function useWorkbenchTreeDndContext(): WorkbenchTreeDndContext {
  return useContext(WorkbenchTreeDndContext);
}
