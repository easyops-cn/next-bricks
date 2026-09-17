---
tagName: eo-text
displayName: WrappedEoText
description: A general-purpose text brick
category: text
source: "@next-bricks/basic"
---

# eo-text

> A general-purpose text brick

## Props

| property    | type                          | required | default     | description                                                                                                                                                     |
| ----------- | ----------------------------- | -------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type        | `TextType`                    | -        | `"default"` | Text type. Allowed values: `"secondary"` \| `"success"` \| `"warning"` \| `"danger"` \| `"disabled"` \| `"code"` \| `"keyboard"` \| `"default"`                  |
| editable    | `boolean \| EditableConfig`   | -        | -           | Whether it is editable; passing an object allows configuring `control` (`"input"` \| `"textarea"`) and `autoSize`                                               |
| color       | `CSSProperties["color"]`      | -        | -           | Font color                                                                                                                                                      |
| fontSize    | `CSSProperties["fontSize"]`   | -        | `"14px"`    | Font size                                                                                                                                                       |
| fontWeight  | `CSSProperties["fontWeight"]` | -        | `"normal"`  | Font weight                                                                                                                                                     |
| lineHeight  | `CSSProperties["lineHeight"]` | -        | `"14px"`    | Line height                                                                                                                                                     |
| textAlign   | `CSSProperties["textAlign"]`  | -        | `"left"`    | Text alignment                                                                                                                                                  |
| display     | `CSSProperties["display"]`    | -        | `"inline"`  | Display type                                                                                                                                                    |
| customStyle | `CSSProperties`               | -        | -           | Custom style; takes precedence over the other style properties                                                                                                  |

## Events

| event  | detail                                                                     | description                                                                   |
| ------ | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| change | `string` — the current text value in the input box                         | Value change event; triggered on every input in editable mode                 |
| update | `string` — the text value submitted after editing (triggered only when the value changes) | Value update event; triggered on blur in editable mode when the value has changed |

## Slots

| name      | description  |
| --------- | ------------ |
| (default) | Text content |

## Examples

### Basic

Displays the basic text usage; customize the style with properties such as `color`, `fontSize` and `display`.

```html preview
<eo-text color="blue" font-size="20px" display="block" font-weight="500">
  Hello World
</eo-text>
```

### Type

Use the `type` property to set the semantic text type; `secondary`, `success`, `warning`, `danger`, `disabled`, `code`, `keyboard` and others are supported.

```yaml preview
- brick: eo-text
  properties:
    type: secondary
    textContent: Hello World
- brick: eo-text
  properties:
    type: success
    textContent: Hello World
- brick: eo-text
  properties:
    type: warning
    textContent: Hello World
- brick: eo-text
  properties:
    type: danger
    textContent: Hello World
- brick: eo-text
  properties:
    type: disabled
    textContent: Hello World
- brick: eo-text
  properties:
    type: code
    textContent: Hello World
- brick: eo-text
  properties:
    type: keyboard
    textContent: Hello World
```

### Editable

After `editable` is enabled, an edit button appears next to the text; clicking it enters edit mode. The `change` event is triggered on input, and the `update` event is triggered after editing is completed.

```yaml preview
- brick: eo-text
  properties:
    editable: true
    textContent: Hello World
  events:
    change:
      - action: console.log
    update:
      - action: console.log
```

### EditableTextarea

Set `editable` to an object and specify `control: "textarea"` to edit with a multiline textarea; `autoSize` configures the automatic height range.

```yaml preview
- brick: eo-text
  properties:
    editable:
      control: textarea
      autoSize:
        minRows: 2
        maxRows: 6
    textContent: Hello World
  events:
    change:
      - action: console.log
    update:
      - action: console.log
```

### CustomStyle

Pass an object to the `customStyle` property to apply custom styles; it takes precedence over individual properties such as `color` and `fontSize`.

```yaml preview
- brick: eo-text
  properties:
    customStyle:
      color: "#abc"
      fontSize: 48px
    textContent: Hello World
```

### TextAlign

Use `textAlign` to control text alignment; combine it with `display: block` for block-level alignment to take effect.

```yaml preview
- brick: eo-text
  properties:
    textAlign: center
    display: block
    textContent: Centered Text
- brick: eo-text
  properties:
    textAlign: right
    display: block
    textContent: Right Aligned Text
```

### LineHeight

Use `lineHeight` to control the line height, which is more noticeable in multiline text.

```yaml preview
- brick: eo-text
  properties:
    lineHeight: "2"
    display: block
    textContent: Text with increased line height for readability
```
