import { uniqueId } from "lodash";
import React, { useEffect, useMemo, useState } from "react";

export interface RotatingArcProps {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

export function RotatingArc({ cx, cy, rx, ry }: RotatingArcProps) {
  const durationPerCircle = 2.6;
  const [path, setPath] = useState("M 0 0");
  const defId = useMemo(() => uniqueId("rotating-arc-"), []);

  useEffect(() => {
    let start: number;
    let timer: number;

    function step(timestamp: number) {
      if (start === undefined) {
        start = timestamp;
      }
      const elapsed = timestamp - start;

      const startAngle =
        -(elapsed / 1000 / durationPerCircle) * Math.PI * 2 + Math.PI * 1.1;
      // A bit more than a quarter circle
      const endAngle = startAngle - Math.PI * 0.6;
      const x1 = cx + rx * Math.cos(startAngle);
      const y1 = cy + ry * Math.sin(startAngle);
      const x2 = cx + rx * Math.cos(endAngle);
      const y2 = cy + ry * Math.sin(endAngle);
      setPath(`M ${x1} ${y1} A ${rx} ${ry} 0 0 0 ${x2} ${y2}`);
      timer = requestAnimationFrame(step);
    }

    timer = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(timer);
    };
  }, [cx, cy, rx, ry]);

  return (
    <>
      <defs>
        <linearGradient
          id={defId}
          gradientTransform="rotate(48)"
          x1="0"
          y1="0"
          x2="830px"
          y2="183px"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="rgba(132, 253, 253, 0)" />
          <stop offset="25%" stopColor="rgba(132, 253, 253, 1)" />
          <stop offset="50%" stopColor="rgba(132, 253, 253, 1)" />
          <stop offset="75%" stopColor="rgba(248, 255, 255, 1)" />
        </linearGradient>
      </defs>
      <path
        d={path}
        // d="M 0.6 89.5 A 412.4 88.9 0 0 0 825.4 88.9"
        strokeWidth={4}
        stroke={`url(#${defId})`}
        fill="none"
      />
    </>
  );
}
