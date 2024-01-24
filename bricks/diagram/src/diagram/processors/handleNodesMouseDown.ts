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
  ConnectNodesOptions,
  PositionTuple,
  RefRepository,
  ActiveTarget,
  DragNodesOptions,
  NodesFilterOptions,
  NodeMovement,
  ManualLayoutStatus,
} from "../interfaces";

export function handleNodesMouseDown(
  event: MouseEvent,
  {
    nodes,
    nodesRefRepository,
    connectNodes,
    dragNodes,
    scale,
    setConnectLineState,
    setConnectLineTo,
    setManualLayoutStatus,
    setNodeMovement,
    onSwitchActiveTarget,
    onNodesConnect,
  }: {
    nodes: DiagramNode[] | undefined;
    connectNodes: ConnectNodesOptions | undefined;
    dragNodes: DragNodesOptions | undefined;
    nodesRefRepository: RefRepository | null;
    scale: number;
    setConnectLineState: (
      value: React.SetStateAction<ConnectLineState | null>
    ) => void;
    setConnectLineTo: (value: React.SetStateAction<PositionTuple>) => void;
    setManualLayoutStatus: (
      value: React.SetStateAction<ManualLayoutStatus>
    ) => void;
    setNodeMovement: (value: React.SetStateAction<NodeMovement | null>) => void;
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

  if (!connectNodes && !dragNodes) {
    return;
  }

  const source = findNode((element) =>
    element.contains(event.target as Node | null)
  );

  if (!source) {
    return;
  }

  if (!nodeMatched(connectNodes || dragNodes!, source)) {
    return;
  }

  event.stopPropagation();
  const from: PositionTuple = [event.clientX, event.clientY];

  if (connectNodes) {
    setConnectLineState({
      from,
      options: {
        strokeColor: DEFAULT_LINE_STROKE_COLOR,
        strokeWidth: DEFAULT_LINE_STROKE_WIDTH,
        ...(__secret_internals.legacyDoTransform(
          { source },
          connectNodes
        ) as ConnectNodesOptions),
      },
    });
    setConnectLineTo(from);

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
    return;
  }

  // Drag node
  onSwitchActiveTarget?.({ type: "node", nodeId: source.id });

  let moved = false;
  const onMouseMove = (e: MouseEvent) => {
    // Respect the scale
    const movement: PositionTuple = [
      (e.clientX - from[0]) / scale,
      (e.clientY - from[1]) / scale,
    ];
    if (!moved) {
      moved = movement[0] ** 2 + movement[1] ** 2 >= 9;
      if (moved) {
        setManualLayoutStatus("started");
      }
    }
    if (moved) {
      setNodeMovement({ id: source.id, move: movement });
    }
  };
  const onMouseUp = () => {
    moved = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
    setNodeMovement(null);
    setManualLayoutStatus("finished");
  };
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
}

function nodeMatched(
  options: NodesFilterOptions,
  source: DiagramNode
): boolean {
  return options.sourceType
    ? ([] as unknown[]).concat(options.sourceType).includes(source.type)
    : checkIfByTransform(options, { source });
}
