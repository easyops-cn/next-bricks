import React from "react";

export function Empty(): React.ReactNode {
  return (
    <svg width="56" height="53" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient
          x1="5.718%"
          y1="4.311%"
          x2="83.05%"
          y2="88.915%"
          id="2a"
        >
          <stop stopColor="#D4D8E4" offset="0%"></stop>
          <stop stopColor="#A9B0C4" offset="100%"></stop>
        </linearGradient>
        <linearGradient x1="0%" y1="11.08%" x2="80.548%" y2="107.704%" id="2d">
          <stop stopColor="#C2C7DA" offset="0%"></stop>
          <stop stopColor="#8F96B3" offset="100%"></stop>
        </linearGradient>
        <linearGradient
          x1="41.823%"
          y1="24.795%"
          x2="8.813%"
          y2="86.427%"
          id="2g"
        >
          <stop stopColor="#CCD0DD" offset="0%"></stop>
          <stop stopColor="#9DA3B9" offset="100%"></stop>
        </linearGradient>
        <filter
          x="-57.2%"
          y="-47.7%"
          width="233.4%"
          height="233.4%"
          filterUnits="objectBoundingBox"
          id="2b"
        >
          <feOffset
            dx="1"
            dy="2"
            in="SourceAlpha"
            result="shadowOffsetOuter1"
          ></feOffset>
          <feGaussianBlur
            stdDeviation="2"
            in="shadowOffsetOuter1"
            result="shadowBlurOuter1"
          ></feGaussianBlur>
          <feComposite
            in="shadowBlurOuter1"
            in2="SourceAlpha"
            operator="out"
            result="shadowBlurOuter1"
          ></feComposite>
          <feColorMatrix
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.22 0"
            in="shadowBlurOuter1"
          ></feColorMatrix>
        </filter>
        <filter
          x="-94.4%"
          y="-121.3%"
          width="288.7%"
          height="288.7%"
          filterUnits="objectBoundingBox"
          id="2e"
        >
          <feOffset
            dy="-2"
            in="SourceAlpha"
            result="shadowOffsetOuter1"
          ></feOffset>
          <feGaussianBlur
            stdDeviation="2"
            in="shadowOffsetOuter1"
            result="shadowBlurOuter1"
          ></feGaussianBlur>
          <feColorMatrix
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
            in="shadowBlurOuter1"
          ></feColorMatrix>
        </filter>
        <path
          d="M23.672 23.607h2.492a4 4 0 0 1 4 4v2.491a4 4 0 0 1-4 4h-2.492a4 4 0 0 1-4-4v-2.491a4 4 0 0 1 4-4Z"
          id="2c"
        ></path>
        <path
          d="M37.311 12.459a4 4 0 0 1 4 4v3.419l-7.418-7.419h3.418Z"
          id="2f"
        ></path>
      </defs>
      <g fill="none" fillRule="evenodd">
        <path
          d="M39.682 33.967H10.81a2.8 2.8 0 0 0-1.94.782l-5.197 4.999v6.98a5.6 5.6 0 0 0 5.6 5.6H41.22a5.6 5.6 0 0 0 5.6-5.6v-6.98l-5.196-4.999a2.8 2.8 0 0 0-1.942-.782Z"
          fill="#A6AAC3"
        ></path>
        <path
          d="m33.893 12.459 7.418 7.419v22.568a2.8 2.8 0 0 1-2.8 2.8h-26.53a2.8 2.8 0 0 1-2.8-2.8V18.459a6 6 0 0 1 6-6h18.712Z"
          fill="url(#2a)"
        ></path>
        <g>
          <use fill="#000" filter="url(#2b)"></use>
          <path
            stroke="#FFF"
            d="M26.164 24.107c.966 0 1.841.391 2.475 1.025a3.489 3.489 0 0 1 1.025 2.475v2.491c0 .967-.392 1.842-1.025 2.475a3.489 3.489 0 0 1-2.475 1.025h-2.492a3.489 3.489 0 0 1-2.475-1.025 3.489 3.489 0 0 1-1.025-2.475v-2.491c0-.967.392-1.842 1.025-2.475a3.489 3.489 0 0 1 2.475-1.025Z"
            strokeLinejoin="round"
            fill="url(#d)"
          ></path>
        </g>
        <g transform="rotate(180 37.602 16.168)">
          <use fill="#000" filter="url(#2e)"></use>
          <use fill="url(#2g)"></use>
        </g>
        <path
          d="M54.164 27.541c.253 0 .459.205.459.459v.918h.918a.459.459 0 1 1 0 .918h-.918v.918a.459.459 0 0 1-.918 0v-.918h-.918a.459.459 0 0 1 0-.918h.918V28c0-.254.205-.459.459-.459ZM1.377 20.197c.19 0 .344.154.344.344v.574h.574a.459.459 0 1 1 0 .918h-.574v.574a.344.344 0 0 1-.688 0l-.001-.574H.459a.459.459 0 0 1 0-.918h.573v-.574c0-.19.155-.344.345-.344Z"
          fill="#D6D8E4"
          opacity="0.3"
        ></path>
        <path
          d="M24.787 43.53h.014c7.087.143 9.817-3.834 12.785-4.046l.19-.008h9.044v10.052a2.8 2.8 0 0 1-2.63 2.795l-.17.005H6.472l-.17-.005a2.8 2.8 0 0 1-2.63-2.795V39.475h8.126l.144-.004c2.485.004 5.214 3.898 12.83 4.06l.015-.002Z"
          fill="#D6D8E4"
        ></path>
        <path
          d="M13.77 2.2s2.308-.555 2.962-2.2c.943 1.35 1.429 1.933 2.547 2.189-1.522.453-2.183.963-2.704 2.401-.598-1.695-1.142-1.914-2.805-2.39"
          fill="#D6D8E4"
          opacity="0.5"
        ></path>
        <path
          d="M41.311 6.64S47.464 5.194 49.21.917c2.514 3.508 3.81 5.025 6.791 5.691-4.059 1.18-5.822 2.503-7.21 6.243-1.594-4.406-3.045-4.976-7.479-6.213"
          fill="#D6D8E4"
          opacity="0.8"
        ></path>
      </g>
    </svg>
  );
}
