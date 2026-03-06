---
tagName: eo-menu-group
displayName: WrappedEoMenuGroup
description: 菜单分组构件，用于对菜单项进行分组展示，提供标题插槽和内容插槽
category: navigation
source: "@next-bricks/basic"
---

# WrappedEoMenuGroup

> 菜单分组构件，用于对菜单项进行分组展示，提供标题插槽和内容插槽

## 导入

```tsx
import { WrappedEoMenuGroup } from "@easyops/wrapped-components";
```

## Slots

| 名称      | 说明                   |
| --------- | ---------------------- |
| title     | 分组标题内容           |
| (default) | 分组内容，通常为菜单项 |

## CSS Parts

| 名称             | 说明         |
| ---------------- | ------------ |
| menu-group       | 外层容器     |
| menu-group-title | 分组标题容器 |

## Examples

### Basic

菜单分组基本用法，通过 `title` 插槽设置分组标题。

```tsx
<WrappedEoMenu mode="vertical">
  <WrappedEoMenuGroup>
    <span slot="title">系统管理</span>
    <WrappedEoMenuItem>用户管理</WrappedEoMenuItem>
    <WrappedEoMenuItem>角色管理</WrappedEoMenuItem>
  </WrappedEoMenuGroup>
  <WrappedEoMenuGroup>
    <span slot="title">数据中心</span>
    <WrappedEoMenuItem>数据源</WrappedEoMenuItem>
    <WrappedEoMenuItem>数据集</WrappedEoMenuItem>
  </WrappedEoMenuGroup>
</WrappedEoMenu>
```
