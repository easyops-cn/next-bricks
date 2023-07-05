import type { PrismTheme } from "prism-react-renderer";
import type { CSSProperties } from "react";

export const theme: PrismTheme = {
  styles: [
    {
      types: ["comment", "block-comment", "prolog", "doctype", "cdata"],
      style: {
        color: "#999",
      },
    },
    {
      types: ["punctuation"],
      style: {
        color: "#ccc",
      },
    },
    {
      types: ["tag", "attr-name", "namespace", "deleted"],
      style: {
        color: "#e2777a",
      },
    },
    {
      types: ["function-name"],
      style: {
        color: "#6196cc",
      },
    },
    {
      types: ["boolean", "number", "function"],
      style: {
        color: "#f08d49",
      },
    },
    {
      types: ["property", "class-name", "constant", "symbol"],
      style: {
        color: "#f8c555",
      },
    },
    {
      types: ["selector", "important", "atrule", "keyword", "builtin"],
      style: {
        color: "#cc99cd",
      },
    },
    {
      types: ["string", "char", "attr-value", "regex", "variable"],
      style: {
        color: "#7ec699",
      },
    },
    {
      types: ["operator", "entity", "url"],
      style: {
        color: "#67cdcc",
      },
    },
    {
      types: ["important", "bold"],
      style: {
        fontWeight: "bold",
      },
    },
    {
      types: ["italic"],
      style: {
        fontStyle: "italic",
      },
    },
    {
      types: ["entity"],
      style: {
        cursor: "help",
      },
    },
    {
      types: ["inserted"],
      style: {
        color: "green",
      },
    },
  ],
} as PrismTheme;

export const preStyle: CSSProperties = {
  color: "#ccc",
  background: "#2d2d2d",
  fontFamily: "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
  MozTabSize: 4,
  OTabSize: 4,
  tabSize: 4,
  WebkitHyphens: "none",
  MozHyphens: "none",
  msHyphens: "none",
  hyphens: "none",
};
