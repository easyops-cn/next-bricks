目录树叶子节点

## Examples

### Basic

```yaml preview
brick: eo-directory-tree-leaf
events:
  select:
    - action: console.log
properties:
  style:
    width: 200px
children:
  - brick: span
    properties:
      textContent: 第一层级
  - brick: eo-tag
    slot: suffix
    properties:
      textContent: suffixBrick
      color: red
```
