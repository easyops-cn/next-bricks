侧栏菜单

## Examples

### Basic

```yaml preview gap
- brick: eo-button
  context:
    - name: menuCollapsed
      value: false
  properties:
    type: primary
    textContent: switch collapsed
  events:
    click:
      - action: context.replace
        args:
          - menuCollapsed
          - <% !CTX.menuCollapsed %>
- brick: eo-sidebar-menu
  properties:
    id: sidebar-menu
    menuCollapsed: <%= CTX.menuCollapsed %>
    style: "<%= { width: CTX.menuCollapsed ? '40px' : '200px' } %>"
  children:
    - brick: eo-sidebar-menu-item
      properties:
        textContent: "菜单项 1"
        icon:
          lib: "easyops"
          category: "monitor"
          icon: "alert-rule"
    - brick: eo-sidebar-menu-group
      children:
        - brick: span
          slot: title
          properties:
            textContent: "菜单分组"
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
        - brick: eo-sidebar-menu-item
          properties:
            textContent: "菜单项 4"
            icon:
              lib: "easyops"
              category: "monitor"
              icon: "alert-rule"
    - brick: eo-sidebar-menu-submenu
      properties:
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
            textContent: "菜单项 5"
            icon:
              lib: "easyops"
              category: "monitor"
              icon: "alert-rule"
        - brick: eo-sidebar-menu-item
          properties:
            textContent: "菜单项 6"
            icon:
              lib: "easyops"
              category: "monitor"
              icon: "alert-rule"
        - brick: eo-sidebar-menu-item
          properties:
            textContent: "菜单项 7"
            icon:
              lib: "easyops"
              category: "monitor"
              icon: "alert-rule"
```
