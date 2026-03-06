---
tagName: eo-tag-list
displayName: WrappedEoTagList
description: 标签列表构件
category: display-component
source: "@next-bricks/basic"
---

# eo-tag-list

> 标签列表构件

## Props

| 属性          | 类型                           | 必填 | 默认值     | 说明           |
| ------------- | ------------------------------ | ---- | ---------- | -------------- |
| list          | `Array<TagListItem \| string>` | -    | -          | 标签列表       |
| size          | `ComponentSize`                | -    | `"medium"` | 按钮大小       |
| color         | `TagColor \| string`           | -    | -          | 颜色           |
| outline       | `boolean`                      | -    | -          | 是否有边线     |
| showTagCircle | `boolean`                      | -    | -          | 显示圆点       |
| disabled      | `boolean`                      | -    | -          | 是否禁用       |
| closable      | `boolean`                      | -    | -          | 是否允许关闭   |
| checkable     | `boolean`                      | -    | -          | 是否允许选择   |
| multiple      | `boolean`                      | -    | `true`     | 是否允许多选   |
| tagStyle      | `React.CSSProperties`          | -    | -          | 标签自定义样式 |

## Events

| 事件      | detail                                                                                                                                | 说明         |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| check     | `{ item: TagListItem \| string \| undefined; list: TagListItem[] }` — { item: 被选中/取消选中的标签项, list: 当前所有选中的标签列表 } | 选择标签事件 |
| close     | `{ item: TagListItem \| string \| undefined; list: TagListItem[] }` — { item: 被关闭的标签项, list: 关闭后剩余的标签列表 }            | 关闭标签事件 |
| tag.click | `TagListItem \| string \| undefined` — 被点击的标签项                                                                                 | 点击标签事件 |

## Examples

### Basic

展示基本的标签列表用法。

```yaml preview
- brick: eo-tag-list
  properties:
    list:
      - text: Item A
        key: Item A
      - text: Item B
        key: Item B
      - text: Item C
        key: Item C
```

### Closable

启用 `closable` 后，每个标签右侧显示关闭按钮，点击可移除标签。

```yaml preview
- brick: eo-tag-list
  properties:
    closable: true
    list:
      - text: Item A
        key: Item A
      - text: Item B
        key: Item B
      - text: Item C
        key: Item C
  events:
    close:
      - action: message.success
        args:
          - <% JSON.stringify(EVENT.detail) %>
```

### Checkable

启用 `checkable` 后，标签可被选中，通过 `check` 事件获取选中项。

```yaml preview
- brick: eo-tag-list
  properties:
    checkable: true
    list:
      - text: Item A
        key: Item A
      - text: Default checked item
        key: Item B
        checked: true
      - text: Item C
        key: Item C
  events:
    check:
      - action: message.success
        args:
          - <% JSON.stringify(EVENT.detail) %>
```

### Multiple

`multiple: true` 允许多选，`multiple: false` 限制为单选。

```yaml preview
- brick: eo-tag-list
  properties:
    multiple: true
    checkable: true
    list:
      - text: Item A
        key: Item A
      - text: Item B
        key: Item B
      - text: Item C
        key: Item C
- brick: div
  properties:
    style:
      height: 20px
- brick: eo-tag-list
  properties:
    multiple: false
    checkable: true
    list:
      - text: Item A
        key: Item A
      - text: Item B
        key: Item B
      - text: Item C
        key: Item C
```

### Disabled

`disabled: true` 禁用所有标签，也可在单个标签项上设置 `disabled: false` 覆盖全局禁用。

```yaml preview
- brick: eo-tag-list
  properties:
    closable: true
    checkable: true
    disabled: true
    multiple: true
    list:
      - text: Item A
        key: Item A
      - text: Item B
        key: Item B
        disabled: false
      - text: Item C
        key: Item C
      - text: Item D
        key: Item D
        disabled: false
```

### Size

支持 `large`、`medium`（默认）、`small` 三种尺寸。

```yaml preview
- brick: eo-tag-list
  properties:
    size: large
    list:
      - text: Item A
        key: Item A
      - text: Item B
        key: Item B
      - text: Item C
        key: Item C
- brick: eo-tag-list
  properties:
    size: medium
    list:
      - text: Item A
        key: Item A
      - text: Item B
        key: Item B
      - text: Item C
        key: Item C
    style:
      margin: 0 10px
- brick: eo-tag-list
  properties:
    size: small
    list:
      - text: Item A
        key: Item A
      - text: Item B
        key: Item B
      - text: Item C
        key: Item C
```

### Color

通过 `color` 属性设置标签颜色，支持预设颜色值和自定义十六进制色值，`outline` 可设置描边样式。

```yaml preview
- brick: eo-tag-list
  properties:
    multiple: true
    list:
      - text: Item A
        key: Item A
        color: red
      - text: Item A+
        key: Item A+
        color: red
        outline: true
      - text: Item B
        key: Item B
        color: red-inverse
      - text: Item C
        key: Item C
        color: yellow
      - text: Item D
        key: Item D
        color: blue-inverse
      - text: Custom Color Item
        key: Custom Color Item
        color: "#abc"
```

### TagStyle

通过 `tagStyle` 为所有标签应用自定义样式，也可在单个标签项上单独设置 `tagStyle` 覆盖全局样式。

```yaml preview
- brick: eo-tag-list
  properties:
    list:
      - text: Item A
        key: Item A
      - text: Item B
        key: Item B
        tagStyle:
          color: green
      - text: Item C
        key: Item C
    tagStyle:
      color: red
```

### ShowTagCircle

启用 `showTagCircle` 后，每个标签前会显示一个圆点图标。

```yaml preview
- brick: eo-tag-list
  properties:
    showTagCircle: true
    list:
      - text: Item A
        key: Item A
      - text: Item B
        key: Item B
      - text: Item C
        key: Item C
```

### TagClick

通过 `tag.click` 事件响应标签点击操作。

```yaml preview
- brick: eo-tag-list
  properties:
    list:
      - text: Item A
        key: Item A
      - text: Item B
        key: Item B
      - text: Item C
        key: Item C
  events:
    tag.click:
      - action: message.success
        args:
          - <% JSON.stringify(EVENT.detail) %>
```
