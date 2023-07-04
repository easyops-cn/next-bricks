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
        textContent: '<% CTX.error ? "CTX.error": "Hello" %>'
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

### Brick Next YAML with highlight

```yaml preview
- brick: vs.code-editor
  events:
    highlight.click:
      - action: console.log
  properties:
    language: brick_next_yaml
    value: |
      # Enhanced yaml for Brick Next with completers
      brick: button
      properties:
        buttonName: test
        textContent: '<% CTX.error ? "CTX.error": "Hello" %>'
        a: CTX.test
        b: <% CTX.b %>
        c: <% STATE.e %>
        d: <% PATH.instanceId %>
        e:
          action: console.log
          args:
            - <% FN.getPageDetail(APP.id, CTX.pageTitle) %>
            - <% `${ CTX.name }` %>
    automaticLayout: fit-content
    completers:
      custom:
        - label: buttonName
          detail: string
        - label: buttonType
          detail: "primary|default|link|danger"
        - label: buttonSize
          insertText: size
      target:
        triggerCharacter: ":"
        list:
          - label: a
          - label: b
      CTX:
        - label: pageTitle
        - label: name
      FN:
        - label: getPageDetail
        - label: getInstance
      PATH:
        - label: instanceId
```
