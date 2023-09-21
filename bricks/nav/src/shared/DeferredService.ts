export class DeferredService {
  private preFetchId: number | null = null;
  private preFetchScheduled = false;
  private firstFetchPromise: Promise<unknown> | null = null;
  private isFetching = false;
  private readonly task: () => Promise<unknown>;

  constructor(task: () => Promise<unknown>) {
    this.task = task;
  }

  schedulePrefetch(): void {
    if (!this.preFetchScheduled) {
      this.preFetchScheduled = true;
      const preFetchLaunchpadInfo = async (): Promise<void> => {
        this.preFetchId = null;
        this.fetch();
      };
      // istanbul ignore if
      if (typeof window.requestIdleCallback === "function") {
        this.preFetchId = window.requestIdleCallback(preFetchLaunchpadInfo);
      } else {
        this.preFetchId = setTimeout(
          preFetchLaunchpadInfo
        ) as unknown as number;
      }
    }
  }

  fetch(eager?: boolean): Promise<unknown> {
    if (this.preFetchId) {
      // istanbul ignore if
      if (typeof window.cancelIdleCallback === "function") {
        cancelIdleCallback(this.preFetchId);
      } else {
        clearTimeout(this.preFetchId);
      }
      this.preFetchId = null;
    }

    let promise: Promise<unknown>;
    if (!this.isFetching || eager) {
      this.isFetching = true;
      promise = this.task();
      promise
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error);
          this.firstFetchPromise = null;
        })
        .finally(() => {
          this.isFetching = false;
        });
      if (!this.firstFetchPromise) {
        this.firstFetchPromise = promise;
      }
      if (eager) {
        return promise;
      }
    }
    return this.firstFetchPromise!;
  }
}
