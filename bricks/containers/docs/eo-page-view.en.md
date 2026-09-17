---
tagName: eo-page-view
displayName: WrappedEoPageView
description: A page view layout brick that provides a multi-section layout with a header, sidebar, sub-sidebar, main content area and footer, supporting a centered narrow layout mode and sticky/fixed footer positioning
category: container-layout
source: "@next-bricks/containers"
---

# eo-page-view

> A page view layout brick that provides a multi-section layout with a header, sidebar, sub-sidebar, main content area and footer, supporting a centered narrow layout mode and sticky/fixed footer positioning

## Props

| property       | type                          | required | default | description                                                                                                                              |
| -------------- | ----------------------------- | -------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| narrow         | `NarrowViewSize \| undefined` | no       | -       | Set the narrow layout mode (centered). `"full"` is full size (not a centered narrow layout), `"small"` is a small narrow layout, `"medium"` is a medium narrow layout and `"large"` is a large narrow layout. |
| showFooter     | `boolean \| undefined`        | no       | -       | Whether to show the footer (usually holds buttons)                                                                                       |
| fixedFooter    | `boolean \| undefined`        | no       | -       | The footer is always fixed at the bottom. When not set, the footer defaults to sticky, that is: when the screen is tall enough, the footer moves up with the content area instead of always being fixed.  |
| reversedFooter | `boolean \| undefined`        | no       | -       | When set to `true`, footer child bricks are aligned to the right; when not set (the default), they are aligned to the left.              |

## Slots

| name       | description                      |
| ---------- | -------------------------------- |
| (default)  | Content area                     |
| header     | Header                           |
| sidebar    | Sidebar                          |
| subSidebar | Sub-sidebar                      |
| footer     | Footer (usually holds buttons)   |

## Examples

### Basic

Displays the basic page view layout, including the header, sidebar, sub-sidebar and content area.

```yaml preview
brick: eo-page-view
properties:
  style:
    height: 300px
children:
  - brick: div
    slot: header
    properties:
      style:
        height: 50px
        background: green
      textContent: Header
  - brick: div
    slot: sidebar
    properties:
      style:
        width: 220px
        height: 100%
        background: purple
      textContent: Sidebar
  - brick: div
    slot: subSidebar
    properties:
      style:
        width: 208px
        height: 100%
        background: red
      textContent: Sub-Sidebar
  - brick: div
    properties:
      style:
        width: 100%
        height: 100%
        background: blue
      textContent: Content
```

### With Main View

Combine with bricks such as eo-main-view to build a complete page layout.

```yaml preview
brick: eo-page-view
properties:
  style:
    height: 300px
children:
  - brick: div
    slot: header
    properties:
      style:
        height: 50px
        background: green
      textContent: Header
  - brick: div
    slot: sidebar
    properties:
      style:
        width: 220px
        height: 100%
        background: purple
      textContent: Sidebar
  - brick: div
    slot: subSidebar
    properties:
      style:
        width: 208px
        height: 100%
        background: red
      textContent: Sub-Sidebar
  - brick: eo-main-view
    children:
      - brick: eo-frame-breadcrumb
        slot: breadcrumb
        properties:
          breadcrumb:
            - text: Home
              to: /Home
            - text: Detail
              to: /Detail
            - text: List
              to: /List
      - brick: eo-page-title
        slot: pageTitle
        properties:
          pageTitle: Hello World
      - brick: div
        properties:
          textContent: Say hello to everyone! And then say goodbye to everyone!
```

### With Footer

Show the footer with `showFooter` and control whether it is fixed at the bottom with `fixedFooter`.

```yaml preview
brick: eo-page-view
properties:
  showFooter: true
  fixedFooter: true
  style:
    height: 300px
children:
  - brick: div
    properties:
      textContent: Page Content
      style:
        padding: 16px
  - brick: eo-button
    slot: footer
    properties:
      type: primary
      textContent: Save
  - brick: eo-button
    slot: footer
    properties:
      textContent: Cancel
```

### Narrow Layout

Use the `narrow` property to set the centered narrow layout mode of the content area.

```yaml preview
brick: eo-page-view
properties:
  narrow: medium
  style:
    height: 300px
children:
  - brick: div
    properties:
      textContent: Centered medium narrow content
      style:
        background: var(--palette-blue-2)
        padding: 16px
```

### Reversed Footer

Use `reversedFooter` to align footer child bricks to the right.

```yaml preview
brick: eo-page-view
properties:
  showFooter: true
  reversedFooter: true
  style:
    height: 300px
children:
  - brick: div
    properties:
      textContent: Page Content
      style:
        padding: 16px
  - brick: eo-button
    slot: footer
    properties:
      type: primary
      textContent: Save
  - brick: eo-button
    slot: footer
    properties:
      textContent: Cancel
```
