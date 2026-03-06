---
tagName: eo-spin
displayName: WrappedEoSpin
description: 加载中指示器构件，在容器内容上方覆盖旋转动画和可选描述文案，支持三种尺寸
category: container-display
source: "@next-bricks/containers"
---

# WrappedEoSpin

> 加载中指示器构件，在容器内容上方覆盖旋转动画和可选描述文案，支持三种尺寸

## 导入

```tsx
import { WrappedEoSpin } from "@easyops/wrapped-components";
```

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

```tsx
<WrappedEoSpin spinning size="default" tip="加载中...">
  <WrappedEoDescriptions
    column={3}
    list={[
      { label: "姓名", text: "Tom" },
      { label: "年龄", text: "18" },
      { label: "身高", text: "180cm" },
      { label: "爱好", text: "篮球" },
      {
        label: "标签",
        useBrick: [
          {
            brick: "eo-tag-list",
            properties: {
              list: [
                { text: "阳光", key: "0", color: "blue" },
                { text: "开朗", key: "1", color: "red" },
                { text: "大男孩", key: "2", color: "green" },
              ],
            },
          },
        ],
      },
    ]}
  />
</WrappedEoSpin>
```

### Size

展示三种不同尺寸（small、default、large）的加载指示器效果。

```tsx
<WrappedEoFlexLayout gap="20px" flexDirection="column">
  <WrappedEoSpin spinning size="small" tip="small">
    <div style={{ height: 60, background: "var(--color-fill-bg-base-1)" }} />
  </WrappedEoSpin>
  <WrappedEoSpin spinning size="default" tip="default">
    <div style={{ height: 60, background: "var(--color-fill-bg-base-1)" }} />
  </WrappedEoSpin>
  <WrappedEoSpin spinning size="large" tip="large">
    <div style={{ height: 60, background: "var(--color-fill-bg-base-1)" }} />
  </WrappedEoSpin>
</WrappedEoFlexLayout>
```

### Not Spinning

展示 spinning 为 false 时不显示加载指示器，直接展示内容。

```tsx
<WrappedEoSpin spinning={false} tip="加载中...">
  <div style={{ padding: 16 }}>内容已加载完成</div>
</WrappedEoSpin>
```
