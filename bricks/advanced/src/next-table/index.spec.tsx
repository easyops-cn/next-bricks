import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react";
import { fireEvent } from "@testing-library/react";
import "./";
import { EoNextTable } from "./index.js";
import { getAllKeys } from "./utils.js";

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
      age: 28,
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
const treeDataSource = {
  list: [
    {
      key: "1",
      name: "Jack",
      age: 18,
      address: "Guangzhou",
      student: [
        {
          key: "11",
          name: "Alex",
          age: 20,
          address: "Shanghai",
        },
        {
          key: "12",
          name: "Lucy",
          age: 16,
          address: "Yunnan",
        },
        {
          key: "13",
          name: "Sam",
          age: 34,
          address: "Guangzhou",
        },
      ],
    },
    {
      key: "2",
      name: "Bob",
      age: 27,
      address: "Hainan",
      student: [
        {
          key: "21",
          name: "Ava",
          age: 23,
          address: "Beijing",
        },
        {
          key: "22",
          name: "Sophia",
          age: 20,
          address: "Shanghai",
        },
        {
          key: "23",
          name: "Charlotte",
          age: 35,
          address: "Chongqing",
          student: [
            {
              key: "231",
              name: "Mia",
              age: 18,
              address: "Chengdu",
            },
            {
              key: "232",
              name: "Noah",
              age: 38,
              address: "Hainan",
            },
            {
              key: "233",
              name: "William",
              age: 16,
              address: "Taiwan",
            },
          ],
        },
      ],
    },
  ],
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
    element.optimizedColumns = ["name", "age", "address"];
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

  test("colSpan & rowSpan", async () => {
    const element = document.createElement("eo-next-table") as EoNextTable;
    element.columns = [
      {
        dataIndex: "name",
        key: "name",
        title: "Name",
      },
      {
        dataIndex: "mobile",
        key: "mobile",
        title: "phone",
        colSpan: 2,
        cellColSpanKey: "mobileColSpan",
        cellRowSpanKey: "mobileRowSpan",
      },
      {
        dataIndex: "landlines",
        key: "landlines",
        colSpan: 0,
        cellColSpanKey: "landlinesColSpan",
        cellRowSpanKey: "landlinesRowSpan",
      },
      {
        dataIndex: "address",
        key: "address",
        title: "Address",
      },
    ];
    element.dataSource = {
      list: [
        {
          key: 0,
          name: "Jack",
          address: "Guangzhou",
          mobile: 18900010222,
          landlines: "0571-22098909",
        },
        {
          key: 1,
          name: "Alex",
          address: "Shanghai",
          mobile: 18900010333,
          mobileColSpan: 2,
          landlinesColSpan: 0,
        },
        {
          key: 2,
          name: "Lucy",
          address: "Yunnan",
          mobile: 18900010444,
          landlines: "0571-22098707",
          landlinesRowSpan: 2,
        },
        {
          key: 3,
          name: "Sam",
          address: "Guangzhou",
          mobile: 18900010555,
          landlines: "0571-22098707",
          landlinesRowSpan: 0,
        },
      ],
    };
    element.pagination = false;

    expect(element.shadowRoot).toBeFalsy();

    await act(async () => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(
      element.shadowRoot?.querySelectorAll("thead .ant-table-cell").length
    ).toBe(3);
    expect(
      element.shadowRoot
        ?.querySelectorAll("thead .ant-table-cell")[1]
        .getAttribute("colspan")
    ).toBe("2");

    expect(
      element.shadowRoot?.querySelectorAll("tbody .ant-table-row").length
    ).toBe(4);

    // no span
    expect(
      element.shadowRoot
        ?.querySelectorAll("tbody .ant-table-row")[0]
        .querySelectorAll(".ant-table-cell").length
    ).toBe(4);

    // colSpan
    expect(
      element.shadowRoot
        ?.querySelectorAll("tbody .ant-table-row")[1]
        .querySelectorAll(".ant-table-cell").length
    ).toBe(3);
    expect(
      element.shadowRoot
        ?.querySelectorAll("tbody .ant-table-row")[1]
        .querySelectorAll(".ant-table-cell")[1]
        .getAttribute("colspan")
    ).toBe("2");

    // rowSpan
    expect(
      element.shadowRoot
        ?.querySelectorAll("tbody .ant-table-row")[2]
        .querySelectorAll(".ant-table-cell").length
    ).toBe(4);
    expect(
      element.shadowRoot
        ?.querySelectorAll("tbody .ant-table-row")[2]
        .querySelectorAll(".ant-table-cell")[2]
        .getAttribute("rowspan")
    ).toBe("2");
    expect(
      element.shadowRoot
        ?.querySelectorAll("tbody .ant-table-row")[3]
        .querySelectorAll(".ant-table-cell").length
    ).toBe(3);

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

  test("sortable", async () => {
    const onSort = jest.fn();
    const element = document.createElement("eo-next-table") as EoNextTable;
    element.columns = [
      {
        dataIndex: "name",
        key: "name",
        title: "Name",
      },
      {
        dataIndex: "age",
        key: "age",
        title: "Age",
        sortable: true,
      },
      {
        dataIndex: "address",
        key: "address",
        title: "Address",
        sortable: true,
      },
    ];
    element.dataSource = dataSource;
    element.pagination = false;
    element.frontSearch = true;
    element.sort = {
      columnKey: "age",
      order: "ascend",
    };
    element.addEventListener("sort.change", onSort);

    expect(element.shadowRoot).toBeFalsy();

    await act(async () => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    const ageTh = element.shadowRoot?.querySelectorAll(
      "thead .ant-table-cell"
    )[1] as Element;
    expect(ageTh.getAttribute("aria-sort")).toBe("ascending");
    expect(
      element.shadowRoot
        ?.querySelectorAll("tbody .ant-table-row")[0]
        .querySelectorAll(".ant-table-cell")[1].textContent
    ).toBe("16");

    await act(async () => {
      fireEvent.click(ageTh);
    });
    expect(ageTh.getAttribute("aria-sort")).toBe("descending");
    expect(onSort).lastCalledWith(
      expect.objectContaining({
        detail: {
          columnKey: "age",
          order: "descend",
        },
      })
    );
    expect(
      element.shadowRoot
        ?.querySelectorAll("tbody .ant-table-row")[0]
        .querySelectorAll(".ant-table-cell")[1].textContent
    ).toBe("38");

    await act(async () => {
      fireEvent.click(ageTh);
    });
    expect(ageTh.getAttribute("aria-sort")).toBeNull;
    expect(onSort).lastCalledWith(
      expect.objectContaining({
        detail: null,
      })
    );
    expect(
      element.shadowRoot
        ?.querySelectorAll("tbody .ant-table-row")[0]
        .querySelectorAll(".ant-table-cell")[1].textContent
    ).toBe(String(dataSource.list[0].age));

    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });

  test("tree data", async () => {
    const element = document.createElement("eo-next-table") as EoNextTable;
    element.columns = columns;
    element.dataSource = treeDataSource;
    element.pagination = false;
    element.childrenColumnName = "student";
    element.expandable = {
      defaultExpandAllRows: true,
    };
    element.searchFields = ["name"];

    expect(element.shadowRoot).toBeFalsy();

    await act(async () => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(
      element.shadowRoot?.querySelectorAll("tbody .ant-table-row").length
    ).toBe(11);

    await act(async () => {
      element.search({ q: "jack" });
    });
    expect(
      element.shadowRoot?.querySelectorAll("tbody .ant-table-row").length
    ).toBe(4);

    await act(async () => {
      element.search({ q: "lucy" });
    });
    expect(
      element.shadowRoot?.querySelectorAll("tbody .ant-table-row").length
    ).toBe(2);

    await act(async () => {
      element.search({ q: "Charlotte" });
    });
    expect(
      element.shadowRoot?.querySelectorAll("tbody .ant-table-row").length
    ).toBe(5);

    await act(async () => {
      element.search({ q: "" });
    });
    expect(
      element.shadowRoot?.querySelectorAll("tbody .ant-table-row").length
    ).toBe(11);

    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
});

describe("sortable", () => {
  test("multiSort is false", async () => {
    const onSort = jest.fn();
    const element = document.createElement("eo-next-table") as EoNextTable;
    element.columns = [
      {
        dataIndex: "name",
        key: "name",
        title: "Name",
      },
      {
        dataIndex: "age",
        key: "age",
        title: "Age",
        sortable: true,
      },
      {
        dataIndex: "address",
        key: "address",
        title: "Address",
        sortable: true,
      },
    ];
    element.dataSource = dataSource;
    element.pagination = false;
    element.sort = {
      columnKey: "age",
      order: "ascend",
    };
    element.addEventListener("sort.change", onSort);

    expect(element.shadowRoot).toBeFalsy();

    await act(async () => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    const ageTh = element.shadowRoot?.querySelectorAll(
      "thead .ant-table-cell"
    )[1] as Element;
    expect(ageTh.getAttribute("aria-sort")).toBe("ascending");
    await act(async () => {
      fireEvent.click(ageTh);
    });
    expect(ageTh.getAttribute("aria-sort")).toBe("descending");
    expect(onSort).lastCalledWith(
      expect.objectContaining({
        detail: {
          columnKey: "age",
          order: "descend",
        },
      })
    );

    const addressTh = element.shadowRoot?.querySelectorAll(
      "thead .ant-table-cell"
    )[2] as Element;
    await act(async () => {
      fireEvent.click(addressTh);
    });
    expect(ageTh.getAttribute("aria-sort")).toBeNull();
    expect(addressTh.getAttribute("aria-sort")).toBe("ascending");
    expect(onSort).lastCalledWith(
      expect.objectContaining({
        detail: {
          columnKey: "address",
          order: "ascend",
        },
      })
    );

    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });

  test("multiSort is true", async () => {
    const onSort = jest.fn();
    const element = document.createElement("eo-next-table") as EoNextTable;
    element.columns = [
      {
        dataIndex: "name",
        key: "name",
        title: "Name",
      },
      {
        dataIndex: "age",
        key: "age",
        title: "Age",
        sortable: true,
        sortPriority: 1,
      },
      {
        dataIndex: "address",
        key: "address",
        title: "Address",
        sortable: true,
        sortPriority: 2,
      },
    ];
    element.dataSource = dataSource;
    element.pagination = false;
    element.multiSort = true;
    element.sort = [
      {
        columnKey: "age",
        order: "ascend",
      },
      {
        columnKey: "address",
        order: "descend",
      },
    ];
    element.addEventListener("sort.change", onSort);

    expect(element.shadowRoot).toBeFalsy();

    await act(async () => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    const ageTh = element.shadowRoot?.querySelectorAll(
      "thead .ant-table-cell"
    )[1] as Element;
    const addressTh = element.shadowRoot?.querySelectorAll(
      "thead .ant-table-cell"
    )[2] as Element;
    expect(ageTh.getAttribute("aria-sort")).toBe("ascending");
    expect(addressTh.getAttribute("aria-sort")).toBe("descending");

    await act(async () => {
      fireEvent.click(ageTh);
    });
    expect(ageTh.getAttribute("aria-sort")).toBe("descending");
    expect(addressTh.getAttribute("aria-sort")).toBe("descending");
    expect(onSort).lastCalledWith(
      expect.objectContaining({
        detail: [
          {
            columnKey: "address",
            order: "descend",
          },
          {
            columnKey: "age",
            order: "descend",
          },
        ],
      })
    );

    await act(async () => {
      fireEvent.click(ageTh);
    });
    expect(onSort).lastCalledWith(
      expect.objectContaining({
        detail: {
          columnKey: "address",
          order: "descend",
        },
      })
    );

    await act(async () => {
      fireEvent.click(addressTh);
    });
    expect(onSort).lastCalledWith(
      expect.objectContaining({
        detail: null,
      })
    );

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

  test("tree data and checkStrictly is true", async () => {
    const onRowSelect = jest.fn();
    const element = document.createElement("eo-next-table") as EoNextTable;
    element.columns = columns;
    element.dataSource = treeDataSource;
    element.childrenColumnName = "student";
    element.expandable = {
      defaultExpandAllRows: true,
    };
    element.rowSelection = {
      checkStrictly: true,
    };
    element.pagination = false;
    element.addEventListener("row.select", onRowSelect);

    expect(element.shadowRoot).toBeFalsy();

    await act(async () => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

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
          keys: [treeDataSource.list[0].key],
          rows: [treeDataSource.list[0]],
          info: {
            type: "single",
          },
        },
      })
    );

    await act(async () => {
      fireEvent.click(
        element.shadowRoot?.querySelectorAll(
          ".ant-table-selection-column label"
        )[2] as Element
      );
    });
    expect(onRowSelect).lastCalledWith(
      expect.objectContaining({
        detail: {
          keys: [
            treeDataSource.list[0].key,
            treeDataSource.list[0].student[0].key,
          ],
          rows: [treeDataSource.list[0], treeDataSource.list[0].student[0]],
          info: {
            type: "single",
          },
        },
      })
    );

    // 全选
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
          keys: getAllKeys({
            list: treeDataSource.list,
            childrenColumnName: "student",
            rowKey: "key",
          }),
          rows: expect.any(Array),
          info: {
            type: "all",
          },
        },
      })
    );

    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });

  test("tree data and checkStrictly is false", async () => {
    const onRowSelect = jest.fn();
    const element = document.createElement("eo-next-table") as EoNextTable;
    element.columns = columns;
    element.dataSource = treeDataSource;
    element.childrenColumnName = "student";
    element.expandable = {
      defaultExpandAllRows: true,
    };
    element.rowSelection = {
      checkStrictly: false,
    };
    element.pagination = false;
    element.addEventListener("row.select", onRowSelect);

    expect(element.shadowRoot).toBeFalsy();

    await act(async () => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

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
          keys: [
            treeDataSource.list[0].key,
            ...treeDataSource.list[0].student.map((v) => v.key),
          ],
          rows: [treeDataSource.list[0], ...treeDataSource.list[0].student],
          info: {
            type: "single",
          },
        },
      })
    );

    await act(async () => {
      fireEvent.click(
        element.shadowRoot?.querySelectorAll(
          ".ant-table-selection-column label"
        )[2] as Element
      );
    });
    expect(onRowSelect).lastCalledWith(
      expect.objectContaining({
        detail: {
          // Not including halfChecked
          keys: [
            ...treeDataSource.list[0].student
              .filter((v, i) => i !== 0)
              .map((v) => v.key),
          ],
          rows: [...treeDataSource.list[0].student.filter((v, i) => i !== 0)],
          info: {
            type: "single",
          },
        },
      })
    );

    // 全选
    await act(async () => {
      fireEvent.click(
        element.shadowRoot?.querySelectorAll(
          ".ant-table-selection-column label"
        )[0] as Element
      );
    });
    // keys order will changed
    expect(onRowSelect).lastCalledWith(
      expect.objectContaining({
        detail: {
          keys: expect.any(Array),
          rows: expect.any(Array),
          info: {
            type: "all",
          },
        },
      })
    );
    expect(
      (
        onRowSelect.mock.calls[onRowSelect.mock.calls.length - 1][0] as any
      ).detail.keys.sort()
    ).toEqual(
      getAllKeys({
        list: treeDataSource.list,
        childrenColumnName: "student",
        rowKey: "key",
      }).sort()
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

  test("tree data", async () => {
    const onRowExpand = jest.fn();
    const onExpandedRowsChange = jest.fn();
    const element = document.createElement("eo-next-table") as EoNextTable;
    element.columns = columns;
    element.dataSource = treeDataSource;
    element.childrenColumnName = "student";
    element.pagination = false;
    element.addEventListener("row.expand", onRowExpand);
    element.addEventListener("expanded.rows.change", onExpandedRowsChange);

    expect(element.shadowRoot).toBeFalsy();

    await act(async () => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(
      element.shadowRoot?.querySelectorAll("tbody .ant-table-row").length
    ).toBe(treeDataSource.list.length);

    await act(async () => {
      fireEvent.click(
        element.shadowRoot?.querySelectorAll(
          ".ant-table-row-expand-icon:not(.ant-table-row-expand-icon-spaced)"
        )[1] as Element
      );
    });
    expect(
      element.shadowRoot?.querySelectorAll("tbody .ant-table-row").length
    ).toBe(treeDataSource.list.length + treeDataSource.list[1].student.length);
    expect(onRowExpand).lastCalledWith(
      expect.objectContaining({
        detail: {
          expanded: true,
          record: treeDataSource.list[1],
        },
      })
    );
    expect(onExpandedRowsChange).lastCalledWith(
      expect.objectContaining({
        detail: [treeDataSource.list[1].key],
      })
    );

    await act(async () => {
      fireEvent.click(
        element.shadowRoot?.querySelectorAll(
          ".ant-table-row-expand-icon:not(.ant-table-row-expand-icon-spaced)"
        )[2] as Element
      );
    });
    expect(
      element.shadowRoot?.querySelectorAll("tbody .ant-table-row").length
    ).toBe(
      treeDataSource.list.length +
        treeDataSource.list[1].student.length +
        (treeDataSource.list[1].student[2].student?.length as any)
    );
    expect(onRowExpand).lastCalledWith(
      expect.objectContaining({
        detail: {
          expanded: true,
          record: treeDataSource.list[1].student[2],
        },
      })
    );
    expect(onExpandedRowsChange).lastCalledWith(
      expect.objectContaining({
        detail: [
          treeDataSource.list[1].key,
          treeDataSource.list[1].student[2].key,
        ],
      })
    );

    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });

  test("defaultExpandAllRows", async () => {
    const onRowExpand = jest.fn();
    const onExpandedRowsChange = jest.fn();
    const element = document.createElement("eo-next-table") as EoNextTable;
    element.columns = columns;
    element.dataSource = treeDataSource;
    element.childrenColumnName = "student";
    element.pagination = false;
    element.expandable = {
      defaultExpandAllRows: true,
    };
    element.addEventListener("row.expand", onRowExpand);
    element.addEventListener("expanded.rows.change", onExpandedRowsChange);

    expect(element.shadowRoot).toBeFalsy();

    await act(async () => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(
      element.shadowRoot?.querySelectorAll("tbody .ant-table-row").length
    ).toBe(11);

    await act(async () => {
      fireEvent.click(
        element.shadowRoot?.querySelectorAll(
          ".ant-table-row-expand-icon:not(.ant-table-row-expand-icon-spaced)"
        )[1] as Element
      );
    });
    expect(
      element.shadowRoot?.querySelectorAll("tbody .ant-table-row").length
    ).toBe(treeDataSource.list.length + treeDataSource.list[1].student.length);
    expect(onRowExpand).lastCalledWith(
      expect.objectContaining({
        detail: {
          expanded: false,
          record: treeDataSource.list[1],
        },
      })
    );
    expect(onExpandedRowsChange).lastCalledWith(
      expect.objectContaining({
        detail: getAllKeys({
          list: treeDataSource.list,
          childrenColumnName: "student",
          rowKey: "key",
        }).filter((v) => v !== treeDataSource.list[1].key),
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

  test("tree data", async () => {
    const onRowDrag = jest.fn();
    const element = document.createElement("eo-next-table") as EoNextTable;
    element.columns = columns;
    element.dataSource = treeDataSource;
    element.childrenColumnName = "student";
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
    expect(row.style.touchAction).not.toBe("none");

    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
});

describe("define cell brick", () => {
  const columns = new Array(3).fill(null).map((d, key) => ({
    dataIndex: key,
    key,
    title: key,
  }));

  test("cell brick", async () => {
    const element = document.createElement("eo-next-table") as EoNextTable;
    element.columns = columns;
    element.dataSource = {
      list: [
        { 0: "A", 1: "B", 2: "C" },
        { 0: "X", 1: "Y", 2: "Z" },
      ],
    };
    element.cell = {
      useBrick: [
        {
          if: "<% DATA.columnKey % 2 === 0 %>",
          brick: "em",
          properties: { textContent: "<% DATA.cellData %>" },
        },
        {
          if: "<% DATA.columnKey % 2 === 1 %>",
          brick: "del",
          properties: { textContent: "<% DATA.cellData %>" },
        },
      ],
    };
    element.rowKey = "0";

    await act(async () => {
      document.body.appendChild(element);
    });

    expect(element.shadowRoot?.querySelectorAll("em")).toMatchInlineSnapshot(`
      NodeList [
        <em>
          A
        </em>,
        <em>
          C
        </em>,
        <em>
          X
        </em>,
        <em>
          Z
        </em>,
      ]
    `);

    expect(element.shadowRoot?.querySelectorAll("del")).toMatchInlineSnapshot(`
      NodeList [
        <del>
          B
        </del>,
        <del>
          Y
        </del>,
      ]
    `);

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("cell header brick", async () => {
    const element = document.createElement("eo-next-table") as EoNextTable;
    element.columns = columns;
    element.dataSource = {
      list: [
        { 0: "A", 1: "B", 2: "C" },
        { 0: "X", 1: "Y", 2: "Z" },
      ],
    };
    element.cell = {
      header: {
        useBrick: [
          {
            if: "<% DATA.columnKey % 2 === 0 %>",
            brick: "em",
            properties: { textContent: "<% DATA.title %>" },
          },
          {
            if: "<% DATA.columnKey % 2 === 1 %>",
            brick: "del",
            properties: { textContent: "<% DATA.title %>" },
          },
        ],
      },
    };
    element.rowKey = "0";

    await act(async () => {
      document.body.appendChild(element);
    });

    expect(element.shadowRoot?.querySelectorAll("em")).toMatchInlineSnapshot(`
      NodeList [
        <em>
          0
        </em>,
        <em>
          2
        </em>,
      ]
    `);

    expect(element.shadowRoot?.querySelectorAll("del")).toMatchInlineSnapshot(`
      NodeList [
        <del>
          1
        </del>,
      ]
    `);

    act(() => {
      document.body.removeChild(element);
    });
  });
});
