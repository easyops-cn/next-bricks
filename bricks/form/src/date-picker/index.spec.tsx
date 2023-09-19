import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./";
import { EoDatePicker } from "./index.js";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat.js";
dayjs.extend(advancedFormat);

jest.mock("@next-core/theme", () => ({}));

describe("eo-date-picker", () => {
  it("should work ", async () => {
    const element = document.createElement("eo-date-picker") as EoDatePicker;
    const mockChange = jest.fn();
    element.useFastSelectBtn = true;
    element.value = "2019-10-01";
    element.futureDateDisabled = true;
    element.addEventListener("change", mockChange);
    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);
    const input = element.shadowRoot?.querySelector(
      "input"
    ) as HTMLInputElement;
    const nextBtn = element.shadowRoot?.querySelector(".next");
    act(() => {
      (nextBtn as HTMLElement).click();
    });
    expect(input.value).toBe("2019-10-02");

    act(() => {
      (element.shadowRoot?.querySelector(".pre") as HTMLElement).click();
    });
    expect(input.value).toBe("2019-10-01");

    act(() => {
      (element.shadowRoot?.querySelector(".current") as HTMLElement).click();
    });
    expect(input.value).toBe(dayjs().format("YYYY-MM-DD"));

    act(() => {
      (element.shadowRoot?.querySelector(".ant-picker") as HTMLElement).click();
    });

    act(() => {
      (
        element.shadowRoot?.querySelector(
          ".ant-picker-today-btn"
        ) as HTMLElement
      ).click();
    });

    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
  it("should work week", async () => {
    const element = document.createElement("eo-date-picker") as EoDatePicker;
    element.useFastSelectBtn = true;
    element.value = "2019-41周";
    element.picker = "week";
    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);
    const input = element.shadowRoot?.querySelector(
      "input"
    ) as HTMLInputElement;
    const nextBtn = element.shadowRoot?.querySelector(".next") as HTMLElement;
    act(() => {
      nextBtn.click();
    });
    expect(input.value).toBe("2019-42周");

    act(() => {
      (element.shadowRoot?.querySelector(".pre") as HTMLElement).click();
    });
    expect(input.value).toBe("2019-41周");

    act(() => {
      (element.shadowRoot?.querySelector(".current") as HTMLElement).click();
    });
    expect(input.value).toBe(dayjs().format("gggg-ww周"));

    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
  it("should work month", async () => {
    const element = document.createElement("eo-date-picker") as EoDatePicker;
    element.useFastSelectBtn = true;
    element.value = "2019-02月";
    element.picker = "month";
    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);
    const input = element.shadowRoot?.querySelector(
      "input"
    ) as HTMLInputElement;
    const nextBtn = element.shadowRoot?.querySelector(".next") as HTMLElement;
    act(() => {
      nextBtn.click();
    });
    expect(input.value).toBe("2019-03月");

    act(() => {
      (element.shadowRoot?.querySelector(".pre") as HTMLElement).click();
    });
    expect(input.value).toBe("2019-02月");

    act(() => {
      (element.shadowRoot?.querySelector(".current") as HTMLElement).click();
    });
    expect(input.value).toBe(dayjs().format("YYYY-MM月"));

    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
  it("should work quarter", async () => {
    const element = document.createElement("eo-date-picker") as EoDatePicker;
    element.useFastSelectBtn = true;
    element.value = "2019-第一季度";
    element.picker = "quarter";
    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);
    const input = element.shadowRoot?.querySelector(
      "input"
    ) as HTMLInputElement;
    const nextBtn = element.shadowRoot?.querySelector(".next") as HTMLElement;

    act(() => {
      (element.shadowRoot?.querySelector(".ant-picker") as HTMLElement).click();
    });
    expect(element.shadowRoot?.querySelector(".quarterContent"));

    act(() => {
      nextBtn.click();
    });
    expect(input.value).toBe("2019-第2季度");

    act(() => {
      (element.shadowRoot?.querySelector(".pre") as HTMLElement).click();
    });
    expect(input.value).toBe("2019-第1季度");

    act(() => {
      (element.shadowRoot?.querySelector(".current") as HTMLElement).click();
    });
    expect(input.value).toBe(dayjs().format("YYYY-第Q季度"));

    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
  it("should work year", async () => {
    const element = document.createElement("eo-date-picker") as EoDatePicker;
    element.useFastSelectBtn = true;
    element.value = "2019";
    element.picker = "year";
    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);
    const input = element.shadowRoot?.querySelector(
      "input"
    ) as HTMLInputElement;
    const nextBtn = element.shadowRoot?.querySelector(".next") as HTMLElement;
    act(() => {
      nextBtn.click();
    });
    expect(input.value).toBe("2020");

    act(() => {
      (element.shadowRoot?.querySelector(".pre") as HTMLElement).click();
    });
    expect(input.value).toBe("2019");

    act(() => {
      (element.shadowRoot?.querySelector(".current") as HTMLElement).click();
    });
    expect(input.value).toBe(dayjs().format("YYYY"));

    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
  describe("test disabled", () => {
    it("should work when  disabledDate is Object", () => {
      const element = document.createElement("eo-date-picker") as EoDatePicker;
      element.useFastSelectBtn = true;
      element.disabledDate = {
        weekday: 4,
      };
      expect(element.shadowRoot).toBeFalsy();

      act(() => {
        document.body.appendChild(element);
      });
      expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

      act(() => {
        (
          element.shadowRoot?.querySelector(".ant-picker") as HTMLElement
        ).click();
      });

      expect(
        element.shadowRoot?.querySelectorAll(
          ".ant-picker-cell-in-view.ant-picker-cell-disabled"
        )
      ).toHaveLength(4);
      expect(
        element.shadowRoot?.querySelectorAll(
          ".ant-picker-time-panel-cell-disabled"
        )
      ).toHaveLength(0);

      act(() => {
        document.body.removeChild(element);
      });
      expect(document.body.contains(element)).toBeFalsy();
    });
    it("should work when  disabledDate is Array", () => {
      const element = document.createElement("eo-date-picker") as EoDatePicker;
      element.useFastSelectBtn = true;
      element.disabledDate = [
        {
          weekday: 4,
          month: "1-12",
        },
        {
          date: "1-2,3",
        },
        {
          date: "1-5,4-7,3-10,10",
          year: "1970",
        },
      ];
      expect(element.shadowRoot).toBeFalsy();

      act(() => {
        document.body.appendChild(element);
      });
      expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

      act(() => {
        (
          element.shadowRoot?.querySelector(".ant-picker") as HTMLElement
        ).click();
      });

      expect(
        element.shadowRoot?.querySelectorAll(
          ".ant-picker-cell-in-view.ant-picker-cell-disabled"
        )
      ).toHaveLength(7);
      expect(
        element.shadowRoot?.querySelectorAll(
          ".ant-picker-time-panel-cell-disabled"
        )
      ).toHaveLength(0);

      act(() => {
        document.body.removeChild(element);
      });
      expect(document.body.contains(element)).toBeFalsy();
    });
    it("while disabledDate set time", () => {
      const element = document.createElement("eo-date-picker") as EoDatePicker;
      element.useFastSelectBtn = true;
      element.value = "2019-10-01 10:11:00";
      element.showTime = true;
      element.format = "YYYY-MM-DD HH:mm:ss";
      element.disabledDate = [
        {
          date: 1,
          second: "10-14,15-19",
        },
        {
          date: 1,
          hour: "10",
          minute: "10-15,13",
          second: "22-23,20-25",
        },
        {
          date: 2,
          second: "0-59",
        },
      ];
      expect(element.shadowRoot).toBeFalsy();

      act(() => {
        document.body.appendChild(element);
      });
      expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

      act(() => {
        (
          element.shadowRoot?.querySelector(".ant-picker") as HTMLElement
        ).click();
      });

      const hourColumn = element.shadowRoot?.querySelectorAll(
        ".ant-picker-time-panel-column"
      )[0];
      const minuteColumn = element.shadowRoot?.querySelectorAll(
        ".ant-picker-time-panel-column"
      )[1];
      const secondColumn = element.shadowRoot?.querySelectorAll(
        ".ant-picker-time-panel-column"
      )[2];
      expect(
        element.shadowRoot?.querySelectorAll(
          ".ant-picker-cell-in-view.ant-picker-cell-disabled"
        )
      ).toHaveLength(0);
      expect(
        hourColumn?.querySelectorAll(".ant-picker-time-panel-cell-disabled")
      ).toHaveLength(0);
      expect(
        minuteColumn?.querySelectorAll(".ant-picker-time-panel-cell-disabled")
      ).toHaveLength(0);
      expect(
        secondColumn?.querySelectorAll(".ant-picker-time-panel-cell-disabled")
      ).toHaveLength(16);
      act(() => {
        document.body.removeChild(element);
      });
      expect(document.body.contains(element)).toBeFalsy();
    });
  });
});
