import React, { useCallback, useEffect, useMemo } from "react";
import { checkIfOfComputed } from "@next-core/runtime";
import { ReactUseBrick } from "@next-core/react-runtime";
import classNames from "classnames";
import type {
  LineLabelConf,
  PositionTuple,
  TextOptions,
} from "../diagram/interfaces";
import type { EdgeCell } from "./interfaces";

export interface LineLabelComponentProps {
  edge: EdgeCell;
  position?: PositionTuple | null;
  label?: LineLabelConf;
  text?: TextOptions;
  onRendered?: (element: HTMLElement | null) => void;
  onClick?: () => void;
}

export function LineLabelComponent({
  edge,
  position,
  label,
  text,
  onRendered,
  onClick,
}: LineLabelComponentProps): JSX.Element | null {
  if (!label && !text) {
    return null;
  }
  return (
    <foreignObject
      className={classNames("line-label-container", { ready: !!position })}
      x={position?.[0]}
      y={position?.[1]}
      onClick={onClick}
    >
      {label ? (
        <div className="line-label label">
          <LineLabelUseBrickComponent
            edge={edge}
            label={label}
            onRendered={onRendered}
          />
        </div>
      ) : (
        <LineLabelTextComponent text={text!} onRendered={onRendered} />
      )}
    </foreignObject>
  );
}

interface LineLabelTextComponentProps {
  text: TextOptions;
  onRendered?: (element: HTMLElement | null) => void;
}

function LineLabelTextComponent({
  text,
  onRendered,
}: LineLabelTextComponentProps): JSX.Element {
  const refCallback = useCallback(
    (element: HTMLDivElement) => {
      onRendered?.(element);
    },
    [onRendered]
  );

  return (
    <div className="line-label text" ref={refCallback} style={text.style}>
      {text.content}
    </div>
  );
}

interface LineLabelUseBrickComponentProps {
  edge: EdgeCell;
  label: LineLabelConf;
  onRendered?: (element: HTMLElement | null) => void;
}

// istanbul ignore next
function LineLabelUseBrickComponent({
  edge,
  label,
  onRendered,
}: LineLabelUseBrickComponentProps): JSX.Element | null {
  const useBrick = useMemo(
    () => (checkIfOfComputed(label) ? label.useBrick : null),
    [label]
  );

  const memoizedData = useMemo(() => ({ edge }), [edge]);

  useEffect(() => {
    if (!useBrick) {
      // Keep the same time delay for reporting rendered.
      setTimeout(() => {
        onRendered?.(null);
      });
    }
  }, [onRendered, useBrick]);

  useEffect(
    () => {
      return () => {
        onRendered?.(null);
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
          // await Promise.resolve();
          onRendered?.(element.parentElement);
        });
      }
    },
    [onRendered]
  );

  const ignoredCallback = useCallback(() => {
    setTimeout(() => {
      onRendered?.(null);
    });
  }, [onRendered]);

  if (!useBrick) {
    return null;
  }

  return (
    <ReactUseBrick
      refCallback={refCallback}
      ignoredCallback={ignoredCallback}
      useBrick={useBrick}
      data={memoizedData}
    />
  );
}
