---
tagName: eo-popover
displayName: WrappedEoPopover
description: A general-purpose popover brick
category: container-display
source: "@next-bricks/basic"
---

# eo-popover

> A general-purpose popover brick

## Props

| property      | type                                 | required | default      | description                                    |
| ------------- | ------------------------------------ | -------- | ------------ | ---------------------------------------------- |
| placement     | `Placement \| undefined`             | no       | -            | Popover placement                              |
| trigger       | `TriggerEvent \| undefined`          | no       | `"click"`    | Popover trigger                                |
| active        | `boolean \| undefined`               | no       | `false`      | Whether the popover is active                  |
| arrow         | `boolean \| undefined`               | no       | `true`       | Whether the popover shows an arrow             |
| shiftPadding  | `number \| undefined`                | no       | -            | Padding beyond the boundary before shifting    |
| arrowColor    | `string \| undefined`                | no       | -            | Arrow color                                    |
| strategy      | `"absolute" \| "fixed" \| undefined` | no       | `"absolute"` | How the popover is positioned                  |
| sync          | `Sync \| undefined`                  | no       | -            | Sync the popover's width and height with the anchor element |
| disabled      | `boolean \| undefined`               | no       | -            | Whether it is disabled                         |
| distance      | `number \| undefined`                | no       | -            | Distance between the popup and its anchor      |
| anchorDisplay | `CSSProperties["display"]`           | no       | -            | Display type of the trigger                    |
| zIndex        | `number \| undefined`                | no       | -            | Z-index of the popover                         |
| themeVariant  | `"default" \| "elevo" \| undefined`  | no       | -            | Theme variant                                  |

## Events

| event                 | detail                              | description                                    |
| --------------------- | ----------------------------------- | ---------------------------------------------- |
| visible.change        | `boolean` — whether it is currently visible | Triggered after the popover visibility changes |
| before.visible.change | `boolean` — whether it is currently visible | Triggered when the popover visibility changes  |

## Slots

| name      | description                |
| --------- | -------------------------- |
| (default) | Popover content            |
| anchor    | The element that triggers the popover |

## CSS Parts

| name  | description                                                                    |
| ----- | ------------------------------------------------------------------------------ |
| popup | The popup's container. Useful for setting a background color, box shadow, etc. |

## Examples

### Triggers

Displays the click and hover triggers.

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
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
```

### Placements

Displays the popover in each of the different placements.

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

### Custom Style

Customize the arrow color with arrowColor, and customize the popover container style with a CSS Part.

```html preview
<div class="example">
  <eo-popover trigger="click" placement="bottom">
    <eo-button slot="anchor">Normal</eo-button>
    <div class="example-panel box1">I'm popover</div>
  </eo-popover>

  <eo-popover
    trigger="click"
    placement="bottom"
    arrow="true"
    arrow-color="pink"
  >
    <eo-button slot="anchor">Custom Style</eo-button>
    <div class="example-panel box2">I'm popover</div>
  </eo-popover>
</div>

<style>
  .example {
    height: 132px;
  }
  .example-panel {
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--medius-border-radius);
  }
  .box2 {
    background: pink;
  }
</style>
```

### Disabled

When disabled, the popover does not respond to trigger actions.

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
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
```

### Events

Listen to the popover visibility change events.

```yaml preview minHeight="160px"
brick: eo-popover
properties:
  placement: bottom
  strategy: fixed
  zIndex: 100
children:
  - brick: eo-button
    slot: anchor
    properties:
      textContent: Click me
  - brick: div
    properties:
      style:
        padding: 12px
      textContent: I'm popover content
events:
  visible.change:
    - action: console.log
      args:
        - visible changed
        - <% EVENT.detail %>
  before.visible.change:
    - action: console.log
      args:
        - before visible changed
        - <% EVENT.detail %>
```
