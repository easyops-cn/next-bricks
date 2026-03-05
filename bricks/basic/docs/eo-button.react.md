---
tagName: eo-button
displayName: WrappedEoButton
description: 通用按钮构件
category: interact-basic
source: "@next-bricks/basic"
---

# WrappedEoButton

> 通用按钮构件

## 导入

```tsx
import { WrappedEoButton } from "@easyops/wrapped-components";
```

## Props

| 属性         | 类型                   | 必填 | 默认值      | 说明                                                                                                                                                           |
| ------------ | ---------------------- | ---- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type         | `ButtonType`           | 否   | `"default"` | 按钮类型，可选值：`"primary"` \| `"default"` \| `"dashed"` \| `"ghost"` \| `"link"` \| `"text"` \| `"icon"` \| `"ai"` \| `"ai-alt"` \| `"neutral"` \| `"flat"` |
| size         | `ComponentSize`        | 否   | `"medium"`  | 按钮大小，可选值：`"large"` \| `"medium"` \| `"small"` \| `"xs"`                                                                                               |
| icon         | `GeneralIconProps`     | 否   | -           | 图标                                                                                                                                                           |
| shape        | `Shape`                | 否   | -           | 按钮形状，支持圆形、椭圆形，不设置为默认方形，可选值：`"round"` \| `"circle"`                                                                                  |
| danger       | `boolean`              | 否   | `false`     | 是否开启危险状态                                                                                                                                               |
| disabled     | `boolean`              | 否   | `false`     | 是否禁用                                                                                                                                                       |
| url          | `string`               | 否   | -           | 链接地址                                                                                                                                                       |
| href         | `string`               | 否   | -           | 跳转外链地址                                                                                                                                                   |
| target       | `string`               | 否   | -           | 链接类型                                                                                                                                                       |
| tooltip      | `string`               | 否   | -           | 鼠标悬停时显示的提示文字                                                                                                                                       |
| buttonStyle  | `React.CSSProperties`  | 否   | -           | 按钮样式                                                                                                                                                       |
| themeVariant | `"default" \| "elevo"` | 否   | -           | 主题变体                                                                                                                                                       |

## Slots

| 名称     | 说明     |
| -------- | -------- |
| （默认） | 按钮内容 |

## CSS Parts

| 名称   | 说明     |
| ------ | -------- |
| button | 按钮元素 |

## Examples

### Types

展示按钮的所有类型，包括 primary、default、dashed、ghost、icon、text、link、ai 和 ai-alt。

```tsx
<>
  <WrappedEoButton type="primary">Primary</WrappedEoButton>
  <WrappedEoButton>Default</WrappedEoButton>
  <WrappedEoButton type="dashed">Dashed</WrappedEoButton>
  <WrappedEoButton type="ghost">Ghost</WrappedEoButton>
  <WrappedEoButton type="icon" icon={{ lib: "antd", icon: "edit" }} />
  <WrappedEoButton type="text">Text</WrappedEoButton>
  <WrappedEoButton type="link">Link</WrappedEoButton>
  <WrappedEoButton type="ai">ai</WrappedEoButton>
  <WrappedEoButton
    type="ai-alt"
    size="large"
    icon={{ lib: "lucide", icon: "sparkles", fill: true, strokeWidth: 1.5 }}
  >
    ai-alt
  </WrappedEoButton>
</>
```

### Sizes

展示按钮支持的四种尺寸：large、medium（默认）、small 和 xs。

```tsx
<>
  <WrappedEoButton size="large">Large</WrappedEoButton>
  <WrappedEoButton>Medium</WrappedEoButton>
  <WrappedEoButton size="small">Small</WrappedEoButton>
  <WrappedEoButton size="xs">X-small</WrappedEoButton>
</>
```

### Shapes

展示按钮的方形（默认）和圆形两种形状。

```tsx
<>
  <WrappedEoButton>Square</WrappedEoButton>
  <WrappedEoButton shape="circle">X</WrappedEoButton>
</>
```

### Danger

展示危险状态下各类型按钮的样式。

```tsx
<>
  <WrappedEoButton danger type="primary">
    Primary
  </WrappedEoButton>
  <WrappedEoButton danger>Default</WrappedEoButton>
  <WrappedEoButton danger type="dashed">
    Dashed
  </WrappedEoButton>
  <WrappedEoButton danger type="ghost">
    Ghost
  </WrappedEoButton>
  <WrappedEoButton danger type="text">
    Text
  </WrappedEoButton>
  <WrappedEoButton danger type="link">
    Link
  </WrappedEoButton>
</>
```

### Disabled

展示禁用状态下各类型按钮，禁用后按钮不可点击且鼠标显示禁止光标。

```tsx
<>
  <WrappedEoButton disabled type="primary">
    Primary
  </WrappedEoButton>
  <WrappedEoButton disabled>Default</WrappedEoButton>
  <WrappedEoButton disabled type="dashed">
    Dashed
  </WrappedEoButton>
  <WrappedEoButton disabled type="ghost">
    Ghost
  </WrappedEoButton>
  <WrappedEoButton disabled type="text">
    Text
  </WrappedEoButton>
  <WrappedEoButton disabled type="link">
    Link
  </WrappedEoButton>
  <WrappedEoButton disabled danger>
    Danger
  </WrappedEoButton>
  <WrappedEoButton disabled danger type="primary">
    Danger primary
  </WrappedEoButton>
</>
```

### Tooltip

使用 tooltip 属性为按钮添加悬停提示，禁用按钮的 tooltip 同样有效。

```tsx
<>
  <WrappedEoButton type="primary" tooltip="primary">
    Primary
  </WrappedEoButton>
  <WrappedEoButton type="link" tooltip="link">
    Link
  </WrappedEoButton>
  <WrappedEoButton disabled tooltip="disabled">
    Default
  </WrappedEoButton>
</>
```

### Icons

通过 icon 属性为按钮添加图标，可与文字组合使用或单独作为图标按钮。

```tsx
<div style={{ display: "flex", gap: "8px" }}>
  <WrappedEoButton icon={{ lib: "antd", icon: "bell" }}>Alarm</WrappedEoButton>
  <WrappedEoButton icon={{ lib: "antd", icon: "setting", theme: "filled" }} />
  <WrappedEoButton
    icon={{ lib: "antd", icon: "setting", theme: "filled" }}
    type="primary"
  />
  <WrappedEoButton
    icon={{ lib: "antd", icon: "setting", theme: "filled" }}
    shape="circle"
  />
</div>
```

### Click

点击按钮时触发原生 click 事件，可绑定事件处理。

```tsx
<WrappedEoButton onClick={() => console.log("Well done!")}>
  Click me
</WrappedEoButton>
```

### Links

通过 href 或 url 属性使按钮具备链接跳转功能，target 控制打开方式。

```tsx
<WrappedEoButton type="link" href="https://baidu.com/" target="_blank">
  Link to Baidu
</WrappedEoButton>
```

### Custom Style

使用 buttonStyle 属性自定义按钮的内联样式。

```tsx
<WrappedEoButton
  type="primary"
  buttonStyle={{ borderRadius: "20px", padding: "0 24px" }}
>
  Custom Style
</WrappedEoButton>
```

### Theme Variant

通过 `themeVariant` 切换按钮的主题变体，`elevo` 变体适用于 Elevo 主题场景。

```tsx
<>
  <WrappedEoButton type="primary">Default Theme</WrappedEoButton>
  <WrappedEoButton type="primary" themeVariant="elevo">
    Elevo Theme
  </WrappedEoButton>
</>
```
