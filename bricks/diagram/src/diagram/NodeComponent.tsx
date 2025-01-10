import React, { useCallback, useEffect, useMemo, useState, type JSX } from "react";
import { ReactUseBrick } from "@next-core/react-runtime";
import type {
  DiagramNode,
  DiagramNodeId,
  NodeBrickConf,
  RefRepository,
} from "./interfaces";
import { findNodeBrick } from "./processors/findNodeBrick";

export interface NodeComponentGroupProps {
  nodes?: DiagramNode[];
  nodeBricks?: NodeBrickConf[];
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

  useEffect(() => {
    // All nodes have been rendered.
    setRendered(!nodes?.some((node) => !renderedIds.includes(node.id)));
  }, [nodes, renderedIds]);

  useEffect(
    () => {
      onRendered?.(rendered ? refRepository : null);
    },
    // Dot not re-run effect when `onRendered` changed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [/* onRendered, */ refRepository, rendered]
  );

  return (
    <React.Fragment>
      {nodes?.map((node) => (
        <div key={node.id} className="node">
          <NodeComponent
            nodeBricks={nodeBricks}
            node={node}
            onRendered={handleRenderer}
            onUnmount={handleUnmount}
          />
        </div>
      ))}
    </React.Fragment>
  );
}

export interface NodeComponentProps {
  node: DiagramNode;
  nodeBricks?: NodeBrickConf[];
  onRendered?: (id: DiagramNodeId, element: HTMLElement | null) => void;
  onUnmount?: (id: DiagramNodeId) => void;
}

export function NodeComponent({
  node,
  nodeBricks,
  onRendered,
  onUnmount,
}: NodeComponentProps): JSX.Element | null {
  const useBrick = useMemo(
    () => findNodeBrick(node, nodeBricks)?.useBrick,
    [node, nodeBricks]
  );
  const memoizedData = useMemo(() => ({ node }), [node]);

  useEffect(() => {
    if (!useBrick) {
      // Keep the same time delay for reporting rendered.
      setTimeout(() => {
        onRendered?.(node.id, null);
      });
    }
  }, [node.id, onRendered, useBrick]);

  useEffect(
    () => {
      return () => {
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
        // Todo: correctly wait for `useBrick` in v3 to be rendered (after layout)
        // Wait a macro task to let `useBrick` to be rendered.
        setTimeout(() => {
          onRendered?.(node.id, element);
        });
      }
    },
    [node.id, onRendered]
  );

  const ignoredCallback = useCallback(() => {
    setTimeout(() => {
      onRendered?.(node.id, null);
    });
  }, [node.id, onRendered]);

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
