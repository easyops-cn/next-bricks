import type React from "react";
import type ReactDOM from "react-dom";

export interface DLL {
  (moduleId: "q1tI"): typeof React;
  (moduleId: string): any;
}

export function getDll(): DLL {
  return (window as unknown as { dll: DLL }).dll;
}

let LegacyReact: typeof React;

export function getLegacyReact(): typeof React {
  if (!LegacyReact) {
    LegacyReact = getDll()("q1tI");
  }
  return LegacyReact;
}

let LegacyReactDOM: typeof ReactDOM;

export function getLegacyReactDOM(): typeof ReactDOM {
  if (!LegacyReactDOM) {
    LegacyReactDOM = getDll()("i8i4");
  }
  return LegacyReactDOM;
}
