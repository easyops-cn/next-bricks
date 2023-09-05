import { createProviderClass } from "@next-core/utils/general";
import { isEqual } from "lodash";
import type {
  InspectSelector,
  SelectedRecordStep,
} from "./preview/interfaces.js";
import { NodeType, NodeItem } from "../interface.js";
import { createNodes } from "./shared/createNodes.js";

export interface SaveRecordedCommandsParams {
  steps: SelectedRecordStep[];
  parent: string;
  initialSort?: number;
}

export async function saveRecordedCommands({
  steps,
  parent,
  initialSort,
}: SaveRecordedCommandsParams): Promise<void> {
  const commands = transformRecordedCommands(steps);
  await createNodes(commands, parent, initialSort);
}

export function transformRecordedCommands(
  steps: SelectedRecordStep[]
): NodeItem[] {
  const commands: NodeItem[] = [];
  let prevTarget: InspectSelector | undefined;
  let prevCommand: NodeItem | undefined;
  for (const step of steps) {
    if (
      prevTarget &&
      prevCommand?.children &&
      isEqual(step.target, prevTarget)
    ) {
      prevCommand.children.push(transformRecordedAction(step));
    } else {
      prevTarget = step.target;
      commands.push(
        (prevCommand = {
          type: NodeType.Command,
          ...(step.target.type === "testid"
            ? {
                name: "findByTestId",
                params: [step.target.value],
              }
            : {
                name: "get",
                params: [`#${step.target.value}`],
              }),
          children: [transformRecordedAction(step)],
        })
      );
    }
  }
  return commands;
}

function transformRecordedAction(step: SelectedRecordStep): NodeItem {
  return {
    type: NodeType.Command,
    ...(step.event === "type"
      ? {
          name: "type",
          params: [step.text],
        }
      : {
          name: step.event,
        }),
  };
}

customElements.define(
  "ui-test.save-recorded-commands",
  createProviderClass(saveRecordedCommands)
);
