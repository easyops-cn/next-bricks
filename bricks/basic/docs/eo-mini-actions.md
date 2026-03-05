---
tagName: eo-mini-actions
displayName: WrappedEoMiniActions
description: 小尺寸按钮组
category: interact-basic
source: "@next-bricks/basic"
---

# eo-mini-actions

> 小尺寸按钮组

## Props

| 属性         | 类型                                | 必填 | 默认值 | 说明         |
| ------------ | ----------------------------------- | ---- | ------ | ------------ |
| actions      | `ActionType[] \| undefined`         | 否   | -      | 操作列表配置 |
| themeVariant | `"default" \| "elevo" \| undefined` | 否   | -      | 主题变体     |

## Events

| 事件           | detail                          | 说明                         |
| -------------- | ------------------------------- | ---------------------------- |
| action.click   | `SimpleActionType` — 该按钮配置 | 点击按钮时触发               |
| visible.change | `boolean` — 当前是否可见        | 当下拉菜单可见性变化之后触发 |

## Examples

### Basic

展示基本的小尺寸按钮组，包含普通图标按钮和下拉菜单按钮。

```yaml preview minHeight="160px"
brick: eo-mini-actions
properties:
  actions:
    - icon:
        lib: antd
        theme: outlined
        icon: star
      isDropdown: false
      event: collect
    - icon:
        lib: antd
        icon: copy
        theme: outlined
      text: 复制链接
      isDropdown: true
      event: copy
    - icon:
        lib: antd
        icon: download
        theme: outlined
      text: 下载
      isDropdown: true
      disabled: true
      event: download
events:
  action.click:
    - action: console.log
  visible.change:
    - action: console.log
```

### Theme Variant

使用 elevo 主题变体展示小尺寸按钮组。

```yaml preview minHeight="160px"
brick: eo-mini-actions
properties:
  themeVariant: elevo
  actions:
    - icon:
        lib: antd
        theme: outlined
        icon: edit
      isDropdown: false
      event: edit
      tooltip: 编辑
    - icon:
        lib: antd
        icon: delete
        theme: outlined
      text: 删除
      isDropdown: true
      danger: true
      event: delete
    - icon:
        lib: antd
        icon: share-alt
        theme: outlined
      text: 分享
      isDropdown: true
      event: share
events:
  action.click:
    - action: console.log
```
