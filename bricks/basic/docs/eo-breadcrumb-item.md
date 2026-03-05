---
tagName: eo-breadcrumb-item
displayName: WrappedEoBreadcrumbItem
description: 面包屑单项构件，支持链接跳转，可通过插槽添加前缀、后缀和自定义分隔符
category: navigation
source: "@next-bricks/basic"
---

# eo-breadcrumb-item

> 面包屑单项构件，支持链接跳转，可通过插槽添加前缀、后缀和自定义分隔符

## Props

| 属性   | 类型                         | 必填 | 默认值 | 说明           |
| ------ | ---------------------------- | ---- | ------ | -------------- |
| href   | `string`                     | 否   | -      | 外链的链接地址 |
| url    | `ExtendedLocationDescriptor` | 否   | -      | 链接地址       |
| target | `Target`                     | 否   | -      | 链接跳转目标   |

## Slots

| 名称      | 说明                 |
| --------- | -------------------- |
| （默认）  | 面包屑单项的文本内容 |
| prefix    | 前缀                 |
| suffix    | 后缀                 |
| separator | 分隔符               |

## Examples

### Basic

基本面包屑单项，包含图标前缀。

```yaml preview
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
```

### 链接跳转

使用 url 或 href 配置链接跳转。

```yaml preview
- brick: eo-breadcrumb-item
  properties:
    textContent: 首页
    url:
      pathname: /
- brick: eo-breadcrumb-item
  properties:
    textContent: 外部链接
    href: https://www.example.com
    target: _blank
- brick: eo-breadcrumb-item
  properties:
    textContent: 当前页
```

### 前缀与后缀插槽

通过 prefix 和 suffix 插槽在文本前后插入内容。

```yaml preview
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
    - brick: eo-icon
      slot: suffix
      properties:
        lib: antd
        icon: info-circle
        theme: outlined
        style:
          font-size: 12px
```
