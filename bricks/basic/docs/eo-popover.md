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
    background-color: var(--palette-gray-5);
    border: 1px solid var(--palette-blue-6);
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
```

### Placements

```html preview
<div class="example">
  <eo-popover placement="bottom">
    <eo-button slot="anchor">Bottom</eo-button>
    <div class="example-panel">I'm popover</div>
  </eo-popover>

  <eo-popover placement="right">
    <eo-button slot="anchor">Right</eo-button>
    <div class="example-panel">I'm popover</div>
  </eo-popover>

  <eo-popover placement="left">
    <eo-button slot="anchor">Left</eo-button>
    <div class="example-panel">I'm popover</div>
  </eo-popover>

  <eo-popover placement="top">
    <eo-button slot="anchor">Top</eo-button>
    <div class="example-panel">I'm popover</div>
  </eo-popover>
</div>

<style>
  .example {
    height: 200px;
    position: relative;
    display: grid;
    grid-template-areas:
      ". t ."
      "l . r"
      ". b .";
  }
  .example-panel {
    width: 100px;
    height: 100px;
    background-color: var(--palette-gray-5);
    border: 1px solid var(--palette-blue-6);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  [placement="left"] {
    grid-area: r;
    align-self: center;
    justify-self: end;
  }

  [placement="right"] {
    grid-area: l;
    align-self: center;
  }

  [placement="top"] {
    grid-area: b;
    justify-self: center;
    align-self: end;
  }

  [placement="bottom"] {
    grid-area: t;
    justify-self: center;
  }
</style>
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
    background-color: var(--palette-gray-5);
    border: 1px solid var(--palette-blue-6);
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
```
