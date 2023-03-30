export function debounceByAnimationFrame<Args extends unknown[] = unknown[], Return = unknown>(
  fn: (...args: Args) => Return
): {
  (...args: Args): void;
  cancel: () => void;
} {
  let frame: number;

  const cancel = () => cancelAnimationFrame(frame);

  const func = (...args: Args) => {
    if (frame) {
      cancel();
    }

    frame = requestAnimationFrame(() => {
      fn(...args);
    });
  }

  func.cancel = cancel;

  return func;
}


