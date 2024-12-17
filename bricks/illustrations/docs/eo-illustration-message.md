插画消息构件

## Examples

### Basic

```yaml preview
brick: eo-illustration-message
properties:
  heading: 糟糕！页面出现了一些问题
  description: "HttpParseError: OK"
```

### Variant: internet-disconnected

```yaml preview
brick: eo-illustration-message
properties:
  variant: internet-disconnected
  heading: 网络错误，请检查您的网络连接。
```

### Variant: success

```yaml preview
brick: eo-illustration-message
properties:
  variant: success
  heading: 工具执行成功！
```

### Customize image

```yaml preview
brick: eo-illustration-message
properties:
  description: 请先创建应用
  customizeImage:
    category: default
    name: create-content
```

### Children

```yaml preview
brick: eo-illustration-message
properties:
  heading: 糟糕！页面出现了一些问题
  description: "HttpParseError: OK"
children:
  - brick: eo-link
    properties:
      textContent: 回到上一页
    events:
      click:
        action: history.goBack
```
