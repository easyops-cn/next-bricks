提示

## Examples

### Basic

```yaml preview
brick: div
properties:
  style:
    margin: 50px
children:
  - brick: eo-tooltip
    properties:
      content: This is a tooltip
      trigger: hover
    events:
      open.change:
        - action: console.log
          args:
            - open.change
            - <% EVENT.detail %>
      after.open.change:
        - action: console.log
          args:
            - after.open.change
            - <% EVENT.detail %>
    children:
      - brick: eo-button
        properties:
          type: primary
          textContent: hover
```

### Trigger

```yaml preview
brick: div
properties:
  style:
    margin: 50px
    display: flex
    gap: 100px
children:
  - brick: eo-tooltip
    properties:
      content: This is a tooltip
      trigger: hover
    children:
      - brick: eo-button
        properties:
          type: primary
          textContent: hover
  - brick: eo-tooltip
    properties:
      content: This is a tooltip
      trigger: click
    children:
      - brick: eo-button
        properties:
          type: primary
          textContent: click
  - brick: eo-tooltip
    properties:
      content: This is a tooltip
      trigger: focus
    children:
      - brick: eo-input
        properties:
          type: primary
          textContent: focus
```

### Placement

```yaml preview
brick: div
properties:
  style:
    margin: 150px
    display: grid
    grid-template-areas: |
      ". top-start top top-end ."
      "left-start . . . right-start"
      "left . . . right"
      "left-end . . . right-end"
      ". bottom-start bottom bottom-end ."
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr
    gap: 20px
children:
  - brick: :forEach
    dataSource:
      - top-start
      - top
      - top-end
      - right-start
      - right
      - right-end
      - bottom-start
      - bottom
      - bottom-end
      - left-start
      - left
      - left-end
    slots:
      "":
        bricks:
          - brick: eo-tooltip
            properties:
              content: This is a tooltip
              trigger: hover
              placement: <% ITEM %>
              style:
                grid-area: <% ITEM %>
            children:
              - brick: eo-button
                properties:
                  type: primary
                  textContent: <% ITEM %>
```

### Hoist

```yaml preview
brick: div
properties:
  style:
    position: relative
    display: flex
    margin: 50px
    padding: 20px
    border: 1px solid red
    overflow: hidden
    gap: 100px
children:
  - brick: eo-tooltip
    properties:
      content: This is a tooltip
      trigger: hover
      hoist: false
    children:
      - brick: eo-button
        properties:
          type: primary
          textContent: hover
  - brick: eo-tooltip
    properties:
      content: This is a tooltip
      trigger: hover
      hoist: true
    children:
      - brick: eo-button
        properties:
          type: primary
          textContent: hover
```

### Slot

```yaml preview
brick: div
properties:
  style:
    margin: 50px
    display: flex
    gap: 100px
children:
  - brick: eo-tooltip
    properties:
      content: This is a tooltip
      trigger: hover
    children:
      - brick: eo-button
        properties:
          type: primary
          textContent: hover
  - brick: eo-tooltip
    properties:
      trigger: hover
    slots:
      "content":
        bricks:
          - brick: strong
            properties:
              style:
                color: red
              textContent: This is a tooltip
      "":
        bricks:
          - brick: eo-button
            properties:
              type: primary
              textContent: hover
```
