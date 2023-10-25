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
          icon: chevron-circle-right
          lib: fa
          prefix: fas
        text: item 1
        to: /nlicro-test3/breadcrumb/new
        type: default
        children: []
        key: "0"
      - icon:
          icon: trash-alt
          lib: fa
          prefix: fas
        text: item 2
        to: item 2
        type: default
        children: []
        key: "1"
      - type: subMenu
        title: sub 1
        icon:
          icon: trash-can
          lib: fa
          prefix: fas
        items:
          - icon:
              icon: message
              lib: fa
              prefix: fas
            text: inner 1
            to: inner 1
            type: default
            children: []
            key: "2.0"
          - icon:
              icon: text-height
              lib: fa
              prefix: fas
            text: inner 2
            to: inner 2
            type: default
            children: []
            key: "2.1"
        key: "2"
      - icon:
          icon: user-times
          lib: fa
          prefix: fas
        text: item 3
        to: item 3
        type: default
        children: []
        key: "3"
      - type: group
        title: group 1
        items:
          - icon:
              icon: message
              lib: fa
              prefix: fas
            text: inner 3
            to: inner 3
            type: default
            children: []
            key: "4.0"
          - icon:
              icon: circle-chevron-right
              lib: fa
              prefix: fas
            text: inner 4
            to: inner 4
            type: default
            children: []
            key: "4.1"
        key: "4"
      - icon:
          icon: user-xmark
          lib: fa
          prefix: fas
        text: item 4
        to: item 4
        type: default
        children: []
        key: "5"
```
