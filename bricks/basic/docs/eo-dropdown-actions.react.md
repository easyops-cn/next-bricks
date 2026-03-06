---
tagName: eo-dropdown-actions
displayName: WrappedEoDropdownActions
description: 下拉菜单构件，点击触发元素弹出操作列表，支持选中状态、弹出层定位策略配置和自定义触发内容
category: interact-basic
source: "@next-bricks/basic"
---

# WrappedEoDropdownActions

> 下拉菜单构件，点击触发元素弹出操作列表，支持选中状态、弹出层定位策略配置和自定义触发内容

## 导入

```tsx
import { WrappedEoDropdownActions } from "@easyops/wrapped-components";
```

## Props

| 属性         | 类型                    | 必填 | 默认值           | 说明              |
| ------------ | ----------------------- | ---- | ---------------- | ----------------- |
| actions      | `Action[]`              | 否   | -                | 操作列表配置      |
| checkedKeys  | `(string \| number)[]`  | 否   | `[]`             | actions选中项配置 |
| disabled     | `boolean`               | 否   | -                | 是否禁用          |
| strategy     | `"absolute" \| "fixed"` | 否   | `"absolute"`     | 弹出层如何定位    |
| placement    | `Placement`             | 否   | `"bottom-start"` | 弹出层放置位置    |
| themeVariant | `"default" \| "elevo"`  | 否   | -                | 主题变体          |

## Events

| 事件            | detail                      | 说明                       |
| --------------- | --------------------------- | -------------------------- |
| onActionClick   | `SimpleAction` — 该按钮配置 | 点击按钮时触发             |
| onVisibleChange | `boolean` — 当前是否可见    | 当弹出层可见性变化之后触发 |

## Slots

| 名称        | 说明               |
| ----------- | ------------------ |
| _(default)_ | 触发弹出的锚点元素 |

## Examples

### Basic

展示包含图标、分隔符、危险项和子菜单的下拉操作菜单，使用默认插槽放置触发按钮。

```tsx
<WrappedEoDropdownActions
  actions={[
    {
      text: "Query",
      icon: { icon: "search", lib: "antd", theme: "outlined" },
      event: "query",
      tooltip: "some tooltip...",
    },
    {
      text: "Edit",
      icon: { lib: "easyops", category: "default", icon: "edit" },
      event: "edit",
    },
    { type: "divider" },
    {
      text: "Delete",
      icon: { lib: "easyops", category: "default", icon: "delete" },
      event: "delete",
      tooltip: "No permission",
      danger: true,
    },
    {
      text: "Delete 2",
      disabled: true,
      icon: { lib: "easyops", category: "default", icon: "delete" },
      event: "delete2",
      tooltip: "No permission",
    },
    {
      text: "switch org",
      icon: { lib: "antd", icon: "swap" },
      items: [
        { text: "org1", event: "org1.click" },
        { text: "org2", event: "org2.click" },
      ],
    },
  ]}
  onActionClick={(e) => {
    const action = e.detail;
    if (action.event === "query") console.log("click query button");
    if (action.event === "edit") console.log("click edit button");
    if (action.event === "delete") console.log("click delete button");
  }}
>
  <WrappedEoButton>button</WrappedEoButton>
</WrappedEoDropdownActions>
```

### Checked Keys

通过 `checkedKeys` 配置已选中的菜单项。

```tsx
<WrappedEoDropdownActions
  checkedKeys={["edit"]}
  actions={[
    { text: "Edit", key: "edit", icon: { lib: "antd", icon: "edit" } },
    {
      text: "Delete",
      key: "delete",
      icon: { lib: "antd", icon: "delete" },
      danger: true,
    },
  ]}
  onActionClick={(e) => console.log(e.detail.text)}
>
  <WrappedEoButton>Actions</WrappedEoButton>
</WrappedEoDropdownActions>
```

### Disabled

禁用下拉菜单，使用户无法打开操作列表。

```tsx
<WrappedEoDropdownActions
  disabled={true}
  actions={[
    { text: "Edit", icon: { lib: "antd", icon: "edit" } },
    { text: "Delete", icon: { lib: "antd", icon: "delete" }, danger: true },
  ]}
>
  <WrappedEoButton disabled>Disabled</WrappedEoButton>
</WrappedEoDropdownActions>
```

### Visible Change

监听 `onVisibleChange` 事件，并通过 `placement`、`strategy`、`themeVariant` 配置弹出层的定位和主题。

```tsx
<WrappedEoDropdownActions
  placement="bottom-start"
  strategy="fixed"
  themeVariant="default"
  actions={[
    { text: "Option 1", icon: { lib: "antd", icon: "check" } },
    { text: "Option 2", icon: { lib: "antd", icon: "star" } },
  ]}
  onVisibleChange={(e) => console.log(e.detail ? "菜单已打开" : "菜单已关闭")}
>
  <WrappedEoButton>Open Menu</WrappedEoButton>
</WrappedEoDropdownActions>
```
