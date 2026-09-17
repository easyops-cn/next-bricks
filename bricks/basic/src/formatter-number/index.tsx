import React, { useMemo } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import { pipes } from "@next-core/pipes";
import "@next-core/theme";
import styleText from "./styles.shadow.css";

const { defineElement, property } = createDecorators();

export interface EoFormatterNumberProps {
  value?: number;
  type?: NumberType;
  currency?: string;
  unit?: string;
  originalUnit?: string;
  decimals?: number;
  thousandsSeparator?: boolean;
  fallback?: string;
}

export type NumberType = "decimal" | "currency" | "percent" | "unit";

export type NumberOriginalUnit =
  // Decimal bytes
  | "bytes"
  | "B"
  | "KB"
  | "MB"
  | "GB"
  | "TB"
  | "PB"
  // Binary bytes
  | "bibytes"
  | "KiB"
  | "MiB"
  | "GiB"
  | "TiB"
  | "PiB";

/**
 * 数字格式化，支持普通数字、货币、百分比、二进制字节等数字的格式化显示。
 * @en Number formatting, supporting the formatted display of plain numbers, currencies, percentages, binary bytes, and other numbers.
 * @category display-component
 */
export
@defineElement("eo-formatter-number", {
  styleTexts: [styleText],
})
class EoFormatterNumber
  extends ReactNextElement
  implements EoFormatterNumberProps
{
  /**
   * 要格式化的数字值
   * @en The number value to format
   */
  @property({ type: Number })
  accessor value: number | undefined;

  /**
   * 格式化类型
   * @en Format type
   */
  @property()
  accessor type: NumberType | undefined;

  /**
   * 货币名
   * @en Currency name
   *
   * @default "CNY"
   */
  @property()
  accessor currency: string | undefined;

  /**
   * 单位名称，当 type 为 "unit" 时使用
   * @en Unit name; used when type is "unit"
   */
  @property()
  accessor unit: string | undefined;

  /**
   * 原始单位，用于单位转换
   * @en Original unit, used for unit conversion
   */
  @property()
  accessor originalUnit: NumberOriginalUnit | undefined;

  /**
   * 保留的小数位数
   * @en Number of decimal places to keep
   */
  @property({ type: Number })
  accessor decimals: number | undefined;

  /**
   * 是否启用千分位分隔符
   * @en Whether to enable the thousands separator
   *
   * @default true
   */
  @property({ type: Boolean })
  accessor thousandsSeparator: boolean | undefined;

  /**
   * 当 value 为空或不是数字时的回退显示内容
   * @en Fallback display content when value is empty or not a number
   */
  @property()
  accessor fallback: string | undefined;

  render() {
    return (
      <EoFormatterNumberComponent
        value={this.value}
        type={this.type}
        currency={this.currency}
        unit={this.unit}
        originalUnit={this.originalUnit}
        decimals={this.decimals}
        thousandsSeparator={this.thousandsSeparator}
        fallback={this.fallback}
      />
    );
  }
}

export function EoFormatterNumberComponent({
  value,
  type,
  currency,
  unit,
  originalUnit,
  decimals,
  thousandsSeparator,
  fallback,
}: EoFormatterNumberProps) {
  const formattedValue = useMemo(() => {
    if (typeof value !== "number") {
      return fallback;
    }

    if (type === "unit" && originalUnit) {
      return pipes.unitFormat(value, originalUnit, decimals ?? 0).join(" ");
    }

    const formatter = new Intl.NumberFormat("zh-CN", {
      style: type ?? "decimal",
      currency: type === "currency" ? (currency ?? "CNY") : undefined,
      unit,
      minimumFractionDigits: decimals ?? 0,
      maximumFractionDigits: decimals ?? 20,
      useGrouping: thousandsSeparator,
    });
    return formatter.format(value);
  }, [
    currency,
    decimals,
    fallback,
    originalUnit,
    thousandsSeparator,
    type,
    unit,
    value,
  ]);

  return <span>{formattedValue}</span>;
}
