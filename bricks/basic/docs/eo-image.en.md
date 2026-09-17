---
tagName: eo-image
displayName: WrappedEoImage
description: A general-purpose image brick
category: display-component
source: "@next-bricks/basic"
---

# eo-image

> A general-purpose image brick

## Props

| property | type | required | default | description |
| --- | --- | --- | --- | --- |
| imgList | `ImageConfig[]` | - | - | Image list |
| width | `string` | - | - | Image width |
| height | `string` | - | - | Image height |
| onlyPreview | `boolean` | - | - | Preview-only mode |

## Events

| event | detail | description |
| --- | --- | --- |
| visibleChange | `boolean` — whether the preview box is visible | Triggered when the preview box is shown or hidden |

## Methods

| method | params | returns | description |
| --- | --- | --- | --- |
| open | <ul><li>`index?: number` - Index of the image to preview; if omitted, the first image is previewed</li></ul> | `void` | Open the preview box |
| close | - | `void` | Close the preview box |

## Examples

### Basic

Shows a list of images that supports a uniform width and height.

```yaml preview
- brick: eo-image
  properties:
    imgList:
      - src: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        width: 100
```

### Preview

When preview is enabled, clicking an image opens the preview box; set `preview: false` to disable the preview of a single image.

```yaml preview
- brick: eo-image
  properties:
    imgList:
      - src: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        width: 100
        preview: true
- brick: eo-image
  properties:
    imgList:
      - src: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200"
        width: 100
        preview: false
```

### Fallback Image

When an image fails to load, the fallback image specified by `fallback` is shown automatically.

```yaml preview
- brick: eo-image
  properties:
    imgList:
      - src: "https://www.error.com/test.png"
        fallback: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200"
        width: 100
```

### Watching Visibility Change

The `visibleChange` event reports whether the preview box is opened or closed.

```yaml preview
- brick: eo-image
  properties:
    imgList:
      - src: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        width: 100
        preview: true
  events:
    visibleChange:
      - action: console.log
        args:
          - "preview visible:"
          - "<% EVENT.detail %>"
```

### Preview-only Mode and Methods

Uses the `onlyPreview` preview-only mode and controls the preview box manually via the `open`/`close` methods.

```yaml preview
- brick: eo-image
  ref: myImage
  properties:
    onlyPreview: true
    imgList:
      - src: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        width: 100
        preview: true
- brick: eo-button
  properties:
    textContent: Open preview
  events:
    click:
      - target: "#myImage"
        method: open
        args:
          - 0
- brick: eo-button
  properties:
    textContent: Close preview
  events:
    click:
      - target: "#myImage"
        method: close
```

### Global Width and Height

Sets a uniform size for all images via the top-level `width` and `height` properties; the `width`/`height` of a single image takes precedence.

```yaml preview
- brick: eo-image
  properties:
    width: "120px"
    height: "80px"
    imgList:
      - src: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
      - src: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
```
