---
tagName: eo-sidebar-menu-submenu
displayName: WrappedEoSidebarMenuSubmenu
description: 侧栏菜单子菜单 已迁移至 `nav` 构件包，后续在在 `basic` 构件包中将不再更新。
category: navigation
source: "@next-bricks/basic"
deprecated: true
---

# eo-sidebar-menu-submenu

> 侧栏菜单子菜单 已迁移至 `nav` 构件包，后续在在 `basic` 构件包中将不再更新。

> **已废弃**：该构件已迁移至 `nav` 构件包，请使用新版侧栏菜单构件。

## Props

| 属性          | 类型               | 必填 | 默认值 | 说明                 |
| ------------- | ------------------ | ---- | ------ | -------------------- |
| icon          | `GeneralIconProps` | 否   | -      | 菜单的图标           |
| selected      | `boolean`          | 否   | -      | 是否选中             |
| collapsed     | `boolean`          | 否   | -      | 是否折叠             |
| menuCollapsed | `boolean`          | 否   | -      | 菜单整体是否收起状态 |

## Slots

| 名称  | 说明       |
| ----- | ---------- |
| title | 子菜单标题 |

## Examples

### Basic

展示可折叠的子菜单，包含标题插槽和子菜单项。

```yaml preview
- brick: eo-sidebar-menu
  children:
    - brick: eo-sidebar-menu-submenu
      properties:
        icon:
          lib: antd
          icon: folder
      slots:
        title:
          bricks:
            - brick: span
              properties:
                textContent: 应用管理
        "":
          bricks:
            - brick: eo-sidebar-menu-item
              properties:
                icon:
                  lib: antd
                  icon: appstore
              slots:
                "":
                  bricks:
                    - brick: span
                      properties:
                        textContent: 应用列表
            - brick: eo-sidebar-menu-item
              properties:
                icon:
                  lib: antd
                  icon: plus
              slots:
                "":
                  bricks:
                    - brick: span
                      properties:
                        textContent: 新建应用
```

### Collapsed

设置 `collapsed` 为 `true` 默认折叠子菜单。

```yaml preview
- brick: eo-sidebar-menu
  children:
    - brick: eo-sidebar-menu-submenu
      properties:
        icon:
          lib: antd
          icon: folder
        collapsed: true
        selected: true
      slots:
        title:
          bricks:
            - brick: span
              properties:
                textContent: 系统管理
        "":
          bricks:
            - brick: eo-sidebar-menu-item
              properties:
                icon:
                  lib: antd
                  icon: user
              slots:
                "":
                  bricks:
                    - brick: span
                      properties:
                        textContent: 用户管理
```
