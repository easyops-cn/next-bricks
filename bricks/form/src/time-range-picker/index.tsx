import React, { useEffect, useMemo, useState, useRef } from "react";
import { createDecorators, EventEmitter } from "@next-core/element";
import { wrapBrick } from "@next-core/react-element";
import { useCurrentTheme } from "@next-core/react-runtime";
import { FormItemElementBase, MessageBody } from "@next-shared/form";
import type { FormItem, FormItemProps } from "../form-item/index.jsx";
import { TimePicker, DatePicker, ConfigProvider, theme } from "antd";
import { StyleProvider, createCache } from "@ant-design/cssinjs";
import "@next-core/theme";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import styleText from "./styles.shadow.css";
import fixStyleText from "../time-picker/fix-style.shadow.css";
import { i18n, initializeI18n } from "@next-core/i18n";
import { K, NS, locales } from "./i18n.js";
import { omit, isEmpty, uniqueId, difference } from "lodash";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import isoWeek from "dayjs/plugin/isoWeek.js";
import advancedFormat from "dayjs/plugin/advancedFormat.js";
import quarterOfYear from "dayjs/plugin/quarterOfYear.js";
import enUS from "antd/locale/en_US.js";
import zhCN from "antd/locale/zh_CN.js";
import "dayjs/locale/zh-cn.js";

initializeI18n(NS, locales);
dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(isoWeek);
dayjs.extend(quarterOfYear);

const { defineElement, property, event } = createDecorators();
const WrappedFormItem = wrapBrick<FormItem, FormItemProps>("eo-form-item");
const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");

const INIT_TIME_RANGE: TimeRange = {
  startTime: "00:00:00",
  endTime: "23:59:59",
};

export enum presetRangeType {
  Today = "今天",
  ThisWeek = "本周",
  ThisMonth = "本月",
  ThisQuarter = "本季度",
  ThisYear = "今年",
}
export interface TimeRange {
  startTime: string;
  endTime: string;
}

type PickerType = "date" | "week" | "month" | "quarter" | "year";
type OtherPickerType = "dateTime" | "hmTime" | "time";
export type RangeType = PickerType & OtherPickerType;

export interface EoTimeRangePickerProps extends FormItemProps {
  shadowRoot?: ShadowRoot | null;
  value?: TimeRange;
  format: string;
  rangeType?: RangeType;
  placeholder?: string | [string, string];
  onChange?: (range: TimeRange) => void;
  emitChangeOnInit?: boolean;
  selectNearDays?: number;
  presetRanges?: presetRangeType[];
}
type RealTimeRangePickerProps = Omit<
  EoTimeRangePickerProps,
  keyof Omit<FormItemProps, "formElement">
>;
/**
 * 时间区间选择器
 * @author zhendonghuang
 * @category form-input-basic
 */
export
@defineElement("eo-time-range-picker", {
  styleTexts: [styleText, fixStyleText],
})
class EoTimeRangePicker extends FormItemElementBase {
  /**
   * 时间段选择器字段名
   */
  @property() accessor name: string | undefined;

  /**
   * 时间段选择器说明
   */
  @property() accessor label: string | undefined;

  /**
   *时间段选择器的初始值
   * @default { "startTime": "00:00:00", "endTime": "23:59:59" }
   */
  @property({ attribute: false }) accessor value: TimeRange | undefined;

  /**
   * 是否必填
   */
  @property({ type: Boolean }) accessor required: boolean | undefined;

  /**
   * 时间段类型
   */
  @property({ attribute: false })
  accessor rangeType: RangeType | undefined;

  /**
   * 输入框提示文字,单时间段时为string，范围时间段时为[string, string]
   */
  @property({ attribute: false })
  accessor placeholder: string | [string, string] | undefined;

  /**
   * 只有rangeType在`date` 和 `dateTime`下， 才支持只选择最近n天(当前时间向前n天)
   */
  @property({ type: Number })
  accessor selectNearDays: number | undefined;

  /**
   * @default  true
   * 是否在初始化完成后额外触发一次`time.range.change`, 这里因为历史原因之前默认行为就是在初始化后会触发该事件，这里为了兼容之前的行为，默认值只能设置为 true。
   */
  @property({ type: Boolean })
  accessor emitChangeOnInit: boolean | undefined = true;

  /**
   * @default  []
   * 预设时间范围快捷选择；设置了属性selectNearDays时，属性presetRanges不生效；属性rangeType为week时，presetRanges的值只能为本周、本月、本季度、今年，属性rangeType为month、quarter、year时，以此类推
   */
  @property({ attribute: false })
  accessor presetRanges: presetRangeType[] | undefined;

  @property({
    attribute: false,
  })
  accessor validator: ((value: any) => MessageBody | string) | undefined;

  /**
   *时间段变化时触发
   */
  @event({ type: "change" })
  accessor #changeEvent!: EventEmitter<TimeRange>;

  handleChange = (value: TimeRange): void => {
    this.value = value;
    this.#changeEvent.emit(value);
  };
  // istanbul ignore next;
  unequal = (value: TimeRange): string => {
    if (value.startTime && value.endTime && value.startTime === value.endTime) {
      return i18n.t(`${NS}:${K.START_TIME_END_TIME_CANNOT_EQUAL}`);
    }
    return "";
  };
  // istanbul ignore next;
  startTimeRequired = (value: TimeRange): string => {
    if (!value.startTime && this.required) {
      return i18n.t(`${NS}:${K.START_TIME_REQUIRED}`);
    }
    return "";
  };
  // istanbul ignore next;
  endTimeRequired = (value: TimeRange): string => {
    if (!value.endTime && this.required) {
      return i18n.t(`${NS}:${K.END_TIME_REQUIRED}`);
    }
    return "";
  };

  #builtInvalidator: ((value: any) => MessageBody | string)[] = [
    this.unequal,
    this.startTimeRequired,
    this.endTimeRequired,
  ];

  #defaultFormat = "HH:mm:ss";
  render() {
    let format = this.#defaultFormat;
    switch (this.rangeType as RangeType) {
      case "date":
        format = "YYYY-MM-DD";
        break;
      case "dateTime":
        format = `YYYY-MM-DD ${this.#defaultFormat}`;
        break;
      case "hmTime":
        format = `HH:mm`;
        break;
      case "week": //week,month,quarter,year 不设置format，使用ant.design RangePicker的默认format
        format = "";
        break;
      case "month":
        format = "";
        break;
      case "quarter":
        format = "";
        break;
      case "year":
        format = "";
        break;
    }
    return (
      <EoTimeRangePickerComponent
        curElement={this}
        formElement={this.getFormElement()}
        name={this.name}
        label={this.label}
        value={this.value}
        notRender={this.notRender}
        labelBrick={this.labelBrick}
        helpBrick={this.helpBrick}
        selectNearDays={this.selectNearDays}
        emitChangeOnInit={this.emitChangeOnInit}
        rangeType={this.rangeType}
        required={this.required}
        format={format}
        placeholder={this.placeholder}
        validator={
          (this.validator
            ? this.#builtInvalidator.concat(this.validator)
            : this.#builtInvalidator) as any
        }
        presetRanges={this.presetRanges}
        onChange={this.handleChange}
        shadowRoot={this.shadowRoot}
        needValidate={true}
        trigger="handleChange"
      />
    );
  }
}

const rangeRules = {
  date: [] as presetRangeType[],
  dateTime: [] as presetRangeType[],
  week: [presetRangeType.Today],
  month: [presetRangeType.Today, presetRangeType.ThisWeek],
  quarter: [
    presetRangeType.Today,
    presetRangeType.ThisWeek,
    presetRangeType.ThisMonth,
  ],
  year: [
    presetRangeType.Today,
    presetRangeType.ThisWeek,
    presetRangeType.ThisMonth,
    presetRangeType.ThisQuarter,
  ],
};

export function RealTimeRangePicker(
  props: RealTimeRangePickerProps
): React.ReactElement {
  const {
    value,
    selectNearDays,
    format,
    emitChangeOnInit,
    presetRanges,
    onChange,
    formElement,
    placeholder,
  } = props;
  const times = ["time", "hmTime"];
  const rangeType = props.rangeType ?? "time";
  const today = times.includes(rangeType) ? "" : dayjs().format("YYYY-MM-DD");
  const initRange = {
    startTime: today + (today ? " " : "") + INIT_TIME_RANGE.startTime,
    endTime: today + (today ? " " : "") + INIT_TIME_RANGE.endTime,
  };

  const initValue: TimeRange =
    !isEmpty(value?.startTime) || !isEmpty(value?.endTime)
      ? (value as TimeRange)
      : initRange;

  const [startTime, setStartTime] = useState(
    dayjs(initValue.startTime, format)
  );
  const [prevStartTime, setPrevStartTime] = useState(startTime?.clone());
  const [endTime, setEndTime] = useState(dayjs(initValue.endTime, format));
  const [prevEndTime, setPrevEndTime] = useState(endTime?.clone());

  const onStartTimeChange = (time: Dayjs | null, timeString: string) => {
    time && setStartTime(time);
    onChange?.({
      startTime: timeString,
      endTime: endTime?.format(format),
    });
  };

  const onEndTimeChange = (time: Dayjs | null, timeString: string) => {
    time && setEndTime(time);
    onChange?.({
      endTime: timeString,
      startTime: startTime?.format(format),
    });
  };

  useEffect(() => {
    if (emitChangeOnInit && !props.value && !formElement && onChange) {
      onChange(times.includes(rangeType) ? INIT_TIME_RANGE : initRange);
    }
  }, []);

  useEffect(() => {
    if (value?.startTime) {
      const start = dayjs(value.startTime, format || "YYYY-MM-DD");
      setStartTime(start);
      setPrevStartTime(start);
    }
    if (value?.endTime) {
      const end = dayjs(value.endTime, format || "YYYY-MM-DD");
      setEndTime(end);
      setPrevEndTime(end);
    }
  }, [value]);

  const timeRange = (
    <div className="timeRange">
      <TimePicker
        {...{ id: uniqueId("start-time-") }}
        // Currently we don't support multiple pick mode
        onChange={onStartTimeChange as any}
        getPopupContainer={(trigger) => trigger}
        value={!isEmpty(value?.startTime) ? startTime : undefined}
        format={format}
        placeholder={placeholder as string | undefined}
      />
      <span className="timeRangeSplit">~</span>
      <TimePicker
        {...{ id: uniqueId("end-time-") }}
        // Currently we don't support multiple pick mode
        onChange={onEndTimeChange as any}
        getPopupContainer={(trigger) => trigger}
        value={!isEmpty(value?.endTime) ? endTime : undefined}
        format={format}
        placeholder={placeholder as string | undefined}
      />
    </div>
  );
  const presetRangeMap = {
    [presetRangeType.Today]: {
      [i18n.t(`${NS}:${K.TODAY}`)]: [dayjs().startOf("day"), dayjs()],
    },
    [presetRangeType.ThisWeek]: {
      [i18n.t(`${NS}:${K.THIS_WEEK}`)]: [
        dayjs().startOf("week"),
        dayjs().endOf("week"),
      ],
    },
    [presetRangeType.ThisMonth]: {
      [i18n.t(`${NS}:${K.THIS_MONTH}`)]: [
        dayjs().startOf("month"),
        dayjs().endOf("month"),
      ],
    },
    [presetRangeType.ThisQuarter]: {
      [i18n.t(`${NS}:${K.THIS_QUARTER}`)]: [
        dayjs().startOf("quarter"),
        dayjs().endOf("quarter"),
      ],
    },
    [presetRangeType.ThisYear]: {
      [i18n.t(`${NS}:${K.THIS_YEAR}`)]: [
        dayjs().startOf("year"),
        dayjs().endOf("year"),
      ],
    },
  };

  const presetRange = useMemo(() => {
    const rangeResult = [];
    if (!selectNearDays && !times.includes(rangeType)) {
      const compliantRanges = difference(
        presetRanges,
        (rangeRules as any)[rangeType]
      );
      for (const i of compliantRanges) {
        const list = Object.entries(presetRangeMap[i])[0];
        rangeResult.push({ label: list[0], value: list[1] });
      }
    }
    return rangeResult;
  }, [rangeType, selectNearDays, presetRanges]);
  const rangeChange = (dates: any) => {
    setStartTime(dates?.[0]);
    setEndTime(dates?.[1]);
    onChange?.({
      startTime: dates?.[0].format(format || "YYYY-MM-DD"), //week,month,quarter,year 的format为""，比如rangeType为quarter，直接返回2022-Q3的这种格式的数据，目前看起来还不是平台通用的，还是先默认转换成"YYYY-MM-DD"
      endTime: dates?.[1].format(format || "YYYY-MM-DD"),
    });
  };

  const needConfirm = useRef(false);
  const onOpenChange = (open: boolean) => {
    if (!open && needConfirm.current) {
      setStartTime(prevStartTime);
      setEndTime(prevEndTime);
    } else {
      needConfirm.current = true;
    }
  };

  const rangeOk = (selectedTime: any) => {
    needConfirm.current = false;
    const dates = selectedTime as [Dayjs, Dayjs];
    setPrevStartTime(dates?.[0]?.clone());
    setPrevEndTime(dates?.[1]?.clone());
  };

  const disabledDate = (current: Dayjs) => {
    if (!selectNearDays) {
      return false;
    }
    const tooSelectNearDays =
      current <= dayjs().subtract(selectNearDays, "days") ||
      current > dayjs().endOf("day");
    return !!tooSelectNearDays;
  };

  // Memoize the picker value
  const pickerValue = useMemo(() => {
    return (
      !isEmpty(value?.startTime) || !isEmpty(value?.endTime)
        ? [startTime, endTime]
        : []
    ) as any;
  }, [endTime, startTime, value?.endTime, value?.startTime]);

  const dateRange = (
    <DatePicker.RangePicker
      style={{ width: 400 }}
      showTime={(rangeType as RangeType) === "dateTime"}
      picker={(rangeType as RangeType) === "dateTime" ? "date" : rangeType}
      value={pickerValue}
      presets={presetRange as any}
      format={format}
      onChange={rangeChange}
      onOpenChange={onOpenChange}
      onOk={rangeOk}
      disabledDate={disabledDate}
      placeholder={placeholder as [string, string] | undefined}
      separator={"~"}
      getPopupContainer={(trigger) => trigger}
      suffixIcon={<WrappedIcon icon="calendar" lib="easyops" />}
    />
  );
  const range = times.includes(rangeType) ? timeRange : dateRange;

  return <div>{range}</div>;
}

export function EoTimeRangePickerComponent(props: EoTimeRangePickerProps) {
  const currentTheme = useCurrentTheme();
  const locale =
    i18n.language && i18n.language.split("-")[0] === "en" ? enUS : zhCN;

  const cahce = useMemo(() => {
    return createCache();
  }, []);
  return (
    <WrappedFormItem
      exportparts="message"
      {...(omit(props, ["shadowRoot"]) as any)}
    >
      <ConfigProvider
        locale={locale as any}
        theme={{
          algorithm:
            currentTheme === "dark-v2"
              ? theme.darkAlgorithm
              : theme.defaultAlgorithm,
        }}
      >
        <StyleProvider container={props.shadowRoot as ShadowRoot} cache={cahce}>
          <div
            onChange={(e) => {
              e.stopPropagation();
            }}
          >
            <RealTimeRangePicker
              format={props.format}
              value={props.value}
              rangeType={props.rangeType}
              onChange={props.onChange}
              emitChangeOnInit={props.emitChangeOnInit}
              selectNearDays={props.selectNearDays}
              presetRanges={props.presetRanges}
              formElement={props.formElement}
              placeholder={props.placeholder}
            />
          </div>
        </StyleProvider>
      </ConfigProvider>
    </WrappedFormItem>
  );
}
