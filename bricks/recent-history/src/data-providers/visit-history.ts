import { createProviderClass } from "@next-core/utils/general";
import { VisitHistoryData, VisitHistory } from "../utils.js";

export function getAllHistory(
  namespace: string,
  capacity?: number
): VisitHistoryData[] {
  return new VisitHistory(namespace, capacity).getAll();
}

export function pushHistory(
  namespace: string,
  capacity: number,
  data: VisitHistoryData
): void {
  new VisitHistory(namespace, capacity).set(data);
}

export function clearHistory(namespace: string): void {
  new VisitHistory(namespace).clear();
}

customElements.define(
  "recent-history.get-all-history",
  createProviderClass(getAllHistory)
);

customElements.define(
  "recent-history.push-history",
  createProviderClass(pushHistory)
);

customElements.define(
  "recent-history.clear-history",
  createProviderClass(clearHistory)
);
