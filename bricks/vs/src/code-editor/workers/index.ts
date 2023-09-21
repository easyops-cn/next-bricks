import { uniqueId } from "lodash";

const parseWorker = new Worker(
  new URL("./parseYaml.worker.ts", import.meta.url)
);

export class VSWorkers {
  static #instance: Record<string, VSWorkers> = {};

  static getInstance(id: string): VSWorkers {
    if (!this.#instance[id]) {
      this.#instance[id] = new VSWorkers(id);
    }
    return this.#instance[id];
  }

  #id: string;
  #worker: Worker;

  #listenerCache = new Map<string, any>();

  constructor(id: string) {
    this.#worker = parseWorker;
    this.#id = id;
  }

  postMessage(message: any) {
    this.#worker.postMessage({
      ...message,
      id: this.#id,
    });
  }

  addEventListener(name: string, listener: any) {
    const uid = uniqueId();
    this.#worker.addEventListener(name, (...args) => {
      const { id } = (args[0] as MessageEvent).data;
      if (id === this.#id) listener(...args);
    });
    this.#listenerCache.set(uid, {
      name,
      fn: listener,
    });
    return uid;
  }

  removeEventListener(uid: string) {
    const listener = this.#listenerCache.get(uid);
    if (listener) {
      this.#worker.removeEventListener(listener.name, listener.fn);
      this.#listenerCache.delete(uid);
    }
  }
}
