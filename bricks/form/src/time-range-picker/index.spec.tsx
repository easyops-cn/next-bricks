import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek.js";
import advancedFormat from "dayjs/plugin/advancedFormat.js";
import quarterOfYear from "dayjs/plugin/quarterOfYear.js";
import "./";
import { EoTimeRangePicker } from "./index.js";
import type { presetRangeType } from "./index.js";

dayjs.extend(advancedFormat);
dayjs.extend(isoWeek);
dayjs.extend(quarterOfYear);

jest.mock("@next-core/theme", () => ({}));

beforeAll(() => {
  jest.useFakeTimers().setSystemTime(new Date("2023-10-01"));
});

afterAll(() => {
  jest.useRealTimers();
});

describe("eo-time-range-picker", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "eo-time-range-picker"
    ) as EoTimeRangePicker;
    element.value = {
      endTime: "10:00:29",
      startTime: "10:00:26",
    };
    element.emitChangeOnInit = true;

    const onChangeMock = jest.fn();

    element.addEventListener("change", onChangeMock);

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);
    const pickerList = element.shadowRoot?.querySelectorAll(".ant-picker");
    expect(pickerList).toHaveLength(2);
    act(() => {
      (pickerList?.[0] as HTMLElement)?.click();
    });
    expect(
      element.shadowRoot?.querySelector(".ant-picker-now-btn")
    ).toBeTruthy();
    act(() => {
      (
        element.shadowRoot?.querySelector(".ant-picker-now-btn") as HTMLElement
      ).click();
    });

    act(() => {
      (pickerList?.[1] as HTMLElement)?.click();
    });

    expect(
      element.shadowRoot?.querySelectorAll(".ant-picker-now-btn")
    ).toHaveLength(2);
    act(() => {
      (
        element.shadowRoot?.querySelectorAll(
          ".ant-picker-now-btn"
        )[1] as HTMLElement
      )?.click();
    });

    expect(onChangeMock).toBeCalledTimes(3);
    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
  it("should rangeType=hmTime", async () => {
    const element = document.createElement(
      "eo-time-range-picker"
    ) as EoTimeRangePicker;
    element.value = {
      endTime: "11:00:29",
      startTime: "10:00:26",
    };
    element.emitChangeOnInit = true;
    element.rangeType = "hmTime" as any;

    const onChangeMock = jest.fn();

    element.addEventListener("change", onChangeMock);

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);
    const pickerList = element.shadowRoot?.querySelectorAll(".ant-picker");
    expect(pickerList).toHaveLength(2);
    act(() => {
      (pickerList?.[0] as HTMLElement)?.click();
    });
    act(() => {
      (
        element.shadowRoot?.querySelector(
          ".ant-picker-ok button"
        ) as HTMLElement
      )?.click();
    });
    const inputList = element.shadowRoot?.querySelectorAll(
      ".ant-picker-input >input"
    );
    expect(inputList).toHaveLength(2);
    expect((inputList?.[0] as HTMLInputElement)?.value).toBe("10:00");
    expect((inputList?.[1] as HTMLInputElement)?.value).toBe("11:00");
    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
  it("should rangeType=dateTime", async () => {
    const element = document.createElement(
      "eo-time-range-picker"
    ) as EoTimeRangePicker;
    element.value = {
      endTime: "2023-11-15:11:00:29",
      startTime: "2023-10-18:10:00:26",
    };
    element.emitChangeOnInit = true;
    element.rangeType = "dateTime" as any;

    const onChangeMock = jest.fn();
    element.addEventListener("change", onChangeMock);

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    act(() => {
      (
        element.shadowRoot?.querySelector(".ant-picker") as HTMLElement
      )?.click();
    });
    act(() => {
      (
        element.shadowRoot?.querySelector(
          ".ant-picker-ok button"
        ) as HTMLElement
      )?.click();
    });
    const inputList = element.shadowRoot?.querySelectorAll(
      ".ant-picker-input >input"
    );
    expect(inputList).toHaveLength(2);
    expect((inputList?.[0] as HTMLInputElement)?.value).toBe(
      "2023-10-18 10:00:26"
    );
    expect((inputList?.[1] as HTMLInputElement)?.value).toBe(
      "2023-11-15 11:00:29"
    );
    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
  it("should rangeType=date", async () => {
    const element = document.createElement(
      "eo-time-range-picker"
    ) as EoTimeRangePicker;
    element.value = {
      endTime: "2023-11-15",
      startTime: "2023-10-18",
    };
    element.emitChangeOnInit = true;
    element.rangeType = "date" as any;

    const onChangeMock = jest.fn();

    element.addEventListener("change", (e) =>
      onChangeMock((e as CustomEvent).detail)
    );

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    const picker = element.shadowRoot?.querySelector(".ant-picker");

    act(() => {
      (picker as HTMLElement)?.click();
    });

    const contentList = element.shadowRoot?.querySelectorAll(
      ".ant-picker-content"
    );
    expect(contentList).toHaveLength(2);
    expect(
      contentList?.[0]?.querySelector("[title='2023-10-10']")
    ).toBeTruthy();
    act(() => {
      (
        contentList?.[0]?.querySelector("[title='2023-10-10']") as HTMLElement
      )?.click();
    });
    act(() => {
      (
        contentList?.[1]?.querySelector("[title='2023-11-16']") as HTMLElement
      )?.click();
    });
    // NOTE: change called times changed from 3 to 2 after upgrade antd.
    expect(onChangeMock).toBeCalledTimes(2);
    expect(onChangeMock).toHaveBeenLastCalledWith({
      endTime: "2023-11-16",
      startTime: "2023-10-10",
    });
    element.selectNearDays = 1;

    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });

  it("should selectNearDays=1", async () => {
    const element = document.createElement(
      "eo-time-range-picker"
    ) as EoTimeRangePicker;
    element.rangeType = "date" as any;
    element.selectNearDays = 1;
    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    const picker = element.shadowRoot?.querySelector(".ant-picker");

    act(() => {
      (picker as HTMLElement)?.click();
    });

    const contentList = element.shadowRoot?.querySelectorAll(
      ".ant-picker-content"
    );
    expect(contentList).toHaveLength(2);
    expect(
      contentList?.[0]?.querySelector(
        ":not(.ant-picker-cell-disabled) >.ant-picker-cell-inner"
      )?.textContent
    )?.toBe("1");
    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });

  it("should presetRanges=[本周]", async () => {
    const element = document.createElement(
      "eo-time-range-picker"
    ) as EoTimeRangePicker;
    element.rangeType = "date" as any;
    element.presetRanges = ["本周"] as presetRangeType[];
    element.emitChangeOnInit = false;
    const onChangeMock = jest.fn();

    element.addEventListener("change", onChangeMock);
    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    const picker = element.shadowRoot?.querySelector(".ant-picker");

    act(() => {
      (picker as HTMLElement)?.click();
    });

    const contentList = element.shadowRoot?.querySelectorAll(
      ".ant-picker-content"
    );
    expect(contentList).toHaveLength(2);
    expect(
      element.shadowRoot?.querySelector(".ant-picker-presets li")
    ).toBeTruthy();
    act(() => {
      (
        element.shadowRoot?.querySelector(
          ".ant-picker-presets li"
        ) as HTMLElement
      ).click();
    });

    expect((onChangeMock.mock.calls[0][0] as CustomEvent).detail).toEqual({
      endTime: dayjs().endOf("week").format("YYYY-MM-DD"),
      startTime: dayjs().startOf("week").format("YYYY-MM-DD"),
    });

    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });

  it("should rangeType=week", async () => {
    const element = document.createElement(
      "eo-time-range-picker"
    ) as EoTimeRangePicker;
    element.value = {
      endTime: "2023-11-15",
      startTime: "2023-10-18",
    };
    element.emitChangeOnInit = true;
    element.rangeType = "week" as any;

    const onChangeMock = jest.fn();

    element.addEventListener("change", onChangeMock);

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);
    const inputList = element.shadowRoot?.querySelectorAll(
      ".ant-picker-input >input"
    );
    expect(inputList).toHaveLength(2);
    expect((inputList?.[0] as HTMLInputElement)?.value).toContain("42");
    expect((inputList?.[1] as HTMLInputElement)?.value).toContain("46");
    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });

  it("should rangeType=month", async () => {
    const element = document.createElement(
      "eo-time-range-picker"
    ) as EoTimeRangePicker;
    element.value = {
      endTime: "2023-11-15",
      startTime: "2023-10-18",
    };
    element.emitChangeOnInit = true;
    element.rangeType = "month" as any;
    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);
    const inputList = element.shadowRoot?.querySelectorAll(
      ".ant-picker-input >input"
    );
    expect(inputList).toHaveLength(2);
    expect((inputList?.[0] as HTMLInputElement)?.value).toContain("10");
    expect((inputList?.[1] as HTMLInputElement)?.value).toContain("11");
    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
  it("should rangeType=quarter", async () => {
    const element = document.createElement(
      "eo-time-range-picker"
    ) as EoTimeRangePicker;
    element.value = {
      endTime: "2023-11-15",
      startTime: "2023-01-18",
    };
    element.emitChangeOnInit = true;
    element.rangeType = "quarter" as any;
    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);
    const inputList = element.shadowRoot?.querySelectorAll(
      ".ant-picker-input >input"
    );
    expect(inputList).toHaveLength(2);
    expect((inputList?.[0] as HTMLInputElement)?.value).toContain("Q1");
    expect((inputList?.[1] as HTMLInputElement)?.value).toContain("Q4");
    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
  it("should rangeType=quarter", async () => {
    const element = document.createElement(
      "eo-time-range-picker"
    ) as EoTimeRangePicker;
    element.value = {
      endTime: "2023-11-15",
      startTime: "2022-01-18",
    };
    element.emitChangeOnInit = true;
    element.rangeType = "year" as any;
    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);
    const inputList = element.shadowRoot?.querySelectorAll(
      ".ant-picker-input >input"
    );
    expect(inputList).toHaveLength(2);
    expect((inputList?.[0] as HTMLInputElement)?.value).toBe("2022");
    expect((inputList?.[1] as HTMLInputElement)?.value).toBe("2023");
    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
});
