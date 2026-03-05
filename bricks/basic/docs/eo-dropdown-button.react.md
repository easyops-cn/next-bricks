---
tagName: eo-dropdown-button
displayName: WrappedEoDropdownButton
description: 下拉按钮
category: interact-basic
source: "@next-bricks/basic"
---

# WrappedEoDropdownButton

> 下拉按钮

## 导入

```tsx
import { WrappedEoDropdownButton } from "@easyops/wrapped-components";
```

## Props

| 属性     | 类型                                 | 必填 | 默认值                                              | 说明           |
| -------- | ------------------------------------ | ---- | --------------------------------------------------- | -------------- |
| type     | `ButtonType \| undefined`            | 否   | -                                                   | 按钮类型       |
| actions  | `Action[] \| undefined`              | 否   | -                                                   | 下拉按钮菜单   |
| btnText  | `string \| undefined`                | 否   | `"管理"`                                            | 按钮默认文字   |
| icon     | `GeneralIconProps \| undefined`      | 否   | `{ lib: "antd", icon: "setting", theme: "filled" }` | 按钮默认图标   |
| size     | `ComponentSize`                      | 是   | `"medium"`                                          | 按钮大小       |
| disabled | `boolean \| undefined`               | 否   | -                                                   | 是否禁用       |
| shape    | `Shape \| undefined`                 | 否   | -                                                   | 按钮形状       |
| strategy | `"absolute" \| "fixed" \| undefined` | 否   | `"absolute"`                                        | 弹出层如何定位 |

## Events

| 事件          | detail                                                                                                                                                                                                                                              | 说明         |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| onActionClick | `SimpleAction` — { key: 操作项的 key, text: 操作项文本, event: 自定义事件名, icon: 图标配置, disabled: 是否禁用, hidden: 是否隐藏, tooltip: 提示文字, url: 链接地址, href: 外部链接, target: 链接目标, danger: 是否为危险操作, dragConf: 拖拽配置 } | 操作点击事件 |

## Examples

### Basic

通用下拉按钮的基础用法，展示菜单项列表。

```tsx
<WrappedEoDropdownButton actions={[{ text: "Item 1" }, { text: "Item 2" }]} />
```

### Type

展示不同按钮类型的下拉按钮样式。

```tsx
<>
  <WrappedEoDropdownButton
    type="primary"
    actions={[{ text: "Item 1" }, { text: "Item 2" }]}
  />
  <WrappedEoDropdownButton
    type="dashed"
    actions={[{ text: "Item 1" }, { text: "Item 2" }]}
  />
  <WrappedEoDropdownButton
    type="text"
    actions={[{ text: "Item 1" }, { text: "Item 2" }]}
  />
  <WrappedEoDropdownButton
    type="link"
    actions={[{ text: "Item 1" }, { text: "Item 2" }]}
  />
</>
```

### Button Text & Icon

自定义按钮文字和图标的下拉按钮。

```tsx
<WrappedEoDropdownButton
  btnText="下拉按钮"
  icon={{ icon: "search", lib: "antd", theme: "outlined" }}
  actions={[{ text: "Item 1" }, { text: "Item 2" }]}
/>
```

### Size

展示不同尺寸的下拉按钮。

```tsx
<>
  <WrappedEoDropdownButton
    size="large"
    actions={[{ text: "Item 1" }, { text: "Item 2" }]}
  />
  <WrappedEoDropdownButton
    size="medium"
    actions={[{ text: "Item 1" }, { text: "Item 2" }]}
  />
  <WrappedEoDropdownButton
    size="small"
    actions={[{ text: "Item 1" }, { text: "Item 2" }]}
  />
</>
```

### Disabled

展示禁用状态的下拉按钮，包括整体禁用和单个菜单项禁用。

```tsx
<>
  <WrappedEoDropdownButton
    disabled={true}
    actions={[{ text: "Item 1" }, { text: "Item 2" }]}
  />
  <WrappedEoDropdownButton
    btnText=""
    shape="circle"
    icon={{ icon: "setting", lib: "antd", theme: "filled" }}
    actions={[{ text: "Item 1", disabled: true }, { text: "Item 2" }]}
  />
</>
```

### Actions & Event

展示带有图标的菜单项并监听点击事件，通过 `onActionClick` 事件处理不同操作。

```tsx
<WrappedEoDropdownButton
  strategy="fixed"
  icon={{ icon: "search", lib: "antd", theme: "outlined" }}
  actions={[
    {
      text: "Query",
      icon: { icon: "search", lib: "antd", theme: "outlined" },
      event: "query",
    },
    {
      text: "Edit",
      icon: { lib: "easyops", category: "default", icon: "edit" },
      event: "edit",
    },
    {
      text: "Delete",
      icon: { lib: "easyops", category: "default", icon: "delete" },
      event: "delete",
    },
  ]}
  onActionClick={(e) => console.log("action clicked:", e.detail)}
/>
```
