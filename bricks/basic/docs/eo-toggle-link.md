---
tagName: eo-toggle-link
displayName: WrappedEoToggleLink
description: 展开/折叠链接。
category: interaction
source: "@next-bricks/basic"
---

# eo-toggle-link

> 展开/折叠链接。

## Props

| 属性         | 类型                   | 必填 | 默认值 | 说明     |
| ------------ | ---------------------- | ---- | ------ | -------- |
| open         | `boolean`              | -    | -      | 是否展开 |
| themeVariant | `"default" \| "elevo"` | -    | -      | 主题变体 |

## Events

| 事件   | detail                   | 说明                |
| ------ | ------------------------ | ------------------- |
| toggle | `boolean` — 当前是否展开 | 切换展开/折叠时触发 |

## Slots

| 名称      | 说明 |
| --------- | ---- |
| (default) | 内容 |

## CSS Parts

| 名称 | 说明 |
| ---- | ---- |
| link | 链接 |
| icon | 图标 |

## Examples

### Basic

点击链接可在展开/折叠之间切换，`toggle` 事件携带当前展开状态。

```yaml preview
- brick: eo-toggle-link
  context:
    - name: open
      value: false
  properties:
    textContent: Toggle me
  events:
    toggle:
      action: context.replace
      args:
        - open
        - <% EVENT.detail %>
- brick: p
  properties:
    textContent: I see you!
    hidden: <%= !CTX.open %>
```

### ThemeVariant

通过 `themeVariant` 切换主题外观，`"elevo"` 主题适用于 Elevo 设计风格。

```yaml preview
- brick: eo-toggle-link
  properties:
    textContent: Default theme
    themeVariant: default
- brick: eo-toggle-link
  properties:
    textContent: Elevo theme
    themeVariant: elevo
```
