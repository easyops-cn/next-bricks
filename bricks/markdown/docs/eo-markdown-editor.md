markdown 编辑器

## Examples

### Basic

```yaml preview
- brick: eo-markdown-editor
  properties:
    value: |-
      # Markdown

      > Content.

      ![image.png](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAeQAAAD8CAYAAACmXNe7AAAACXBIWXMAABYlAAAWJQFJUiTwAAAEDklEQVR4nO3VMQEAIAzAMEDI/LsEGfRIFPTrnpm7AICvzu8AAMCQASDBkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDAkAEgwJABIMCQASDgAQOBA1GN5JhBAAAAAElFTkSuQmCC)
  events:
    markdown.value.change:
      action: console.log
      args:
        - change
        - <% EVENT.detail %>
    image.upload:
      action: console.log
      args:
        - upload
        - <% EVENT.detail %>
```

### Table

```yaml preview
- brick: eo-markdown-editor
  properties:
    value: |-
      # Markdown

      > Content.

      | head1 | head2 | head3 |
      | :---- | :---- | :---- |
      | 1     | 3     | 5     |
      | 2     | 4     | 6     |
  events:
    markdown.value.change:
      action: console.log
      args:
        - change
        - <% EVENT.detail %>
```

### CodeBlock

````yaml preview
- brick: eo-markdown-editor
  properties:
    value: |-
      # Markdown

      > Content.

      ```css
        .table-tooltip-btn-box:hover {
          background-color: #e8e8e8;
        }
      ```
  events:
    markdown.value.change:
      action: console.log
      args:
        - change
        - <% EVENT.detail %>
````

### Readonly

````yaml preview
- brick: eo-markdown-editor
  properties:
    readonly: true
    value: |-
      # Markdown

      > Content.

      ```css
        .table-tooltip-btn-box:hover {
          background-color: #e8e8e8;
        }
      ```
````

### With Form

```yaml preview
- brick: eo-form
  events:
    validate.success:
      - action: console.log
    values.change:
      - action: console.log
  children:
    - brick: eo-markdown-editor
      properties:
        name: markdown
        label: markdown
        required: true
    - brick: eo-submit-buttons
```
