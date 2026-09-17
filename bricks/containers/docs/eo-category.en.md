---
tagName: eo-category
displayName: WrappedEoCategory
description: A general-purpose category container
category: container-display
source: "@next-bricks/containers"
---

# eo-category

> A general-purpose category container

## Props

| property | type | required | default | description |
| --- | --- | --- | --- | --- |
| categories | `CategoryProps[]` | yes | - | Category information |
| contentStyle | `React.CSSProperties` | - | - | Content style |
| headerStyle | `React.CSSProperties` | - | - | Header style |
| containerStyle | `React.CSSProperties` | - | - | Container style |
| split | `boolean` | - | - | Whether to show the divider |
| headerMask | `boolean` | - | `true` | Whether to show the header line |
| showIndex | `boolean` | - | - | Whether to show the index |

## Slots

| name | description |
| --- | --- |
| {categoryKey} | Content slot of each category item, named after the key of the corresponding category |
| {categoryKey}.titleSuffix | Title suffix slot of each category item |
| headerToolbar | Toolbar slot on the right of the header |

## Examples

### Basic

Basic usage, displaying a category container with titles and content.

```yaml preview
- brick: eo-category
  properties:
    categories:
      - title: Item 1
        key: Item 1
      - title: Item 2
        key: Item 2
  slots:
    "Item 1":
      bricks:
        - brick: div
          properties:
            textContent: Item 1 Content
    "Item 2":
      bricks:
        - brick: div
          properties:
            textContent: Item 2 Content
```

### Content Style

Uses contentStyle to customize the style of the category content area.

```yaml preview
- brick: eo-category
  properties:
    categories:
      - title: Item 1
        key: Item 1
      - title: Item 2
        key: Item 2
    contentStyle:
      background: "#abc"
  slots:
    "Item 1":
      bricks:
        - brick: div
          properties:
            textContent: Item 1 Content
    "Item 2":
      bricks:
        - brick: div
          properties:
            textContent: Item 2 Content
```

### Header Style

Uses headerStyle to customize the style of the category header area.

```yaml preview
- brick: eo-category
  properties:
    categories:
      - title: Item 1
        key: Item 1
      - title: Item 2
        key: Item 2
    headerStyle:
      background: "#abc"
      padding: 10px 20px
      marginTop: 20px
  slots:
    "Item 1":
      bricks:
        - brick: div
          properties:
            textContent: Item 1 Content
    "Item 2":
      bricks:
        - brick: div
          properties:
            textContent: Item 2 Content
```

### Container Style

Uses containerStyle to customize the style of the whole container.

```yaml preview
- brick: eo-category
  properties:
    categories:
      - title: Item 1
        key: Item 1
      - title: Item 2
        key: Item 2
    containerStyle:
      background: "#abc"
      padding: 10px 20px
      borderRadius: 8px
  slots:
    "Item 1":
      bricks:
        - brick: div
          properties:
            textContent: Item 1 Content
    "Item 2":
      bricks:
        - brick: div
          properties:
            textContent: Item 2 Content
```

### Show Index

Index display mode, with the divider enabled and the header line hidden.

```yaml preview
- brick: eo-category
  properties:
    split: true
    headerMask: false
    showIndex: true
    categories:
      - title: Form One
        key: Item 1
      - title: Form Two
        key: Item 2
  children:
    - brick: eo-form
      slot: Item 1
      properties:
        id: form
      context:
        - name: formHadSave
          value: false
      events:
        validate.success:
          - action: message.success
            args:
              - Form one saved
          - action: context.replace
            args:
              - formHadSave
              - true
          - target: "#save-btn-1"
            properties:
              textContent: Saved
              icon:
                lib: antd
                icon: check
              style:
                pointerEvents: none
      children:
        - brick: eo-input
          properties:
            label: Name
            name: name
            required: true
            disabled: <%= CTX.formHadSave %>
        - brick: eo-link
          properties:
            textContent: Save Button
            icon:
              lib: antd
              icon: save
            size: small
            id: save-btn-1
            style:
              marginTop: 4px
          events:
            click:
              - if: <% !EVENT.target.hadSave %>
                target: "#form"
                method: validate
    - brick: eo-form
      slot: Item 2
      children:
        - brick: eo-input
          properties:
            label: School
            name: school
        - brick: eo-link
          properties:
            textContent: Saved
            icon:
              lib: antd
              icon: check
            size: small
            style:
              pointerEvents: none
              marginTop: 4px
```
