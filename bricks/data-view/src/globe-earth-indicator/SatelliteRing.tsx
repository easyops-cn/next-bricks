import React from "react";

export function SatelliteRing() {
  return (
    <svg className="ring" width="928px" height="534px" viewBox="0 0 928 534">
      <defs>
        <linearGradient
          x1="50%"
          y1="14.8555832%"
          x2="50%"
          y2="100%"
          id="linearGradient-1"
        >
          <stop stopColor="#00E8FF" stopOpacity="0" offset="0%"></stop>
          <stop stopColor="#00CCFF" offset="100%"></stop>
        </linearGradient>
        <linearGradient
          x1="50%"
          y1="14.8555832%"
          x2="50%"
          y2="100%"
          id="linearGradient-2"
        >
          <stop stopColor="#00CCFF" offset="0%"></stop>
          <stop stopColor="#00E8FF" stopOpacity="0" offset="100%"></stop>
        </linearGradient>
      </defs>
      <g transform="translate(51 304)" stroke="1" fill="none" opacity={0.5}>
        <ellipse
          cx="413"
          cy="-136"
          rx="164"
          ry="94.5"
          stroke="url(#linearGradient-1)"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 413 -136"
            to="360 413 -136"
            dur="2.6s"
            repeatCount="indefinite"
          />
        </ellipse>
        <ellipse
          cx="413"
          cy="-136"
          rx="164"
          ry="94.5"
          stroke="url(#linearGradient-2)"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="210 413 -136"
            to="-150 413 -136"
            dur="2.6s"
            repeatCount="indefinite"
          />
        </ellipse>
      </g>
    </svg>
  );
}
