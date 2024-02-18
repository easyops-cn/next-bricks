import { uniqueId } from "lodash";

let parseWorker;

function init() {
  if (!parseWorker) {
    parseWorker = new Worker(new URL("./parseYaml.worker.ts", import.meta.url));
  }
}

export class VSWorkers {
  static #instance = {};

  static getInstance(id) {
    if (!this.#instance[id]) {
      init();
      this.#instance[id] = new VSWorkers(id);
    }
    return this.#instance[id];
  }

  #id;
  #worker;

  #listenerCache = new Map();

  constructor(id) {
    this.#worker = parseWorker;
    this.#id = id;
  }

  postMessage(message) {
    this.#worker.postMessage({
      ...message,
      id: this.#id,
    });
  }

  addEventListener(name, listener) {
    const uid = uniqueId();
    this.#worker.addEventListener(name, (...args) => {
      const { id } = (args[0]).data;
      if (id === this.#id) listener(...args);
    });
    this.#listenerCache.set(uid, {
      name,
      fn: listener,
    });
    return uid;
  }

  removeEventListener(uid) {
    const listener = this.#listenerCache.get(uid);
    if (listener) {
      this.#worker.removeEventListener(listener.name, listener.fn);
      this.#listenerCache.delete(uid);
    }
  }
}
