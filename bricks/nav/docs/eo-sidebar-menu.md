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
    style: "<%= { width: CTX.menuCollapsed ? '40px' : '196px' } %>"
  children:
    - brick: eo-sidebar-menu-item
      properties:
        textContent: "菜单项 1"
        icon:
          lib: easyops
          category: second-menu
          icon: gaussdb-for-opengauss-second-menu
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
              lib: easyops
              category: second-menu
              icon: firewall-second-menu
        - brick: eo-sidebar-menu-item
          properties:
            textContent: "菜单项 3"
            icon:
              lib: easyops
              category: second-menu
              icon: host-resources-second-menu
        - brick: eo-sidebar-menu-item
          properties:
            textContent: "菜单项 4"
            icon:
              lib: easyops
              category: second-menu
              icon: loadbalance-second-menu
    - brick: eo-sidebar-menu-submenu
      properties:
        icon:
          lib: easyops
          category: second-menu
          icon: oceanbase-second-menu
      children:
        - brick: span
          slot: title
          properties:
            textContent: "子菜单"
        - brick: eo-sidebar-menu-item
          properties:
            textContent: "菜单项 5"
            icon:
              lib: easyops
              category: second-menu
              icon: nginx-second-menu
            inSubmenu: true
        - brick: eo-sidebar-menu-item
          properties:
            textContent: "菜单项 6"
            icon:
              lib: easyops
              category: second-menu
              icon: process-task-second-menu
            inSubmenu: true
        - brick: eo-sidebar-menu-item
          properties:
            textContent: "菜单项 7"
            icon:
              lib: easyops
              category: second-menu
              icon: persistent-volume-statement-second-menu
            inSubmenu: true
```
