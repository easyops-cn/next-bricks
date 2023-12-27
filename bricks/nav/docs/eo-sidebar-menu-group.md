侧栏菜单分组

## Examples

### Basic

```yaml preview
- brick: eo-sidebar-menu-group
  properties:
    style:
      width: 196px
  children:
    - brick: span
      slot: title
      properties:
        textContent: "菜单分组"
    - brick: eo-sidebar-menu-item
      properties:
        textContent: "菜单项 1"
        icon:
          lib: easyops
          category: second-menu
          icon: advanced-settings-second-menu
    - brick: eo-sidebar-menu-item
      properties:
        textContent: "菜单项 2"
        icon:
          lib: easyops
          category: second-menu
          icon: alibaba-cloud-disk-second-menu
    - brick: eo-sidebar-menu-item
      properties:
        textContent: "菜单项 3"
        icon:
          lib: easyops
          category: second-menu
          icon: advanced-settings-second-menu
```
