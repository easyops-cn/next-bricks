// istanbul ignore file
import React from "react";
import { InspectOutline } from "../data-providers/preview/interfaces.js";

export interface InspectOutlineComponentProps extends InspectOutline {
  type: "hover" | "active";
}

export function InspectOutlineComponent({
  type,
  width,
  height,
  left,
  top,
  selector,
}: InspectOutlineComponentProps): React.ReactElement {
  const borderWidth = 2;
  return (
    <div
      className={"outline " + type}
      style={{
        width: width + borderWidth * 2,
        height: height + borderWidth * 2,
        left: left - borderWidth,
        top: top - borderWidth,
      }}
    >
      <div className="label">
        {selector.type === "testid"
          ? `{${selector.value}}`
          : selector.type === "id"
          ? `#${selector.value}`
          : selector.value}
      </div>
    </div>
  );
}
