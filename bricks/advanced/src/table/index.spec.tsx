import React from "react";
import { describe, test, expect } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./index.jsx";
import { TableComponent } from "./index.jsx";

jest.mock("./BrickTable.js", () => ({
  BrickTable: () => {
    return <div>hello world</div>;
  },
}));
jest.mock("@next-core/theme", () => ({}));

describe("eo-table", () => {
  test("basic usage", () => {
    const element = document.createElement("eo-table") as TableComponent;

    element.columns = [
      {
        title: "name",
        key: "name",
        dataIndex: "name",
      },
      {
        title: "age",
        key: "age",
        dataIndex: "age",
      },
    ];

    element.dataSource = [
      {
        name: "sailor",
        age: "18",
      },
    ];

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(2);
    expect(element.columns.length).toBe(2);
    expect(element.shadowRoot).toBeTruthy();

    act(() => {
      document.body.removeChild(element);
    });

    expect(document.body.contains(element)).toBeFalsy();
  });
});
