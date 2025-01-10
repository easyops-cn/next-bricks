import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react";
import "./";
import { BasicIndexGroup } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

describe("data-view.basic-index-group", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "data-view.basic-index-group"
    ) as BasicIndexGroup;

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      element.itemList = [
        {
          type: "host",
          title: "主机",
          number: 100,
        },
        {
          type: "cloud",
          title: "容器",
          number: 200,
        },
      ];
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);
    expect(
      element.shadowRoot.querySelector(".groupWrapper").getAttribute("style")
    ).toEqual("gap: 30px;");
    expect(element.shadowRoot.querySelector(".cardWrapper").className).toEqual(
      "cardWrapper leftRightWrapper thinCard"
    );
    expect(
      element.shadowRoot.querySelectorAll(".titleWrapper")[0].textContent
    ).toEqual("主机");
    expect(
      element.shadowRoot.querySelectorAll(".titleWrapper")[1].textContent
    ).toEqual("容器");
    act(() => {
      document.body.removeChild(element);
      element.gap = 40;
      element.layout = "top-bottom";
      element.itemList = [
        {
          type: "host",
          title: "主机",
          number: 100,
          imgSrc: "11.png",
        },
        {
          type: "cloud",
          title: "容器",
          number: 200,
        },
      ];
      document.body.appendChild(element);
    });
    expect(
      element.shadowRoot.querySelector(".groupWrapper").getAttribute("style")
    ).toEqual("gap: 40px;");
    expect(element.shadowRoot.querySelector(".cardWrapper").className).toEqual(
      "cardWrapper topBottomWrapper thinCard"
    );
    expect(
      element.shadowRoot.querySelector(".iconWrapper").getAttribute("style")
    ).toEqual("background-image: url(11.png);");
    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
