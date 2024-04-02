import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  CSSProperties,
} from "react";
import { createDecorators, EventEmitter } from "@next-core/element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import { wrapBrick } from "@next-core/react-element";
import { DatePicker, ConfigProvider, theme } from "antd";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import { StyleProvider, createCache } from "@ant-design/cssinjs";
import { useCurrentTheme } from "@next-core/react-runtime";
import { FormItemElementBase } from "@next-shared/form";
import type { FormItem, FormItemProps } from "../form-item/index.jsx";
import { i18n, initializeI18n } from "@next-core/i18n";
import { K, NS, locales } from "./i18n.js";
import { omit } from "lodash";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import enUS from "antd/locale/en_US.js";
import zhCN from "antd/locale/zh_CN.js";
import isoWeek from "dayjs/plugin/isoWeek.js";
import advancedFormat from "dayjs/plugin/advancedFormat.js";
import quarterOfYear from "dayjs/plugin/quarterOfYear.js";
import "dayjs/locale/zh-cn.js";
import classNames from "classnames";
import { DisabledDateType, PickerMode, DisabledDate } from "../interface.js";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import moment from "moment";

initializeI18n(NS, locales);
dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(isoWeek);
dayjs.extend(quarterOfYear);

interface InternalStateDatePickerProps {
  placeholder?: string;
  value?: Dayjs;
  showTime?: boolean;
  inputStyle?: React.CSSProperties;
  format?: string;
  picker?: PickerMode;
  disabledDate?: DisabledDateType;
  useFastSelectBtn?: boolean;
  futureDateDisabled?: boolean;
  disabled?: boolean;
  onChange?: (value: Dayjs | null, dateString: string) => void;
  onOk?: (date: Dayjs) => void;
}

interface EoDatePickerProps
  extends Omit<InternalStateDatePickerProps, "value" | "onChange" | "onOk">,
    FormItemProps {
  shadowRoot: ShadowRoot | null;
  value?: string;
  onChange?: (value: string) => void;
  onOk?: (value: string) => void;
}

interface FieldSetAndRanges {
  fieldSet: Set<number>;
  ranges: [number, number][];
}
type PickerModeMap = {
  [K in PickerMode]: string[];
};

const { defineElement, property, event } = createDecorators();
const WrappedFormItem = wrapBrick<FormItem, FormItemProps>("eo-form-item");
const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");

/**
 * 日期选择器
 * @author zhendonghuang
 * @category form-input-basic
 */
export
@defineElement("eo-date-picker", {
  styleTexts: [styleText],
})
class EoDatePicker extends FormItemElementBase {
  /**
   * 日期选择器字段名
   */
  @property() accessor name: string | undefined;
  /**
   * 日期选择器说明
   */
  @property() accessor label: string | undefined;

  /**
   *日期选择器的初始值
   */
  @property() accessor value: string | undefined;

  /**
   * 日期选择器占位说明
   */
  @property()
  accessor placeholder: string | undefined;

  /**
   * 校验文本信息
   */
  @property({ attribute: false })
  accessor message: Record<string, string> | undefined;

  /**
   * 是否禁用
   */
  @property({ type: Boolean }) accessor disabled: boolean | undefined;

  /**
   * 是否必填
   */
  @property({ type: Boolean }) accessor required: boolean | undefined;

  /**
   * 是否显示时间, 当设为 `true` 时, 请同时设置 `format` 为 `YYYY-MM-DD HH:mm:ss` 使其也显示具体时，分，秒 的时间
   */
  @property({
    type: Boolean,
  })
  accessor showTime: boolean | undefined;

  /**
   * 显示预览的格式，具体配置参考 [dayjs](https://day.js.org/docs/zh-CN/display/format#%E6%94%AF%E6%8C%81%E7%9A%84%E6%A0%BC%E5%BC%8F%E5%8C%96%E5%8D%A0%E4%BD%8D%E7%AC%A6%E5%88%97%E8%A1%A8)，注意，这里并非是定义给后台的数据格式，给后台的数据格式定义请参考 `general-form` 构件的 [valueTypes](developers/brick-book/brick/forms.general-form) 属性
   */
  @property()
  accessor format: string | undefined;

  /**
   * 设置选择器类型
   */
  @property({ attribute: false })
  accessor picker: PickerMode | undefined;

  /**
   * 不可选择未来日期,优先级高于disabledDate
   */
  @property({ type: Boolean })
  accessor futureDateDisabled: boolean | undefined;

  /**
   * 不可选择的日期
   */
  @property({ attribute: false })
  accessor disabledDate: DisabledDateType | undefined;

  /**
   *快速选项
   */
  @property({ type: Boolean })
  accessor useFastSelectBtn: boolean | undefined;

  /**
   * 输入框样式
   */
  @property({
    attribute: false,
  })
  accessor inputStyle: CSSProperties | undefined;

  /**
   *日期变化时触发
   */
  @event({ type: "change" })
  accessor #changeEvent!: EventEmitter<string>;

  /**
   *点击确定按钮触发（showTime 为 true 使用）
   */
  @event({ type: "ok" })
  accessor #okEvent!: EventEmitter<string>;

  handleChange = (value: string): void => {
    this.value = value;
    this.#changeEvent.emit(value);
  };
  #handleOk = (value: string): void => {
    this.#okEvent.emit(value);
  };
  render() {
    return (
      <EoDatePickerComponent
        curElement={this}
        formElement={this.getFormElement()}
        shadowRoot={this.shadowRoot}
        label={this.label}
        name={this.name}
        value={this.value}
        message={this.message}
        required={this.required}
        placeholder={this.placeholder}
        labelBrick={this.labelBrick}
        helpBrick={this.helpBrick}
        inputStyle={this.inputStyle}
        disabled={this.disabled}
        disabledDate={this.disabledDate}
        notRender={this.notRender}
        futureDateDisabled={this.futureDateDisabled}
        picker={this.picker}
        format={this.format}
        showTime={this.showTime}
        onChange={this.handleChange}
        trigger={"handleChange"}
        onOk={this.#handleOk}
        useFastSelectBtn={this.useFastSelectBtn}
      />
    );
  }
}

const getFieldSetAndRanges = (
  expression?: string | number
): FieldSetAndRanges => {
  const fieldSet = new Set<number>();
  const ranges: [number, number][] = [];
  `${expression}`.split(",").forEach((part) => {
    if (part.includes("-")) {
      const range = part.split("-").map((v) => Number(v)) as [number, number];
      ranges.push(range);
    } else if (part.trim() !== "" && !Number.isNaN(Number(part))) {
      fieldSet.add(Number(part));
    }
  });
  return { fieldSet, ranges };
};

const isInFieldSetOrRanges = (
  cur: number,
  fieldSetAndRanges: FieldSetAndRanges
): boolean => {
  const { fieldSet, ranges } = fieldSetAndRanges;
  return fieldSet.size === 0 && ranges.length === 0
    ? true
    : fieldSet.has(cur) ||
        ranges.some(([min, max]) => cur >= min && cur <= max);
};

const isEmptyFieldSetOrRanges = (
  fieldSetAndRanges: FieldSetAndRanges
): boolean => {
  const { fieldSet, ranges } = fieldSetAndRanges;
  return fieldSet.size === 0 && ranges.length === 0;
};

const getFieldsFromFieldSetAndRanges = (
  fieldSetAndRanges: FieldSetAndRanges
): number[] => {
  const { fieldSet, ranges } = fieldSetAndRanges;
  let fields = [...fieldSet];
  ranges.forEach(([min, max]) => {
    fields = fields.concat([...Array(max + 1).keys()].slice(min));
  });
  return [...new Set(fields)];
};

export function InternalStateDatePicker(
  props: InternalStateDatePickerProps
): React.ReactElement {
  const {
    picker,
    format,
    showTime,
    inputStyle,
    disabledDate,
    futureDateDisabled,
    useFastSelectBtn,
    placeholder,
    disabled,
    onChange,
    onOk,
  } = props;

  const [value, setValue] = useState(props.value);
  const [confirmDisabled, setConfirmDisabled] = useState(false);
  const crontab = useMemo(() => {
    if (!disabledDate) {
      return [];
    }
    return ([] as DisabledDate[]).concat(disabledDate).map((item) => {
      const { second, minute, hour, date, month, weekday, year } = item;
      const hourFieldSetAndRanges = getFieldSetAndRanges(hour);
      const minuteFieldSetAndRanges = getFieldSetAndRanges(minute);
      const secondFieldSetAndRanges = getFieldSetAndRanges(second);
      const yearFieldSetAndRanges = getFieldSetAndRanges(year);
      const monthFieldSetAndRanges = getFieldSetAndRanges(month);
      const dateFieldSetAndRanges = getFieldSetAndRanges(date);
      const weekFieldSetAndRanges = getFieldSetAndRanges(weekday);
      return {
        fields: {
          hour: hourFieldSetAndRanges,
          minute: minuteFieldSetAndRanges,
          second: secondFieldSetAndRanges,
          year: yearFieldSetAndRanges,
          month: monthFieldSetAndRanges,
          date: dateFieldSetAndRanges,
          weekday: weekFieldSetAndRanges,
        },
        isAllDate:
          isEmptyFieldSetOrRanges(yearFieldSetAndRanges) &&
          isEmptyFieldSetOrRanges(monthFieldSetAndRanges) &&
          isEmptyFieldSetOrRanges(dateFieldSetAndRanges) &&
          isEmptyFieldSetOrRanges(weekFieldSetAndRanges),
        isAllTime:
          isEmptyFieldSetOrRanges(hourFieldSetAndRanges) &&
          isEmptyFieldSetOrRanges(minuteFieldSetAndRanges) &&
          isEmptyFieldSetOrRanges(secondFieldSetAndRanges),
      };
    });
  }, [disabledDate]);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  const handleDisabledDate = (date: Dayjs): boolean => {
    const curYear = date.year();
    const curMonth = date.month() + 1;
    const curDate = date.date();
    const curWeekday = date.isoWeekday();
    return crontab.some((cron) => {
      const { isAllDate, isAllTime, fields } = cron;
      //没有限制日期或限制了时分秒，则该日可选
      if (isAllDate || !isAllTime) {
        return false;
      }
      const { year, month, weekday, date } = fields;
      return (
        isInFieldSetOrRanges(curYear, year) &&
        isInFieldSetOrRanges(curMonth, month) &&
        isInFieldSetOrRanges(curWeekday, weekday) &&
        isInFieldSetOrRanges(curDate, date)
      );
    });
  };

  const handleDisabledFutureDate = (date: Dayjs): boolean => {
    return date && date > dayjs();
  };

  const handleDisabledTime = (date: Dayjs | null) => {
    if (!date) return;
    const curYear = date.year();
    const curMonth = date.month() + 1;
    const curDate = date.date();
    const curWeekday = date.isoWeekday();
    const curHour = date.hour();
    const curMinute = date.minute();
    const currentSecond = date.second();
    let disabledHours: number[] = [];
    let disabledMinutes: number[] = [];
    let disabledSeconds: number[] = [];
    let matchCurDate = false;
    crontab.forEach((cron) => {
      const { isAllTime, fields } = cron;
      //时分秒都没输入，则所有时间都可选
      if (isAllTime) return;
      const { hour, minute, second, year, month, weekday, date } = fields;
      const isMatchDate =
        isInFieldSetOrRanges(curYear, year) &&
        isInFieldSetOrRanges(curMonth, month) &&
        isInFieldSetOrRanges(curWeekday, weekday) &&
        isInFieldSetOrRanges(curDate, date);
      matchCurDate =
        matchCurDate ||
        (isMatchDate &&
          isInFieldSetOrRanges(curHour, hour) &&
          isInFieldSetOrRanges(curMinute, minute) &&
          isInFieldSetOrRanges(currentSecond, second));
      if (isMatchDate) {
        const hourFields = isEmptyFieldSetOrRanges(hour)
          ? [...Array(24).keys()]
          : getFieldsFromFieldSetAndRanges(hour);
        const minuteFields = isEmptyFieldSetOrRanges(minute)
          ? [...Array(60).keys()]
          : getFieldsFromFieldSetAndRanges(minute);
        const secondFields = isEmptyFieldSetOrRanges(second)
          ? [...Array(60).keys()]
          : getFieldsFromFieldSetAndRanges(second);
        // 当前在禁止小时里
        if (isInFieldSetOrRanges(curHour, hour)) {
          // 当前在禁止分钟里
          if (isInFieldSetOrRanges(curMinute, minute)) {
            disabledSeconds = disabledSeconds.concat([...secondFields]);
          }
          // 秒全禁用则对应分钟也禁用
          if (secondFields.length === 60) {
            disabledMinutes = disabledMinutes.concat([...minuteFields]);
          }
        }
        // 分全禁用则对应小时也禁用
        if (minuteFields.length === 60 && secondFields.length === 60) {
          disabledHours = disabledHours.concat([...hourFields]);
        }
      }
    });
    setConfirmDisabled(matchCurDate);
    return {
      disabledHours: () => disabledHours,
      disabledMinutes: () => disabledMinutes,
      disabledSeconds: () => disabledSeconds,
    };
  };

  const isDatePicker = picker === "date";
  const isQuarterPicker = picker === "quarter";

  const PickerBtn = useCallback(() => {
    const strMap: PickerModeMap = {
      date: [
        i18n.t(`${NS}:${K.LAST_DAY}`),
        i18n.t(`${NS}:${K.TODAY}`),
        i18n.t(`${NS}:${K.NEXT_DAY}`),
      ],
      week: [
        i18n.t(`${NS}:${K.LAST_WEEK}`),
        i18n.t(`${NS}:${K.THIS_WEEK}`),
        i18n.t(`${NS}:${K.NEXT_WEEK}`),
      ],
      month: [
        i18n.t(`${NS}:${K.LAST_MONTH}`),
        i18n.t(`${NS}:${K.THIS_MONTH}`),
        i18n.t(`${NS}:${K.NEXT_MONTH}`),
      ],
      quarter: [
        i18n.t(`${NS}:${K.LAST_QUARTER}`),
        i18n.t(`${NS}:${K.THIS_QUARTER}`),
        i18n.t(`${NS}:${K.NEXT_QUARTER}`),
      ],
      year: [
        i18n.t(`${NS}:${K.LAST_YEAR}`),
        i18n.t(`${NS}:${K.THIS_YEAR}`),
        i18n.t(`${NS}:${K.NEXT_YEAR}`),
      ],
    };
    const strs = strMap[picker as PickerMode];
    const currentDate = value || dayjs();
    const handlePreTime = () => {
      let preDate: Dayjs;
      switch (picker) {
        case "date":
          preDate = currentDate.clone().subtract(1, "days");
          break;
        case "week":
          preDate = currentDate.clone().subtract(1, "weeks");
          break;
        case "month":
          preDate = currentDate.clone().subtract(1, "months");
          break;
        case "quarter":
          preDate = currentDate.clone().subtract(1, "quarters");
          break;
        case "year":
          preDate = currentDate.clone().subtract(1, "years");
          break;
        default:
          preDate = currentDate;
          break;
      }
      onChange?.(preDate, dayjs(preDate).format(format));
      setValue(preDate);
    };
    const handleCurTime = () => {
      let curDate: Dayjs;
      switch (picker) {
        case "date":
          curDate = dayjs();
          break;
        case "week":
          curDate = dayjs().startOf("week");
          break;
        case "month":
          curDate = dayjs();
          break;
        case "quarter":
          curDate = dayjs().startOf("quarter");
          break;
        case "year":
          curDate = dayjs();
          break;
        default:
          curDate = currentDate;
          break;
      }
      onChange?.(curDate, dayjs(curDate).format(format));
      setValue(curDate);
    };
    const handleNextTime = () => {
      let nextDate: Dayjs;
      switch (picker) {
        case "date":
          nextDate = currentDate.clone().add(1, "days");
          break;
        case "week":
          nextDate = currentDate.clone().add(1, "weeks");
          break;
        case "month":
          nextDate = currentDate.clone().add(1, "months");
          break;
        case "quarter":
          nextDate = currentDate.clone().add(1, "quarters");
          break;
        case "year":
          nextDate = currentDate.clone().add(1, "years");
          break;
        default:
          nextDate = currentDate;
          break;
      }
      onChange?.(nextDate, dayjs(nextDate).format(format));
      setValue(nextDate);
    };

    return (
      <div
        className={classNames("pickerBtnWrap", {
          disabledFastSelect: disabled,
        })}
      >
        <div className={classNames("pre")} onClick={() => handlePreTime()}>
          <LeftOutlined rev="" />
          <span>{strs[0]}</span>
        </div>
        <div className="current" onClick={() => handleCurTime()}>
          {strs[1]}
        </div>
        <div
          className={classNames({
            next: true,
            nextDisabled:
              futureDateDisabled &&
              handleDisabledFutureDate(
                currentDate
                  .clone()
                  .add(1, picker === "date" ? "days" : (picker as any))
              ),
          })}
          onClick={() => handleNextTime()}
        >
          <span>{strs[2]}</span>
          <RightOutlined rev="" />
        </div>
      </div>
    );
  }, [value, picker, futureDateDisabled]);

  const cellRender = useCallback(
    (
      current: string | number | Dayjs,
      info: { originNode: React.ReactElement }
    ) => {
      const quarterMap = {
        1: i18n.t(`${NS}:${K.FISRT_QUARTER}`),
        2: i18n.t(`${NS}:${K.SECOND_QUARTER}`),
        3: i18n.t(`${NS}:${K.THIRD_QUARTER}`),
        4: i18n.t(`${NS}:${K.FOURTH_QUARTER}`),
      };
      const selectedQuarter: number = dayjs(value).quarter();
      const currentQuarter: number = dayjs(current).quarter();
      return picker === "quarter" ? (
        <div
          className={classNames("quarterContent", {
            selectedQuarter: selectedQuarter === currentQuarter,
          })}
        >
          {quarterMap[currentQuarter as keyof typeof quarterMap]}
        </div>
      ) : (
        info.originNode
      );
    },
    [value, picker]
  );

  return (
    <div
      className="pickerWrap"
      onChange={(e) => {
        e.stopPropagation();
      }}
    >
      <DatePicker
        cellRender={(current, info: { originNode: React.ReactElement }) => {
          return cellRender(current, info);
        }}
        value={value}
        getPopupContainer={(trigger) => trigger}
        popupClassName={classNames({
          quarterPicker: isQuarterPicker,
          confirmDisabled: confirmDisabled,
        })}
        format={format}
        showTime={isDatePicker ? showTime : undefined}
        // Currently we don't support multiple pick mode
        onChange={onChange as any}
        style={inputStyle}
        placeholder={placeholder}
        onOk={onOk}
        suffixIcon={<WrappedIcon icon="calendar" lib="easyops" />}
        picker={picker}
        disabledDate={
          (futureDateDisabled && handleDisabledFutureDate) ||
          (disabledDate && handleDisabledDate)
        }
        disabledTime={disabledDate && (handleDisabledTime as any)}
        disabled={disabled}
      />
      {useFastSelectBtn && <PickerBtn />}
    </div>
  );
}

export function EoDatePickerComponent(
  props: EoDatePickerProps
): React.ReactElement {
  const { picker = "date", ...restProps } = props;

  const PickerFormatMap = {
    date: "YYYY-MM-DD",
    week: "gggg-ww周",
    month: "YYYY-MM月",
    quarter: "YYYY-第Q季度",
    year: "YYYY",
  };
  const currentTheme = useCurrentTheme();
  const locale =
    i18n.language && i18n.language.split("-")[0] === "en" ? enUS : zhCN;
  const isDatePicker = picker === "date";
  const format = props.format || PickerFormatMap[picker];

  const handleChange = (date: Dayjs | null, dateString: string): void => {
    props.onChange?.(dateString);
  };

  const handleOk = (date: Dayjs): void => {
    props.onOk?.(date?.format(props.format));
  };
  const cahce = useMemo(() => {
    return createCache();
  }, []);

  const value: Dayjs | undefined = useMemo(() => {
    const parseValue = props.value;
    if (parseValue) {
      if (!props.format && (picker === "week" || picker === "quarter")) {
        //dayjs目前不支持解析gggg-ww周、YYYY-第Q季度格式的输入
        return dayjs(moment(parseValue, format).format());
      } else {
        return dayjs(parseValue, format);
      }
    }
  }, [props.value, format]);

  return (
    <WrappedFormItem {...(omit(props, ["shadowRoot"]) as any)}>
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
          <InternalStateDatePicker
            {...restProps}
            value={value}
            format={format}
            onChange={handleChange}
            onOk={isDatePicker ? handleOk : undefined}
            picker={picker}
          />
        </StyleProvider>
      </ConfigProvider>
    </WrappedFormItem>
  );
}
