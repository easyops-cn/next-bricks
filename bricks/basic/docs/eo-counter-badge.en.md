---
tagName: eo-counter-badge
displayName: WrappedEoCounterBadge
description: A general-purpose counter badge brick
category: display-component
source: "@next-bricks/basic"
---

# eo-counter-badge

> A general-purpose counter badge brick

## Props

| property      | type               | required | default                    | description                                                                    |
| ------------- | ------------------ | -------- | -------------------------- | ------------------------------------------------------------------------------ |
| count         | `number`           | no       | `0`                        | The displayed number; shown as `${overflowCount}+` when greater than overflowCount, and hidden when 0 |
| overflowCount | `number`           | no       | `99`                       | The capped number to display                                                   |
| dot           | `boolean`          | no       | -                          | Do not show the number; show only a small dot                                  |
| showZero      | `boolean`          | no       | -                          | Whether to show the badge when the value is 0                                  |
| color         | `string`           | no       | `"var(--theme-red-color)"` | Badge background color                                                         |
| fontColor     | `string`           | no       | `"#ffffff"`                | Badge font color                                                               |
| offset        | `[number, number]` | no       | `[0, 0]`                   | Position offset of the status dot, in the format [x, y]                        |
| icon          | `GeneralIconProps` | no       | -                          | Icon used in the content                                                       |

## Slots

| name      | description  |
| --------- | ------------ |
| (default) | Content area |

## Examples

### Basic

Displays the basic badge usage; `count` and `overflowCount` control the displayed number.

```yaml preview
- brick: eo-counter-badge
  properties:
    textContent: My Notifications
    count: 15
    overflowCount: 99
```

### Slot

Use the default slot to embed custom content in the badge; when the value is 0, `showZero` controls whether the badge is shown.

```yaml preview
- brick: eo-counter-badge
  properties:
    showZero: true
    count: 100
  children:
    - brick: div
      properties:
        style:
          font-size: 16px
        textContent: My To-dos
```

### Icon

Use the `icon` property to display an icon in the badge.

```yaml preview
- brick: eo-counter-badge
  properties:
    showZero: false
    count: 99
    dot: false
    icon:
      lib: antd
      theme: outlined
      icon: star
```

### Dot

Enable the `dot` property to show a small dot instead of a number.

```yaml preview
- brick: eo-counter-badge
  properties:
    showZero: false
    count: 99
    dot: true
    textContent: Total Count
```

### Custom Color

Use `color` and `fontColor` to customize the badge background and font colors, and `overflowCount` to control the capped number.

```yaml preview
- brick: eo-counter-badge
  properties:
    textContent: Resolved Issues
    color: var(--theme-green-color)
    fontColor: "#ffffff"
    count: 1000000
    overflowCount: 500
```

### Offset

Use the `offset` property to adjust the badge position offset.

```yaml preview
- brick: eo-counter-badge
  properties:
    count: 15
    overflowCount: 99
    offset:
      - 10
      - -5
    textContent: Offset Example
```

### Standalone (No Content)

When no content slot is passed, the badge is displayed as a standalone element.

```yaml preview
- brick: eo-counter-badge
  properties:
    count: 15
    overflowCount: 99
```
