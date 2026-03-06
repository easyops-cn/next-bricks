---
tagName: eo-breadcrumb-item
displayName: WrappedEoBreadcrumbItem
description: 面包屑单项构件，支持链接跳转，可通过插槽添加前缀、后缀和自定义分隔符
category: navigation
source: "@next-bricks/basic"
---

# WrappedEoBreadcrumbItem

> 面包屑单项构件，支持链接跳转，可通过插槽添加前缀、后缀和自定义分隔符

## 导入

```tsx
import { WrappedEoBreadcrumbItem } from "@easyops/wrapped-components";
```

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

```tsx
<WrappedEoBreadcrumbItem>
  <eo-icon
    slot="prefix"
    lib="easyops"
    category="app"
    icon="monitor-alarm-notice"
    style={{ fontSize: "14px" }}
  />
  事件中心
</WrappedEoBreadcrumbItem>
```

### 链接跳转

使用 url 或 href 配置链接跳转。

```tsx
<>
  <WrappedEoBreadcrumbItem url={{ pathname: "/" }}>
    首页
  </WrappedEoBreadcrumbItem>
  <WrappedEoBreadcrumbItem href="https://www.example.com" target="_blank">
    外部链接
  </WrappedEoBreadcrumbItem>
  <WrappedEoBreadcrumbItem>当前页</WrappedEoBreadcrumbItem>
</>
```

### 前缀与后缀插槽

通过 prefix 和 suffix 插槽在文本前后插入内容。

```tsx
<WrappedEoBreadcrumbItem>
  <eo-icon
    slot="prefix"
    lib="easyops"
    category="app"
    icon="monitor-alarm-notice"
    style={{ fontSize: "14px" }}
  />
  <eo-icon
    slot="suffix"
    lib="antd"
    icon="info-circle"
    theme="outlined"
    style={{ fontSize: "12px" }}
  />
  事件中心
</WrappedEoBreadcrumbItem>
```
