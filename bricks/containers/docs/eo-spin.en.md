---
tagName: eo-spin
displayName: WrappedEoSpin
description: Loading indicator brick that overlays a spinning animation and an optional tip on top of the container content; three sizes are supported
category: container-display
source: "@next-bricks/containers"
---

# eo-spin

> Loading indicator brick that overlays a spinning animation and an optional tip on top of the container content; three sizes are supported

## Props

| property | type                              | required | default     | description                    |
| -------- | --------------------------------- | -------- | ----------- | ------------------------------ |
| size     | `"small" \| "default" \| "large"` | -        | `"default"` | Size of the loading indicator  |
| tip      | `string`                          | -        | -           | Custom tip text                |
| spinning | `boolean`                         | -        | -           | Whether it is in the loading state |

## Slots

| name      | description      |
| --------- | ---------------- |
| (default) | Container content |

## Examples

### Basic

Demonstrates basic usage: overlaying a loading indicator on top of the content, together with a tip.

```yaml preview
brick: eo-spin
properties:
  spinning: true
  size: default
  tip: Loading...
slots:
  "":
    type: bricks
    bricks:
      - brick: eo-descriptions
        properties:
          column: 3
          list:
            - label: Name
              text: Tom
            - label: Age
              text: 18
            - label: Height
              text: 180cm
            - label: Hobby
              text: Basketball
            - label: Tag
              useBrick:
                - brick: eo-tag-list
                  properties:
                    list:
                      - text: Sunny
                        key: 0
                        color: blue
                      - text: Cheerful
                        key: 1
                        color: red
                      - text: Big Boy
                        key: 2
                        color: green
```

### Size

Demonstrates the three loading indicator sizes (small, default, large).

```yaml preview
- brick: eo-flex-layout
  properties:
    gap: 20px
    flexDirection: column
  children:
    - brick: eo-spin
      properties:
        spinning: true
        size: small
        tip: small
      children:
        - brick: div
          properties:
            style:
              height: 60px
              background: var(--color-fill-bg-base-1)
    - brick: eo-spin
      properties:
        spinning: true
        size: default
        tip: default
      children:
        - brick: div
          properties:
            style:
              height: 60px
              background: var(--color-fill-bg-base-1)
    - brick: eo-spin
      properties:
        spinning: true
        size: large
        tip: large
      children:
        - brick: div
          properties:
            style:
              height: 60px
              background: var(--color-fill-bg-base-1)
```

### Not Spinning

Demonstrates that when spinning is false the loading indicator is not displayed and the content is shown directly.

```yaml preview
brick: eo-spin
properties:
  spinning: false
  tip: Loading...
slots:
  "":
    type: bricks
    bricks:
      - brick: div
        properties:
          textContent: Content loaded
          style:
            padding: 16px
```
