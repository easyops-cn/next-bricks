---
tagName: eo-menu-group
displayName: WrappedEoMenuGroup
description: 菜单分组构件，用于对菜单项进行分组展示，提供标题插槽和内容插槽
category: navigation
source: "@next-bricks/basic"
---

# eo-menu-group

> 菜单分组构件，用于对菜单项进行分组展示，提供标题插槽和内容插槽

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

```yaml preview
- brick: eo-menu
  properties:
    mode: vertical
  children:
    - brick: eo-menu-group
      children:
        - brick: span
          properties:
            textContent: 系统管理
          slot: title
        - brick: eo-menu-item
          properties:
            textContent: 用户管理
        - brick: eo-menu-item
          properties:
            textContent: 角色管理
    - brick: eo-menu-group
      children:
        - brick: span
          properties:
            textContent: 数据中心
          slot: title
        - brick: eo-menu-item
          properties:
            textContent: 数据源
        - brick: eo-menu-item
          properties:
            textContent: 数据集
```
