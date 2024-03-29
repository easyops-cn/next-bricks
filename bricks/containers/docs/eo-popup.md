构件 `eo-popup`

## Examples

### Basic

```yaml preview minHeight="500px"
brick: eo-popup
properties:
  popupTitle: Popup
  popupHeight: 300px
  visible: true
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

### Resizable

```yaml preview minHeight="500px"
brick: eo-popup
properties:
  popupTitle: resizable
  visible: true
  resizable: true
children:
  - brick: div
    properties:
      textContent: Hello, I'm content!
```

### Toolbar slot

```yaml preview minHeight="300px"
brick: eo-popup
properties:
  popupTitle: resizable
  popupHeight: 200px
  visible: true
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
