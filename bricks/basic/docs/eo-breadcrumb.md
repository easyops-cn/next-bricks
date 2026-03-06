---
tagName: eo-breadcrumb
displayName: WrappedEoBreadcrumb
description: 面包屑容器构件，通过插槽放置面包屑单项，支持自定义分隔符
category: navigation
source: "@next-bricks/basic"
---

# eo-breadcrumb

> 面包屑容器构件，通过插槽放置面包屑单项，支持自定义分隔符

## Slots

| 名称      | 说明                                     |
| --------- | ---------------------------------------- |
| （默认）  | 面包屑项，可使用 eo-breadcrumb-item 构件 |
| separator | 分隔符，默认为 /                         |

## Examples

### Basic

基本面包屑导航，包含图标前缀和自定义分隔符。

```yaml preview
brick: eo-breadcrumb
children:
  - brick: span
    slot: separator
    properties:
      textContent: "/"
  - brick: eo-breadcrumb-item
    properties:
      textContent: 事件中心
    children:
      - brick: eo-icon
        slot: prefix
        properties:
          lib: easyops
          category: app
          icon: monitor-alarm-notice
          style:
            font-size: 14px
      - brick: span
        slot: separator
        properties:
          textContent: ">"
  - brick: eo-breadcrumb-item
    properties:
      textContent: 告警规则
  - brick: eo-breadcrumb-item
    properties:
      textContent: 编辑
```

### Slot

使用 separator 插槽自定义统一分隔符。

```yaml preview
brick: eo-breadcrumb
children:
  - brick: span
    slot: separator
    properties:
      textContent: ">"
  - brick: eo-breadcrumb-item
    properties:
      textContent: 事件中心
    children:
      - brick: eo-icon
        slot: prefix
        properties:
          lib: easyops
          category: app
          icon: monitor-alarm-notice
          style:
            font-size: 14px
  - brick: eo-breadcrumb-item
    properties:
      textContent: 告警规则
  - brick: eo-breadcrumb-item
    properties:
      textContent: 编辑
```
