工作台布局

## Examples

### Basic

```yaml preview
- brick: eo-workbench-layout
  properties:
    layouts:
      - i: hello
        x: 0
        y: 0
        w: 2
        h: 1
      - i: world
        x: 0
        y: 1
        w: 2
        h: 1
      - i: small
        x: 2
        y: 0
        w: 1
        h: 1
    componentList:
      - title: 基础布局
        brick: eo-card
        properties:
          fillVertical: true
        children:
          - brick: div
            properties:
              textContent: Hello
              style:
                textAlign: center
                fontSize: 20px
        position:
          i: hello
          x: 0
          y: 0
          w: 2
          h: 1
        key: hello
      - title: world
        brick: eo-card
        properties:
          fillVertical: true
        children:
          - brick: div
            properties:
              textContent: World
              style:
                textAlign: center
                fontSize: 20px
        position:
          i: world
          x: 0
          y: 2
          w: 2
          h: 1
        type: large
        key: world
      - title: small
        brick: div
        properties:
          style:
            height: 100%
            background: "#fff"
        children:
          - brick: div
            properties:
              textContent: small
              style:
                textAlign: center
                fontSize: 20px
        position:
          i: small
          x: 2
          y: 0
          w: 1
          h: 2
        type: small
        key: small
      - title: custom
        brick: div
        properties:
          style:
            background: "#6ad26a"
            width: 100%
            height: 100%
        position:
          i: custom
          x: 1
          y: 3
          w: 1
          h: 1
        type: custom
        key: custom
```

### Edit & Event

```yaml preview
- brick: eo-workbench-layout
  events:
    save.layout:
      - action: console.log
  properties:
    isEdit: true
    layouts:
      - i: hello
        x: 0
        y: 0
        w: 2
        h: 1
      - i: world
        x: 0
        y: 1
        w: 2
        h: 1
      - i: small
        x: 2
        y: 0
        w: 1
        h: 1
    componentList:
      - title: 基础布局
        brick: eo-card
        properties:
          fillVertical: true
        children:
          - brick: div
            properties:
              textContent: Hello
              style:
                textAlign: center
                fontSize: 20px
        position:
          i: hello
          x: 0
          y: 0
          w: 2
          h: 1
        key: hello
      - title: world
        brick: eo-card
        properties:
          fillVertical: true
        children:
          - brick: div
            properties:
              textContent: World
              style:
                textAlign: center
                fontSize: 20px
        position:
          i: world
          x: 0
          y: 2
          w: 2
          h: 1
        type: large
        key: world
      - title: small
        brick: div
        properties:
          style:
            height: 100%
            background: "#fff"
        children:
          - brick: div
            properties:
              textContent: small
              style:
                textAlign: center
                fontSize: 20px
        position:
          i: small
          x: 2
          y: 0
          w: 1
          h: 2
        type: small
        key: small
      - title: custom
        brick: div
        properties:
          style:
            background: "#6ad26a"
            width: 100%
            height: 100%
        position:
          i: custom
          x: 1
          y: 3
          w: 1
          h: 1
        type: custom
        key: custom
```
