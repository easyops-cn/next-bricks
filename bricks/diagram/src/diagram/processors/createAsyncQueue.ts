type Task = (...args: unknown[]) => unknown;
type Queue = (task: Task) => Promise<void>;

export function createAsyncQueue(): Queue {
  let working = false;
  const waitingTasks: Task[] = [];
  return async function queue(task: Task) {
    waitingTasks.push(task);
    if (!working) {
      working = true;
      let nextTask: Task | undefined;
      while ((nextTask = waitingTasks.shift())) {
        try {
          await nextTask();
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error);
        }
      }
      working = false;
    }
  };
}
