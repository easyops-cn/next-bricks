API目录树

## Examples

### Basic

```yaml preview
brick: api-market.apis-directory-tree
events:
  expand:
    - action: console.log
      args:
        - <% EVENT.detail %>
  select:
    - action: console.log
      args:
        - <% EVENT.detail %>
  action.click:
    - action: console.log
      args:
        - <% EVENT.detail %>
properties:
  id: directory-tree
  style:
    width: 400px
  directoryTitle: 目录名称标题
  placeholder: 输入关键词
  searchable: true
  selectedKeys:
    - "1-1-1"
  suffixBrick:
    useBrick:
      if: <% !Array.isArray(DATA.data.children) %>
      brick: eo-tag
      properties:
        textContent: <% DATA.data.key %>
  data:
    - key: "0"
      title: "第一层级 - 0"
      type: "group"
    - key: "1"
      title: "第一层级 - 1"
      type: "group"
      children:
        - key: 1-0
          title: "第二层级 - 0"
          type: "group"
        - key: 1-1
          title: "第二层级 - 1"
          type: "group"
          children:
            - key: 1-1-0
              title: "第三层级 - 0"
              type: "item"
              data:
                method: "DELETE"
            - key: 1-1-1
              title: "第三层级 - 1"
              type: "item"
              data:
                method: "GET"
            - key: 1-1-2
              title: "第三层级 - 2"
              type: "item"
              data:
                method: "POST"
        - key: 1-3
          title: "第二层级 - 2"
          type: "group"
    - key: "2"
      title: "第一层级 - 2"
      type: "group"
    - key: "3"
      title: "第一层级 - 3"
      type: "group"
    - key: "4"
      title: "第一层级 - 4"
      type: "group"
children:
  - slot: toolbar
    brick: eo-mini-actions
    events:
      expand.all:
        - target: "#directory-tree"
          method: expandAll
      collapse.all:
        - target: "#directory-tree"
          method: collapseAll
      aim:
        - target: "#directory-tree"
          method: expandAccordingToSelectedKeys
    properties:
      actions:
        - icon:
            lib: antd
            icon: down
            theme: outlined
          isDropdown: false
          event: expand.all
        - icon:
            lib: antd
            icon: up
            theme: outlined
          isDropdown: false
          event: collapse.all
        - icon:
            lib: antd
            icon: aim
            theme: outlined
          isDropdown: false
          event: aim
```
