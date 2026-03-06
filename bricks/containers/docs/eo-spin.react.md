```jsx
import { WrappedEoSpin } from "@next-bricks/containers";
```

## Props

| Prop     | Type                              | Default     | Description      |
| -------- | --------------------------------- | ----------- | ---------------- |
| size     | `"small" \| "default" \| "large"` | `"default"` | 加载指示符大小   |
| tip      | `string`                          | -           | 自定义描述文案   |
| spinning | `boolean`                         | -           | 是否为加载中状态 |

## Slots

| Slot      | Description |
| --------- | ----------- |
| (default) | 容器内容    |

## Examples

### Basic

```jsx
<WrappedEoSpin spinning tip="加载中...">
  <div>Content</div>
</WrappedEoSpin>
```

### Size

```jsx
// Small
<WrappedEoSpin spinning size="small" tip="small">
  <div style={{ height: 60 }}>Content</div>
</WrappedEoSpin>

// Default
<WrappedEoSpin spinning size="default" tip="default">
  <div style={{ height: 60 }}>Content</div>
</WrappedEoSpin>

// Large
<WrappedEoSpin spinning size="large" tip="large">
  <div style={{ height: 60 }}>Content</div>
</WrappedEoSpin>
```

### Not Spinning

```jsx
<WrappedEoSpin spinning={false} tip="加载中...">
  <div>内容已加载完成</div>
</WrappedEoSpin>
```
