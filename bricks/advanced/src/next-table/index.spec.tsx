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
  {
    dataIndex: "tag",
    key: "tag",
    title: "Tag",
  },
  {
    dataIndex: ["tutor", "name"],
    key: "tutorName",
    title: "Tutor",
  },
];
const dataSource = {
  list: [
    {
      key: 0,
      name: "Jack",
      age: 18,
      address: "Guangzhou",
      tag: ["nice", "good"],
      tutor: {
        name: "Mr.Bob",
      },
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
      tutor: {
        name: "Mr.Chen",
      },
    },
    {
      key: 4,
      name: "Bob",
      age: 35,
      address: "Hainan",
      tag: ["happy", "good"],
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
      tutor: {
        subject: "Physics",
        name: "Miss.Rose",
      },
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
      tag: ["happy", "nice"],
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
    element.columns = [
      ...columns,
      {
        dataIndex: "hidden1",
        key: "hidden1",
        title: "hidden 1",
      },
      {
        dataIndex: ["group", "name"],
        key: "groupName",
        title: "hidden 2",
      },
    ];
    element.dataSource = dataSource;
    element.hiddenColumns = ["hidden1", "groupName"];

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
});

describe("pagination", () => {
  test("basic usage", async () => {
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

describe("front search", () => {
  test("search by column.dataIndex", async () => {
    const element = document.createElement("eo-next-table") as EoNextTable;
    element.columns = columns;
    element.dataSource = dataSource;
    element.pagination = false;

    expect(element.shadowRoot).toBeFalsy();

    await act(async () => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(
      element.shadowRoot?.querySelectorAll("tbody .ant-table-row").length
    ).toBe(dataSource.list.length);

    await act(async () => {
      element.search({ q: "nice" });
    });
    expect(
      element.shadowRoot?.querySelectorAll("tbody .ant-table-row").length
    ).toBe(2);

    await act(async () => {
      element.search({ q: "rose" });
    });
    expect(
      element.shadowRoot?.querySelectorAll("tbody .ant-table-row").length
    ).toBe(1);

    await act(async () => {
      element.search({ q: "" });
    });
    expect(
      element.shadowRoot?.querySelectorAll("tbody .ant-table-row").length
    ).toBe(dataSource.list.length);

    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });

  test("search by searchFields", async () => {
    const element = document.createElement("eo-next-table") as EoNextTable;
    element.columns = columns;
    element.dataSource = dataSource;
    element.pagination = false;
    element.searchFields = ["tutor"];

    expect(element.shadowRoot).toBeFalsy();

    await act(async () => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(
      element.shadowRoot?.querySelectorAll("tbody .ant-table-row").length
    ).toBe(dataSource.list.length);

    await act(async () => {
      element.search({ q: "nice" });
    });
    expect(
      element.shadowRoot?.querySelectorAll("tbody .ant-table-row").length
    ).toBe(0);

    await act(async () => {
      element.search({ q: "physics" });
    });
    expect(
      element.shadowRoot?.querySelectorAll("tbody .ant-table-row").length
    ).toBe(1);

    await act(async () => {
      element.search({ q: "" });
    });
    expect(
      element.shadowRoot?.querySelectorAll("tbody .ant-table-row").length
    ).toBe(dataSource.list.length);

    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
});

describe("rowSelection", () => {
  test("basic usage", async () => {
    const onRowSelect = jest.fn();
    const element = document.createElement("eo-next-table") as EoNextTable;
    element.columns = columns;
    element.dataSource = dataSource;
    element.addEventListener("row.select", onRowSelect);

    expect(element.shadowRoot).toBeFalsy();

    await act(async () => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(
      element.shadowRoot?.querySelector(".ant-table-selection")
    ).toBeFalsy();
    expect(element.shadowRoot?.querySelector(".select-info")).toBeFalsy();

    await act(async () => {
      element.rowSelection = true;
    });
    expect(
      element.shadowRoot?.querySelector(".ant-table-selection")
    ).toBeTruthy();
    expect(element.shadowRoot?.querySelector(".select-info")).toBeFalsy();

    await act(async () => {
      // 第一个为全选，后面的才是每行的选择框
      fireEvent.click(
        element.shadowRoot?.querySelectorAll(
          ".ant-table-selection-column label"
        )[1] as Element
      );
    });
    expect(onRowSelect).lastCalledWith(
      expect.objectContaining({
        detail: {
          keys: [dataSource.list[0].key],
          rows: [dataSource.list[0]],
          info: {
            type: "single",
          },
        },
      })
    );
    expect(element.shadowRoot?.querySelector(".select-info")).toBeTruthy();

    // 全选第一页
    await act(async () => {
      fireEvent.click(
        element.shadowRoot?.querySelectorAll(
          ".ant-table-selection-column label"
        )[0] as Element
      );
    });
    expect(onRowSelect).lastCalledWith(
      expect.objectContaining({
        detail: {
          keys: dataSource.list.slice(0, 5).map((v) => v.key),
          rows: dataSource.list.slice(0, 5),
          info: {
            type: "all",
          },
        },
      })
    );

    // 跳转并全选第二页
    await act(async () => {
      const pageItem = element.shadowRoot?.querySelectorAll(
        ".ant-pagination-item"
      )[1] as Element;
      fireEvent.click(pageItem);
    });
    await act(async () => {
      fireEvent.click(
        element.shadowRoot?.querySelectorAll(
          ".ant-table-selection-column label"
        )[0] as Element
      );
    });
    expect(onRowSelect).lastCalledWith(
      expect.objectContaining({
        detail: {
          keys: dataSource.list.slice(0, 10).map((v) => v.key),
          rows: dataSource.list.slice(0, 10),
          info: {
            type: "all",
          },
        },
      })
    );

    // 清空
    await act(async () => {
      fireEvent.click(
        element.shadowRoot?.querySelector(".select-info eo-link") as Element
      );
    });
    expect(onRowSelect).lastCalledWith(
      expect.objectContaining({
        detail: {
          keys: [],
          rows: [],
          info: {
            type: "none",
          },
        },
      })
    );

    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
});

describe("expandable", () => {
  test("basic usage", async () => {
    const onRowExpand = jest.fn();
    const onExpandedRowsChange = jest.fn();
    const element = document.createElement("eo-next-table") as EoNextTable;
    element.columns = columns;
    element.dataSource = dataSource;
    element.addEventListener("row.expand", onRowExpand);
    element.addEventListener("expanded.rows.change", onExpandedRowsChange);

    expect(element.shadowRoot).toBeFalsy();

    await act(async () => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(
      element.shadowRoot?.querySelector(".ant-table-row-expand-icon-cell")
    ).toBeFalsy();

    await act(async () => {
      element.expandable = {
        rowExpandable: "<% DATA.rowData.key % 2 === 0 %>",
        expandIconBrick: {
          useBrick: {
            brick: "div",
            properties: {
              className: "expand-icon",
            },
          },
        },
        expandedRowBrick: {
          useBrick: {
            brick: "div",
            properties: {
              className: "expanded-row-brick",
            },
          },
        },
      };
    });
    expect(
      element.shadowRoot?.querySelector(".ant-table-row-expand-icon-cell")
    ).toBeTruthy();

    await act(async () => {
      fireEvent.click(
        element.shadowRoot?.querySelectorAll(".expand-icon")[1] as Element
      );
    });
    expect(onRowExpand).not.toBeCalled();
    expect(onExpandedRowsChange).not.toBeCalled();

    await act(async () => {
      fireEvent.click(
        element.shadowRoot?.querySelectorAll(".expand-icon")[0] as Element
      );
    });
    expect(
      element.shadowRoot?.querySelector(
        ".ant-table-expanded-row .expanded-row-brick"
      )
    ).toBeTruthy();
    expect(onRowExpand).lastCalledWith(
      expect.objectContaining({
        detail: {
          expanded: true,
          record: dataSource.list[0],
        },
      })
    );
    expect(onExpandedRowsChange).lastCalledWith(
      expect.objectContaining({
        detail: [dataSource.list[0].key],
      })
    );

    await act(async () => {
      fireEvent.click(
        element.shadowRoot?.querySelectorAll(".expand-icon")[0] as Element
      );
    });
    expect(onRowExpand).lastCalledWith(
      expect.objectContaining({
        detail: {
          expanded: false,
          record: dataSource.list[0],
        },
      })
    );
    expect(onExpandedRowsChange).lastCalledWith(
      expect.objectContaining({
        detail: [],
      })
    );

    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
});

describe("draggable", () => {
  test("basic usage", async () => {
    // TODO(nlicro): there's not a very practical way to test dnd in a jsdom environment - this library relies heavily on getBoundingClientRect which is stubbed to return all zeroes in jsdom.
    const onRowDrag = jest.fn();
    const element = document.createElement("eo-next-table") as EoNextTable;
    element.columns = columns;
    element.dataSource = dataSource;
    element.pagination = false;
    element.rowDraggable = true;
    element.rowKey = "name";
    element.addEventListener("row.drag", onRowDrag);

    expect(element.shadowRoot).toBeFalsy();

    await act(async () => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    const row = element.shadowRoot?.querySelector(
      "[data-row-key='Jack']"
    ) as HTMLElement;
    expect(row.style.touchAction).toBe("none");

    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
});
