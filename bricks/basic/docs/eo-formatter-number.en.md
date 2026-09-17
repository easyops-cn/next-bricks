---
tagName: eo-formatter-number
displayName: WrappedEoFormatterNumber
description: Number formatting; supports the formatted display of plain numbers, currencies, percentages, binary bytes and more.
category: display-component
source: "@next-bricks/basic"
---

# eo-formatter-number

> Number formatting; supports the formatted display of plain numbers, currencies, percentages, binary bytes and more.

## Props

| property           | type                              | required | default | description                                                    |
| ------------------ | --------------------------------- | -------- | ------- | -------------------------------------------------------------- |
| value              | `number \| undefined`             | no       | -       | The numeric value to format                                    |
| type               | `NumberType \| undefined`         | no       | -       | Formatting type                                                |
| currency           | `string \| undefined`             | no       | `"CNY"` | Currency name                                                  |
| unit               | `string \| undefined`             | no       | -       | Unit name, used when type is "unit"                            |
| originalUnit       | `NumberOriginalUnit \| undefined` | no       | -       | Original unit, used for unit conversion                        |
| decimals           | `number \| undefined`             | no       | -       | Number of decimal places to keep                               |
| thousandsSeparator | `boolean \| undefined`            | no       | `true`  | Whether to enable the thousands separator                      |
| fallback           | `string \| undefined`             | no       | -       | Fallback content displayed when value is empty or not a number |

## Examples

### Basic

Demonstrates basic number formatting; decimal numbers are displayed with the thousands separator by default.

```yaml preview
brick: eo-formatter-number
properties:
  value: 314159265
```

### Currency

Formats a number as a currency; the Chinese yuan is used by default.

```yaml preview
brick: eo-formatter-number
properties:
  value: 314159265
  type: currency
```

### Percent

Formats a number as a percentage.

```yaml preview
brick: eo-formatter-number
properties:
  value: 0.314159265
  type: percent
```

### Bytes

Formats a byte count into readable binary units, with automatic conversion.

```yaml preview
brick: eo-formatter-number
properties:
  value: 314159265
  type: unit
  decimals: 2
  originalUnit: KiB
```

### Fallback

Displays the fallback content when value is empty or not a number.

```yaml preview
brick: eo-formatter-number
properties:
  fallback: "-"
```

### Customizations

Customize the number of decimal places and disable the thousands separator.

```yaml preview
brick: eo-formatter-number
properties:
  value: 314159.265
  thousandsSeparator: false
  decimals: 2
```

### Custom Currency

Number formatting for a specified currency, for example the US dollar.

```yaml preview
brick: eo-formatter-number
properties:
  value: 9999.99
  type: currency
  currency: USD
  decimals: 2
```
