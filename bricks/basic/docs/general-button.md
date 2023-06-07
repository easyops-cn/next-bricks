通用按钮构件。

```html preview
<basic.general-button type="primary">I'm a button</basic.general-button>
```

## Examples

### Types

```html preview gap
<basic.general-button type="primary">Primary</basic.general-button>

<basic.general-button>Default</basic.general-button>

<basic.general-button type="dashed">Dashed</basic.general-button>

<basic.general-button type="ghost">Ghost</basic.general-button>

<basic.general-button type="text">Text</basic.general-button>

<basic.general-button type="link">Link</basic.general-button>
```

### Sizes

```html preview gap
<basic.general-button size="large">Large</basic.general-button>

<basic.general-button>Medium</basic.general-button>

<basic.general-button size="small">Small</basic.general-button>

<basic.general-button size="xs">X-small</basic.general-button>
```

### Shapes

```html preview gap
<basic.general-button>Square</basic.general-button>

<basic.general-button shape="round">Round</basic.general-button>

<basic.general-button shape="circle">X</basic.general-button>
```

### Danger

```html preview gap
<basic.general-button danger type="primary">Primary</basic.general-button>

<basic.general-button danger>Default</basic.general-button>

<basic.general-button danger type="dashed">Dashed</basic.general-button>

<basic.general-button danger type="ghost">Ghost</basic.general-button>

<basic.general-button danger type="text">Text</basic.general-button>

<basic.general-button danger type="link">Link</basic.general-button>
```

### Disabled

```html preview gap
<basic.general-button disabled type="primary">Primary</basic.general-button>

<basic.general-button disabled>Default</basic.general-button>

<basic.general-button disabled type="dashed">Dashed</basic.general-button>

<basic.general-button disabled type="ghost">Ghost</basic.general-button>

<basic.general-button disabled type="text">Text</basic.general-button>

<basic.general-button disabled type="link">Link</basic.general-button>

<basic.general-button disabled danger>Danger</basic.general-button>

<basic.general-button disabled danger type="primary"
  >Danger primary</basic.general-button
>
```

### Icons

```yaml preview gap
- brick: basic.general-button
  properties:
    icon:
      lib: antd
      icon: bell
    textContent: Alarm
- brick: basic.general-button
  properties:
    icon:
      lib: antd
      icon: bell
- brick: basic.general-button
  properties:
    icon:
      lib: antd
      icon: bell
    type: primary
- brick: basic.general-button
  properties:
    icon:
      lib: antd
      icon: bell
    shape: circle
```

### Click

```yaml preview
- brick: basic.general-button
  properties:
    textContent: Click me
  events:
    click:
      action: message.success
      args:
        - Well done!
```

### Links

```html preview
<basic.general-button type="link" href="https://baidu.com/" target="_blank">
  Link to Baidu
</basic.general-button>
```
