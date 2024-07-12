import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import { isNil } from "lodash";
import moment from "moment";
import type { Link, LinkProps } from "@next-bricks/basic/link";
import { Target } from "../interface.js";
import {
  costTime,
  humanizeTime,
  HumanizeTimeFormat,
} from "@next-shared/datetime";

export interface LinkInfo {
  url: string;
  target?: Target;
}

export interface EoHumanizeTimeProps {
  value: number | string;
  isMillisecond?: boolean;
  formatter?: HumanizeTimeFormat;
  isCostTime?: boolean;
  inputFormat?: string;
  outputFormat?: string;
  type?: "datetime" | "date";
  link?: LinkInfo;
}

const { defineElement, property } = createDecorators();

const WrappedLink = wrapBrick<Link, LinkProps>("eo-link");

/**
 * 人性化时间展示，可显示完整时间、相对时间、未来时间、耗时等，支持自定义输入值格式和输出格式。
 */
export
@defineElement("eo-humanize-time", {
  styleTexts: [styleText],
  alias: ["presentational.humanize-time"],
})
class EoHumanizeTime extends ReactNextElement {
  /**
   * 时间截，或字符串，当为字符串时，应提供时间格式 `inputFormat`
   * @required
   */
  @property({
    attribute: false,
  })
  accessor value: number | string;

  /**
   * 字符串的时间格式，如 "YYYY-MM-DD", [时间格式参照表](https://day.js.org/docs/en/parse/string-format)
   */
  @property()
  accessor inputFormat: string;

  /**
   * 展示时间格式，如 "YYYY-MM-DD"，当设置该属性时，属性 `formatter` 无效 [时间格式参照表](https://day.js.org/docs/en/display/format)
   */
  @property()
  accessor outputFormat: string;

  /**
   * 使用日期+时间格式输出还是仅日期。
   * @default "datetime"
   */
  @property()
  accessor type: "datetime" | "date";

  /**
   * 是否展示为耗费时间，例如：'1 个月 20 天'
   */
  @property({
    type: Boolean,
  })
  accessor isCostTime: boolean;

  /**
   * 格式类型
   *
   * @default "default"
   */
  @property({
    attribute: false,
  })
  accessor formatter: HumanizeTimeFormat;

  /**
   * value 值的单位是否为毫秒（此处属性 id 写错，实际表达意义为 isMillisecond）
   *
   * @deprecated 请使用 `isMillisecond`
   */
  @property({
    type: Boolean,
  })
  accessor isMicrosecond: boolean;

  /**
   * value 值的单位是否为毫秒
   */
  @property({
    type: Boolean,
  })
  accessor isMillisecond: boolean;

  /**
   * 跳转链接，默认为空
   */
  @property({
    attribute: false,
  })
  accessor link: LinkInfo;

  connectedCallback(): void {
    // istanbul ignore else
    if (!this.style.display) {
      this.style.display = "block";
    }
    super.connectedCallback();
  }

  render() {
    return (
      <HumanizeTimeComponent
        value={this.value}
        type={this.type}
        formatter={this.formatter}
        isMillisecond={this.isMillisecond ?? this.isMicrosecond}
        isCostTime={this.isCostTime}
        link={this.link}
        inputFormat={this.inputFormat}
        outputFormat={this.outputFormat}
      />
    );
  }
}

export function HumanizeTimeComponent({
  value,
  type,
  isMillisecond,
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
    ts = isMillisecond ? value : Number(value) * 1000;
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
      : humanizeTime(ts, HumanizeTimeFormat[formatter], type);
  }

  if (link) {
    return (
      <WrappedLink url={link.url} target={link.target}>
        {label}
      </WrappedLink>
    );
  }

  return <span>{label}</span>;
}
