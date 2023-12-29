import React, { useCallback, useEffect, useMemo, useState } from "react";
// import { getRuntime } from "@next-core/runtime";
import { ReactUseBrick } from "@next-core/react-runtime";
import type {
  DiagramNode,
  DiagramNodeId,
  NodeBrickConf,
  RefRepository,
} from "./interfaces";
import { findNodeBrick } from "./findNodeBrick";

export interface NodeComponentGroupProps {
  nodes?: DiagramNode[];
  nodeBricks?: NodeBrickConf[];
  // nodePositions?: Map<DiagramNodeId, NodePosition>;
  onRendered?: (refRepository: RefRepository | null) => void;
}

export function NodeComponentGroup({
  nodes,
  nodeBricks,
  onRendered,
}: NodeComponentGroupProps): JSX.Element {
  const [rendered, setRendered] = useState(false);
  const [renderedIds, setRenderedIds] = useState<DiagramNodeId[]>([]);
  const refRepository = useMemo<RefRepository>(() => new Map(), []);

  const handleRenderer = useCallback(
    (id: DiagramNodeId, element: HTMLElement | null) => {
      if (element) {
        refRepository.set(id, element);
      }
      setRenderedIds((previous) =>
        previous.includes(id) ? previous : previous.concat(id)
      );
    },
    [refRepository]
  );

  const handleUnmount = useCallback(
    (id: DiagramNodeId) => {
      setRenderedIds((previous) => {
        const index = previous.indexOf(id);
        return index === -1
          ? previous
          : previous.slice(0, index).concat(previous.slice(index + 1));
      });
      refRepository.delete(id);
    },
    [refRepository]
  );

  // useEffect(() => {
  //   setRendered(false);
  // }, [nodes]);

  useEffect(() => {
    // All nodes have been rendered.
    // setRendered(renderedIds.length >= (nodes?.length ?? 0));
    setRendered(!nodes?.some((node) => !renderedIds.includes(node.id)));
  }, [nodes, renderedIds]);

  useEffect(() => {
    onRendered?.(rendered ? refRepository : null);
  }, [/* onRendered, */ refRepository, rendered]);

  return (
    <React.Fragment>
      {nodes?.map((node) => {
        // const position = nodePositions?.get(node.id);
        return (
          <div key={node.id} className="node">
            <NodeComponent
              nodeBricks={nodeBricks}
              node={node}
              // refRepository={refRepository}
              onRendered={handleRenderer}
              onUnmount={handleUnmount}
            />
          </div>
        );
      })}
    </React.Fragment>
  );
}

export interface NodeComponentProps {
  node: DiagramNode;
  nodeBricks?: NodeBrickConf[];
  // refRepository?: RefRepository;
  onRendered?: (id: DiagramNodeId, element: HTMLElement | null) => void;
  onUnmount?: (id: DiagramNodeId) => void;
}

export function NodeComponent({
  node,
  nodeBricks,
  // refRepository,
  onRendered,
  onUnmount,
}: NodeComponentProps): JSX.Element | null {
  const useBrick = useMemo(
    () => findNodeBrick(node, nodeBricks)?.useBrick,
    [node, nodeBricks]
  );
  // const migrateV3 = getRuntime().version >= 3;
  const memoizedData = useMemo(() => ({ node }), [node]);

  // Todo(steve)
  // istanbul ignore next
  useEffect(() => {
    if (/* !migrateV3 || */ !useBrick) {
      // Wait a micro task to let `useBrick` to be rendered.
      Promise.resolve().then(() => {
        onRendered?.(node.id, null);
      });
    }
  }, [/* migrateV3, */ node.id, onRendered, useBrick]);

  useEffect(
    () => {
      return () => {
        // refRepository?.delete(node.id);
        onUnmount?.(node.id);
      };
    },
    // Only unmount once
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const refCallback = useCallback(
    (element: HTMLElement | null) => {
      if (element) {
        // refRepository?.set(node.id, element);
        // if (migrateV3) {
        // Todo: correctly wait for `useBrick` in v3 to be rendered (after layout)
        // Wait a macro task to let `useBrick` to be rendered.
        setTimeout(() => {
          onRendered?.(node.id, element);
        }, 1);
        // }
      }
    },
    [/* migrateV3, */ node.id, onRendered /* , refRepository */]
  );

  const ignoredCallback = useCallback(() => {
    // if (migrateV3) {
    // Todo: correctly wait for `useBrick` in v3 to be rendered (after layout)
    setTimeout(() => {
      onRendered?.(node.id, null);
    }, 1);
    // }
  }, [/* migrateV3, */ node.id, onRendered]);

  if (!useBrick) {
    return null;
  }

  return (
    <ReactUseBrick
      refCallback={refCallback}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore For v3 only
      ignoredCallback={ignoredCallback}
      useBrick={useBrick}
      data={memoizedData}
    />
  );
}
