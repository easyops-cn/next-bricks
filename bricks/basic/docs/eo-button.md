通用按钮构件。

```html preview
<eo-button type="primary">I'm a button</eo-button>
```

## Examples

### Types

```yaml preview gap
- brick: eo-button
  properties:
    type: primary
    textContent: Primary
- brick: eo-button
  properties:
    textContent: Default
- brick: eo-button
  properties:
    type: dashed
    textContent: Dashed
- brick: eo-button
  properties:
    type: ghost
    textContent: Ghost
- brick: eo-button
  properties:
    type: icon
    icon:
      lib: antd
      icon: edit
- brick: eo-button
  properties:
    type: text
    textContent: Text
- brick: eo-button
  properties:
    type: link
    textContent: Link
- brick: eo-button
  properties:
    type: ai
    textContent: ai
- brick: eo-button
  properties:
    type: ai-alt
    size: large
    icon:
      lib: lucide
      icon: sparkles
      fill: true
      strokeWidth: 1.5
    textContent: ai-alt
```

### Sizes

```html preview gap
<eo-button size="large">Large</eo-button>

<eo-button>Medium</eo-button>

<eo-button size="small">Small</eo-button>

<eo-button size="xs">X-small</eo-button>
```

### Shapes

```html preview gap
<eo-button>Square</eo-button>

<eo-button shape="circle">X</eo-button>
```

### Danger

```html preview gap
<eo-button danger type="primary">Primary</eo-button>

<eo-button danger>Default</eo-button>

<eo-button danger type="dashed">Dashed</eo-button>

<eo-button danger type="ghost">Ghost</eo-button>

<eo-button danger type="text">Text</eo-button>

<eo-button danger type="link">Link</eo-button>
```

### Disabled

```html preview gap
<eo-button disabled type="primary">Primary</eo-button>

<eo-button disabled>Default</eo-button>

<eo-button disabled type="dashed">Dashed</eo-button>

<eo-button disabled type="ghost">Ghost</eo-button>

<eo-button disabled type="text">Text</eo-button>

<eo-button disabled type="link">Link</eo-button>

<eo-button disabled danger>Danger</eo-button>

<eo-button disabled danger type="primary">Danger primary</eo-button>
```

### Tooltips

```html preview gap minHeight="130px"
<eo-button type="primary" tooltip="primary">Primary</eo-button>

<eo-button type="link" tooltip="link">Link</eo-button>

<eo-button disabled tooltip="disabled">Default</eo-button>
```

### Icons

```yaml preview gap
- brick: eo-flex-layout
  properties:
    gap: 8px
  children:
    - brick: eo-button
      properties:
        icon:
          lib: antd
          icon: bell
        textContent: Alarm
    - brick: eo-button
      properties:
        icon:
          lib: antd
          icon: setting
          theme: filled
    - brick: eo-button
      properties:
        icon:
          lib: antd
          icon: setting
          theme: filled
        type: primary
    - brick: eo-button
      properties:
        icon:
          lib: antd
          icon: setting
          theme: filled
        shape: circle
```

### Click

```yaml preview
- brick: eo-button
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
<eo-button type="link" href="https://baidu.com/" target="_blank">
  Link to Baidu
</eo-button>
```
