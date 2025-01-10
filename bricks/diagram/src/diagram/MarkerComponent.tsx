import React, { type JSX } from "react";
import type { LineMarkerType } from "./interfaces";

export interface MarkerComponentProps extends BaseMarkerComponentProps {
  type: LineMarkerType;
}

export interface BaseMarkerComponentProps {
  id: string;
  strokeColor?: string;
}

export function MarkerComponent({
  id,
  type,
  strokeColor,
}: MarkerComponentProps): JSX.Element {
  let Component: (props: BaseMarkerComponentProps) => JSX.Element;

  switch (type) {
    case "0..1":
      Component = EntityRelationZeroOrOneMarker;
      break;
    case "0..N":
      Component = EntityRelationZeroOrManyMarker;
      break;
    case "circle":
      Component = CircleMarker;
      break;
    default:
      Component = ArrowMarker;
  }
  return <Component id={id} strokeColor={strokeColor} />;
}

function CircleMarker({
  id,
  strokeColor,
}: BaseMarkerComponentProps): JSX.Element {
  const r = 3;
  const d = r * 3;
  return (
    <marker
      viewBox={`0 0 ${d} ${d}`}
      refX={r}
      refY={r}
      id={id}
      overflow="visible"
      markerWidth={d}
      markerHeight={d}
    >
      <circle stroke="none" fill={strokeColor} cx={r} cy={r} r={r} />
    </marker>
  );
}

function ArrowMarker({
  id,
  strokeColor,
}: BaseMarkerComponentProps): JSX.Element {
  return (
    <marker
      id={id}
      viewBox="0 0 6 6"
      refX={5}
      refY={3}
      markerWidth={6}
      markerHeight={6}
      orient="auto-start-reverse"
      strokeLinejoin="round"
    >
      <path
        d="M 0.5 0.5 L 5.5 3 L 0.5 5.5 z"
        stroke={strokeColor}
        strokeWidth={1}
        fill={strokeColor}
      />
    </marker>
  );
}

function EntityRelationZeroOrOneMarker({
  id,
  strokeColor,
}: BaseMarkerComponentProps): JSX.Element {
  return (
    <marker
      id={id}
      viewBox="0 0 21 11"
      refX={0.5}
      refY={5.5}
      markerWidth={21}
      markerHeight={11}
      orient="auto-start-reverse"
    >
      <path
        d="M 5.5 5.5 m 5 0 a 5 5 0 1 0 -10 0 a 5 5 0 1 0 10 0 M 15.5 0.5 V 10.5 M 10.5 5.5 H 20.5"
        stroke={strokeColor}
        strokeWidth={1}
        fill="none"
      />
    </marker>
  );
}

function EntityRelationZeroOrManyMarker({
  id,
  strokeColor,
}: BaseMarkerComponentProps): JSX.Element {
  return (
    <marker
      id={id}
      viewBox="0 0 21 11"
      refX={0.5}
      refY={5.5}
      markerWidth={21}
      markerHeight={11}
      orient="auto-start-reverse"
    >
      <path
        d="M 5.5 5.5 m 5 0 a 5 5 0 1 0 -10 0 a 5 5 0 1 0 10 0 M 20.5 0.5 L 10.5 5.5 L 20.5 10.5 M 10.5 5.5 H 20.5"
        stroke={strokeColor}
        strokeWidth={1}
        fill="none"
      />
    </marker>
  );
}
