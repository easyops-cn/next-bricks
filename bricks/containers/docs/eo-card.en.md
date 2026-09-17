---
tagName: eo-card
displayName: WrappedEoCard
description: A general-purpose card brick
category: card-info
source: "@next-bricks/containers"
---

# eo-card

> A general-purpose card brick

## Props

| property         | type                   | required | default     | description                                                                                                                                                                                 |
| ---------------- | ---------------------- | -------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------          |
| cardTitle        | `string`               | -        | -           | Title                                                                                                                                                                                       |
| headerIcon       | `GeneralIconProps`     | -        | -           | Header icon                                                                                                                                                                                 |
| fillVertical     | `boolean`              | -        | -           | Fills the parent container automatically. Note that `fillVertical` and `verticalCenter` cannot be used at the same time                                                                     |
| verticalCenter   | `boolean`              | -        | -           | Vertically centered. Note that `fillVertical` and `verticalCenter` cannot be used at the same time                                                                                          |
| hasExtraSlot     | `boolean`              | -        | -           | Whether there is an action area slot in the top-right corner                                                                                                                                |
| operationButtons | `OperationButton[]`    | -        | `[]`        | List of action buttons in the top-right corner                                                                                                                                              |
| headerStyle      | `React.CSSProperties`  | -        | -           | Header style                                                                                                                                                                                |
| bodyStyle        | `React.CSSProperties`  | -        | -           | Body style                                                                                                                                                                                  |
| background       | `boolean \| string`    | -        | -           | Background setting. Pass `false` to remove the background, or a string to customize the background color (such as a CSS color value); the standard background fill color is used by default |
| outline          | `CardOutline`          | -        | `"default"` | Card outline. By default the standard background fill color is used; under 8.2 the default is no border and no fill.                                                                        |
| hideSplit        | `boolean`              | -        | -           | Whether to hide the divider                                                                                                                                                                 |
| themeVariant     | `"default" \| "elevo"` | -        | -           | Theme variant. Allowed values: `"default"` or `"elevo"`                                                                                                                                     |

## Slots

| name        | description                 |
| ----------- | --------------------------- |
| _(default)_ | Card content                |
| extra       | Extra element on the right side of the header |
| titleSuffix | Slot for the title suffix   |

## Examples

### Basic

Demonstrates basic card usage with a title.

```yaml preview
brick: eo-card
properties:
  cardTitle: Card Title
children:
  - brick: div
    properties:
      textContent: Content
```

### Fill Vertical

Demonstrates a card automatically filling the height of its parent container.

```yaml preview
brick: div
properties:
  style:
    height: 300px
children:
  - brick: eo-card
    properties:
      cardTitle: Hello
      fillVertical: true
      style:
        height: 100%
    children:
      - brick: div
        properties:
          textContent: World
          style:
            background: var(--palette-green-2)
            height: 100%
```

### Vertical Center

Demonstrates vertically centered card content.

```yaml preview
- brick: eo-card
  properties:
    cardTitle: Card Title
    verticalCenter: true
  slots:
    "":
      bricks:
        - brick: div
          properties:
            textContent: Content
            style:
              height: 50px
```

### Hide Split

Demonstrates hiding the divider between the title and the content.

```yaml preview
- brick: eo-card
  properties:
    cardTitle: Card Title
    hideSplit: true
  slots:
    "":
      bricks:
        - brick: div
          properties:
            textContent: Content
            style:
              display: flex
              background: pink
              height: 200px
              alignItems: center
              justifyContent: center
              fontSize: 22px
              fontWeight: 500
              color: "#fff"
```

### Extra Slot

Demonstrates using the extra slot on the right side of the card header to place additional action elements.

```yaml preview
- brick: eo-card
  properties:
    cardTitle: Card Title
    hasExtraSlot: true
  slots:
    extra:
      bricks:
        - brick: eo-button
          properties:
            textContent: Extra Button
```

### titleSuffix Slot

Demonstrates placing an info icon in the title suffix slot of the card.

```yaml preview
- brick: eo-card
  properties:
    cardTitle: Card Title
  slots:
    titleSuffix:
      bricks:
        - brick: eo-tooltip
          properties:
            content: This is a tooltip
            trigger: hover
          children:
            - brick: eo-icon
              properties:
                lib: antd
                category: filled
                icon: info-circle
                style:
                  height: 14px
                  lineHeight: 14px
                  fontSize: 14px
                  marginLeft: 6px
                  color: var(--color-normal-text)
```

### Header Icon

Demonstrates a card title with an icon in front of it.

```yaml preview
- brick: eo-card
  properties:
    cardTitle: Card Title
    headerIcon:
      lib: antd
      icon: search
  slots:
    "":
      bricks:
        - brick: div
          properties:
            textContent: Content
```

### Header Style

Demonstrates a custom card header style.

```yaml preview
- brick: eo-card
  properties:
    cardTitle: Card Title
    headerStyle:
      background: "#abc"
      color: "#fff"
      fontSize: 22px
  slots:
    "":
      bricks:
        - brick: div
          properties:
            textContent: Content
```

### Background

Demonstrates removing the card background and customizing the background color.

```yaml preview
- brick: eo-card
  properties:
    cardTitle: Card Title
    background: false
  slots:
    "":
      bricks:
        - brick: div
          properties:
            textContent: Content
- brick: div
  properties:
    style:
      height: 10px
- brick: eo-card
  properties:
    cardTitle: Card Title
    background: "#abc"
  slots:
    "":
      bricks:
        - brick: div
          properties:
            textContent: Content
```

### Outline

Demonstrates the different card outline styles (border, shadow, background, none).

```yaml preview gap
- brick: div
  properties:
    style:
      display: grid
      flexDirection: column
      gap: 1em
  children:
    - brick: eo-card
      properties:
        cardTitle: Card Title
        textContent: "outline: (not set)"
    - brick: eo-card
      properties:
        cardTitle: Card Title
        outline: border
        hideSplit: true
        textContent: "outline: border"
    - brick: eo-card
      properties:
        cardTitle: Card Title
        hideSplit: true
        outline: shadow
        textContent: "outline: shadow"
    - brick: eo-card
      properties:
        cardTitle: Card Title
        outline: background
        background: var(--color-fill-bg-base-4)
        textContent: "outline: background"
```

### Operation Buttons

Demonstrates configuring a list of action buttons in the top-right corner of the card header.

```yaml preview
- brick: eo-card
  properties:
    cardTitle: Card Title
    operationButtons:
      - id: btn-edit
        eventName: edit
        text: Edit
        configProps:
          type: text
      - id: btn-delete
        eventName: delete
        text: Delete
        configProps:
          type: text
          danger: true
  slots:
    "":
      bricks:
        - brick: div
          properties:
            textContent: Content
```

### Body Style and Theme Variant

Demonstrates a custom body style and the elevo theme variant.

```yaml preview
- brick: eo-card
  properties:
    cardTitle: Card Title
    bodyStyle:
      padding: 24px
      background: var(--palette-blue-1)
    themeVariant: elevo
  slots:
    "":
      bricks:
        - brick: div
          properties:
            textContent: Content with custom body style and elevo theme
```
