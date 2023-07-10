分页

## Examples

### Basic

```yaml preview
brick: eo-pagination
properties:
  total: 100
  pageSize: 20
  page: 1
events:
  change:
    - action: console.log
      args:
        - <% EVENT.detail %>
```
