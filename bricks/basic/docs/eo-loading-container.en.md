---
tagName: eo-loading-container
displayName: WrappedEoLoadingContainer
description: A loading state container that shows a mask and a spinning icon while loading, with support for delayed display to prevent flickering
category: display-component
source: "@next-bricks/basic"
---

# eo-loading-container

> A loading state container that shows a mask and a spinning icon while loading, with support for delayed display to prevent flickering

## Props

| property | type          | required | default    | description                                            |
| -------- | ------------- | -------- | ---------- | ------------------------------------------------------ |
| loading  | `boolean`     | -        | -          | Whether to show the loading state                      |
| delay    | `number`      | -        | -          | Time to delay before showing the loading indicator (prevents flickering) |
| size     | `LoadingSize` | -        | `"medium"` | Size of the loading icon                               |

## Slots

| name      | description |
| --------- | ----------- |
| (default) | Content     |

## Examples

### Basic

Put the content to be loaded into the container and use the `loading` property to control whether the loading mask is shown.

```yaml preview
brick: eo-loading-container
properties:
  loading: true
children:
  - brick: eo-button
    properties:
      textContent: Hello world
```

### Delayed Display

Use the `delay` property to delay showing the loading indicator, avoiding flickering when data returns quickly; the unit is milliseconds.

```yaml preview
brick: eo-loading-container
properties:
  loading: true
  delay: 500
children:
  - brick: eo-text
    properties:
      textContent: Content Area
```

### Loading Icon Size

Use the `size` property to control the size of the loading icon; the "small", "medium" and "large" sizes are supported.

```yaml preview
- brick: eo-loading-container
  properties:
    loading: true
    size: small
  children:
    - brick: eo-text
      properties:
        textContent: Small
- brick: eo-loading-container
  properties:
    loading: true
    size: medium
  children:
    - brick: eo-text
      properties:
        textContent: Medium
- brick: eo-loading-container
  properties:
    loading: true
    size: large
  children:
    - brick: eo-text
      properties:
        textContent: Large
```
