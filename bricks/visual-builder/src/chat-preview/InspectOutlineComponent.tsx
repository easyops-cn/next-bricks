import React from "react";
import { InspectOutline } from "../data-providers/chat-preview/interfaces.js";

export interface InspectOutlineComponentProps extends InspectOutline {
  variant: "hover" | "active";
}

export function InspectOutlineComponent({
  variant,
  width,
  height,
  left,
  top,
  label,
}: InspectOutlineComponentProps): React.ReactElement {
  const borderWidth = 4;
  return (
    <div
      className={"outline " + variant}
      style={{
        width: width + borderWidth * 2,
        height: height + borderWidth * 2,
        left: left - borderWidth,
        top: top - borderWidth,
      }}
    >
      <div className="label">{label}</div>
    </div>
  );
}
