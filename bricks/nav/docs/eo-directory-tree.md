目录树

## Examples

### Basic

```yaml preview
brick: eo-directory-tree
events:
  expand:
    - action: console.log
      args:
        - <% EVENT.detail %>
  select:
    - action: console.log
      args:
        - <% EVENT.detail %>
properties:
  style:
    width: 400px
  directoryTitle: 目录名称标题
  placeholder: 输入关键词
  searchable: true
  suffixBrick:
    useBrick:
      if: <% !Array.isArray(DATA.data.children) %>
      brick: eo-tag
      properties:
        textContent: <% DATA.data.key %>
  data:
    - key: "0"
      title: "第一层级 - 0"
    - key: "1"
      title: "第一层级 - 1"
      children:
        - key: 1-0
          title: "第二层级 - 0"
        - key: 1-1
          title: "第二层级 - 1"
          children:
            - key: 1-1-0
              title: "第三层级 - 0"
            - key: 1-1-1
              title: "第三层级 - 1"
            - key: 1-1-2
              title: "第三层级 - 2"
        - key: 1-3
          title: "第二层级 - 2"
    - key: "2"
      title: "第一层级 - 2"
    - key: "3"
      title: "第一层级 - 3"
    - key: "4"
      title: "第一层级 - 4"
children:
  - slot: toolbar
    brick: eo-mini-actions
    properties:
      actions:
        - icon:
            lib: antd
            theme: outlined
            icon: star
          isDropdown: false
          event: collect
        - icon:
            lib: antd
            icon: copy
            theme: outlined
          text: 复制链接
          isDropdown: true
          event: copy
        - icon:
            lib: antd
            icon: download
            theme: outlined
          text: 下载
          isDropdown: true
          disabled: true
          event: download
```
