---
tagName: eo-toggle-link
displayName: WrappedEoToggleLink
description: An expand/collapse link.
category: interaction
source: "@next-bricks/basic"
---

# eo-toggle-link

> An expand/collapse link.

## Props

| property     | type                   | required | default | description    |
| ------------ | ---------------------- | -------- | ------- | -------------- |
| open         | `boolean`              | -        | -       | Whether it is expanded |
| themeVariant | `"default" \| "elevo"` | -        | -       | Theme variant  |

## Events

| event  | detail                        | description                                        |
| ------ | ----------------------------- | -------------------------------------------------- |
| toggle | `boolean` — whether it is currently expanded | Triggered when toggling between expanded and collapsed |

## Slots

| name      | description |
| --------- | ----------- |
| (default) | Content     |

## CSS Parts

| name | description |
| ---- | ----------- |
| link | Link        |
| icon | Icon        |

## Examples

### Basic

Clicking the link toggles between expanded and collapsed; the `toggle` event carries the current expanded state.

```yaml preview
- brick: eo-toggle-link
  context:
    - name: open
      value: false
  properties:
    textContent: Toggle me
  events:
    toggle:
      action: context.replace
      args:
        - open
        - <% EVENT.detail %>
- brick: p
  properties:
    textContent: I see you!
    hidden: <%= !CTX.open %>
```

### ThemeVariant

Use `themeVariant` to switch the theme appearance; the `"elevo"` theme is for the Elevo design style.

```yaml preview
- brick: eo-toggle-link
  properties:
    textContent: Default theme
    themeVariant: default
- brick: eo-toggle-link
  properties:
    textContent: Elevo theme
    themeVariant: elevo
```
