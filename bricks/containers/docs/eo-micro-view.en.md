---
tagName: eo-micro-view
displayName: WrappedEoMicroView
description: Basic page layout
category: container-layout
source: "@next-bricks/containers"
deprecated: true
---

# eo-micro-view

> Basic page layout
>
> **Deprecated**: please use the newer page layout bricks.

## Props

| property  | type     | required | default | description                                     |
| --------- | -------- | -------- | ------- | ----------------------------------------------- |
| pageTitle | `string` | no       | -       | Page title, displayed at the top of the content area |

## Slots

| name      | description                                                                  |
| --------- | ---------------------------------------------------------------------------- |
| (default) | Main content area                                                            |
| toolbar   | Toolbar slot; the toolbar area is shown automatically when it has content     |

## Examples

### Basic

Displays a basic page layout with a page title and a content area.

```html preview
<eo-micro-view page-title="Page Title">Content</eo-micro-view>
```

### With Toolbar

Put action buttons in the `toolbar` slot; the toolbar area is shown automatically when it has content.

```yaml preview
- brick: eo-micro-view
  properties:
    pageTitle: Page Title
  slots:
    "":
      bricks:
        - brick: div
          properties:
            textContent: Main Content
            style:
              padding: 16px
              border: 1px solid #eee
    toolbar:
      bricks:
        - brick: eo-button
          properties:
            type: primary
            textContent: Create
        - brick: eo-button
          properties:
            textContent: Export
```

### No Title

When `pageTitle` is not set, the title area is not rendered and only the content area remains.

```yaml preview
- brick: eo-micro-view
  slots:
    "":
      bricks:
        - brick: div
          properties:
            textContent: Content without title
            style:
              padding: 16px
```
