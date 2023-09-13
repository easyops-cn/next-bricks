import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import { fireEvent } from "@testing-library/react";
import "./";
import { EoNextTable } from "./index.js";

jest.mock("@next-core/theme", () => ({}));
jest.mock("react-i18next", () => {
  const originalModule = jest.requireActual("react-i18next") as any;
  return {
    ...originalModule,
    Trans: jest.fn(),
  };
});

const columns = [
  {
    dataIndex: "name",
    key: "name",
    title: "Name",
    headerBrick: {
      useBrick: {
        brick: "span",
        properties: {
          className: "header-brick",
        },
      },
    },
    useBrick: {
      brick: "span",
      properties: {
        className: "content-brick",
      },
    },
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
const dataSource = {
  list: [
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
    {
      key: 3,
      name: "Sam",
      age: 28,
      address: "Guangzhou",
    },
    {
      key: 4,
      name: "Bob",
      age: 35,
      address: "Hainan",
    },
    {
      key: 5,
      name: "Ava",
      age: 23,
      address: "Beijing",
    },
    {
      key: 6,
      name: "Sophia",
      age: 20,
      address: "Shanghai",
    },
    {
      key: 7,
      name: "Charlotte",
      age: 33,
      address: "Chongqing",
    },
    {
      key: 8,
      name: "Mia",
      age: 18,
      address: "Chengdu",
    },
    {
      key: 9,
      name: "Noah",
      age: 38,
      address: "Hainan",
    },
    {
      key: 10,
      name: "William",
      age: 16,
      address: "Taiwan",
    },
  ],
  page: 1,
  pageSize: 5,
};

describe("eo-next-table", () => {
  test("basic usage", async () => {
    const element = document.createElement("eo-next-table") as EoNextTable;
    element.columns = columns;
    element.dataSource = dataSource;

    expect(element.shadowRoot).toBeFalsy();

    await act(async () => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(
      element.shadowRoot?.querySelectorAll("thead .ant-table-cell").length
    ).toBe(columns.length);
    expect(
      element.shadowRoot?.querySelectorAll("tbody .ant-table-row").length
    ).toBe(5);

    expect(
      element.shadowRoot?.querySelectorAll("thead .header-brick").length
    ).toBe(1);
    expect(
      element.shadowRoot?.querySelectorAll("tbody .content-brick").length
    ).toBe(5);

    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });

  test("pagination", async () => {
    const onPageChange = jest.fn();
    const onPageSizeChange = jest.fn();
    const element = document.createElement("eo-next-table") as EoNextTable;
    element.columns = columns;
    element.dataSource = dataSource;
    element.pagination = {
      showTotal: true,
      pageSizeOptions: [5, 10, 20],
    };
    element.addEventListener("page.change", onPageChange);
    element.addEventListener("page.size.change", onPageSizeChange);

    expect(element.shadowRoot).toBeFalsy();

    await act(async () => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(element.shadowRoot?.querySelector(".ant-pagination")).toBeTruthy();
    expect(
      element.shadowRoot?.querySelector(".pagination-total-text")
    ).toBeTruthy();
    // page changer options
    expect(
      element.shadowRoot?.querySelectorAll(".ant-pagination-item").length
    ).toBe(Math.ceil(dataSource.list.length / dataSource.pageSize));

    await act(async () => {
      // open page size changer popup
      fireEvent.mouseDown(
        element.shadowRoot?.querySelector(
          ".ant-pagination-options-size-changer .ant-select-selector"
        ) as Element
      );
    });
    // page size changer options
    expect(
      element.shadowRoot?.querySelectorAll(
        ".ant-pagination-options .ant-select-item-option"
      ).length
    ).toBe(3);

    await act(async () => {
      // change page to 2
      const pageItem = element.shadowRoot?.querySelectorAll(
        ".ant-pagination-item"
      )[1] as Element;
      fireEvent.click(pageItem);
    });
    expect(onPageChange).lastCalledWith(
      expect.objectContaining({
        detail: {
          page: 2,
          pageSize: 5,
        },
      })
    );

    await act(async () => {
      // change page size to 20
      const pageSizeOptionItem = element.shadowRoot?.querySelectorAll(
        ".ant-pagination-options .ant-select-item-option"
      )[2] as Element;
      fireEvent.click(pageSizeOptionItem);
    });
    expect(onPageChange).lastCalledWith(
      expect.objectContaining({
        detail: {
          page: 1,
          pageSize: 20,
        },
      })
    );
    expect(onPageSizeChange).lastCalledWith(
      expect.objectContaining({
        detail: {
          page: 1,
          pageSize: 20,
        },
      })
    );

    await act(async () => {
      element.pagination = {
        showTotal: false,
      };
    });
    expect(element.shadowRoot?.querySelector(".ant-pagination")).toBeTruthy();
    expect(
      element.shadowRoot?.querySelector(".pagination-total-text")
    ).toBeFalsy();

    await act(async () => {
      element.pagination = false;
    });
    expect(element.shadowRoot?.querySelector(".ant-pagination")).toBeFalsy();

    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
});
