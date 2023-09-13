import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./";
import { EoNextTable } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

const columns = [
  {
    dataIndex: "name",
    key: "name",
    title: "Name",
  },
  {
    dataIndex: "age",
    key: "age",
    title: "Age",
  },
  {
    dataIndex: "address",
    key: "address",
    title: "Address",
  },
];
const dataSource = [
  {
    key: 0,
    name: "Jack",
    age: 18,
    address: "Guangzhou",
  },
  {
    key: 1,
    name: "Alex",
    age: 20,
    address: "Shanghai",
  },
  {
    key: 2,
    name: "Lucy",
    age: 16,
    address: "Yunnan",
  },
];

describe("eo-next-table", () => {
  test("basic usage", async () => {
    const element = document.createElement("eo-next-table") as EoNextTable;
    element.columns = columns;
    element.dataSource = dataSource;

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(
      element.shadowRoot?.querySelectorAll("thead .ant-table-cell").length
    ).toBe(columns.length);
    expect(
      element.shadowRoot?.querySelectorAll("tbody .ant-table-row").length
    ).toBe(dataSource.length);

    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
});
