```jsx
import { WrappedEoSearchBar } from "@next-bricks/containers";
```

## Props

| Prop         | Type                           | Default                     | Description                                                                          |
| ------------ | ------------------------------ | --------------------------- | ------------------------------------------------------------------------------------ |
| marginBottom | `string`                       | `"var(--card-content-gap)"` | bottom 偏移，`search-bar`常适配于`brick-table`，故默认加这个偏移，符合设计规范       |
| wrap         | `boolean`                      | -                           | 当在搜索框插槽`start`和`end`内元素居多时，元素溢出，设置为`true`时，内容区域可以换行 |
| align        | `"start" \| "center" \| "end"` | `"center"`                  | 搜索栏中对齐的方式                                                                   |

## Slots

| Slot  | Description |
| ----- | ----------- |
| start | 左侧搜索栏  |
| end   | 右侧操作栏  |

## Examples

### Basic

```jsx
<WrappedEoSearchBar>
  <WrappedEoSearch slot="start" placeholder="请输入" clearable trim />
</WrappedEoSearchBar>
```

### With End Slot

```jsx
<WrappedEoSearchBar>
  <WrappedEoSearch slot="start" placeholder="请输入" clearable trim />
  <WrappedEoButton slot="end" type="primary">
    搜索
  </WrappedEoButton>
  <WrappedEoButton slot="end">重置</WrappedEoButton>
</WrappedEoSearchBar>
```

### Wrap

```jsx
<WrappedEoSearchBar wrap>
  <WrappedEoSearch slot="start" placeholder="请输入" />
  <WrappedEoSelect
    slot="start"
    placeholder="请选择"
    options={["Beijing", "Shanghai"]}
  />
  <WrappedEoButton slot="end" type="primary">
    搜索
  </WrappedEoButton>
</WrappedEoSearchBar>
```

### Align

```jsx
<WrappedEoSearchBar align="start">
  <WrappedEoSearch slot="start" placeholder="请输入" />
  <WrappedEoButton slot="end" type="primary">
    搜索
  </WrappedEoButton>
</WrappedEoSearchBar>
```
