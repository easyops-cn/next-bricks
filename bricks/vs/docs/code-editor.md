基于 [Monaco Editor](https://github.com/microsoft/monaco-editor) 的代码编辑器。

```yaml preview
brick: vs.code-editor
properties:
  language: typescript
  value: |
    function sayHello(): string {
      return "hello";
    }
```

## Examples

### Automatic layout - fit-content

```yaml preview
brick: vs.code-editor
properties:
  automaticLayout: fit-content
  language: typescript
  value: |
    function sayHello(): string {
      return "hello";
    }
```

### Automatic layout - fit-container

```yaml preview
brick: div
properties:
  style:
    height: 200px
children:
  - brick: vs.code-editor
    properties:
      automaticLayout: fit-container
      language: typescript
      value: |
        function sayHello(): string {
          return "hello";
        }
```

### Brick Next YAML

```yaml preview
- brick: vs.code-editor
  properties:
    language: brick_next_yaml
    value: |
      # Enhanced yaml for Brick Next
      brick: button
      properties:
        textContent: '<% CTX.error ? "Oops": "Hello" %>'
    automaticLayout: fit-content
- brick: vs.code-editor
  properties:
    language: yaml
    value: |
      # Normal yaml
      brick: button
      properties:
        textContent: '<% CTX.error ? "Oops": "Hello" %>'
    automaticLayout: fit-content
    style:
      marginTop: 2em
```
