现代风格的组件标题

## Examples

### Basic

```yaml preview
- brick: data-view.modern-style-component-title
  properties:
    componentTitle: 组件标题
    style:
      height: 50px
      display: block
      background-color: "#1c1e21"
```

### TitleSuffix && Toolbar slot

```yaml preview
- brick: data-view.modern-style-component-title
  properties:
    componentTitle: 组件标题
    style:
      height: 50px
      display: block
      background-color: "#1c1e21"
  slots:
    toolbar:
      type: bricks
      bricks:
        - brick: span
          properties:
            textContent: toolbar
    titleSuffix:
      type: bricks
      bricks:
        - brick: span
          properties:
            textContent: titleSuffix
```

### hideRightComponent

```yaml preview
- brick: data-view.modern-style-component-title
  properties:
    componentTitle: 组件标题
    hideRightComponent: false
    hideLeftComponent: true
    style:
      height: 50px
      display: block
      background-color: "#1c1e21"
```
