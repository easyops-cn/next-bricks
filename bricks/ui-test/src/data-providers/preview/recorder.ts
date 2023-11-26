// istanbul ignore file: working in progress
import {
  getPossibleTargets,
  previewFromOrigin,
  toggleInspecting,
} from "./inspector.js";
import type { InspectTarget, RecordStep } from "./interfaces.js";

let isRecording = false;
let currentKeydownTargets: InspectTarget[] | null = null;
let currentKeydownTexts: string[];
let steps: RecordStep[];

export function toggleRecording(recording: boolean, inspecting: boolean): void {
  if (isRecording === recording) {
    return;
  }
  isRecording = recording;
  if (inspecting) {
    toggleInspecting(!recording);
  }
  if (recording) {
    steps = [];
    window.addEventListener("click", onMouseEvent, {
      capture: true,
      passive: true,
    });
    window.addEventListener("dblclick", onMouseEvent, {
      capture: true,
      passive: true,
    });
    window.addEventListener("keydown", onKeyDown, {
      capture: true,
      passive: true,
    });
  } else {
    completeKeyDown();
    currentKeydownTargets = null;
    window.removeEventListener("click", onMouseEvent, { capture: true });
    window.removeEventListener("dblclick", onMouseEvent, { capture: true });
    window.removeEventListener("keydown", onKeyDown, { capture: true });

    if (steps.length > 0) {
      window.parent.postMessage(
        {
          channel: "ui-test-preview",
          type: "record-complete",
          payload: {
            steps,
          },
        },
        previewFromOrigin
      );
    }
  }
}

function onMouseEvent(event: MouseEvent): void {
  completeKeyDown();
  currentKeydownTargets = null;
  const targets = getPossibleTargets(event.composedPath());
  if (targets.length === 0) {
    return;
  }
  steps.push({
    event: event.type,
    targets: targets.map((t) => t.selectors),
  });
}

function onKeyDown(event: KeyboardEvent): void {
  // If the target of keydown is not changed,
  // consider these events as a sequential typing.
  const targets = getPossibleTargets(event.composedPath());
  const firstTarget = targets[0];
  if (targets.length === 0) {
    currentKeydownTargets = null;
    return;
  }
  if (firstTarget.element !== currentKeydownTargets?.[0]?.element) {
    completeKeyDown();
    currentKeydownTargets = targets;
    currentKeydownTexts = [];
  }

  // Todo: handle modifiers
  switch (event.key) {
    case "Backspace":
      currentKeydownTexts.push("{backspace}");
      break;
    case "Enter":
      currentKeydownTexts.push("{enter}");
      break;
    case "Escape":
      currentKeydownTexts.push("{esc}");
      break;
    // Todo: handle other keys
    default:
      if (event.key.length === 1) {
        currentKeydownTexts.push(event.key);
      }
  }
}

function completeKeyDown(): void {
  if (currentKeydownTargets && currentKeydownTexts.length > 0) {
    steps.push({
      event: "type",
      targets: currentKeydownTargets.map((t) => t.selectors),
      text: currentKeydownTexts.join(""),
    });
  }
}
