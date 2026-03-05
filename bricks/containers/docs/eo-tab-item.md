---
tagName: eo-tab-item
displayName: WrappedEoTabItem
description: Tab 子项构件
category: container-layout
source: "@next-bricks/containers"
---

# eo-tab-item

> Tab 子项构件

## Props

| 属性       | 类型               | 必填 | 默认值      | 说明                                                      |
| ---------- | ------------------ | ---- | ----------- | --------------------------------------------------------- |
| type       | `TabType`          | -    | `"default"` | 样式类型                                                  |
| panel      | `string`           | ✅   | -           | 面板名称，对应 tab-group 中的 slot 名称，用于关联内容面板 |
| icon       | `GeneralIconProps` | -    | -           | 图标配置，显示在标签文字左侧                              |
| disabled   | `boolean`          | -    | -           | 是否禁用，禁用后点击无响应且样式置灰                      |
| active     | `boolean`          | -    | -           | 是否为激活状态，通常由 tab-group 自动管理                 |
| badgeConf  | `BadgeProps`       | -    | -           | 徽标数配置，显示在标签文字右侧或右上角（panel 类型时）    |
| panelColor | `string`           | -    | -           | 面板颜色，同时控制默认状态和激活状态的文字及图标颜色      |

## Slots

| 名称 | 说明                       |
| ---- | -------------------------- |
| ""   | 默认插槽，放置标签文字内容 |

## CSS Parts

| 名称     | 说明         |
| -------- | ------------ |
| tab-item | Tab 子项容器 |

## Examples

### 基本用法

展示基本的 Tab 子项，包含标签文字和面板关联。

```yaml preview
- brick: eo-tab-group
  properties:
    activePanel: "tab1"
  slots:
    nav:
      type: bricks
      bricks:
        - brick: eo-tab-list
          slots:
            "":
              type: bricks
              bricks:
                - brick: eo-tab-item
                  properties:
                    panel: "tab1"
                  slots:
                    "":
                      type: bricks
                      bricks:
                        - brick: span
                          properties:
                            textContent: "标签一"
                - brick: eo-tab-item
                  properties:
                    panel: "tab2"
                  slots:
                    "":
                      type: bricks
                      bricks:
                        - brick: span
                          properties:
                            textContent: "标签二"
                - brick: eo-tab-item
                  properties:
                    panel: "tab3"
                  slots:
                    "":
                      type: bricks
                      bricks:
                        - brick: span
                          properties:
                            textContent: "标签三"
    tab1:
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: "内容一"
    tab2:
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: "内容二"
    tab3:
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: "内容三"
```

### 带图标

使用 icon 属性在标签文字左侧显示图标。

```yaml preview
- brick: eo-tab-group
  properties:
    activePanel: "tab1"
  slots:
    nav:
      type: bricks
      bricks:
        - brick: eo-tab-list
          slots:
            "":
              type: bricks
              bricks:
                - brick: eo-tab-item
                  properties:
                    panel: "tab1"
                    icon:
                      lib: "antd"
                      icon: "home"
                  slots:
                    "":
                      type: bricks
                      bricks:
                        - brick: span
                          properties:
                            textContent: "首页"
                - brick: eo-tab-item
                  properties:
                    panel: "tab2"
                    icon:
                      lib: "antd"
                      icon: "setting"
                  slots:
                    "":
                      type: bricks
                      bricks:
                        - brick: span
                          properties:
                            textContent: "设置"
    tab1:
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: "首页内容"
    tab2:
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: "设置内容"
```

### 禁用状态

使用 disabled 属性禁用某个 Tab 子项。

```yaml preview
- brick: eo-tab-group
  properties:
    activePanel: "tab1"
  slots:
    nav:
      type: bricks
      bricks:
        - brick: eo-tab-list
          slots:
            "":
              type: bricks
              bricks:
                - brick: eo-tab-item
                  properties:
                    panel: "tab1"
                  slots:
                    "":
                      type: bricks
                      bricks:
                        - brick: span
                          properties:
                            textContent: "可用标签"
                - brick: eo-tab-item
                  properties:
                    panel: "tab2"
                    disabled: true
                  slots:
                    "":
                      type: bricks
                      bricks:
                        - brick: span
                          properties:
                            textContent: "禁用标签"
    tab1:
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: "可用标签内容"
    tab2:
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: "禁用标签内容"
```

### 徽标数

使用 badgeConf 配置在标签上显示徽标数。

```yaml preview
- brick: eo-tab-group
  properties:
    activePanel: "tab1"
  slots:
    nav:
      type: bricks
      bricks:
        - brick: eo-tab-list
          slots:
            "":
              type: bricks
              bricks:
                - brick: eo-tab-item
                  properties:
                    panel: "tab1"
                    badgeConf:
                      count: 5
                  slots:
                    "":
                      type: bricks
                      bricks:
                        - brick: span
                          properties:
                            textContent: "消息"
                - brick: eo-tab-item
                  properties:
                    panel: "tab2"
                    badgeConf:
                      count: 99
                  slots:
                    "":
                      type: bricks
                      bricks:
                        - brick: span
                          properties:
                            textContent: "通知"
    tab1:
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: "消息内容"
    tab2:
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: "通知内容"
```

### 自定义面板颜色与激活状态

使用 panelColor 自定义标签颜色，并使用 active 手动控制激活状态。

```yaml preview
- brick: eo-tab-group
  properties:
    activePanel: "tab1"
  slots:
    nav:
      type: bricks
      bricks:
        - brick: eo-tab-list
          slots:
            "":
              type: bricks
              bricks:
                - brick: eo-tab-item
                  properties:
                    panel: "tab1"
                    panelColor: "#52c41a"
                    active: true
                  slots:
                    "":
                      type: bricks
                      bricks:
                        - brick: span
                          properties:
                            textContent: "绿色标签"
                - brick: eo-tab-item
                  properties:
                    panel: "tab2"
                    panelColor: "#fa8c16"
                  slots:
                    "":
                      type: bricks
                      bricks:
                        - brick: span
                          properties:
                            textContent: "橙色标签"
    tab1:
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: "绿色面板内容"
    tab2:
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: "橙色面板内容"
```
