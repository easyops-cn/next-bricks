import React, { useEffect, useMemo, useState } from "react";
import { ReactUseBrick } from "@next-core/react-runtime";
import { checkIfByTransform } from "@next-core/runtime";
import { isEqual } from "lodash";
import type { NodeBrickCell, NodeBrickConf, NodeCell } from "./interfaces";

export interface NodeComponentProps {
  node: NodeCell;
  defaultNodeBricks?: NodeBrickConf[];
}

export function NodeComponent({
  node,
  defaultNodeBricks,
}: NodeComponentProps): JSX.Element | null {
  const memoizedData = useDeepMemo({ node: { id: node.id, data: node.data } });
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
      width={node.view.width}
      height={node.view.height}
      className="node"
    >
      {useBrick && <ReactUseBrick useBrick={useBrick} data={memoizedData} />}
    </foreignObject>
  ) : null;
}

function useDeepMemo<T>(value: T): T {
  const [memoizedValue, setMemoizedValue] = useState(value);

  useEffect(() => {
    setMemoizedValue((prev) => (isEqual(prev, value) ? prev : value));
  }, [value]);

  return memoizedValue;
}
