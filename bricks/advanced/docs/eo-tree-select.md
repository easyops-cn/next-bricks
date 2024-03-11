构件 `eo-tree-select`

## Examples

### Basic

```yaml preview minHeight="500px"
- brick: eo-tree-select
  properties:
    treeData:
      - title: Node1
        value: 0
        key: 0
        children:
          - title: Node1-1
            value: 0-1
          - title: Node1-2
            value: 0-2
          - title: Node1-3
            value: 0-3
      - title: Node2
        value: 1
        key: 1
        children:
          - title: Node2-1
            value: 1-1
          - title: Node2-2
            value: 1-2
          - title: Node2-3
            value: 1-3
```

### With Form

```yaml preview minHeight="500px"
- brick: eo-form
  events:
    validate.success:
      - action: console.log
    validate.error:
      - action: console.log
  children:
    - brick: eo-tree-select
      properties:
        label: tree
        name: tree
        required: true
        treeData:
          - title: "Node1"
            value: "Node1"
            key: "0-0"
            children:
              - title: "Child Node1-1"
                value: "Child Node1-1"
                key: "0-0-0"
              - title: "Child Node1-2"
                value: "Child Node1-2"
                key: "0-0-1"
          - title: "Node2"
            value: "0-1"
            key: "0-1"
            children:
              - title: "Child Node2-1"
                value: "Child Node2-1"
                key: "0-1-0"
              - title: "Child Node2-2"
                value: "Child Node2-2"
                key: "0-1-1"
                children:
                  - title: Child Node2-2-1
                    value: Child Node2-2-1
                    key: "0-1-1-0"
        multiple: true
        checkable: true
        placeholder: 请选择树节点
      events:
        change:
          - action: console.log
        select:
          - action: console.log
        expand:
          - action: console.log
        search:
          - action: console.log
    - brick: eo-submit-buttons
```
