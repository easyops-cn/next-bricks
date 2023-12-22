侧边栏

## Examples

### Basic

```yaml preview
brick: eo-sidebar
properties:
  style:
    height: 600px
  position: static
  menu:
    title: 这是一个菜单标题
    menuItems:
      - icon:
          lib: easyops
          category: second-menu
          icon: automatic-collection-second-menu
        text: item 1
        to: /nlicro-test3/breadcrumb/new
        type: default
        children: []
        key: "0"
      - icon:
          lib: easyops
          category: second-menu
          icon: deployment-instance-second-menu
        text: item 2
        to: item 2
        type: default
        children: []
        key: "1"
      - type: subMenu
        title: sub 1
        icon:
          lib: easyops
          category: second-menu
          icon: deployment-architecture-second-menu
        items:
          - text: inner 1
            to: inner 1
            type: default
            children: []
            key: "2.0"
          - text: inner 2
            to: inner 2
            type: default
            children: []
            key: "2.1"
          - type: group
            title: group in submenu
            items:
              - text: item - 1
                to: item - 1
                type: default
                children: []
                key: "2.3.1"
              - text: item - 2
                to: item - 2
                type: default
                children: []
                key: "2.3.2"
        key: "2"
      - icon:
          lib: easyops
          category: second-menu
          icon: elasticsearch-second-menu
        text: item 3
        to: item 3
        type: default
        children: []
        key: "3"
      - type: group
        title: group 1
        items:
          - icon:
              lib: easyops
              category: second-menu
              icon: change-history-second-menu
            text: inner 3
            to: inner 3
            type: default
            children: []
            key: "4.0"
          - icon:
              lib: easyops
              category: second-menu
              icon: broadband-line-second-menu
            text: inner 4
            to: inner 4
            type: default
            children: []
            key: "4.1"
        key: "4"
      - icon:
          lib: easyops
          category: second-menu
          icon: fill-in-second-menu
        text: item 4
        to: item 4
        type: default
        children: []
        key: "5"
```
