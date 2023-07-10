import { JsonStorage } from "@next-shared/general/JsonStorage";
import { LRUCacheWithDelete } from "mnemonist";

export interface VisitHistoryData {
  key: string;
  name: string;
  [key: string]: any;
}

export const VISIT_HISTORY_NAME_SPACE = "recent-history";

const storage = new JsonStorage(localStorage);

export class VisitHistory {
  #namespace: string;
  #storageNamespace: string;
  #capacity: number;
  #LRUCache: LRUCacheWithDelete<string, VisitHistoryData>;

  constructor(namespace: string, capacity = 100) {
    this.#namespace = namespace;
    this.#storageNamespace = `${VISIT_HISTORY_NAME_SPACE}-${namespace}`;
    this.#capacity = capacity;

    if (!storage.getItem(this.#storageNamespace)) {
      storage.setItem(this.#storageNamespace, []);
    }

    const history = storage.getItem(
      this.#storageNamespace
    ) as VisitHistoryData[];

    this.#LRUCache = new LRUCacheWithDelete(this.#capacity);
    history.reverse().forEach((h) => {
      this.#LRUCache.set(h.key, h);
    });
  }

  #updateStorage() {
    const list = [...this.#LRUCache.values()];
    storage.setItem(this.#storageNamespace, list);
    window.dispatchEvent(
      new CustomEvent<{ namespace: string; list: VisitHistoryData[] }>(
        "recent-history-change",
        { detail: { namespace: this.#namespace, list } }
      )
    );
  }

  set(data: VisitHistoryData) {
    this.#LRUCache.set(data.key, data);
    this.#updateStorage();
  }

  get(key: string) {
    const data = this.#LRUCache.get(key);
    this.#updateStorage();
    return data;
  }

  getAll() {
    return [...this.#LRUCache.values()];
  }

  peek(key: string) {
    return this.#LRUCache.peek(key);
  }

  has(key: string) {
    return this.#LRUCache.has(key);
  }

  delete(key: string) {
    const result = this.#LRUCache.delete(key);
    this.#updateStorage();
    return result;
  }

  remove(key: string) {
    const data = this.#LRUCache.remove(key);
    this.#updateStorage();
    return data;
  }

  clear() {
    this.#LRUCache.clear();
    this.#updateStorage();
  }
}
