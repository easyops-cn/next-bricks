---
tagName: eo-tab-group
displayName: WrappedEoTabGroup
description: Tab 容器组
category: container-layout
source: "@next-bricks/containers"
---

# WrappedEoTabGroup

> Tab 容器组

## 导入

```tsx
import { WrappedEoTabGroup } from "@easyops/wrapped-components";
```

## Props

| 属性          | 类型                  | 必填 | 默认值      | 说明                                                                                        |
| ------------- | --------------------- | ---- | ----------- | ------------------------------------------------------------------------------------------- |
| type          | `TabType`             | -    | `"default"` | 样式类型                                                                                    |
| activePanel   | `string`              | -    | -           | 当前激活的面板名称，对应 tab-item 的 panel 属性                                             |
| contentStyle  | `React.CSSProperties` | -    | -           | 内容样式                                                                                    |
| outline       | `TabsOutline`         | -    | `"default"` | 轮廓。默认情况下，使用阴影，8.2 下默认则为无轮廓。该属性对 panel 类型无效（其始终无轮廓）。 |
| fillContainer | `boolean`             | -    | -           | 是否填满容器高度，启用后 tab 组件高度为 100%，内容区域自动撑满剩余空间                      |

## Events

| 事件        | detail                        | 说明            |
| ----------- | ----------------------------- | --------------- |
| onTabSelect | `string` — 当前选中的面板名称 | 选择 tab 时触发 |

## Slots

| 名称  | 说明                            |
| ----- | ------------------------------- |
| nav   | 导航区域，放置 eo-tab-item 组件 |
| extra | 导航栏右侧额外内容              |

## Examples

### 基本用法

展示默认样式的 Tab 容器组，包含多个 tab-item 切换面板。

```tsx
<WrappedEoTabGroup
  activePanel="panel1"
  onTabSelect={(e) => console.log(e.detail)}
>
  <div slot="nav">
    <WrappedEoTabList>
      <WrappedEoTabItem panel="panel1" label="选项卡一" />
      <WrappedEoTabItem panel="panel2" label="选项卡二" />
      <WrappedEoTabItem panel="panel3" label="选项卡三" />
    </WrappedEoTabList>
  </div>
  <div slot="panel1">面板一的内容</div>
  <div slot="panel2">面板二的内容</div>
  <div slot="panel3">面板三的内容</div>
</WrappedEoTabGroup>
```

### 胶囊样式

使用 capsule 类型展示胶囊风格的 Tab 容器。

```tsx
<WrappedEoTabGroup type="capsule" activePanel="panel1">
  <div slot="nav">
    <WrappedEoTabList>
      <WrappedEoTabItem panel="panel1" label="胶囊一" />
      <WrappedEoTabItem panel="panel2" label="胶囊二" />
    </WrappedEoTabList>
  </div>
  <div slot="panel1">胶囊面板一的内容</div>
  <div slot="panel2">胶囊面板二的内容</div>
</WrappedEoTabGroup>
```

### 面板样式

使用 panel 类型展示面板风格的 Tab，该类型始终无轮廓。

```tsx
<WrappedEoTabGroup type="panel" activePanel="panel1">
  <div slot="nav">
    <WrappedEoTabList>
      <WrappedEoTabItem panel="panel1" label="面板一" />
      <WrappedEoTabItem panel="panel2" label="面板二" />
    </WrappedEoTabList>
  </div>
  <div slot="panel1">面板类型内容一</div>
  <div slot="panel2">面板类型内容二</div>
</WrappedEoTabGroup>
```

### 文字样式

使用 text 类型展示纯文字风格的 Tab。

```tsx
<WrappedEoTabGroup type="text" activePanel="panel1">
  <div slot="nav">
    <WrappedEoTabList>
      <WrappedEoTabItem panel="panel1" label="文字一" />
      <WrappedEoTabItem panel="panel2" label="文字二" />
    </WrappedEoTabList>
  </div>
  <div slot="panel1">文字样式面板一</div>
  <div slot="panel2">文字样式面板二</div>
</WrappedEoTabGroup>
```

### 阴影轮廓与自定义内容样式

使用 outline 属性设置阴影轮廓，并通过 contentStyle 自定义内容区域样式。

```tsx
<WrappedEoTabGroup
  outline="shadow"
  activePanel="panel1"
  contentStyle={{ padding: "24px", background: "#fafafa" }}
>
  <div slot="nav">
    <WrappedEoTabList>
      <WrappedEoTabItem panel="panel1" label="选项卡一" />
      <WrappedEoTabItem panel="panel2" label="选项卡二" />
    </WrappedEoTabList>
  </div>
  <div slot="extra">额外操作</div>
  <div slot="panel1">阴影轮廓面板一</div>
  <div slot="panel2">阴影轮廓面板二</div>
</WrappedEoTabGroup>
```

### 填满容器

启用 fillContainer 使 Tab 组件填满父容器高度。

```tsx
<div style={{ height: "300px" }}>
  <WrappedEoTabGroup fillContainer={true} activePanel="panel1">
    <div slot="nav">
      <WrappedEoTabList>
        <WrappedEoTabItem panel="panel1" label="选项卡一" />
        <WrappedEoTabItem panel="panel2" label="选项卡二" />
      </WrappedEoTabList>
    </div>
    <div slot="panel1">填满容器面板一</div>
    <div slot="panel2">填满容器面板二</div>
  </WrappedEoTabGroup>
</div>
```
