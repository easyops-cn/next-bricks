显示水印。

## Examples

### Basic

```yaml preview minHeight="500px"
brick: div
lifeCycle:
  onPageLoad:
    - useProvider: basic.show-watermark
      args:
        - content: Developer
          zIndex: -1
children:
  - brick: eo-button
    properties:
      textContent: Click
```

### Mutiple Content

```yaml preview minHeight="500px"
brick: div
lifeCycle:
  onPageLoad:
    - useProvider: basic.show-watermark
      args:
        - content:
            - Hello
            - World
          width: 180
          height: 60
          zIndex: -1
children:
  - brick: eo-button
    properties:
      textContent: Click
```

### custom style

```yaml preview minHeight="500px"
brick: div
lifeCycle:
  onPageLoad:
    - useProvider: basic.show-watermark
      args:
        - content:
            - Developer
            - Easyops
            - Hello
            - World
          width: 300
          rotate: 45
          font:
            fontSize: 22
            fontWeight: 500
            color: rgba(100,100,0,0.4)
          gap:
            - 10
            - 10
children:
  - brick: eo-button
    properties:
      textContent: Click
```

### Image

```yaml preview minHeight="500px"
brick: div
lifeCycle:
  onPageLoad:
    - useProvider: basic.show-watermark
      args:
        - image: https://user-assets.sxlcdn.com/images/367275/FoZZCRcWcp4_HPWinw2CpHbu8Dnm.png?imageMogr2/strip/auto-orient/thumbnail/720x1440%3E/format/png
          width: 100
          height: 50
          zIndex: -1
children:
  - brick: eo-button
    properties:
      textContent: Click
```

### Custom container

```yaml preview minHeight="500px"
brick: div
lifeCycle:
  onPageLoad:
    - useProvider: basic.show-watermark
      args:
        - content: Only Box
          container: "#box"
children:
  - brick: eo-button
    properties:
      textContent: Click
  - brick: div
    properties:
      id: box
      style:
        position: relative
        height: 500px
        margin: 20px
        background: "rgb(122, 122, 122)"
        display: flex
        justifyContent: center
        alignItems: center
        fontSize: 50px
        flexDirection: column
    children:
      - brick: div
        properties:
          textContent: Box
      - brick: eo-input
        properties:
          placeholder: Hello World
```
