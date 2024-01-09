import { checkIfByTransform, __secret_internals } from "@next-core/runtime";
import type React from "react";
import {
  DEFAULT_LINE_STROKE_COLOR,
  DEFAULT_LINE_STROKE_WIDTH,
} from "../constants";
import type {
  ConnectLineState,
  DiagramNode,
  ConnectLineDetail,
  NodesConnectOptions,
  PositionTuple,
  RefRepository,
  ActiveTarget,
} from "../interfaces";

export function handleNodesMouseDown(
  event: MouseEvent,
  {
    nodes,
    nodesRefRepository,
    nodesConnect,
    setConnectLineState,
    setConnectLineTo,
    onSwitchActiveTarget,
    onNodesConnect,
  }: {
    nodes: DiagramNode[] | undefined;
    nodesConnect: NodesConnectOptions | undefined;
    nodesRefRepository: RefRepository | null;
    setConnectLineState: (
      value: React.SetStateAction<ConnectLineState | null>
    ) => void;
    setConnectLineTo: (value: React.SetStateAction<PositionTuple>) => void;
    onSwitchActiveTarget?(target: ActiveTarget | null): void;
    onNodesConnect?(detail: ConnectLineDetail): void;
  }
) {
  function findNode(match: (element: HTMLElement) => boolean) {
    if (nodesRefRepository) {
      for (const [id, element] of nodesRefRepository) {
        if (match(element)) {
          return nodes?.find((node) => node.id === id);
        }
      }
    }
  }

  if (!nodesConnect) {
    return;
  }

  const source = findNode((element) =>
    element.contains(event.target as Node | null)
  );

  if (!source) {
    return;
  }

  if (nodesConnect.sourceType) {
    if (
      !([] as unknown[]).concat(nodesConnect.sourceType).includes(source.type)
    ) {
      return;
    }
  } else if (!checkIfByTransform(nodesConnect, { source })) {
    return;
  }

  event.stopPropagation();

  setConnectLineState({
    from: [event.clientX, event.clientY],
    options: {
      strokeColor: DEFAULT_LINE_STROKE_COLOR,
      strokeWidth: DEFAULT_LINE_STROKE_WIDTH,
      ...(__secret_internals.legacyDoTransform(
        { source },
        nodesConnect
      ) as NodesConnectOptions),
    },
  });
  setConnectLineTo([event.clientX, event.clientY]);
  onSwitchActiveTarget?.({ type: "node", nodeId: source.id });
  const onMouseMove = (e: MouseEvent) => {
    setConnectLineTo([e.clientX, e.clientY]);
  };
  const onMouseUp = (e: MouseEvent) => {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
    setConnectLineState(null);
    const eventTargets = e.composedPath();
    const target = findNode((element) => eventTargets.includes(element));
    if (target && source !== target) {
      onNodesConnect?.({ source, target });
    }
  };
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
}
