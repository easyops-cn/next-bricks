---
tagName: eo-modal
displayName: WrappedEoModal
description: 模态框构件，以遮罩层弹窗形式展示内容，支持全屏、居中、自定义宽高、侧边栏、键盘 ESC 关闭及确认/取消按钮交互
category: container-display
source: "@next-bricks/containers"
---

# WrappedEoModal

> 模态框构件，以遮罩层弹窗形式展示内容，支持全屏、居中、自定义宽高、侧边栏、键盘 ESC 关闭及确认/取消按钮交互

## 导入

```tsx
import { WrappedEoModal } from "@easyops/wrapped-components";
```

## Props

| 属性             | 类型                   | 必填 | 默认值    | 说明                                                                                          |
| ---------------- | ---------------------- | ---- | --------- | --------------------------------------------------------------------------------------------- |
| modalTitle       | `string`               | 否   | -         | 标题                                                                                          |
| width            | `string \| number`     | 否   | `"520px"` | 宽度                                                                                          |
| height           | `string \| number`     | 否   | -         | 高度                                                                                          |
| minWidth         | `string \| number`     | 否   | `"520px"` | 最小宽度                                                                                      |
| minHeight        | `string \| number`     | 否   | -         | 最小高度                                                                                      |
| centered         | `boolean`              | 否   | -         | 是否垂直居中显示。当设置 `themeVariant` 为 `elevo` 时，默认为 `true`。                        |
| maskClosable     | `boolean`              | 否   | -         | 点击遮罩层是否关闭模态框                                                                      |
| fullscreen       | `boolean`              | 否   | -         | 全屏模式                                                                                      |
| fullscreenButton | `boolean`              | 否   | -         | 是否显示全屏按钮                                                                              |
| noFooter         | `boolean`              | 否   | -         | 是否隐藏底部                                                                                  |
| headerBordered   | `boolean`              | 否   | -         | 是否显示头部底边线（themeVariant: elevo 时默认不显示头部底边线）                              |
| background       | `string`               | 否   | -         | 背景                                                                                          |
| closeWhenConfirm | `boolean`              | 否   | `true`    | 点击确定按钮时自动关闭弹窗                                                                    |
| confirmDisabled  | `boolean`              | 否   | -         | 确认按钮是否禁用                                                                              |
| visible          | `boolean`              | 否   | -         | 是否显示模态框                                                                                |
| confirmText      | `string`               | 否   | -         | 确认按钮文本                                                                                  |
| cancelText       | `string`               | 否   | -         | 取消按钮文本                                                                                  |
| confirmDanger    | `boolean`              | 否   | -         | 确认按钮类型（危险样式）                                                                      |
| hideCancelButton | `boolean`              | 否   | -         | 是否隐藏取消按钮                                                                              |
| keyboard         | `boolean`              | 否   | -         | 是否支持键盘 esc 关闭                                                                         |
| themeVariant     | `"default" \| "elevo"` | 否   | -         | 主题变体                                                                                      |
| stackable        | `boolean`              | 否   | -         | 是否可堆叠，开启后每次打开会将新的弹窗置于上层（zIndex ++）。注意：仅初始设置有效。（已废弃） |

## Events

| 事件      | detail | 说明         |
| --------- | ------ | ------------ |
| onOpen    | `void` | 打开弹窗事件 |
| onClose   | `void` | 关闭弹窗事件 |
| onConfirm | `void` | 确认按钮事件 |
| onCancel  | `void` | 取消按钮事件 |

## Methods

| 方法  | 参数 | 返回值 | 说明           |
| ----- | ---- | ------ | -------------- |
| open  | -    | `void` | 打开模态框方法 |
| close | -    | `void` | 关闭模态框方法 |

## Slots

| 名称     | 说明         |
| -------- | ------------ |
| （默认） | 内容插槽     |
| footer   | 底部左侧插槽 |
| sidebar  | 弹窗左侧插槽 |

## Examples

### Basic

通过 `visible` 属性直接展示模态框的基本用法。

```tsx
<WrappedEoModal modalTitle="Modal Title" visible={true}>
  Content
</WrappedEoModal>
```

### Width & Height

通过 `width`、`height`、`minWidth` 和 `minHeight` 属性控制模态框尺寸。

```tsx
import { useRef } from "react";

const modalRef = useRef<any>();

<>
  <WrappedEoButton onClick={() => modalRef.current?.open()}>
    Open Modal
  </WrappedEoButton>
  <WrappedEoModal
    ref={modalRef}
    modalTitle="模态框标题"
    width="600px"
    height="300px"
    minWidth="400px"
    minHeight="200px"
  >
    <div>Content</div>
  </WrappedEoModal>
</>;
```

### Centered

通过 `centered` 属性使模态框垂直居中显示。

```tsx
import { useRef } from "react";

const modalRef = useRef<any>();

<>
  <WrappedEoButton onClick={() => modalRef.current?.open()}>
    Open Centered Modal
  </WrappedEoButton>
  <WrappedEoModal ref={modalRef} modalTitle="居中模态框" centered={true}>
    <div>模态框内容</div>
  </WrappedEoModal>
</>;
```

### MaskClosable

通过 `maskClosable` 控制点击遮罩层是否关闭模态框。

```tsx
import { useRef } from "react";

const allowCloseRef = useRef<any>();
const noCloseRef = useRef<any>();

<>
  <WrappedEoButton onClick={() => allowCloseRef.current?.open()}>
    Mask Allow Close
  </WrappedEoButton>
  <WrappedEoModal
    ref={allowCloseRef}
    modalTitle="模态框标题"
    maskClosable={true}
  >
    <div>模态框内容</div>
  </WrappedEoModal>
  <WrappedEoButton onClick={() => noCloseRef.current?.open()}>
    Mask Not Allow Close
  </WrappedEoButton>
  <WrappedEoModal ref={noCloseRef} modalTitle="模态框标题" maskClosable={false}>
    <div>模态框内容</div>
  </WrappedEoModal>
</>;
```

### Fullscreen & Fullscreen Button

通过 `fullscreen` 属性开启全屏模式，`fullscreenButton` 显示全屏切换按钮。

```tsx
import { useRef } from "react";

const fullscreenRef = useRef<any>();
const fullscreenBtnRef = useRef<any>();

<>
  <WrappedEoButton onClick={() => fullscreenRef.current?.open()}>
    Open Fullscreen Modal
  </WrappedEoButton>
  <WrappedEoModal ref={fullscreenRef} modalTitle="全屏模态框" fullscreen={true}>
    <div>模态框内容</div>
  </WrappedEoModal>
  <WrappedEoButton onClick={() => fullscreenBtnRef.current?.open()}>
    Open With Fullscreen Button
  </WrappedEoButton>
  <WrappedEoModal
    ref={fullscreenBtnRef}
    modalTitle="可切换全屏"
    fullscreenButton={true}
  >
    <div>模态框内容</div>
  </WrappedEoModal>
</>;
```

### Confirm Text & Cancel Text

通过 `confirmText` 和 `cancelText` 自定义底部按钮文本。

```tsx
<WrappedEoModal
  modalTitle="Modal Title"
  visible={true}
  confirmText="提交"
  cancelText="放弃"
>
  Content
</WrappedEoModal>
```

### Hide Cancel Button

通过 `hideCancelButton` 隐藏取消按钮，适用于只需确认的场景。

```tsx
<WrappedEoModal modalTitle="Modal Title" visible={true} hideCancelButton={true}>
  Content
</WrappedEoModal>
```

### Confirm Danger & Disabled

通过 `confirmDanger` 设置危险样式确认按钮，`confirmDisabled` 禁用确认按钮。

```tsx
import { useRef } from "react";

const dangerRef = useRef<any>();
const disabledRef = useRef<any>();

<>
  <WrappedEoButton onClick={() => dangerRef.current?.open()}>
    Open Danger Modal
  </WrappedEoButton>
  <WrappedEoModal
    ref={dangerRef}
    modalTitle="删除确认"
    confirmDanger={true}
    confirmText="删除"
  >
    <div>确认删除此项？</div>
  </WrappedEoModal>
  <WrappedEoButton onClick={() => disabledRef.current?.open()}>
    Open Disabled Confirm Modal
  </WrappedEoButton>
  <WrappedEoModal
    ref={disabledRef}
    modalTitle="确认按钮禁用"
    confirmDisabled={true}
  >
    <div>确认按钮不可点击。</div>
  </WrappedEoModal>
</>;
```

### No Footer

通过 `noFooter` 隐藏底部区域，适用于纯展示场景。

```tsx
import { useRef } from "react";

const modalRef = useRef<any>();

<>
  <WrappedEoButton onClick={() => modalRef.current?.open()}>
    Open
  </WrappedEoButton>
  <WrappedEoModal ref={modalRef} modalTitle="无底部模态框" noFooter={true}>
    <div>仅展示内容，无底部按钮。</div>
  </WrappedEoModal>
</>;
```

### Background & Header Bordered

通过 `background` 设置模态框背景色，`headerBordered` 显示头部底边线。

```tsx
import { useRef } from "react";

const modalRef = useRef<any>();

<>
  <WrappedEoButton onClick={() => modalRef.current?.open()}>
    Open Styled Modal
  </WrappedEoButton>
  <WrappedEoModal
    ref={modalRef}
    modalTitle="自定义背景"
    background="#f5f5f5"
    headerBordered={true}
  >
    <div>带自定义背景和头部底边线的模态框。</div>
  </WrappedEoModal>
</>;
```

### Events

监听 `onOpen`、`onClose`、`onConfirm` 和 `onCancel` 事件，结合 `keyboard` 属性支持 Esc 键关闭，`closeWhenConfirm` 控制确认后是否自动关闭。

```tsx
import { useRef } from "react";

const modalRef = useRef<any>();

<>
  <WrappedEoButton onClick={() => modalRef.current?.open()}>
    open
  </WrappedEoButton>
  <WrappedEoModal
    ref={modalRef}
    modalTitle="模态框标题"
    keyboard={true}
    closeWhenConfirm={false}
    onOpen={() => console.log("modal Open")}
    onClose={() => console.log("modal Close")}
    onConfirm={() => console.log("modal Confirm")}
    onCancel={() => console.log("modal Cancel")}
  >
    <div>Content</div>
  </WrappedEoModal>
</>;
```

### Sidebar Slot

使用 `sidebar` 插槽在模态框左侧放置内容（如导航菜单）。

```tsx
import { useRef } from "react";

const modalRef = useRef<any>();

<>
  <WrappedEoButton onClick={() => modalRef.current?.open()}>
    open
  </WrappedEoButton>
  <WrappedEoModal
    ref={modalRef}
    modalTitle="模态框标题"
    keyboard={true}
    width="700px"
    onOpen={() => console.log("modal Open")}
    onClose={() => console.log("modal Close")}
  >
    <div>Content</div>
    <div slot="sidebar">Sidebar</div>
  </WrappedEoModal>
</>;
```

### Footer Slot

使用 `footer` 插槽在模态框底部左侧放置自定义内容。

```tsx
import { useRef } from "react";

const modalRef = useRef<any>();

<>
  <WrappedEoButton onClick={() => modalRef.current?.open()}>
    Open
  </WrappedEoButton>
  <WrappedEoModal ref={modalRef} modalTitle="带底部插槽的模态框">
    <div>模态框内容</div>
    <span slot="footer">底部左侧自定义内容</span>
  </WrappedEoModal>
</>;
```

### Theme Variant

通过 `themeVariant` 属性切换主题变体，`elevo` 主题下默认居中且无头部底边线。

```tsx
import { useRef } from "react";

const modalRef = useRef<any>();

<>
  <WrappedEoButton onClick={() => modalRef.current?.open()}>
    Open Elevo Theme Modal
  </WrappedEoButton>
  <WrappedEoModal
    ref={modalRef}
    modalTitle="Elevo 主题模态框"
    themeVariant="elevo"
  >
    <div>使用 elevo 主题变体的模态框。</div>
  </WrappedEoModal>
</>;
```
