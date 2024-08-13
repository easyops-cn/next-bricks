// istanbul ignore file: working in progress
// https://github.com/facebook/react/blob/cae635054e17a6f107a39d328649137b83f25972/packages/react-devtools-shared/src/backend/views/Highlighter/index.js
import { throttle } from "lodash";
import type {
  PreviewMessagePreviewerHoverOnBrick,
  PreviewMessagePreviewerSelectBrick,
  PreviewMessagePreviewerContextMenuOnBrick,
} from "./interfaces.js";

export let previewProxyOrigin: string;

export function setPreviewFromOrigin(origin: string): void {
  previewProxyOrigin = origin;
}

export function startInspecting(): void {
  registerListeners();
}

export function stopInspecting(): void {
  unregisterListeners();
}

function registerListeners(): void {
  window.addEventListener("click", onClick, true);
  window.addEventListener("mousedown", onMouseEvent, true);
  window.addEventListener("mouseover", onMouseEvent, true);
  window.addEventListener("mouseup", onMouseEvent, true);
  window.addEventListener("pointerdown", onPointerDown, true);
  window.addEventListener("pointermove", onPointerMove, true);
  window.addEventListener("pointerup", onMouseEvent, true);
  window.addEventListener("pointerleave", onPointerLeave, true);
  window.addEventListener("contextmenu", onContextMenu, true);
}

function unregisterListeners(): void {
  window.removeEventListener("click", onClick, true);
  window.removeEventListener("mousedown", onMouseEvent, true);
  window.removeEventListener("mouseover", onMouseEvent, true);
  window.removeEventListener("mouseup", onMouseEvent, true);
  window.removeEventListener("pointerdown", onPointerDown, true);
  window.removeEventListener("pointermove", onPointerMove, true);
  window.removeEventListener("pointerup", onMouseEvent, true);
  window.removeEventListener("pointerleave", onPointerLeave, true);
  window.removeEventListener("contextmenu", onContextMenu, true);
}

function onClick(event: MouseEvent): void {
  event.preventDefault();
  event.stopPropagation();
  selectBrick(event.composedPath());
}

function onMouseEvent(event: MouseEvent): void {
  event.preventDefault();
  event.stopPropagation();
}

const hoverOnBrick = throttle(
  (eventTargets: EventTarget[]) => {
    const iidList = getPossibleBrickTargets(eventTargets);

    if (iidList.length > 0) {
      window.parent.postMessage(
        {
          sender: "previewer",
          type: "hover-on-brick",
          iidList,
        } as PreviewMessagePreviewerHoverOnBrick,
        previewProxyOrigin
      );
    }
  },
  100,
  { leading: false }
);

function onPointerDown(event: MouseEvent): void {
  event.preventDefault();
  event.stopPropagation();
  hoverOnBrick(event.composedPath());
}

function onPointerMove(event: MouseEvent): void {
  event.preventDefault();
  event.stopPropagation();
  hoverOnBrick(event.composedPath());
}

function onPointerLeave(event: MouseEvent): void {
  event.preventDefault();
  event.stopPropagation();
  window.parent.postMessage(
    {
      sender: "previewer",
      type: "hover-on-brick",
      iidList: [],
    } as PreviewMessagePreviewerHoverOnBrick,
    previewProxyOrigin
  );
}

function onContextMenu(event: MouseEvent): void {
  event.preventDefault();
  event.stopPropagation();
  contextMenuOnBrick(event.composedPath(), {
    x: event.clientX,
    y: event.clientY,
  });
}

function contextMenuOnBrick(
  eventTargets: EventTarget[],
  position: {
    x: number;
    y: number;
  }
): void {
  const iidList = getPossibleBrickTargets(eventTargets);
  if (iidList.length > 0) {
    window.parent.postMessage(
      {
        sender: "previewer",
        type: "context-menu-on-brick",
        iidList,
        position,
      } as PreviewMessagePreviewerContextMenuOnBrick,
      previewProxyOrigin
    );
  }
}

function selectBrick(eventTargets: EventTarget[]): void {
  const iidList = getPossibleBrickTargets(eventTargets);
  if (iidList.length > 0) {
    window.parent.postMessage(
      {
        sender: "previewer",
        type: "select-brick",
        iidList,
      } as PreviewMessagePreviewerSelectBrick,
      previewProxyOrigin
    );
  }
}

export function getPossibleBrickIidList(brick: HTMLElement): string[] {
  const iidList: string[] = [];
  // Traverse from bottom to up, to find bricks current hover on.
  let cursor: HTMLElement | null = brick;
  while (cursor) {
    if (typeof cursor.dataset.iid === "string") {
      iidList.push(cursor.dataset.iid);
    }
    cursor = cursor.parentElement;
  }
  return iidList;
}

export function getPossibleBrickTargets(eventTargets: EventTarget[]) {
  const targets: string[] = [];
  for (const target of eventTargets) {
    if (
      target instanceof HTMLElement &&
      typeof target.dataset.iid === "string"
    ) {
      targets.push(target.dataset.iid);
    }
  }
  return targets;
}
