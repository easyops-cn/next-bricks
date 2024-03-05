import React, { useEffect, useState } from "react";
import classNames from "classnames";
import type { ConnectLineState } from "./interfaces";
import type { PositionTuple } from "../diagram/interfaces";

export interface ConnectLineComponentProps {
  connectLineState: ConnectLineState | null;
  markerEnd: string;
  onConnect(state: ConnectLineState, to: PositionTuple): void;
}

export function ConnectLineComponent({
  connectLineState,
  markerEnd,
  onConnect,
}: ConnectLineComponentProps): JSX.Element {
  const [connectLineTo, setConnectLineTo] = useState<PositionTuple | null>(
    null
  );

  useEffect(() => {
    if (connectLineState) {
      setConnectLineTo(connectLineState.from);

      const onMouseMove = (e: MouseEvent) => {
        setConnectLineTo([
          e.clientX - connectLineState.offset[0],
          e.clientY - connectLineState.offset[1],
        ]);
      };
      const onMouseDown = (e: MouseEvent) => {
        e.stopPropagation();
      };
      const onClick = (e: MouseEvent) => {
        e.stopPropagation();
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        reset();
        onConnect(connectLineState, [
          e.clientX - connectLineState.offset[0],
          e.clientY - connectLineState.offset[1],
        ]);
      };
      const reset = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mousedown", onMouseDown, {
          capture: true,
        });
        document.removeEventListener("click", onClick, { capture: true });
        setConnectLineTo(null);
      };
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mousedown", onMouseDown, { capture: true });
      document.addEventListener("click", onClick, { capture: true });

      return reset;
    }
  }, [connectLineState, onConnect]);

  return (
    <path
      className={classNames("connect-line", {
        connecting:
          !!connectLineState &&
          connectLineTo &&
          // Do not show when the distance of mouse move is less than 5px
          (connectLineTo[0] - connectLineState.from[0]) ** 2 +
            (connectLineTo[1] - connectLineState.from[1]) ** 2 >
            25,
      })}
      d={
        connectLineState && connectLineTo
          ? `M${connectLineState.from.join(" ")}L${connectLineTo.join(" ")}`
          : ""
      }
      fill="none"
      stroke="gray"
      strokeWidth={1}
      markerEnd={`url(#${markerEnd})`}
    />
  );
}
