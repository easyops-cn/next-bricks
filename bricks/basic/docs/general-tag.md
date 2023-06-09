通用标签构件

```yaml preview
- brick: basic.general-tag
  properties:
    textContent: Normal Item
```

## Examples

### Closable & Event

```yaml preview
- brick: basic.general-tag
  properties:
    textContent: Normal Item
- brick: basic.general-tag
  properties:
    closable: true
    textContent: Closable Item
  events:
    close:
      - action: message.success
        args:
          - <% JSON.stringify(EVENT.detail) %>
```

### Checkable & Event

```yaml preview
- brick: basic.general-tag
  properties:
    checkable: true
    textContent: Check Item
  events:
    check:
      - action: message.success
        args:
          - <% JSON.stringify(EVENT.detail) %>
- brick: basic.general-tag
  properties:
    checkable: true
    textContent: Default Checked Item
    checked: true
  events:
    check:
      - action: message.success
        args:
          - <% JSON.stringify(EVENT.detail) %>
```

### Disabled

```yaml preview
- brick: basic.general-tag
  properties:
    closable: true
    checkable: true
    disabled: true
    textContent: Disabled Item
```

### Size

```yaml preview
- brick: basic.general-tag
  properties:
    size: large
    textContent: Large Item
- brick: basic.general-tag
  properties:
    size: medium
    textContent: Medium Item
- brick: basic.general-tag
  properties:
    size: small
    textContent: Small Item
```

### Color

```yaml preview
- brick: div
  properties:
    textContent: "Normal:"
- brick: basic.general-tag
  properties:
    color: gray
    textContent: " 灰色 "
- brick: basic.general-tag
  properties:
    color: red
    textContent: " 红色 "
- brick: basic.general-tag
  properties:
    color: orange
    textContent: " 橙色 "
- brick: basic.general-tag
  properties:
    color: yellow
    textContent: " 黄色 "
- brick: basic.general-tag
  properties:
    color: blue
    textContent: " 蓝色 "
- brick: basic.general-tag
  properties:
    color: geekblue
    textContent: " 深蓝色 "
- brick: basic.general-tag
  properties:
    color: cyan
    textContent: " 浅蓝色 "
- brick: basic.general-tag
  properties:
    color: green
    textContent: " 绿色 "
- brick: basic.general-tag
  properties:
    color: purple
    textContent: " 紫色 "
- brick: div
  properties:
    textContent: "Inverse:"
- brick: basic.general-tag
  properties:
    color: gray-inverse
    textContent: " 灰色 "
- brick: basic.general-tag
  properties:
    color: red-inverse
    textContent: " 红色 "
- brick: basic.general-tag
  properties:
    color: orange-inverse
    textContent: " 橙色 "
- brick: basic.general-tag
  properties:
    color: yellow-inverse
    textContent: " 黄色 "
- brick: basic.general-tag
  properties:
    color: blue-inverse
    textContent: " 蓝色 "
- brick: basic.general-tag
  properties:
    color: geekblue-inverse
    textContent: " 深蓝色 "
- brick: basic.general-tag
  properties:
    color: cyan-inverse
    textContent: " 浅蓝色 "
- brick: basic.general-tag
  properties:
    color: green-inverse
    textContent: " 绿色 "
- brick: basic.general-tag
  properties:
    color: purple-inverse
    textContent: " 紫色 "
```

### tagStyle

```yaml preview
- brick: basic.general-tag
  properties:
    textContent: TagStyle
    tagStyle:
      color: "#abc"
      width: 200px
```

### EllipsisWidth

```yaml preview
- brick: basic.general-tag
  properties:
    textContent: Hello World, This is over flow test
    ellipsisWidth: 100px
- brick: basic.general-tag
  properties:
    textContent: Hello World, This is over flow test
    ellipsisWidth: 150px
- brick: basic.general-tag
  properties:
    textContent: Hello World, This is over flow test
    ellipsisWidth: 300px
```
