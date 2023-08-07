export type SimpleFunction<P extends unknown[] = unknown[], R = unknown> = (
  ...args: P
) => R;

// The debounce function receives our function as a parameter
export function debounceByAnimationFrame<P extends unknown[]>(
  fn: SimpleFunction<P, void>
): SimpleFunction<P, void> & { cancel: () => void } {
  // This holds the requestAnimationFrame reference, so we can cancel it if we wish
  let frame: number;

  const cancel = () => cancelAnimationFrame(frame);

  // The debounce function returns a new function that can receive a variable number of arguments
  const func = (...params: P) => {
    // If the frame variable has been defined, clear it now, and queue for next frame
    if (frame) {
      cancel();
    }

    // Queue our function call for the next frame
    frame = requestAnimationFrame(() => {
      // Call our function and pass any params we received
      fn(...params);
    });
  };

  func.cancel = cancel;

  return func;
}
