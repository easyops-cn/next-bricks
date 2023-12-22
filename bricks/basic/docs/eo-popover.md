通用弹出层构件

## Examples

### Triggers

```html preview
<div class="example">
  <eo-popover placement="bottom">
    <eo-button slot="anchor">Click me</eo-button>
    <div class="example-panel">I'm popover</div>
  </eo-popover>

  <eo-popover trigger="hover" placement="bottom">
    <eo-button slot="anchor">Hover me</eo-button>
    <div class="example-panel">I'm popover</div>
  </eo-popover>
</div>

<style>
  .example {
    height: 132px;
  }
  .example-panel {
    width: 100px;
    height: 100px;
    box-shadow: var(--base-shadow);
    background: var(--card-default-background);
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
```

### Placements

```yaml preview
- brick: div
  properties:
    className: example
  children:
    - brick: eo-popover
      properties:
        placement: bottom-start
      children:
        - brick: eo-button
          slot: anchor
          properties:
            textContent: Bottom Start
        - brick: div
          properties:
            className: example-panel
            textContent: I'm popover
    - brick: eo-popover
      properties:
        placement: bottom
      children:
        - brick: eo-button
          slot: anchor
          properties:
            textContent: Bottom
        - brick: div
          properties:
            className: example-panel
            textContent: I'm popover
    - brick: eo-popover
      properties:
        placement: bottom-end
      children:
        - brick: eo-button
          slot: anchor
          properties:
            textContent: Bottom-End
        - brick: div
          properties:
            className: example-panel
            textContent: I'm popover
    - brick: eo-popover
      properties:
        placement: right-start
      children:
        - brick: eo-button
          slot: anchor
          properties:
            textContent: Right Start
        - brick: div
          properties:
            className: example-panel
            textContent: I'm popover
    - brick: eo-popover
      properties:
        placement: right
      children:
        - brick: eo-button
          slot: anchor
          properties:
            textContent: Right
        - brick: div
          properties:
            className: example-panel
            textContent: I'm popover
    - brick: eo-popover
      properties:
        placement: right-end
      children:
        - brick: eo-button
          slot: anchor
          properties:
            textContent: Right End
        - brick: div
          properties:
            className: example-panel
            textContent: I'm popover
    - brick: eo-popover
      properties:
        placement: left
      children:
        - brick: eo-button
          slot: anchor
          properties:
            textContent: Left
        - brick: div
          properties:
            className: example-panel
            textContent: I'm popover
    - brick: eo-popover
      properties:
        placement: left-start
      children:
        - brick: eo-button
          slot: anchor
          properties:
            textContent: Left Start
        - brick: div
          properties:
            className: example-panel
            textContent: I'm popover
    - brick: eo-popover
      properties:
        placement: left-end
      children:
        - brick: eo-button
          slot: anchor
          properties:
            textContent: Left End
        - brick: div
          properties:
            className: example-panel
            textContent: I'm popover
    - brick: eo-popover
      properties:
        placement: top-start
      children:
        - brick: eo-button
          slot: anchor
          properties:
            textContent: Top Start
        - brick: div
          properties:
            className: example-panel
            textContent: I'm popover
    - brick: eo-popover
      properties:
        placement: top
      children:
        - brick: eo-button
          slot: anchor
          properties:
            textContent: Top
        - brick: div
          properties:
            className: example-panel
            textContent: I'm popover
    - brick: eo-popover
      properties:
        placement: top-end
      children:
        - brick: eo-button
          slot: anchor
          properties:
            textContent: Top End
        - brick: div
          properties:
            className: example-panel
            textContent: I'm popover
- brick: style
  properties:
    textContent: |
      .example {
         height: 200px;
         margin: 100px;
         position: relative;
         display: grid;
         grid-template-areas:
           ". ts t te ."
           "ls . . . rs"
           "l . . . r"
           "le . . . re"
           ". bs b be .";
       }
       .example-panel {
         width: 100px;
         height: 100px;
         box-shadow: var(--base-shadow);
         background: var(--card-default-background);
         display: flex;
         align-items: center;
         justify-content: center;
       }

       [placement="left-start"] {
         grid-area: ls;
         justify-self: end;
       }
       
       [placement="left-end"] {
         grid-area: le;
         justify-self: end;
       }

       [placement="left"] {
         grid-area: l;
         justify-self: end;
       }

       [placement="right-start"] {
         grid-area: rs;
       }
       [placement="right-end"] {
         grid-area: re;
       }
       [placement="right"] {
         grid-area: r;
       }

       [placement="top-start"] {
         grid-area: ts;
         justify-self: end;
         align-self: end;
       }
       [placement="top-end"] {
         grid-area: te;
         justify-self: start;
         align-self: end;
       }
       [placement="top"] {
         grid-area: t;
         justify-self: center;
         align-self: end;
       }

       [placement="bottom-start"] {
         grid-area: bs;
         justify-self: end;
       }
       [placement="bottom-end"] {
         grid-area: be;
         justify-self: start;
       }
       [placement="bottom"] {
         grid-area: b;
         justify-self: center;
       }
```

### Disabled

```html preview
<div class="example">
  <eo-popover placement="bottom" disabled>
    <eo-button slot="anchor">Click me</eo-button>
    <div class="example-panel">I'm popover</div>
  </eo-popover>
</div>

<style>
  .example {
    height: 132px;
  }
  .example-panel {
    width: 100px;
    height: 100px;
    box-shadow: var(--base-shadow);
    background: var(--card-default-background);
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
```
