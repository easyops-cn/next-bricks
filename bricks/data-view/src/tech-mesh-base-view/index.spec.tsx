import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react";
import "./";
import { TechMeshBaseView } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

describe("data-view.tech-mesh-base-view", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "data-view.tech-mesh-base-view"
    ) as TechMeshBaseView;

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(element.shadowRoot.querySelectorAll(".layout-wrapper").length).toBe(
      1
    );
    expect(element.shadowRoot.querySelector(".contentWrapper")).toBeTruthy();

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
