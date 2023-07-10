import {
  describe,
  test,
  expect,
  jest,
  beforeEach,
  afterEach,
} from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./index.jsx";
import { RecentVisit } from "./index.jsx";
import { clearHistory, pushHistory } from "../data-providers/visit-history.js";

jest.mock("@next-core/theme", () => ({}));

const namespace = "test";

describe("recent-history.recent-visit", () => {
  beforeEach(() => {
    pushHistory(namespace, 5, { key: "a", name: "aaa" });
    pushHistory(namespace, 5, { key: "b", name: "bbb" });
    pushHistory(namespace, 5, { key: "c", name: "ccc" });
  });

  afterEach(() => {
    clearHistory(namespace);
  });

  test("basic usage", async () => {
    const element = document.createElement(
      "recent-history.recent-visit"
    ) as RecentVisit;
    element.namespace = namespace;
    element.capacity = 5;
    element.urlTemplate = "/detail/{{key}}";
    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);
    expect(element.shadowRoot?.querySelectorAll("eo-link")).toHaveLength(3);
    expect(
      element.shadowRoot?.querySelector("eo-link")?.getAttribute("url")
    ).toBe("/detail/c");

    await act(async () => {
      element.compareKeys = ["b"];
    });
    expect(element.shadowRoot?.querySelectorAll("eo-link")).toHaveLength(1);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
