显示通知消息。

## Examples

```yaml preview
brick: div
properties:
  style:
    display: grid
    gap: 1em
children:
  - brick: eo-button
    properties:
      textContent: Info
    events:
      click:
        useProvider: basic.show-notification
        args:
          - message: It works!
  - brick: eo-button
    properties:
      textContent: Success
    events:
      click:
        useProvider: basic.show-notification
        args:
          - message: Success!
            type: success
  - brick: eo-button
    properties:
      textContent: Error
    events:
      click:
        useProvider: basic.show-notification
        args:
          - message: Error!
            type: error
  - brick: eo-button
    properties:
      textContent: Warn
    events:
      click:
        useProvider: basic.show-notification
        args:
          - message: Warn!
            type: warn
```
