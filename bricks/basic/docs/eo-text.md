通用文本构件。

```html preview
<eo-text color="blue" font-size="20px" display="block" font-weight="500">
  Hello World
</eo-text>
```

## Examples

### type

```yaml preview
- brick: eo-text
  properties:
    type: secondary
    textContent: Hello World
- brick: eo-text
  properties:
    type: success
    textContent: Hello World
- brick: eo-text
  properties:
    type: warning
    textContent: Hello World
- brick: eo-text
  properties:
    type: danger
    textContent: Hello World
- brick: eo-text
  properties:
    type: disabled
    textContent: Hello World
- brick: eo-text
  properties:
    type: code
    textContent: Hello World
- brick: eo-text
  properties:
    type: keyboard
    textContent: Hello World
```

### CustomStyle

```yaml preview
- brick: eo-text
  properties:
    customStyle:
      color: "#abc"
      fontSize: 48px
    textContent: Hello World
```
