// istanbul ignore file
import React from "react";
import { InspectOutline } from "../data-providers/preview/interfaces.js";

export function InspectOutlineComponent({
  width,
  height,
  left,
  top,
  selector,
}: InspectOutline): React.ReactElement {
  const borderWidth = 2;
  return (
    <div
      className="outline"
      style={{
        width: width + borderWidth * 2,
        height: height + borderWidth * 2,
        left: left - borderWidth,
        top: top - borderWidth,
      }}
    >
      <div className="label">
        {selector.type === "testid"
          ? `[${selector.value}]`
          : `#${selector.value}`}
      </div>
    </div>
  );
}
