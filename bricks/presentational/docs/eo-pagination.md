分页

## Examples

### Basic

```yaml preview
brick: eo-pagination
properties:
  total: 1000
  pageSize: 20
  page: 1
events:
  change:
    - action: console.log
      args:
        - <% EVENT.detail %>
```

### By token

```yaml preview
brick: eo-pagination
properties:
  type: token
  pageSize: 20
  nextToken: abc
  previousToken: def
events:
  change:
    - action: console.log
      args:
        - <% EVENT.detail %>
```
