import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import { isNil } from "lodash";
import moment from "moment";

export declare const humanizeTime: (
  time: moment.MomentInput,
  format?: HumanizeTimeFormat
) => string | null;
export declare const costTime: (cost: number, start?: any, end?: any) => string;

export declare enum HumanizeTimeFormat {
  full = "full",
  default = "default",
  relative = "relative",
  future = "future",
  accurate = "accurate",
  auto = "auto",
}

export interface LinkInfo {
  detailUrlTemplate: string;
  target?: string;
}

export interface EoHumanizeTimeProps {
  value: number | string;
  isMicrosecond?: boolean;
  formatter?: HumanizeTimeFormat;
  isCostTime?: boolean;
  inputFormat?: string;
  outputFormat?: string;
  link?: LinkInfo;
}

const { defineElement, property } = createDecorators();

/**
 * 构件 `eo-humanize-time`
 */
export
@defineElement("eo-humanize-time", {
  styleTexts: [styleText],
})
class EoHumanizeTime extends ReactNextElement {
  /**
   * 时间截，或字符串，当为字符串时，应提供时间格式 `inputFormat`
   * @requires true
   */
  @property({
    attribute: false,
  })
  accessor value: number | string;

  /**
   * 字符串的时间格式，如 "YYYY-MM-DD", [时间格式参照表](https://dayjs.gitee.io/docs/zh-CN/parse/string-format)
   */
  @property()
  accessor inputFormat: string;

  /**
   * 展示时间格式，如 "YYYY-MM-DD"，当设置该属性时，属性 `formatter` 无效 [时间格式参照表](https://dayjs.gitee.io/docs/zh-CN/parse/string-format)
   */
  @property()
  accessor outputFormat: string;

  /**
   * 是否展示为耗费时间，例如：'1 个月 20 天'
   */
  @property({
    type: Boolean,
  })
  accessor isCostTime: boolean;

  connectedCallback(): void {
    // istanbul ignore else
    if (!this.style.display) {
      this.style.display = "block";
    }
    super.connectedCallback();
  }

  /**
   * 枚举值：full, default, relative, future, accurate, auto [类型链接](https://github.com/easyops-cn/next-libs/blob/207fe7ee3ac010ab860c23cd062216c8ca612f0c/libs/datetime/src/humanizeTime.ts#L9)
   * @default "default"
   */
  @property({
    attribute: false,
  })
  accessor formatter: HumanizeTimeFormat;

  /**
   * value 值的单位是否为毫秒
   */
  @property({
    type: Boolean,
  })
  accessor isMicrosecond: boolean;

  /**
   * 跳转链接，默认为空
   */
  @property({
    attribute: false,
  })
  accessor link: LinkInfo;

  render() {
    return (
      <HumanizeTimeComponent
        value={this.value}
        formatter={this.formatter}
        isMicrosecond={this.isMicrosecond}
        isCostTime={this.isCostTime}
        link={this.link}
        inputFormat={this.inputFormat}
        outputFormat={this.outputFormat}
      />
    );
  }
}

export function BrickLink({
  url,
}: {
  url: string;
  target: string;
  label: string;
}) {
  return <span>{url}</span>;
}

export function HumanizeTimeComponent({
  value,
  isMicrosecond,
  inputFormat,
  outputFormat,
  isCostTime,
  formatter,
  link,
}: EoHumanizeTimeProps) {
  if (isNil(value)) {
    return <span>-</span>;
  }

  let ts;
  if (typeof value === "number") {
    ts = isMicrosecond ? value : Number(value) * 1000;
  } else {
    const time = moment(value, inputFormat);
    ts = time.unix() * 1000;
  }

  let label: string;
  if (outputFormat) {
    label = moment(ts).format(outputFormat);
  } else {
    label = isCostTime
      ? costTime(ts)
      : humanizeTime(ts, HumanizeTimeFormat[formatter]);
  }

  if (link) {
    return (
      <BrickLink
        url={link.detailUrlTemplate}
        target={link.target}
        label={label}
      />
    );
  }

  return <span>{label}</span>;
}
