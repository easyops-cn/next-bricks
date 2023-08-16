常用来包裹内容上方的搜索类构件

## Examples

### Basic

```yaml preview
- brick: eo-search-bar
  slots:
    start:
      bricks:
        - brick: presentational-bricks.brick-general-search
          properties:
            placeholder: text here to search
      type: bricks
```

### End Slot

```yaml preview
- brick: eo-search-bar
  slots:
    end:
      bricks:
        - brick: basic-bricks.general-button
          properties:
            buttonIcon: reload
            buttonType: primary
        - brick: basic-bricks.general-button
          properties:
            buttonIcon: fullscreen
            buttonType: primary
      type: bricks
    start:
      bricks:
        - brick: presentational-bricks.brick-general-search
          properties:
            placeholder: text here to search
        - brick: forms.general-select
          properties:
            inputBoxStyle:
              width: 300
            options:
              - general-drawer
              - general-input
              - general-select
            placeholder: please select a brick
        - brick: forms.general-checkbox
          properties:
            options:
              - 与我相关
            style:
              marginLeft: 12px
      type: bricks
```
