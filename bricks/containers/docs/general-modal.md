通用模态框容器构件。

```html preview
<containers.general-modal modal-title="Modal Title" visible="true">Content</containers.general-card>
```

## Examples

### Width & Height

```yaml preview
- brick: basic.general-button
  properties:
    textContent: Open Modal
  events:
    click:
      - target: "#modal"
        method: open
- brick: containers.general-modal
  properties:
    id: "modal"
    modalTitle: 模态框标题
    width: 300px
    height: 200px
  slots:
    "":
      bricks:
        - brick: div
          properties:
            textContent: Content
```

### MaskClosable

```yaml preview
- brick: basic.general-button
  properties:
    textContent: Mask Allow Close
  events:
    click:
      - target: "#modal-mask-allow-close"
        method: open
- brick: containers.general-modal
  properties:
    modalTitle: 模态框标题
    id: "modal-mask-allow-close"
    maskClosable: true
  slots:
    "":
      bricks:
        - brick: div
          properties:
            textContent: 模态框内容
- brick: basic.general-button
  properties:
    textContent: Mask Not Allow Close
  events:
    click:
      - target: "#modal-mast-not-allow-close"
        method: open
- brick: containers.general-modal
  properties:
    modalTitle: 模态框标题
    id: "modal-mast-not-allow-close"
    maskClosable: false
  slots:
    "":
      bricks:
        - brick: div
          properties:
            textContent: 模态框内容
```

### Fullscreen

```yaml preview
- brick: basic.general-button
  properties:
    textContent: open
  events:
    click:
      - target: "#modal"
        method: open
- brick: containers.general-modal
  properties:
    modalTitle: 模态框标题
    id: "modal"
    fullscreen: true
  slots:
    "":
      bricks:
        - brick: div
          properties:
            textContent: 模态框内容
```

### Confirm Text & Cancel Text

```html preview
<containers.general-modal
  modal-title="Modal Title"
  visible="true"
  confirm-text="提交"
  cancel-text="放弃"
>
  Content
</containers.general-card>
```

### Hide Cancel Button

```html preview
<containers.general-modal
  modal-title="Modal Title"
  visible="true"
  hide-cancel-button="true"
>
  Content
</containers.general-card>
```

### Open Event & Close Event

```yaml preview
- brick: basic.general-button
  properties:
    textContent: open
  events:
    click:
      - target: "#modal"
        method: open
- brick: containers.general-modal
  properties:
    modalTitle: 模态框标题
    id: "modal"
    placement: left
  events:
    open:
      - action: message.success
        args:
          - modal Open
    close:
      - action: message.success
        args:
          - modal Close
  slots:
    "":
      bricks:
        - brick: div
          properties:
            textContent: Content
```
