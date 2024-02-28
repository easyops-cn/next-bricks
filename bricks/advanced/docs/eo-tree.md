树形构件

## Examples

### Basic

```yaml preview
brick: eo-tree
properties:
  defaultExpandAll: true
  dataSource:
    - title: parent 1
      key: 0-0
      children:
        - title: parent 1-0
          key: 0-0-0
          children:
            - title: leaf
              key: 0-0-0-0
            - title: leaf
              key: 0-0-0-1
        - title: parent 1-1
          key: 0-0-1
          children:
            - title: sss
              key: 0-0-1-0
```

### Checkable

```yaml preview
brick: eo-tree
properties:
  defaultExpandAll: true
  checkable: true
  selectable: false
  showLine: true
  switcherIcon: chevron
  dataSource:
    - title: parent 1
      key: 0-0
      children:
        - title: parent 1-0
          key: 0-0-0
          children:
            - title: leaf
              key: 0-0-0-0
            - title: leaf
              key: 0-0-0-1
        - title: parent 1-1
          key: 0-0-1
          children:
            - title: sss
              key: 0-0-1-0
events:
  check:
    action: console.log
  check.detail:
    action: console.log
```

### titleSuffixBrick

```yaml preview
brick: eo-tree
properties:
  defaultExpandAll: true
  titleSuffixBrick:
    useBrick:
      brick: eo-link
      properties:
        icon:
          lib: antd
          icon: edit
          theme: outlined
        style:
          margin-left: 5px
          font-size: 12px
  dataSource:
    - title: parent 1
      key: 0-0
      children:
        - title: parent 1-0
          key: 0-0-0
          children:
            - title: leaf
              key: 0-0-0-0
            - title: leaf
              key: 0-0-0-1
        - title: parent 1-1
          key: 0-0-1
          children:
            - title: sss
              key: 0-0-1-0
```
