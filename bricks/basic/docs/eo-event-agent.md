事件代理。

## Examples

### Basic

```yaml preview gap
- brick: eo-event-agent
  portal: true
  events:
    trigger:
      - if: <% EVENT.detail.type === "Good" %>
        action: message.success
        args:
          - Good happens!
      - if: <% EVENT.detail.type === "Bad" %>
        action: message.error
        args:
          - Bad happens!
- brick: eo-button
  properties:
    textContent: Good
  events:
    click:
      target: eo-event-agent
      method: trigger
      args:
        - type: Good
- brick: eo-button
  properties:
    textContent: Bad
  events:
    click:
      target: eo-event-agent
      method: trigger
      args:
        - type: Bad
```
