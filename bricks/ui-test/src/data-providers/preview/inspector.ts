// istanbul ignore file: working in progress
// https://github.com/facebook/react/blob/cae635054e17a6f107a39d328649137b83f25972/packages/react-devtools-shared/src/backend/views/Highlighter/index.js
import { cloneDeep, curry, isEmpty, isEqual, throttle } from "lodash";
import { brickCommandsConf } from "@next-shared/ui-test";
import { blacklistBricksOfQueries } from "../../constants.js";
import type {
  InspectOutline,
  InspectSelector,
  InspectTarget,
  RelatedCommand,
  RuntimeBrickCommandConf,
  RuntimeSelectorConf,
} from "./interfaces.js";

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
          outlines: targets.length > 0 ? [getTargetOutline(targets[0])] : [],
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
      payload: { outlines: [] },
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
          targets: targets.map((t) => t.selectors),
        },
      },
      previewFromOrigin
    );
  }
}

export function calcElementPosition(element: HTMLElement): number {
  const children = element.parentElement?.children ?? [];

  return Array.from(children).indexOf(element);
}

export function matchSelectorType(
  select: RuntimeSelectorConf,
  element: HTMLElement
): boolean {
  if (select.type === "testid") {
    return select.value === element.dataset.testid;
  }

  if (select.type === "css-selector") {
    return element.matches(select.value);
  }

  return false;
}

export function matchBrickElements(
  brickCommandConfList: RuntimeBrickCommandConf[],
  eventTargets: EventTarget[]
) {
  const matches: InspectTarget[] = [];

  const processedConf = brickCommandConfList.map((conf) => {
    return {
      brick: conf.brick,
      element: conf.element,
      shadowDom: conf.shadowDom,
      targets: conf.targets.map((target) => ({
        ...target,
        selectors: cloneDeep(target.selectors),
        cursor: -1,
        end: target.selectors.length - 1,
      })),
    };
  });

  for (const item of eventTargets) {
    if (
      (item as Node).nodeType === Node.ELEMENT_NODE &&
      item instanceof HTMLElement
    ) {
      processedConf.forEach((conf) => {
        conf.targets.forEach((target) => {
          const { cursor, end, selectors } = target;
          const reversSelectors = [...selectors].reverse();
          const curSelector = reversSelectors[cursor + 1];

          if (cursor < end && matchSelectorType(curSelector, item)) {
            if (curSelector.multiple) {
              curSelector.eq = calcElementPosition(item);
            }

            curSelector.element = item;
            target.cursor = cursor + 1;

            if (target.cursor === target.end) {
              let hostBrickData;

              if (conf.element) {
                const hostElement = conf.element as HTMLElement;
                const tag = hostElement.tagName.toLowerCase();
                if (hostElement.dataset.testid) {
                  hostBrickData = {
                    type: "testid",
                    shadowDom: conf.shadowDom,
                    value: hostElement.dataset.testid,
                    tag,
                  };
                } else if (hostElement.id) {
                  hostBrickData = {
                    type: "id",
                    shadowDom: conf.shadowDom,
                    value: hostElement.id,
                    tag,
                  };
                }
              }

              matches.push({
                element: selectors[selectors.length - 1].element as HTMLElement,
                selectors: [
                  ...(hostBrickData ? [hostBrickData as InspectSelector] : []),
                  ...target.selectors.map((s) => ({
                    type: s.type,
                    value: s.value,
                    tag: (s.element as HTMLElement).tagName.toLowerCase(),
                    isolate: target.isolate,
                    eq: s.eq,
                  })),
                ],
              });
            }
          }
        });
      });
    }
  }

  return matches;
}

export function getBrickTargets(eventTargets: EventTarget[]) {
  const matchedBrickCommands = [] as RuntimeBrickCommandConf[];
  eventTargets.forEach((item: any) => {
    if (
      (item as Node).nodeType === Node.ELEMENT_NODE &&
      item instanceof HTMLElement &&
      item.hasAttribute("data-iid")
    ) {
      const brick = item.tagName.toLowerCase();

      const find = brickCommandsConf.find((conf) => conf.brick === brick);

      if (find) {
        matchedBrickCommands.push({
          ...find,
          targets: find.targets.filter((item) => !item.isolate),
          element: item,
        });
      }
    }
  });

  return matchBrickElements(matchedBrickCommands, eventTargets);
}

export function getBrickIsolateTargets(eventTargets: EventTarget[]) {
  const matchedBrickIsolateCommands = [] as RuntimeBrickCommandConf[];
  brickCommandsConf.forEach((item) => {
    const filters = item.targets.filter((t) => t.isolate);

    if (filters.length) {
      matchedBrickIsolateCommands.push({
        ...item,
        targets: filters,
      });
    }
  });

  return matchBrickElements(matchedBrickIsolateCommands, eventTargets);
}

export function getPossibleBrickTargets(eventTargets: EventTarget[]) {
  const targets: InspectTarget[] = [];

  const matched = [getBrickTargets, getBrickIsolateTargets].reduce(
    (arr, fn: (e: EventTarget[]) => any) => {
      return arr.length === 0 ? fn(eventTargets) : arr;
    },
    []
  );

  if (matched.length > 0) {
    targets.push(...matched);
    return targets;
  }

  return targets;
}

export function getPossibleElementTargets(eventTargets: EventTarget[]) {
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

      if (
        blacklistBricksOfQueries.some((s) =>
          s instanceof RegExp ? s.test(tag) : s === tag
        )
      ) {
        continue;
      }

      // 用户填写的以下划线开头的 testid 过滤掉
      if (item.dataset.testid && !item.dataset.testid?.startsWith("_")) {
        targets.push({
          element: item,
          selectors: [
            {
              type: "testid",
              value: item.dataset.testid,
              tag,
            },
          ],
        });
      } else if (item.id) {
        targets.push({
          element: item,
          selectors: [
            {
              type: "id",
              value: item.id,
              tag,
            },
          ],
        });
      }
    }
  }

  // Ad hoc:
  // - Ignore `button[data-testid=button]` in `basic-bricks.general-button`
  if (
    targets.length > 1 &&
    isEqual(targets[0].selectors[0], {
      tag: "button",
      type: "testid",
      value: "button",
    }) &&
    targets[1].selectors[0].tag === "basic-bricks.general-button"
  ) {
    targets.shift();
  }

  return targets;
}

export function getPossibleTargets(
  eventTargets: EventTarget[]
): InspectTarget[] {
  const brickTargets = getPossibleBrickTargets(eventTargets);

  if (brickTargets.length) return brickTargets;

  // rollback the legacy way
  return getPossibleElementTargets(eventTargets);
}

export function hoverOverTreeNode(relatedCommands: RelatedCommand[]) {
  window.parent.postMessage(
    {
      channel: "ui-test-preview",
      type: "inspect-hover",
      payload: {
        outlines: getTargetOutlinesByRelatedCommands(relatedCommands),
      },
    },
    previewFromOrigin
  );
}

export function setActiveTreeNode(relatedCommands: RelatedCommand[]) {
  window.parent.postMessage(
    {
      channel: "ui-test-preview",
      type: "inspect-active",
      payload: {
        outlines: getTargetOutlinesByRelatedCommands(relatedCommands),
      },
    },
    previewFromOrigin
  );
}

function getTargetOutlinesByRelatedCommands(relatedCommands: RelatedCommand[]) {
  const targets: InspectTarget[] = [];
  let current: (Document | Element)[] = [document];
  let currentChanged = false;

  for (const { name, params } of relatedCommands) {
    const [p1] = params ?? [];
    switch (name) {
      case "findByTestId":
      case "findAllByTestId":
        if (typeof p1 === "string") {
          const selector = `[data-testid="${p1}"]`;
          findElements(
            (container) =>
              name === "findByTestId"
                ? container.querySelector(selector)
                : [...container.querySelectorAll(selector)],
            {
              type: "testid",
              value: p1,
            }
          );
          break;
        }
        reset();
        break;
      case "get":
        if (typeof p1 === "string") {
          if (/^#[-\w]+$/.test(p1)) {
            findElements((container) => [...container.querySelectorAll(p1)], {
              type: "id",
              value: p1.substring(1),
            });
          } else {
            findElements((container) => [...container.querySelectorAll(p1)], {
              type: "css-selector",
              value: p1,
            });
          }
          break;
        }
        reset();
        break;
      case "find":
        if (typeof p1 === "string") {
          findElements((container) => [...container.querySelectorAll(p1)], {
            type: "css-selector",
            value: p1,
          });
          break;
        }
        reset();
        break;
    }
  }

  function findElements(
    finder: (container: Document | Element) => Element[] | Element | null,
    selector: PartialInspectSelector
  ) {
    if (currentChanged) {
      targets.length = 0;
    }
    const nextCurrent: Element[] = [];
    for (const container of current) {
      const elements = finder(container);
      const singleMatch = isSingleMatch(elements);
      if (singleMatch && !elements) {
        break;
      }
      for (const element of singleMatch ? [elements] : elements) {
        targets.push({
          element: element as HTMLElement,
          selectors: [
            {
              ...selector,
              tag: element.tagName.toLowerCase(),
            },
          ],
        });
        nextCurrent.push(element);
      }
      if (singleMatch) {
        break;
      }
    }
    current = nextCurrent;
    currentChanged = true;
  }

  function reset() {
    if (currentChanged) {
      targets.length = 0;
    }
    current = [];
    currentChanged = true;
  }

  return targets.map(getTargetOutline);
}

function isSingleMatch(
  elements: Element[] | Element | null
): elements is Element | null {
  return !Array.isArray(elements);
}

type PartialInspectSelector = Pick<InspectSelector, "type" | "value">;

function getTargetOutline(target: InspectTarget): InspectOutline {
  const { element, selectors } = target;
  const { width, height, left, top } = element.getBoundingClientRect();
  return {
    width,
    height,
    left: left + window.scrollX,
    top: top + window.scrollY,
    selectors,
  };
}
