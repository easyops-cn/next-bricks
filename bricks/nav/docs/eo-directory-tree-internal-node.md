目录树节点

## Examples

### Basic

```yaml preview
brick: eo-directory-tree-internal-node
events:
  expand:
    - action: console.log
      args:
        - <% EVENT.detail %>
properties:
  style:
    width: 200px
children:
  - brick: span
    slot: label
    properties:
      textContent: 第一层级
  - brick: eo-tag
    slot: suffix
    properties:
      textContent: suffixBrick
      color: red
  - brick: eo-directory-tree-leaf
    properties:
      depth: 1
    children:
      - brick: span
        properties:
          textContent: 第二层级-1
  - brick: eo-directory-tree-leaf
    properties:
      depth: 1
    children:
      - brick: span
        properties:
          textContent: 第二层级-2
  - brick: eo-directory-tree-leaf
    properties:
      depth: 1
    children:
      - brick: span
        properties:
          textContent: 第二层级-3
```

### Selectable

```yaml preview
brick: eo-directory-tree-internal-node
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
  selectable: true
  style:
    width: 200px
children:
  - brick: span
    slot: label
    properties:
      textContent: 第一层级
  - brick: eo-tag
    slot: suffix
    properties:
      textContent: suffixBrick
      color: red
  - brick: eo-directory-tree-leaf
    properties:
      depth: 1
    children:
      - brick: span
        properties:
          textContent: 第二层级-1
  - brick: eo-directory-tree-leaf
    properties:
      depth: 1
    children:
      - brick: span
        properties:
          textContent: 第二层级-2
  - brick: eo-directory-tree-leaf
    properties:
      depth: 1
    children:
      - brick: span
        properties:
          textContent: 第二层级-3
```
