// istanbul ignore file: working in progress
// https://github.com/facebook/react/blob/cae635054e17a6f107a39d328649137b83f25972/packages/react-devtools-shared/src/backend/views/Highlighter/index.js
import { debounce } from "lodash";
import type {
  InspectOutline,
  InspectSelector,
  InspectTarget,
} from "./interfaces.js";
import { getElementsIncludingInShadowDOM } from "../preview/connect.js";

let isInspecting = false;
const IID_ITEM_PREFIX = "item:";
let currentHoverElement: Element | null = null;

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
  window[method]("pointerdown", onMouseEvent as EventListener, true);
  window[method]("pointerover", onMouseEvent as EventListener, true);
  window[method]("pointerup", onMouseEvent as EventListener, true);
  window[method]("pointerleave", onPointerLeave as EventListener, true);
  window[method]("pointermove", onPointerMove as EventListener, true);
}

export function select(selector: InspectSelector) {
  const iid = `${selector.type}:${selector.uuid}`;
  const elements = getElementsIncludingInShadowDOM(iid);
  window.parent.postMessage(
    {
      channel: "chat-preview",
      type: "inspect-active",
      payload: {
        outlines: elements.map((element) =>
          getTargetOutline({ ...selector, element, label: getLabel(element) })
        ),
      },
    },
    location.origin
  );
}

function onClick(event: MouseEvent): void {
  event.preventDefault();
  event.stopPropagation();
  selectByClick(event);
}

function onMouseEvent(event: MouseEvent): void {
  event.preventDefault();
  event.stopPropagation();
}

const hoverOnTarget = debounce(
  (eventTargets: EventTarget[], clientX: number, clientY: number) => {
    let targets = getPossibleBrickTargets(eventTargets);
    if (targets.length === 0) {
      for (const element of eventTargets) {
        if (element instanceof HTMLElement && element.shadowRoot) {
          targets = getPossibleBrickTargets(
            element.shadowRoot.elementsFromPoint(clientX, clientY)
          );
          break;
        }
      }
    }
    const hoverElement = targets.length > 0 ? targets[0].element : null;
    if (hoverElement !== currentHoverElement) {
      currentHoverElement = hoverElement;
      window.parent.postMessage(
        {
          channel: "chat-preview",
          type: "inspect-hover",
          payload: {
            outlines: targets.map(getTargetOutline),
          },
        },
        location.origin
      );
    }
  },
  20,
  { leading: true }
);

function onPointerMove(event: MouseEvent): void {
  // `event.composedPath()` will be unavailable in debounced callback
  hoverOnTarget(event.composedPath(), event.clientX, event.clientY);
}

function onPointerLeave(event: MouseEvent): void {
  event.preventDefault();
  event.stopPropagation();
  currentHoverElement = null;
  window.parent.postMessage(
    {
      channel: "chat-preview",
      type: "inspect-hover",
      payload: { outlines: [] },
    },
    location.origin
  );
}

function selectByClick(event: MouseEvent): void {
  const targets = getPossibleBrickTargets(event.composedPath());
  window.parent.postMessage(
    {
      channel: "chat-preview",
      type: "inspect-active",
      payload: {
        outlines: targets.map(getTargetOutline),
      },
    },
    location.origin
  );
}

function getPossibleBrickTargets(eventTargets: EventTarget[]) {
  const inspectTargets: InspectTarget[] = [];
  eventTargets.forEach((item) => {
    let iid: string | undefined;
    if (
      (item as Node).nodeType === Node.ELEMENT_NODE &&
      item instanceof HTMLElement &&
      (iid = item.dataset.iid) &&
      iid.startsWith(IID_ITEM_PREFIX)
    ) {
      const uuid = iid.substring(IID_ITEM_PREFIX.length);
      inspectTargets.push({
        type: "item",
        uuid,
        label: getLabel(item),
        element: item,
      });
    }
  });
  return inspectTargets;
}

function getTargetOutline(target: InspectTarget): InspectOutline {
  const { element, type, uuid, label } = target;
  const { width, height, left, top } = element.getBoundingClientRect();
  return {
    width,
    height,
    left: left + window.scrollX,
    top: top + window.scrollY,
    type,
    uuid,
    label,
  };
}

function getLabel(element: Element) {
  return element.tagName.toLowerCase().split(".").pop();
}
