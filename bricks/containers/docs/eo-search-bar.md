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
            placeholder: 请选择
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
            placeholder: 请输入
        - brick: eo-select
          properties:
            placeholder: 请选择
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
            textContent: 搜索
        - brick: eo-button
          properties:
            textContent: 重置
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
            placeholder: 请输入
      type: bricks
    end:
      bricks:
        - brick: eo-button
          properties:
            type: primary
            textContent: 搜索
      type: bricks
```
