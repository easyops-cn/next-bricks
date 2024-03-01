import React, { useCallback, useEffect, useMemo } from "react";
import {
  ReactUseBrick,
  type UseSingleBrickConf,
} from "@next-core/react-runtime";
import { checkIfByTransform } from "@next-core/runtime";
import type {
  NodeBrickCell,
  NodeBrickConf,
  NodeCell,
  NodeId,
} from "./interfaces";

export interface NodeContainerProps {
  node: NodeCell;
  defaultNodeBricks?: NodeBrickConf[];
  onMount?: (id: NodeId, element: HTMLElement | null) => void;
  onUnmount?: (id: NodeId) => void;
}

export function NodeContainer({
  node,
  defaultNodeBricks,
  onMount,
  onUnmount,
}: NodeContainerProps): JSX.Element | null {
  const memoizedData = useMemo(
    () => ({ node: { id: node.id, data: node.data } }),
    [node.id, node.data]
  );
  const specifiedUseBrick = (node as NodeBrickCell).useBrick;

  const useBrick = useMemo(() => {
    return (
      specifiedUseBrick ??
      defaultNodeBricks?.find((item) => checkIfByTransform(item, memoizedData))
        ?.useBrick
    );
  }, [defaultNodeBricks, specifiedUseBrick, memoizedData]);

  return useBrick ? (
    <foreignObject
      x={node.view.x}
      y={node.view.y}
      width={node.view.width}
      height={node.view.height}
      style={{ overflow: "visible" }}
    >
      <NodeComponent
        id={node.id}
        useBrick={useBrick}
        data={memoizedData}
        onMount={onMount}
        onUnmount={onUnmount}
      />
    </foreignObject>
  ) : null;
}

export interface NodeComponentProps {
  id: NodeId;
  useBrick: UseSingleBrickConf;
  data: unknown;
  onMount?: (id: NodeId, element: HTMLElement | null) => void;
  onUnmount?: (id: NodeId) => void;
}

export function NodeComponent({
  id,
  useBrick,
  data,
  onMount,
  onUnmount,
}: NodeComponentProps): JSX.Element | null {
  useEffect(
    () => {
      return () => {
        onUnmount?.(id);
      };
    },
    // Only unmount once
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const refCallback = useCallback(
    (element: HTMLElement | null) => {
      if (element) {
        onMount?.(id, element);
      }
    },
    [id, onMount]
  );

  const ignoredCallback = useCallback(() => {
    onMount?.(id, null);
  }, [id, onMount]);

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
      data={data}
    />
  );
}
