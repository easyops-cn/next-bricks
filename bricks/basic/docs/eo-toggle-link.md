展开/折叠链接。

## Examples

### Basic

```yaml preview
- brick: eo-toggle-link
  context:
    - name: open
      value: false
  properties:
    textContent: Toggle me
  events:
    toggle:
      action: context.replace
      args:
        - open
        - <% EVENT.detail %>
- brick: p
  properties:
    textContent: I see you!
    hidden: <%= !CTX.open %>
```
