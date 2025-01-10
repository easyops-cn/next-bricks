import React, { type JSX } from "react";
import classNames from "classnames";
import type { ConnectLineState, PositionTuple } from "./interfaces";
import { MarkerComponent } from "./MarkerComponent";

export interface ConnectLineComponentProps {
  connectLineState: ConnectLineState | null;
  connectLineTo: PositionTuple;
  markerPrefix: string;
}

export function ConnectLineComponent({
  connectLineState,
  connectLineTo,
  markerPrefix,
}: ConnectLineComponentProps): JSX.Element {
  return (
    <svg
      width="100%"
      height="100%"
      className={classNames("connect-line", {
        connecting:
          !!connectLineState &&
          // Do not show when the distance of mouse move is less than 5px
          (connectLineTo[0] - connectLineState.from[0]) ** 2 +
            (connectLineTo[1] - connectLineState.from[1]) ** 2 >
            25,
      })}
    >
      <defs>
        <MarkerComponent
          type="arrow"
          id={`${markerPrefix}connect-line`}
          strokeColor={connectLineState?.options.strokeColor}
        />
      </defs>
      <path
        d={
          connectLineState
            ? `M${connectLineState.from.join(" ")}L${connectLineTo.join(" ")}`
            : ""
        }
        fill="none"
        stroke={connectLineState?.options.strokeColor}
        strokeWidth={connectLineState?.options.strokeWidth}
        markerEnd={
          connectLineState?.options.arrow
            ? `url(#${markerPrefix}connect-line)`
            : undefined
        }
      />
    </svg>
  );
}
