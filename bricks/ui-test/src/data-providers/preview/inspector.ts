// istanbul ignore file: working in progress
// https://github.com/facebook/react/blob/cae635054e17a6f107a39d328649137b83f25972/packages/react-devtools-shared/src/backend/views/Highlighter/index.js
import { isEqual, throttle } from "lodash";
import type { InspectOutline, InspectTarget } from "./interfaces.js";

let isInspecting = false;
export let previewFromOrigin: string;

export function setPreviewFromOrigin(origin: string): void {
  previewFromOrigin = origin;
}

export function toggleInspecting(inspecting: boolean): void {
  if (isInspecting === inspecting) {
    return;
  }
  isInspecting = inspecting;

  const method = inspecting ? "addEventListener" : "removeEventListener";

  window[method]("click", onClick as EventListener, true);
  window[method]("mousedown", onMouseEvent as EventListener, true);
  window[method]("mouseover", onMouseEvent as EventListener, true);
  window[method]("mouseup", onMouseEvent as EventListener, true);
  window[method]("pointerdown", onPointerDown as EventListener, true);
  window[method]("pointerover", onPointerOver as EventListener, true);
  window[method]("pointerup", onMouseEvent as EventListener, true);
  window[method]("pointerleave", onPointerLeave as EventListener, true);
}

function onClick(event: MouseEvent): void {
  event.preventDefault();
  event.stopPropagation();
  selectTarget(event);
}

function onMouseEvent(event: MouseEvent): void {
  event.preventDefault();
  event.stopPropagation();
}

const hoverOnTarget = throttle(
  (eventTargets: EventTarget[]) => {
    const targets = getPossibleTargets(eventTargets);
    window.parent.postMessage(
      {
        channel: "ui-test-preview",
        type: "inspect-hover",
        payload: {
          outline: getTargetOutline(targets[0]),
        },
      },
      previewFromOrigin
    );
  },
  100,
  { leading: false }
);

function onPointerDown(event: MouseEvent): void {
  event.preventDefault();
  event.stopPropagation();
  hoverOnTarget(event.composedPath());
}

function onPointerOver(event: MouseEvent): void {
  event.preventDefault();
  event.stopPropagation();
  hoverOnTarget(event.composedPath());
}

function onPointerLeave(event: MouseEvent): void {
  event.preventDefault();
  event.stopPropagation();
  window.parent.postMessage(
    {
      channel: "ui-test-preview",
      type: "inspect-hover",
      payload: { outline: null },
    },
    previewFromOrigin
  );
}

function selectTarget(event: MouseEvent): void {
  const targets = getPossibleTargets(event.composedPath());
  if (targets.length > 0) {
    window.parent.postMessage(
      {
        channel: "ui-test-preview",
        type: "inspect-select",
        payload: {
          targets: targets.map((t) => t.selector),
        },
      },
      previewFromOrigin
    );
  }
}

export function getPossibleTargets(
  eventTargets: EventTarget[]
): InspectTarget[] {
  const targets: InspectTarget[] = [];
  for (const item of eventTargets) {
    if (
      (item as Node).nodeType === Node.ELEMENT_NODE &&
      item instanceof HTMLElement
    ) {
      if (
        item.id &&
        (item.id === "main-mount-point" || item.id === "portal-mount-point")
      ) {
        break;
      }
      const tag = item.tagName.toLowerCase();
      // Ignore all `slot`s
      if (tag === "slot") {
        continue;
      }
      if (item.dataset.testid) {
        targets.push({
          element: item,
          selector: {
            type: "testid",
            value: item.dataset.testid,
            tag,
          },
        });
      } else if (item.id) {
        targets.push({
          element: item,
          selector: {
            type: "id",
            value: item.id,
            tag,
          },
        });
      }
    }
  }

  // Ad hoc:
  // - Ignore `button[data-testid=button]` in `basic-bricks.general-button`
  if (
    targets.length > 1 &&
    isEqual(targets[0].selector, {
      tag: "button",
      type: "testid",
      value: "button",
    }) &&
    targets[1].selector.tag === "basic-bricks.general-button"
  ) {
    targets.shift();
  }

  return targets;
}

export function getTargetOutline(
  target: InspectTarget | null | undefined
): InspectOutline | null {
  if (!target) {
    return null;
  }
  const { element, selector } = target;
  const { width, height, left, top } = element.getBoundingClientRect();
  return {
    width,
    height,
    left: left + window.scrollX,
    top: top + window.scrollY,
    selector,
  };
}
