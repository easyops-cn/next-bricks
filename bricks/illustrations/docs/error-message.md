构件 `illustrations.error-message`

## Examples

### Basic

```yaml preview
brick: illustrations.error-message
properties:
  errorTitle: 糟糕！页面出现了一些问题
  description: "HttpParseError: OK"
```

### Variant

```yaml preview
brick: illustrations.error-message
properties:
  variant: internet-disconnected
  errorTitle: 网络错误，请检查您的网络连接。
```

### Children

```yaml preview
brick: illustrations.error-message
properties:
  errorTitle: 糟糕！页面出现了一些问题
  description: "HttpParseError: OK"
children:
  - brick: eo-link
    properties:
      textContent: 回到上一页
    events:
      click:
        action: history.goBack
```
