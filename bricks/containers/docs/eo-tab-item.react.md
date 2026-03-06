---
tagName: eo-tab-item
displayName: WrappedEoTabItem
description: Tab 子项构件
category: container-layout
source: "@next-bricks/containers"
---

# WrappedEoTabItem

> Tab 子项构件

## 导入

```tsx
import { WrappedEoTabItem } from "@easyops/wrapped-components";
```

## Props

| 属性       | 类型               | 必填 | 默认值      | 说明                                                      |
| ---------- | ------------------ | ---- | ----------- | --------------------------------------------------------- |
| type       | `TabType`          | -    | `"default"` | 样式类型                                                  |
| panel      | `string`           | ✅   | -           | 面板名称，对应 tab-group 中的 slot 名称，用于关联内容面板 |
| icon       | `GeneralIconProps` | -    | -           | 图标配置，显示在标签文字左侧                              |
| disabled   | `boolean`          | -    | -           | 是否禁用，禁用后点击无响应且样式置灰                      |
| active     | `boolean`          | -    | -           | 是否为激活状态，通常由 tab-group 自动管理                 |
| badgeConf  | `BadgeProps`       | -    | -           | 徽标数配置，显示在标签文字右侧或右上角（panel 类型时）    |
| panelColor | `string`           | -    | -           | 面板颜色，同时控制默认状态和激活状态的文字及图标颜色      |

## Slots

| 名称 | 说明                       |
| ---- | -------------------------- |
| ""   | 默认插槽，放置标签文字内容 |

## CSS Parts

| 名称     | 说明         |
| -------- | ------------ |
| tab-item | Tab 子项容器 |

## Examples

### 基本用法

展示基本的 Tab 子项，包含标签文字和面板关联。

```tsx
<WrappedEoTabGroup activePanel="tab1">
  <div slot="nav">
    <WrappedEoTabList>
      <WrappedEoTabItem panel="tab1">
        <span>标签一</span>
      </WrappedEoTabItem>
      <WrappedEoTabItem panel="tab2">
        <span>标签二</span>
      </WrappedEoTabItem>
      <WrappedEoTabItem panel="tab3">
        <span>标签三</span>
      </WrappedEoTabItem>
    </WrappedEoTabList>
  </div>
  <div slot="tab1">内容一</div>
  <div slot="tab2">内容二</div>
  <div slot="tab3">内容三</div>
</WrappedEoTabGroup>
```

### 带图标

使用 icon 属性在标签文字左侧显示图标。

```tsx
<WrappedEoTabGroup activePanel="tab1">
  <div slot="nav">
    <WrappedEoTabList>
      <WrappedEoTabItem panel="tab1" icon={{ lib: "antd", icon: "home" }}>
        <span>首页</span>
      </WrappedEoTabItem>
      <WrappedEoTabItem panel="tab2" icon={{ lib: "antd", icon: "setting" }}>
        <span>设置</span>
      </WrappedEoTabItem>
    </WrappedEoTabList>
  </div>
  <div slot="tab1">首页内容</div>
  <div slot="tab2">设置内容</div>
</WrappedEoTabGroup>
```

### 禁用状态

使用 disabled 属性禁用某个 Tab 子项。

```tsx
<WrappedEoTabGroup activePanel="tab1">
  <div slot="nav">
    <WrappedEoTabList>
      <WrappedEoTabItem panel="tab1">
        <span>可用标签</span>
      </WrappedEoTabItem>
      <WrappedEoTabItem panel="tab2" disabled={true}>
        <span>禁用标签</span>
      </WrappedEoTabItem>
    </WrappedEoTabList>
  </div>
  <div slot="tab1">可用标签内容</div>
  <div slot="tab2">禁用标签内容</div>
</WrappedEoTabGroup>
```

### 徽标数

使用 badgeConf 配置在标签上显示徽标数。

```tsx
<WrappedEoTabGroup activePanel="tab1">
  <div slot="nav">
    <WrappedEoTabList>
      <WrappedEoTabItem panel="tab1" badgeConf={{ count: 5 }}>
        <span>消息</span>
      </WrappedEoTabItem>
      <WrappedEoTabItem panel="tab2" badgeConf={{ count: 99 }}>
        <span>通知</span>
      </WrappedEoTabItem>
    </WrappedEoTabList>
  </div>
  <div slot="tab1">消息内容</div>
  <div slot="tab2">通知内容</div>
</WrappedEoTabGroup>
```

### 自定义面板颜色与激活状态

使用 panelColor 自定义标签颜色，并使用 active 手动控制激活状态。

```tsx
<WrappedEoTabGroup activePanel="tab1">
  <div slot="nav">
    <WrappedEoTabList>
      <WrappedEoTabItem panel="tab1" panelColor="#52c41a" active={true}>
        <span>绿色标签</span>
      </WrappedEoTabItem>
      <WrappedEoTabItem panel="tab2" panelColor="#fa8c16">
        <span>橙色标签</span>
      </WrappedEoTabItem>
    </WrappedEoTabList>
  </div>
  <div slot="tab1">绿色面板内容</div>
  <div slot="tab2">橙色面板内容</div>
</WrappedEoTabGroup>
```
