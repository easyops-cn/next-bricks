import React, { useEffect, useState } from "react";

export function RotatingArc() {
  const durationPerCircle = 2.6;
  const [path, setPath] = useState("M 0 0");

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
      const rx = 412.4;
      const ry = 88.9;
      const cx = 413;
      const cy = 89.5;
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
  }, []);

  return (
    <path
      d={path}
      // d="M 0.6 89.5 A 412.4 88.9 0 0 0 825.4 88.9"
      strokeWidth={4}
      stroke="url(#rotating-arc)"
      fill="none"
    ></path>
  );
}
