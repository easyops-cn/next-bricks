通用抽屉容器构件。

```html preview minHeight="320px"
<eo-drawer custom-title="Drawer Title" visible="true">Content</eo-drawer>
```

## Examples

### Placement

```yaml preview minHeight="500px"
- brick: eo-button
  properties:
    textContent: Top
  events:
    click:
      - target: "#drawer-top"
        method: open
- brick: eo-button
  properties:
    textContent: Left
  events:
    click:
      - target: "#drawer-left"
        method: open
- brick: eo-button
  properties:
    textContent: Right
  events:
    click:
      - target: "#drawer-right"
        method: open
- brick: eo-button
  properties:
    textContent: Bottom
  events:
    click:
      - target: "#drawer-bottom"
        method: open
- brick: eo-drawer
  properties:
    customTitle: 抽屉标题
    id: "drawer-top"
    placement: top
- brick: eo-drawer
  properties:
    customTitle: 抽屉标题
    id: "drawer-left"
    placement: left
- brick: eo-drawer
  properties:
    customTitle: 抽屉标题
    id: "drawer-right"
    placement: right
- brick: eo-drawer
  properties:
    customTitle: 抽屉标题
    id: "drawer-bottom"
    placement: bottom
```

### Width

```yaml preview minHeight="320px"
- brick: eo-button
  properties:
    textContent: open
  events:
    click:
      - target: "#drawer"
        method: open
- brick: eo-drawer
  properties:
    customTitle: 抽屉标题
    id: "drawer"
    width: 200
  children:
    - brick: div
      properties:
        textContent: 抽屉内容
```

### Height

```yaml preview minHeight="320px"
- brick: eo-button
  properties:
    textContent: open
  events:
    click:
      - target: "#drawer"
        method: open
- brick: eo-drawer
  properties:
    customTitle: 抽屉标题
    id: "drawer"
    height: 200
    placement: top
  children:
    - brick: div
      properties:
        textContent: 抽屉内容
```

### Closable

```yaml preview minHeight="320px"
- brick: eo-button
  properties:
    textContent: Show Close
  events:
    click:
      - target: "#drawer-show-close"
        method: open
- brick: eo-button
  properties:
    textContent: Hide Close
  events:
    click:
      - target: "#drawer-hide-close"
        method: open
- brick: eo-drawer
  properties:
    customTitle: 抽屉标题
    id: "drawer-show-close"
  children:
    - brick: div
      properties:
        textContent: 抽屉内容
- brick: eo-drawer
  properties:
    customTitle: 抽屉标题
    id: "drawer-hide-close"
    closable: false
  children:
    - brick: div
      properties:
        textContent: 抽屉内容
```

### Mask

```yaml preview minHeight="320px"
- brick: eo-button
  properties:
    textContent: Show Mask
  events:
    click:
      - target: "#drawer-show-mask"
        method: open
- brick: eo-drawer
  properties:
    customTitle: 抽屉标题
    id: "drawer-show-mask"
    mask: true
  children:
    - brick: div
      properties:
        textContent: 抽屉内容
- brick: eo-button
  properties:
    textContent: Hide Mask
  events:
    click:
      - target: "#drawer-hide-mask"
        method: open
- brick: eo-drawer
  properties:
    customTitle: 抽屉标题
    id: "drawer-hide-mask"
    mask: false
  children:
    - brick: div
      properties:
        textContent: 抽屉内容
```

### MaskClosable

```yaml preview minHeight="320px"
- brick: eo-button
  properties:
    textContent: Mask Allow Close
  events:
    click:
      - target: "#drawer-mask-allow-close"
        method: open
- brick: eo-drawer
  properties:
    customTitle: 抽屉标题
    id: "drawer-mask-allow-close"
    maskClosable: true
  children:
    - brick: div
      properties:
        textContent: 抽屉内容
- brick: eo-button
  properties:
    textContent: Mask Not Allow Close
  events:
    click:
      - target: "#drawer-mask-not-allow-close"
        method: open
- brick: eo-drawer
  properties:
    customTitle: 抽屉标题
    id: "drawer-mask-not-allow-close"
    maskClosable: false
  children:
    - brick: div
      properties:
        textContent: 抽屉内容
```

### Slots

```yaml preview minHeight="320px"
- brick: eo-button
  properties:
    textContent: open
  events:
    click:
      - target: "#drawer"
        method: open
- brick: eo-drawer
  properties:
    customTitle: 抽屉标题
    id: "drawer"
    footerSlot: true
  children:
    - brick: div
      properties:
        textContent: 抽屉内容
    - brick: div
      slot: footer
      properties:
        textContent: 底部内容
    - brick: div
      slot: extra
      properties:
        textContent: 头部右上角
    - brick: div
      slot: headerLeft
      properties:
        textContent: 头部左上角
```

### Open Event & Close Event

```yaml preview minHeight="320px"
- brick: eo-button
  properties:
    textContent: open
  events:
    click:
      - target: "#drawer"
        method: open
- brick: eo-drawer
  properties:
    customTitle: 抽屉标题
    id: "drawer"
    placement: left
    keyboard: true
  events:
    open:
      - action: message.success
        args:
          - Drawer Open
    close:
      - action: message.success
        args:
          - Drawer Close
  children:
    - brick: eo-button
      properties:
        textContent: 关闭弹窗
      events:
        click:
          - target: "#drawer"
            method: "close"
```
