import React, { useCallback, useEffect } from "react";
import {
  ReactUseBrick,
  type UseSingleBrickConf,
} from "@next-core/react-runtime";
import type { NodeId } from "./interfaces";

export interface NodeComponentProps {
  id: NodeId;
  useBrick: UseSingleBrickConf;
  onMount?: (id: NodeId, element: HTMLElement | null) => void;
  onUnmount?: (id: NodeId) => void;
}

export function NodeComponent({
  id,
  useBrick,
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
    />
  );
}
