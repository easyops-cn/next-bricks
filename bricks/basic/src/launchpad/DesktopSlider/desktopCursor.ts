// See https://github.com/facebook/jest/issues/11471
// Open launchpad with the previous visited desktop.
let rememberedDesktopCursor = 0;

export function getRememberedDesktopCursor(): number {
  return rememberedDesktopCursor;
}

export function setRememberedDesktopCursor(newValue: number): void {
  rememberedDesktopCursor = newValue;
}
