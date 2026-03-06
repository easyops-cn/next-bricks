---
tagName: eo-text
displayName: WrappedEoText
description: 通用文本构件
category: text
source: "@next-bricks/basic"
---

# WrappedEoText

> 通用文本构件

## 导入

```tsx
import { WrappedEoText } from "@easyops/wrapped-components";
```

## Props

| 属性        | 类型                          | 必填 | 默认值      | 说明                                                                                                                                   |
| ----------- | ----------------------------- | ---- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| type        | `TextType`                    | -    | `"default"` | 文本类型，可选值：`"secondary"` \| `"success"` \| `"warning"` \| `"danger"` \| `"disabled"` \| `"code"` \| `"keyboard"` \| `"default"` |
| editable    | `boolean \| EditableConfig`   | -    | -           | 是否可编辑，传入对象可配置 `control`（`"input"` \| `"textarea"`）和 `autoSize`                                                         |
| color       | `CSSProperties["color"]`      | -    | -           | 字体颜色                                                                                                                               |
| fontSize    | `CSSProperties["fontSize"]`   | -    | `"14px"`    | 字体大小                                                                                                                               |
| fontWeight  | `CSSProperties["fontWeight"]` | -    | `"normal"`  | 字体粗细                                                                                                                               |
| lineHeight  | `CSSProperties["lineHeight"]` | -    | `"14px"`    | 字体行高                                                                                                                               |
| textAlign   | `CSSProperties["textAlign"]`  | -    | `"left"`    | 字体对齐方式                                                                                                                           |
| display     | `CSSProperties["display"]`    | -    | `"inline"`  | 显示类型                                                                                                                               |
| customStyle | `CSSProperties`               | -    | -           | 自定义样式，优先级高于其他样式属性                                                                                                     |

## Events

| 事件     | detail                                                    | 说明                                             |
| -------- | --------------------------------------------------------- | ------------------------------------------------ |
| onChange | `string` — 当前输入框中的文本值                           | 值改变事件，在可编辑模式下每次输入时触发         |
| onUpdate | `string` — 编辑完成后提交的文本值（仅在值发生变化时触发） | 值更新事件，在可编辑模式下失焦且值发生变化时触发 |

## Slots

| 名称      | 说明     |
| --------- | -------- |
| (default) | 文本内容 |

## Examples

### Basic

展示基本文本用法，通过 `color`、`fontSize`、`display` 等属性自定义样式。

```tsx
<WrappedEoText color="blue" fontSize="20px" display="block" fontWeight="500">
  Hello World
</WrappedEoText>
```

### Type

通过 `type` 属性设置文本语义类型，支持 `secondary`、`success`、`warning`、`danger`、`disabled`、`code`、`keyboard` 等。

```tsx
<>
  <WrappedEoText type="secondary">Hello World</WrappedEoText>
  <WrappedEoText type="success">Hello World</WrappedEoText>
  <WrappedEoText type="warning">Hello World</WrappedEoText>
  <WrappedEoText type="danger">Hello World</WrappedEoText>
  <WrappedEoText type="disabled">Hello World</WrappedEoText>
  <WrappedEoText type="code">Hello World</WrappedEoText>
  <WrappedEoText type="keyboard">Hello World</WrappedEoText>
</>
```

### Editable

启用 `editable` 后，文本旁会显示编辑按钮，点击后进入编辑模式；`onChange` 事件在输入时触发，`onUpdate` 事件在完成编辑后触发。

```tsx
<WrappedEoText
  editable
  onChange={(e) => console.log(e.detail)}
  onUpdate={(e) => console.log(e.detail)}
>
  Hello World
</WrappedEoText>
```

### EditableTextarea

将 `editable` 设为对象并指定 `control: "textarea"` 可使用多行文本域编辑；`autoSize` 可配置自动高度范围。

```tsx
<WrappedEoText
  editable={{ control: "textarea", autoSize: { minRows: 2, maxRows: 6 } }}
  onChange={(e) => console.log(e.detail)}
  onUpdate={(e) => console.log(e.detail)}
>
  Hello World
</WrappedEoText>
```

### CustomStyle

通过 `customStyle` 属性传入对象来应用自定义样式，优先级高于 `color`、`fontSize` 等单独属性。

```tsx
<WrappedEoText customStyle={{ color: "#abc", fontSize: "48px" }}>
  Hello World
</WrappedEoText>
```

### TextAlign

通过 `textAlign` 控制文本对齐方式，结合 `display="block"` 使块级对齐生效。

```tsx
<>
  <WrappedEoText textAlign="center" display="block">
    Centered Text
  </WrappedEoText>
  <WrappedEoText textAlign="right" display="block">
    Right Aligned Text
  </WrappedEoText>
</>
```

### LineHeight

通过 `lineHeight` 控制行高，在多行文本中更为明显。

```tsx
<WrappedEoText lineHeight="2" display="block">
  Text with increased line height for readability
</WrappedEoText>
```
