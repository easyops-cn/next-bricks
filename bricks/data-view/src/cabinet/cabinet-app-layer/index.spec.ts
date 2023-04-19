import { describe, test, expect } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./index.jsx";
import { CabinetAppLayer } from "./index.jsx";

describe("data-view.cabinet-app-layer", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "data-view.cabinet-app-layer"
    ) as CabinetAppLayer;

    element.appTitle = "inventory-api";
    element.status = "faded";

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();

    expect(element.shadowRoot.querySelector(".app-title").textContent).toBe(
      "inventory-api"
    );
    expect(new Set(element.shadowRoot.querySelector(".container").classList).has("status-faded")).toBe(true);

    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
});
