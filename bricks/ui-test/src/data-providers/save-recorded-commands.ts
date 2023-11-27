import { createProviderClass } from "@next-core/utils/general";
import { isEqual, isNil } from "lodash";
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
  let prevTarget: InspectSelector[] | undefined;
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

      const [startCommand, ...restCommands] = step.target;

      commands.push(
        (prevCommand = {
          type: NodeType.Command,
          ...(startCommand.type === "testid"
            ? {
                name: "findByTestId",
                params: [startCommand.value],
              }
            : {
                name: "get",
                params: [
                  `${startCommand.type === "id" ? "#" : ""}${
                    startCommand.value
                  }${startCommand.isolate ? ":visible" : ""}`,
                ],
              }),
          children: [
            ...processChainCommand(restCommands),
            transformRecordedAction(step),
          ],
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

function processChainCommand(selectors: InspectSelector[]): NodeItem[] {
  const nodes: NodeItem[] = [];
  selectors.forEach((selector) => {
    nodes.push({
      type: NodeType.Command,
      ...(selector.type === "testid"
        ? {
            name: "findByTestId",
            params: [selector.value],
          }
        : {
            name: "find",
            params: [`${selector.value}`],
          }),
    });

    if (!isNil(selector.eq)) {
      nodes.push({
        type: NodeType.Command,
        name: "eq",
        params: [selector.eq],
      });
    }
  });

  return nodes;
}

customElements.define(
  "ui-test.save-recorded-commands",
  createProviderClass(saveRecordedCommands)
);
