---
tagName: eo-sidebar-menu
displayName: WrappedEoSidebarMenu
description: 侧栏菜单 已迁移至 `nav` 构件包，后续在在 `basic` 构件包中将不再更新。
category: navigation
source: "@next-bricks/basic"
deprecated: true
---

# eo-sidebar-menu

> 侧栏菜单 已迁移至 `nav` 构件包，后续在在 `basic` 构件包中将不再更新。

> **已废弃**：该构件已迁移至 `nav` 构件包，请使用新版侧栏菜单构件。

## Props

| 属性          | 类型      | 必填 | 默认值 | 说明                 |
| ------------- | --------- | ---- | ------ | -------------------- |
| menuCollapsed | `boolean` | 否   | -      | 菜单整体是否收起状态 |

## Examples

### Basic

使用 `eo-sidebar-menu` 包裹菜单项，构成完整侧栏菜单。

```yaml preview
- brick: eo-sidebar-menu
  children:
    - brick: eo-sidebar-menu-item
      properties:
        icon:
          lib: antd
          icon: home
      slots:
        "":
          bricks:
            - brick: span
              properties:
                textContent: 首页
    - brick: eo-sidebar-menu-item
      properties:
        icon:
          lib: antd
          icon: setting
        selected: true
      slots:
        "":
          bricks:
            - brick: span
              properties:
                textContent: 设置
```

### Collapsed

设置 `menuCollapsed` 为 `true` 收起菜单，仅显示图标。

```yaml preview
- brick: eo-sidebar-menu
  properties:
    menuCollapsed: true
  children:
    - brick: eo-sidebar-menu-item
      properties:
        icon:
          lib: antd
          icon: home
      slots:
        "":
          bricks:
            - brick: span
              properties:
                textContent: 首页
    - brick: eo-sidebar-menu-item
      properties:
        icon:
          lib: antd
          icon: setting
      slots:
        "":
          bricks:
            - brick: span
              properties:
                textContent: 设置
```
