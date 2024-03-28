构件 `eo-popup`

## Examples

### Basic

```yaml preview minHeight="500px"
brick: eo-popup
properties:
  popupTitle: Popup
  popupHeight: 300px
  isVisible: true
children:
  - brick: div
    properties:
      textContent: Hello, I'm content!
```

### Method & PopupId

```yaml preview minHeight="500px"
- brick: eo-button
  properties:
    textContent: Open Popup
  events:
    click:
      - target: "#popup"
        method: open
- brick: eo-button
  properties:
    textContent: Close Popup
  events:
    click:
      - target: "#popup"
        method: close
- brick: eo-popup
  properties:
    popupTitle: Button Open
    popupHeight: 400px
    id: popup
    popupId: popupA
  children:
    - brick: div
      properties:
        textContent: Hello, I'm content!
```

### Resize

```yaml preview minHeight="500px"
brick: eo-popup
properties:
  popupTitle: Resize
  isVisible: true
  resize: true
children:
  - brick: div
    properties:
      textContent: Hello, I'm content!
```

### toolbar slot

```yaml preview minHeight="300px"
brick: eo-popup
properties:
  popupTitle: Resize
  popupHeight: 200px
  isVisible: true
children:
  - brick: div
    properties:
      textContent: Hello, I'm content!
  - brick: eo-icon
    slot: toolbar
    properties:
      icon: edit
      lib: antd
      style:
        cursor: pointer
    events:
      click:
        - action: message.success
          args:
            - edit
```
