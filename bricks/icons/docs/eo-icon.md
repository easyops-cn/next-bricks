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
    - brick: eo-icon
      properties:
        lib: lucide
        icon: activity
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

### Lucide

[View all Lucide icons.](https://lucide.dev/icons/)

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
        lib: lucide
        icon: activity
    - brick: eo-icon
      properties:
        lib: lucide
        icon: languages
    - brick: eo-icon
      properties:
        lib: lucide
        icon: ambulance
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

### Image

```yaml preview
brick: div
properties:
  style:
    display: flex
    gap: 1em
    fontSize: 32px
    color: var(--palette-green-6)
children:
  - brick: eo-icon
    properties:
      imgSrc: https://img.icons8.com/cotton/64/like--v1.png
  - brick: eo-icon
    properties:
      imgSrc: https://img.icons8.com/color/48/happy--v1.png
  - brick: eo-icon
    properties:
      imgSrc: https://img.icons8.com/flat-round/64/cottage.png
  - brick: eo-icon
    properties:
      imgSrc: "https://cdn.jsdelivr.net/npm/lucide-static@0.16.29/icons/pie-chart.svg"
  - brick: eo-icon
    properties:
      imgSrc: "https://cdn.jsdelivr.net/npm/lucide-static@0.16.29/icons/pie-chart.svg"
      keepSvgOriginalColor: true
```

### Colors

```yaml preview
- brick: div
  properties:
    style:
      display: grid
      gridTemplateColumns: repeat(4, 1fr)
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
    - brick: eo-icon
      properties:
        lib: lucide
        icon: ambulance
    - brick: eo-icon
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
        lib: lucide
        icon: ambulance
        style:
          color: red
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
    - brick: eo-icon
      properties:
        lib: lucide
        icon: ambulance
        gradientDirection: left-to-right
        startColor: pink
        endColor: red
```

### Spinning

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
        spinning: true
        lib: antd
        theme: outlined
        icon: loading
    - brick: eo-icon
      properties:
        spinning: true
        lib: fa
        icon: spinner
    - brick: eo-icon
      properties:
        spinning: true
        lib: easyops
        category: third-menu
        icon: placeholder-third-menu
    - brick: eo-icon
      properties:
        spinning: true
        lib: lucide
        icon: loader-circle
```

### Fallback

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
        icon: oops
        fallback:
          lib: fa
          icon: question
    - brick: eo-icon
      properties:
        lib: fa
        icon: oops
        fallback:
          lib: fa
          icon: question
    - brick: eo-icon
      properties:
        lib: easyops
        icon: oops
        fallback:
          lib: fa
          icon: question
    - brick: eo-icon
      properties:
        lib: lucide
        icon: oops
        fallback:
          lib: fa
          icon: question
    - brick: eo-icon
      properties:
        lib: antd
        icon: oops
        fallback:
          imgSrc: "https://cdn.jsdelivr.net/npm/lucide-static@0.16.29/icons/pie-chart.svg"
    - brick: eo-icon
      properties:
        imgSrc: "https://cdn.jsdelivr.net/npm/lucide-static@0.16.29/icons/x-chart.svg"
        fallback:
          imgSrc: "https://cdn.jsdelivr.net/npm/lucide-static@0.16.29/icons/pie-chart.svg"
    - brick: eo-icon
      properties:
        imgSrc: "https://cdn.jsdelivr.net/npm/lucide-static@0.16.29/icons/x-chart.svg"
        fallback:
          imgSrc: "https://cdn.jsdelivr.net/npm/lucide-static@0.16.29/icons/y-chart.svg"
```
