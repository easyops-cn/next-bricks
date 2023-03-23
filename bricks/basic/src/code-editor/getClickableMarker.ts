import { ExtendedMarker, HighlightTokenType } from "./interfaces.js";

const modKey = /Mac|iPod|iPhone|iPad/.test(navigator.platform)
  ? "meta"
  : "ctrl";

export function getClickableMarker(
  e: any,
  clickableTypes: HighlightTokenType[],
  markers?: ExtendedMarker[]
): ExtendedMarker | void {
  if (!matchModifierKeys(e.domEvent, modKey)) {
    return;
  }
  const { row, column } = e.getDocumentPosition();
  const marker = markers?.find(
    (marker) =>
      row === marker.startRow &&
      column >= marker.startCol &&
      column <= marker.endCol
  );
  return marker && clickableTypes.includes(marker.highlightType)
    ? marker
    : undefined;
}

const modifierKeys = ["ctrl", "alt", "shift", "meta"];

function matchModifierKeys(
  event: MouseEvent,
  keys: string | string[]
): boolean {
  const keyList: string[] = Array.isArray(keys) ? keys : [keys];
  return !modifierKeys.some(
    (k) =>
      Number(keyList.includes(k)) ^
      Number(!!event[`${k}Key` as keyof MouseEvent])
  );
}
