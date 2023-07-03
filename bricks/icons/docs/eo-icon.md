Your favorite icons, including [Ant Design Icons](https://ant.design/components/icon-cn), [Font Awesome](https://fontawesome.com/), and EasyOps Icons.

```yaml preview
- brick: div
  properties:
    style:
      display: flex
      gap: 1em
      fontSize: 32px
  children:
    - brick: eo-icon
      properties:
        lib: antd
        icon: bell
    - brick: eo-icon
      properties:
        lib: fa
        icon: heart
    - brick: eo-icon
      properties:
        lib: easyops
        icon: honeycomb
```

## Examples

### Ant Design

[View all Ant Design icons.](https://4x.ant.design/components/icon-cn/)

```yaml preview
- brick: div
  properties:
    style:
      display: flex
      gap: 1em
      fontSize: 32px
  children:
    - brick: eo-icon
      properties:
        lib: antd
        icon: bell
    - brick: eo-icon
      properties:
        lib: antd
        theme: filled
        icon: bell
    - brick: eo-icon
      properties:
        lib: antd
        theme: twotone
        icon: bell
```

### Font Awesome

[View all Font Awesome free icons.](https://fontawesome.com/search?m=free&o=r)

```yaml preview
- brick: div
  properties:
    style:
      display: flex
      gap: 1em
      fontSize: 32px
  children:
    - brick: eo-icon
      properties:
        lib: fa
        icon: heart
    - brick: eo-icon
      properties:
        lib: fa
        prefix: far
        icon: heart
    - brick: eo-icon
      properties:
        lib: fa
        prefix: fab
        icon: github
```

### EasyOps

```yaml preview
- brick: div
  properties:
    style:
      display: flex
      gap: 1em
      fontSize: 32px
  children:
    - brick: eo-icon
      properties:
        lib: easyops
        icon: honeycomb
    - brick: eo-icon
      properties:
        lib: easyops
        category: monitor
        icon: host
    - brick: eo-icon
      properties:
        lib: easyops
        category: model
        icon: app
```

### Colors

```yaml preview
- brick: div
  properties:
    style:
      display: grid
      gridTemplateColumns: repeat(3, 1fr)
      justifyItems: center
      fontSize: 32px
      gap: 0.5em
  children:
    - brick: eo-icon
      properties:
        lib: antd
        theme: outlined
        icon: branches
    - brick: eo-icon
      properties:
        lib: fa
        prefix: far
        icon: bell
    - brick: eo-icon
      properties:
        lib: easyops
        category: default
        icon: account
    - brick: eo-antd-icon
      properties:
        lib: antd
        theme: outlined
        icon: branches
        style:
          color: cyan
    - brick: eo-icon
      properties:
        lib: fa
        prefix: far
        icon: bell
        style:
          color: orange
    - brick: eo-icon
      properties:
        lib: easyops
        category: default
        icon: account
        style:
          color: gray
    - brick: eo-icon
      properties:
        lib: antd
        theme: outlined
        icon: branches
        startColor: yellow
        endColor: red
    - brick: eo-icon
      properties:
        lib: antd
        theme: outlined
        icon: function
        startColor: green
        endColor: blue
        gradientDirection: left-to-right
    - brick: eo-icon
      properties:
        lib: fa
        prefix: far
        icon: bell
        startColor: pink
        endColor: purple
```
