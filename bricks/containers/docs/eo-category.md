通用分类容器构件。

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

## Examples

### Content Style

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

```yaml preview
- brick: eo-category
  properties:
    split: true
    headerMask: false
    showIndex: true
    categories:
      - title: 表单一
        key: Item 1
      - title: 表单二
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
              - 表单一保存了
          - action: context.replace
            args:
              - formHadSave
              - true
          - target: "#save-btn-1"
            properties:
              textContent: 已保存
              icon:
                lib: antd
                icon: check
              style:
                pointerEvents: none
      children:
        - brick: eo-input
          properties:
            label: 姓名
            name: name
            required: true
            disabled: <%= CTX.formHadSave %>
        - brick: eo-link
          properties:
            textContent: 保存按钮
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
            label: 学校
            name: school
        - brick: eo-link
          properties:
            textContent: 已保存
            icon:
              lib: antd
              icon: check
            size: small
            style:
              pointerEvents: none
              marginTop: 4px
```
