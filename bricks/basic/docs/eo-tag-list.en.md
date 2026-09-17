---
tagName: eo-tag-list
displayName: WrappedEoTagList
description: A tag list brick
category: display-component
source: "@next-bricks/basic"
---

# eo-tag-list

> A tag list brick

## Props

| property      | type                           | required | default    | description          |
| ------------- | ------------------------------ | -------- | ---------- | -------------------- |
| list          | `Array<TagListItem \| string>` | -        | -          | Tag list             |
| size          | `ComponentSize`                | -        | `"medium"` | Button size          |
| color         | `TagColor \| string`           | -        | -          | Color                |
| outline       | `boolean`                      | -        | -          | Whether it has an outline |
| showTagCircle | `boolean`                      | -        | -          | Show a circle dot    |
| disabled      | `boolean`                      | -        | -          | Whether it is disabled |
| closable      | `boolean`                      | -        | -          | Whether it can be closed |
| checkable     | `boolean`                      | -        | -          | Whether it can be checked |
| multiple      | `boolean`                      | -        | `true`     | Whether multiple selection is allowed |
| tagStyle      | `React.CSSProperties`          | -        | -          | Custom style of the tag |

## Events

| event     | detail                                                                                                                                | description       |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| check     | `{ item: TagListItem \| string \| undefined; list: TagListItem[] }` — { item: the tag item that was checked/unchecked, list: all currently checked tag items } | Check tag event   |
| close     | `{ item: TagListItem \| string \| undefined; list: TagListItem[] }` — { item: the tag item that was closed, list: the remaining tag items after closing }   | Close tag event   |
| tag.click | `TagListItem \| string \| undefined` — the tag item that was clicked                                                                    | Tag click event   |

## Examples

### Basic

Show the basic usage of the tag list.

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

After enabling `closable`, a close button is shown on the right of each tag; clicking it removes the tag.

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

After enabling `checkable`, tags can be checked; get the checked items through the `check` event.

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

`multiple: true` allows multiple selection, while `multiple: false` restricts it to single selection.

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

`disabled: true` disables all tags; you can also set `disabled: false` on a single tag item to override the global disabled state.

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

The `large`, `medium` (default) and `small` sizes are supported.

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

Set the tag color with the `color` property; preset color values and custom hexadecimal color values are supported, and `outline` sets the outline style.

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

Use `tagStyle` to apply a custom style to all tags; you can also set `tagStyle` on a single tag item to override the global style.

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

After enabling `showTagCircle`, a circle dot icon is shown before each tag.

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

Respond to tag click actions through the `tag.click` event.

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
