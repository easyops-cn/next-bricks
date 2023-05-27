import type React from "react";

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
