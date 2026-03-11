---
tagName: eo-spin
displayName: WrappedEoSpin
description: 加载中指示器构件，在容器内容上方覆盖旋转动画和可选描述文案，支持三种尺寸
category: container-display
source: "@next-bricks/containers"
---

# eo-spin

> 加载中指示器构件，在容器内容上方覆盖旋转动画和可选描述文案，支持三种尺寸

## Props

| 属性     | 类型                              | 必填 | 默认值      | 说明             |
| -------- | --------------------------------- | ---- | ----------- | ---------------- |
| size     | `"small" \| "default" \| "large"` | -    | `"default"` | 加载指示符大小   |
| tip      | `string`                          | -    | -           | 自定义描述文案   |
| spinning | `boolean`                         | -    | -           | 是否为加载中状态 |

## Slots

| 名称      | 说明     |
| --------- | -------- |
| (default) | 容器内容 |

## Examples

### Basic

展示基本用法：在内容上方覆盖加载指示器，配合描述文案使用。

```yaml preview
brick: eo-spin
properties:
  spinning: true
  size: default
  tip: 加载中...
slots:
  "":
    type: bricks
    bricks:
      - brick: eo-descriptions
        properties:
          column: 3
          list:
            - label: 姓名
              text: Tom
            - label: 年龄
              text: 18
            - label: 身高
              text: 180cm
            - label: 爱好
              text: 篮球
            - label: 标签
              useBrick:
                - brick: eo-tag-list
                  properties:
                    list:
                      - text: 阳光
                        key: 0
                        color: blue
                      - text: 开朗
                        key: 1
                        color: red
                      - text: 大男孩
                        key: 2
                        color: green
```

### Size

展示三种不同尺寸（small、default、large）的加载指示器效果。

```yaml preview
- brick: eo-flex-layout
  properties:
    gap: 20px
    flexDirection: column
  children:
    - brick: eo-spin
      properties:
        spinning: true
        size: small
        tip: small
      children:
        - brick: div
          properties:
            style:
              height: 60px
              background: var(--color-fill-bg-base-1)
    - brick: eo-spin
      properties:
        spinning: true
        size: default
        tip: default
      children:
        - brick: div
          properties:
            style:
              height: 60px
              background: var(--color-fill-bg-base-1)
    - brick: eo-spin
      properties:
        spinning: true
        size: large
        tip: large
      children:
        - brick: div
          properties:
            style:
              height: 60px
              background: var(--color-fill-bg-base-1)
```

### Not Spinning

展示 spinning 为 false 时不显示加载指示器，直接展示内容。

```yaml preview
brick: eo-spin
properties:
  spinning: false
  tip: 加载中...
slots:
  "":
    type: bricks
    bricks:
      - brick: div
        properties:
          textContent: 内容已加载完成
          style:
            padding: 16px
```
