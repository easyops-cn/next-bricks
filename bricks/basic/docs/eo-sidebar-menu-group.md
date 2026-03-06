---
tagName: eo-sidebar-menu-group
displayName: WrappedEoSidebarMenuGroup
description: 侧栏菜单分组 已迁移至 `nav` 构件包，后续在在 `basic` 构件包中将不再更新。
category: navigation
source: "@next-bricks/basic"
deprecated: true
---

# eo-sidebar-menu-group

> 侧栏菜单分组 已迁移至 `nav` 构件包，后续在在 `basic` 构件包中将不再更新。

> **已废弃**：该构件已迁移至 `nav` 构件包，请使用新版侧栏菜单构件。

## Props

| 属性          | 类型      | 必填 | 默认值 | 说明                 |
| ------------- | --------- | ---- | ------ | -------------------- |
| collapsable   | `boolean` | 是   | `true` | 是否允许折叠         |
| collapsed     | `boolean` | 否   | -      | 是否折叠             |
| selected      | `boolean` | 否   | -      | 是否选中             |
| menuCollapsed | `boolean` | 否   | -      | 菜单整体是否收起状态 |

## Slots

| 名称  | 说明     |
| ----- | -------- |
| title | 分组标题 |

## Examples

### Basic

展示可折叠的菜单分组，通过 `title` 插槽设置分组标题。

```yaml preview
- brick: eo-sidebar-menu
  children:
    - brick: eo-sidebar-menu-group
      slots:
        title:
          bricks:
            - brick: span
              properties:
                textContent: 资源管理
        "":
          bricks:
            - brick: eo-sidebar-menu-item
              properties:
                icon:
                  lib: antd
                  icon: database
              slots:
                "":
                  bricks:
                    - brick: span
                      properties:
                        textContent: 主机
            - brick: eo-sidebar-menu-item
              properties:
                icon:
                  lib: antd
                  icon: cloud
                selected: true
              slots:
                "":
                  bricks:
                    - brick: span
                      properties:
                        textContent: 云主机
```

### Non-collapsable

设置 `collapsable` 为 `false` 禁止分组折叠。

```yaml preview
- brick: eo-sidebar-menu
  children:
    - brick: eo-sidebar-menu-group
      properties:
        collapsable: false
        selected: true
      slots:
        title:
          bricks:
            - brick: span
              properties:
                textContent: 固定分组
        "":
          bricks:
            - brick: eo-sidebar-menu-item
              properties:
                icon:
                  lib: antd
                  icon: file
              slots:
                "":
                  bricks:
                    - brick: span
                      properties:
                        textContent: 文档管理
```

### Pre-collapsed

设置 `collapsed` 为 `true` 使分组默认处于折叠状态。

```yaml preview
- brick: eo-sidebar-menu
  children:
    - brick: eo-sidebar-menu-group
      properties:
        collapsed: true
      slots:
        title:
          bricks:
            - brick: span
              properties:
                textContent: 高级设置
        "":
          bricks:
            - brick: eo-sidebar-menu-item
              properties:
                icon:
                  lib: antd
                  icon: tool
              slots:
                "":
                  bricks:
                    - brick: span
                      properties:
                        textContent: 高级配置
```
