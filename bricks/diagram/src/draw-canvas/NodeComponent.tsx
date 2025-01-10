import React, { useCallback, useEffect, useMemo, useRef, useState, type JSX } from "react";
import { ReactUseBrick } from "@next-core/react-runtime";
import { __secret_internals, checkIfByTransform } from "@next-core/runtime";
import { isEqual } from "lodash";
import ResizeObserver from "resize-observer-polyfill";
import type { NodeBrickCell, NodeBrickConf, NodeCell } from "./interfaces";
import type { SizeTuple } from "../diagram/interfaces";

export interface NodeComponentProps {
  node: NodeCell;
  degraded: boolean;
  degradedNodeLabel?: string;
  defaultNodeBricks?: NodeBrickConf[];
  onResize(id: string, size: SizeTuple | null): void;
}

export function NodeComponent({
  node,
  degraded,
  degradedNodeLabel,
  defaultNodeBricks,
  onResize,
}: NodeComponentProps): JSX.Element | null {
  const memoizedData = useDeepMemo({ node: { id: node.id, data: node.data } });
  const specifiedUseBrick = (node as NodeBrickCell).useBrick;
  const observerRef = useRef<ResizeObserver | null>(null);

  const useBrick = useMemo(() => {
    return degraded
      ? null
      : specifiedUseBrick ??
          defaultNodeBricks?.find((item) =>
            checkIfByTransform(item, memoizedData)
          )?.useBrick;
  }, [degraded, specifiedUseBrick, defaultNodeBricks, memoizedData]);

  const label = useMemo<string>(
    () =>
      degraded
        ? String(
            __secret_internals.legacyDoTransform(
              memoizedData,
              degradedNodeLabel ?? "<% DATA.node.id %>"
            )
          )
        : "",
    [degraded, degradedNodeLabel, memoizedData]
  );

  const refCallback = useCallback(
    (element: HTMLElement | null) => {
      const prevObserver = observerRef.current;
      if (prevObserver) {
        prevObserver.disconnect();
        observerRef.current = null;
      }
      if (element) {
        // Todo: correctly wait for `useBrick` in v3 to be rendered (after layout)
        // Wait a macro task to let `useBrick` to be rendered.
        setTimeout(() => {
          const observer = new ResizeObserver(() => {
            onResize(node.id, [element.offsetWidth, element.offsetHeight]);
          });
          observer.observe(element);
          observerRef.current = observer;
        });
      } else {
        onResize(node.id, null);
      }
    },
    [node.id, onResize]
  );

  const degradedRefCallBack = useCallback(
    (g: SVGGElement | null) => {
      if (g) {
        // istanbul ignore next
        const size =
          process.env.NODE_ENV === "test"
            ? { width: 60, height: 60 }
            : g.getBBox();
        onResize(node.id, [size.width, size.height]);
      } else {
        onResize(node.id, null);
      }
    },
    [node.id, onResize]
  );

  return useBrick ? (
    <foreignObject
      // Make a large size to avoid the brick inside to be clipped by the foreignObject.
      width={9999}
      height={9999}
      className="node"
    >
      {useBrick && (
        <ReactUseBrick
          useBrick={useBrick}
          data={memoizedData}
          refCallback={refCallback}
        />
      )}
    </foreignObject>
  ) : degraded ? (
    <g className="degraded" ref={degradedRefCallBack}>
      <circle cx={8} cy={8} r={8} />
      <text x={8} y={32}>
        {label}
      </text>
    </g>
  ) : null;
}

function useDeepMemo<T>(value: T): T {
  const [memoizedValue, setMemoizedValue] = useState(value);

  useEffect(() => {
    setMemoizedValue((prev) => (isEqual(prev, value) ? prev : value));
  }, [value]);

  return memoizedValue;
}
