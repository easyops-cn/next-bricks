---
tagName: eo-breadcrumb
displayName: WrappedEoBreadcrumb
description: 面包屑容器构件，通过插槽放置面包屑单项，支持自定义分隔符
category: navigation
source: "@next-bricks/basic"
---

# WrappedEoBreadcrumb

> 面包屑容器构件，通过插槽放置面包屑单项，支持自定义分隔符

## 导入

```tsx
import { WrappedEoBreadcrumb } from "@easyops/wrapped-components";
```

## Slots

| 名称      | 说明                                          |
| --------- | --------------------------------------------- |
| （默认）  | 面包屑项，可使用 WrappedEoBreadcrumbItem 构件 |
| separator | 分隔符，默认为 /                              |

## Examples

### Basic

基本面包屑导航，包含图标前缀和自定义分隔符。

```tsx
import {
  WrappedEoBreadcrumb,
  WrappedEoBreadcrumbItem,
} from "@easyops/wrapped-components";

<WrappedEoBreadcrumb>
  <span slot="separator">/</span>
  <WrappedEoBreadcrumbItem>
    <eo-icon
      slot="prefix"
      lib="easyops"
      category="app"
      icon="monitor-alarm-notice"
      style={{ fontSize: "14px" }}
    />
    <span slot="separator">&gt;</span>
    事件中心
  </WrappedEoBreadcrumbItem>
  <WrappedEoBreadcrumbItem>告警规则</WrappedEoBreadcrumbItem>
  <WrappedEoBreadcrumbItem>编辑</WrappedEoBreadcrumbItem>
</WrappedEoBreadcrumb>;
```

### Slot

使用 separator 插槽自定义统一分隔符。

```tsx
import {
  WrappedEoBreadcrumb,
  WrappedEoBreadcrumbItem,
} from "@easyops/wrapped-components";

<WrappedEoBreadcrumb>
  <span slot="separator">&gt;</span>
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
  <WrappedEoBreadcrumbItem>告警规则</WrappedEoBreadcrumbItem>
  <WrappedEoBreadcrumbItem>编辑</WrappedEoBreadcrumbItem>
</WrappedEoBreadcrumb>;
```
