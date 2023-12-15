侧栏菜单分组

## Examples

### Basic

```yaml preview
- brick: eo-sidebar-menu-group
  properties:
    style:
      width: 200px
  children:
    - brick: span
      slot: title
      properties:
        textContent: "菜单分组"
    - brick: eo-sidebar-menu-item
      properties:
        textContent: "菜单项 1"
        icon:
          lib: "easyops"
          category: "monitor"
          icon: "alert-rule"
    - brick: eo-sidebar-menu-item
      properties:
        textContent: "菜单项 2"
        icon:
          lib: "easyops"
          category: "monitor"
          icon: "alert-rule"
    - brick: eo-sidebar-menu-item
      properties:
        textContent: "菜单项 3"
        icon:
          lib: "easyops"
          category: "monitor"
          icon: "alert-rule"
```
