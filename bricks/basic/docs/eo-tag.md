通用标签构件

```yaml preview gap
- brick: eo-tag
  properties:
    textContent: Normal Item
```

## Examples

### Closable & Event

```yaml preview gap
- brick: eo-tag
  properties:
    textContent: Normal Item
- brick: eo-tag
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

```yaml preview gap
- brick: eo-tag
  properties:
    checkable: true
    textContent: Check Item
  events:
    check:
      - action: message.success
        args:
          - <% JSON.stringify(EVENT.detail) %>
- brick: eo-tag
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

```yaml preview gap
- brick: eo-tag
  properties:
    closable: true
    checkable: true
    disabled: true
    textContent: Disabled Item
```

### Size

```yaml preview gap
- brick: eo-tag
  properties:
    size: large
    textContent: Large Item
- brick: eo-tag
  properties:
    size: medium
    textContent: Medium Item
- brick: eo-tag
  properties:
    size: small
    textContent: Small Item
```

### Color

```yaml preview gap
- brick: div
  properties:
    textContent: "Normal:"
- brick: eo-tag
  properties:
    color: gray
    textContent: " 灰色 "
- brick: eo-tag
  properties:
    color: red
    textContent: " 红色 "
- brick: eo-tag
  properties:
    color: orange
    textContent: " 橙色 "
- brick: eo-tag
  properties:
    color: yellow
    textContent: " 黄色 "
- brick: eo-tag
  properties:
    color: blue
    textContent: " 蓝色 "
- brick: eo-tag
  properties:
    color: geekblue
    textContent: " 深蓝色 "
- brick: eo-tag
  properties:
    color: grayblue
    textContent: " 灰蓝色 "
- brick: eo-tag
  properties:
    color: cyan
    textContent: " 浅蓝色 "
- brick: eo-tag
  properties:
    color: green
    textContent: " 绿色 "
- brick: eo-tag
  properties:
    color: purple
    textContent: " 紫色 "
- brick: eo-tag
  properties:
    color: teal
    textContent: " 青绿色 "
- brick: eo-tag
  properties:
    color: pink
    textContent: " 粉色 "
- brick: div
  properties:
    style:
      flexBasis: 100%
- brick: div
  properties:
    textContent: "Inverse:"
- brick: eo-tag
  properties:
    color: gray-inverse
    textContent: " 灰色 "
- brick: eo-tag
  properties:
    color: red-inverse
    textContent: " 红色 "
- brick: eo-tag
  properties:
    color: orange-inverse
    textContent: " 橙色 "
- brick: eo-tag
  properties:
    color: yellow-inverse
    textContent: " 黄色 "
- brick: eo-tag
  properties:
    color: blue-inverse
    textContent: " 蓝色 "
- brick: eo-tag
  properties:
    color: geekblue-inverse
    textContent: " 深蓝色 "
- brick: eo-tag
  properties:
    color: grayblue-inverse
    textContent: " 灰蓝色 "
- brick: eo-tag
  properties:
    color: cyan-inverse
    textContent: " 浅蓝色 "
- brick: eo-tag
  properties:
    color: green-inverse
    textContent: " 绿色 "
- brick: eo-tag
  properties:
    color: purple-inverse
    textContent: " 紫色 "
- brick: eo-tag
  properties:
    color: teal-inverse
    textContent: " 青绿色 "
- brick: eo-tag
  properties:
    color: pink-inverse
    textContent: " 粉色 "
```

### TagStyle

```yaml preview gap
- brick: eo-tag
  properties:
    textContent: TagStyle
    tagStyle:
      color: "#abc"
      width: 200px
```

### EllipsisWidth

```yaml preview gap
- brick: eo-tag
  properties:
    textContent: Hello World, This is over flow test
    ellipsisWidth: 100px
- brick: eo-tag
  properties:
    textContent: Hello World, This is over flow test
    ellipsisWidth: 150px
- brick: eo-tag
  properties:
    textContent: Hello World, This is over flow test
    ellipsisWidth: 300px
```
