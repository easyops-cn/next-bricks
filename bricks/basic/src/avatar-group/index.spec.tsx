import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react";
import "./";
import { EoAvatarGroup } from "./index.js";
import { EoAvatar } from "../avatar";
import { EoEasyopsAvatar } from "../easyops-avatar";

jest.mock("@next-core/theme", () => ({}));

describe("eo-avatar-group", () => {
  test("basic usage", async () => {
    const element = document.createElement("eo-avatar-group") as EoAvatarGroup;
    const item1 = document.createElement("eo-avatar") as EoAvatar;
    item1.size = "large";
    const item2 = document.createElement(
      "eo-easyops-avatar"
    ) as EoEasyopsAvatar;
    item2.size = "medium";
    const item3 = document.createElement("eo-avatar") as EoAvatar;
    item3.size = "xs";
    element.appendChild(item1);
    element.appendChild(item2);
    element.appendChild(item3);

    expect(element.shadowRoot).toBeFalsy();

    await act(async () => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);
    expect(item1.size).toBe("large");
    expect(item1.bordered).toBeTruthy();

    await act(async () => {
      element.size = "xs";
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);
    expect(item1.size).toBe("xs");

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
