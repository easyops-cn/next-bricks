---
tagName: eo-banner
displayName: WrappedEoBanner
description: 构件 `eo-banner`
category: container-layout
source: "@next-bricks/containers"
---

# eo-banner

> 构件 `eo-banner`

## Props

| 属性              | 类型             | 必填 | 默认值   | 说明                                                                                                                           |
| ----------------- | ---------------- | ---- | -------- | ------------------------------------------------------------------------------------------------------------------------------ |
| bannerTitle       | `string`         | -    | -        | 横幅标题，显示在横幅顶部区域                                                                                                   |
| bannerDescription | `string`         | -    | -        | 横幅描述信息，显示在标题下方                                                                                                   |
| narrow            | `NarrowViewSize` | -    | `"full"` | 设置窄布局模式（居中）。"full": 全尺寸（非窄布局居中）；"small": 小尺寸窄布局；"medium": 中等尺寸窄布局；"large": 大尺寸窄布局 |

## Slots

| 名称     | 说明   |
| -------- | ------ |
| _(默认)_ | 内容区 |

## Examples

### Basic

展示带有标题和描述的基本横幅。

```yaml preview
brick: eo-banner
properties:
  bannerTitle: Hello World
  bannerDescription: Say hello to everyone!
```

### Narrow Layout

展示不同窄布局模式下的横幅效果。

```yaml preview
brick: eo-banner
properties:
  bannerTitle: 窄布局横幅
  bannerDescription: 使用 medium 窄布局模式居中展示内容
  narrow: medium
```

### With Slot Content

展示横幅中使用默认插槽放置自定义内容。

```yaml preview
brick: eo-banner
properties:
  bannerTitle: 带内容的横幅
  bannerDescription: 横幅下方可以放置自定义内容
  narrow: large
children:
  - brick: eo-button
    properties:
      textContent: 了解更多
```
