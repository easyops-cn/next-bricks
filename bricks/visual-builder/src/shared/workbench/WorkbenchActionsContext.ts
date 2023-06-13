import { createContext, useContext } from "react";
import type {
  ActionClickDetail,
  WorkbenchTreeAction,
} from "../../interfaces.js";

export interface ContextOfWorkbenchActions {
  actions?: WorkbenchTreeAction[];
  actionsHidden?: boolean;
  onActionClick?(detail: ActionClickDetail): void;
}

export const WorkbenchActionsContext = createContext<ContextOfWorkbenchActions>(
  {}
);

export function useWorkbenchActionsContext(): ContextOfWorkbenchActions {
  return useContext(WorkbenchActionsContext);
}
