常用来包裹内容上方的搜索类构件

## Examples

### Basic

```yaml preview
- brick: eo-search-bar
  slots:
    start:
      bricks:
        - brick: eo-search
          properties:
            placeholder: 请输入
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
            placeholder: 请输入
            clearable: true
            trim: true
        - brick: eo-select
          properties:
            inputStyle:
              width: 30px
            options:
              - Beijing
              - Shanghai
              - Guangzhou
              - Shenzhen
        - brick: eo-checkbox
          properties:
            options:
              - Beijing
              - Shanghai
              - Guangzhou
              - Shenzhen
            style:
              marginLeft: 12px
      type: bricks
```
