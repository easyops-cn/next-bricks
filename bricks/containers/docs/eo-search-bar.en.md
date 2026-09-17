Usually used to wrap search-type bricks above the content.

## Examples

### Basic

```yaml preview
- brick: eo-search-bar
  slots:
    start:
      bricks:
        - brick: eo-search
          properties:
            placeholder: Please enter
            clearable: true
            trim: true
      type: bricks
```

### End Slot

```yaml preview
- brick: eo-search-bar
  slots:
    end:
      bricks:
        - brick: eo-button
          properties:
            type: primary
            icon:
              lib: antd
              icon: bell
        - brick: eo-button
          properties:
            icon:
              lib: antd
              icon: bell
      type: bricks
    start:
      bricks:
        - brick: eo-search
          properties:
            placeholder: Please enter
            clearable: true
            trim: true
        - brick: eo-select
          properties:
            placeholder: Please select
            inputStyle:
              width: 300px
            options:
              - Beijing
              - Shanghai
              - Guangzhou
              - Shenzhen
        - brick: eo-checkbox
          properties:
            options:
              - Beijing
            style:
              marginLeft: 12px
      type: bricks
```

### Wrap

```yaml preview
- brick: eo-search-bar
  properties:
    wrap: true
  slots:
    start:
      bricks:
        - brick: eo-search
          properties:
            placeholder: Please enter
        - brick: eo-select
          properties:
            placeholder: Please select
            options:
              - Beijing
              - Shanghai
              - Guangzhou
      type: bricks
    end:
      bricks:
        - brick: eo-button
          properties:
            type: primary
            textContent: Search
        - brick: eo-button
          properties:
            textContent: Reset
      type: bricks
```

### Align

```yaml preview
- brick: eo-search-bar
  properties:
    align: start
  slots:
    start:
      bricks:
        - brick: eo-search
          properties:
            placeholder: Please enter
      type: bricks
    end:
      bricks:
        - brick: eo-button
          properties:
            type: primary
            textContent: Search
      type: bricks
```
