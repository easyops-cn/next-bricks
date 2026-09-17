Copies text content to the clipboard.

## Examples

```yaml preview
brick: eo-button
properties:
  textContent: Copy
events:
  click:
    useProvider: basic.copy-to-clipboard
    args:
      - Some text to copy...
    callback:
      success:
        action: message.success
        args:
          - Copied!
      error:
        action: message.error
        args:
          - Copy failed!
```
