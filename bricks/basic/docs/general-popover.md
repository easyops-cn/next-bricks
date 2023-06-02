通用弹出层构件

## Examples

### Triggers

```html preview
<div class="example">
  <basic.general-popover placement="bottom">
    <basic.general-button slot="anchor">Click me</basic.general-button>
    <div class="example-panel">I'm popover</div>
  </basic.general-popover>

  <basic.general-popover trigger="hover" placement="bottom">
    <basic.general-button slot="anchor">Hover me</basic.general-button>
    <div class="example-panel">I'm popover</div>
  </basic.general-popover>
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
  <basic.general-popover placement="bottom">
    <basic.general-button slot="anchor">Bottom</basic.general-button>
    <div class="example-panel">I'm popover</div>
  </basic.general-popover>

  <basic.general-popover placement="right">
    <basic.general-button slot="anchor">Right</basic.general-button>
    <div class="example-panel">I'm popover</div>
  </basic.general-popover>

  <basic.general-popover placement="left">
    <basic.general-button slot="anchor">Left</basic.general-button>
    <div class="example-panel">I'm popover</div>
  </basic.general-popover>

  <basic.general-popover placement="top">
    <basic.general-button slot="anchor">Top</basic.general-button>
    <div class="example-panel">I'm popover</div>
  </basic.general-popover>
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
