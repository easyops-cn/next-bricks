---
tagName: eo-formatter-number
displayName: WrappedEoFormatterNumber
description: 数字格式化，支持普通数字、货币、百分比、二进制字节等数字的格式化显示。
category: display-component
source: "@next-bricks/basic"
---

# eo-formatter-number

> 数字格式化，支持普通数字、货币、百分比、二进制字节等数字的格式化显示。

## Props

| 属性               | 类型                              | 必填 | 默认值  | 说明                                    |
| ------------------ | --------------------------------- | ---- | ------- | --------------------------------------- |
| value              | `number \| undefined`             | 否   | -       | 要格式化的数字值                        |
| type               | `NumberType \| undefined`         | 否   | -       | 格式化类型                              |
| currency           | `string \| undefined`             | 否   | `"CNY"` | 货币名                                  |
| unit               | `string \| undefined`             | 否   | -       | 单位名称，当 type 为 "unit" 时使用      |
| originalUnit       | `NumberOriginalUnit \| undefined` | 否   | -       | 原始单位，用于单位转换                  |
| decimals           | `number \| undefined`             | 否   | -       | 保留的小数位数                          |
| thousandsSeparator | `boolean \| undefined`            | 否   | `true`  | 是否启用千分位分隔符                    |
| fallback           | `string \| undefined`             | 否   | -       | 当 value 为空或不是数字时的回退显示内容 |

## Examples

### Basic

展示基础数字格式化，默认使用千分位分隔符显示十进制数字。

```yaml preview
brick: eo-formatter-number
properties:
  value: 314159265
```

### Currency

将数字格式化为货币格式显示，默认使用人民币。

```yaml preview
brick: eo-formatter-number
properties:
  value: 314159265
  type: currency
```

### Percent

将数字格式化为百分比格式显示。

```yaml preview
brick: eo-formatter-number
properties:
  value: 0.314159265
  type: percent
```

### Bytes

将字节数格式化为可读的二进制单位，支持自动换算。

```yaml preview
brick: eo-formatter-number
properties:
  value: 314159265
  type: unit
  decimals: 2
  originalUnit: KiB
```

### Fallback

当 value 为空或非数字时，显示回退内容。

```yaml preview
brick: eo-formatter-number
properties:
  fallback: "-"
```

### Customizations

自定义小数位数并禁用千分位分隔符。

```yaml preview
brick: eo-formatter-number
properties:
  value: 314159.265
  thousandsSeparator: false
  decimals: 2
```

### Custom Currency

指定货币类型的数字格式化，例如美元。

```yaml preview
brick: eo-formatter-number
properties:
  value: 9999.99
  type: currency
  currency: USD
  decimals: 2
```
