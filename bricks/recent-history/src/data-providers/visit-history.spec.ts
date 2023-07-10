import { describe, test, expect } from "@jest/globals";
import { JsonStorage } from "@next-shared/general/JsonStorage";
import { VISIT_HISTORY_NAME_SPACE } from "../utils.js";
import { pushHistory, getAllHistory, clearHistory } from "./visit-history.js";

describe("pushHistory", () => {
  test("should work", async () => {
    const storage = new JsonStorage(localStorage);
    const namespace = "test";
    const visitHistoryNamespace = `${VISIT_HISTORY_NAME_SPACE}-${namespace}`;
    pushHistory(namespace, 5, { key: "a", name: "aaa" });
    expect(storage.getItem(visitHistoryNamespace)).toMatchObject([
      { key: "a", name: "aaa" },
    ]);

    expect(getAllHistory(namespace)).toMatchObject([{ key: "a", name: "aaa" }]);

    clearHistory(namespace);
    expect(getAllHistory(namespace)).toMatchObject([]);
  });
});
