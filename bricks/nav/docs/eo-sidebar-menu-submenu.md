侧栏菜单子菜单

## Examples

### Basic

```yaml preview
- brick: eo-sidebar-menu-submenu
  properties:
    style:
      width: 196px
    icon:
      lib: antd
      icon: menu
      theme: outlined
  children:
    - brick: span
      slot: title
      properties:
        textContent: "子菜单"
    - brick: eo-sidebar-menu-item
      properties:
        textContent: "菜单项 1"
        icon:
          lib: easyops
          category: second-menu
          icon: availability-zone-second-menu
        inSubmenu: true
    - brick: eo-sidebar-menu-item
      properties:
        textContent: "菜单项 2"
        icon:
          lib: easyops
          category: second-menu
          icon: basic-info-second-menu
        inSubmenu: true
    - brick: eo-sidebar-menu-item
      properties:
        textContent: "菜单项 3"
        icon:
          lib: easyops
          category: second-menu
          icon: deployment-tasks-second-menu
        inSubmenu: true
```
