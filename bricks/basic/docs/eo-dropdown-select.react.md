---
tagName: eo-dropdown-select
displayName: WrappedEoDropdownSelect
description: 下拉式选择构件，常用于标题
category: interact-basic
source: "@next-bricks/basic"
---

# WrappedEoDropdownSelect

> 下拉式选择构件，常用于标题

## 导入

```tsx
import { WrappedEoDropdownSelect } from "@easyops/wrapped-components";
```

## Props

| 属性             | 类型                                  | 必填 | 默认值     | 说明                   |
| ---------------- | ------------------------------------- | ---- | ---------- | ---------------------- |
| defaultValue     | `string \| number \| undefined`       | 否   | -          | 默认值，仅初始设置有效 |
| options          | `DropdownSelectOption[] \| undefined` | 否   | -          | 可选项列表             |
| size             | `"medium" \| "large" \| undefined`    | 否   | `"medium"` | 选择器尺寸             |
| loading          | `boolean \| undefined`                | 否   | -          | 是否显示加载状态       |
| labelMaxWidth    | `string \| number \| undefined`       | 否   | `"650px"`  | 当前选中标签的最大宽度 |
| dropdownMaxWidth | `string \| number \| undefined`       | 否   | `"500px"`  | 下拉面板的最大宽度     |

## Events

| 事件     | detail                                                                                  | 说明           |
| -------- | --------------------------------------------------------------------------------------- | -------------- |
| onChange | `DropdownSelectOption` — { label: 选中的标签文本, value: 选中的值, disabled: 是否禁用 } | 选项变化时触发 |

## Methods

| 方法             | 参数                                                                    | 返回值 | 说明                                                    |
| ---------------- | ----------------------------------------------------------------------- | ------ | ------------------------------------------------------- |
| setDefaultOption | <ul><li>`option: DropdownSelectOption` - 要设置为默认值的选项</li></ul> | `void` | 设置默认选中项，若 options 中不存在该选项则追加到列表中 |

## Slots

| 名称   | 说明             |
| ------ | ---------------- |
| prefix | 下拉列表前置内容 |

## Examples

### Basic

下拉式选择构件的基础用法，适用于标题区域的选择场景。

```tsx
<WrappedEoDropdownSelect
  size="large"
  defaultValue="shenzhen"
  options={[
    { label: "Beijing", value: "beijing" },
    { label: "Shenzhen", value: "shenzhen" },
    { label: "Guangzhou", value: "guangzhou" },
  ]}
/>
```

### Change Event

监听选项变化事件，在选择不同选项时触发 `onChange` 事件。

```tsx
<WrappedEoDropdownSelect
  defaultValue="beijing"
  options={[
    { label: "Beijing", value: "beijing" },
    { label: "Shenzhen", value: "shenzhen" },
    { label: "Guangzhou", value: "guangzhou" },
  ]}
  onChange={(e) => console.log("已选择：", e.detail.label)}
/>
```

### Loading

展示加载状态，异步获取选项时显示加载指示器。

```tsx
<WrappedEoDropdownSelect
  loading={true}
  options={[
    { label: "Beijing", value: "beijing" },
    { label: "Shenzhen", value: "shenzhen" },
  ]}
/>
```

### Custom Width

自定义标签最大宽度和下拉面板最大宽度。

```tsx
<WrappedEoDropdownSelect
  labelMaxWidth={200}
  dropdownMaxWidth={300}
  defaultValue="beijing"
  options={[
    { label: "Beijing", value: "beijing" },
    { label: "Shenzhen", value: "shenzhen" },
    { label: "Guangzhou (Very Long Label Example)", value: "guangzhou" },
  ]}
/>
```

### Disabled Option

展示包含禁用选项的下拉选择。

```tsx
<WrappedEoDropdownSelect
  defaultValue="beijing"
  options={[
    { label: "Beijing", value: "beijing" },
    { label: "Shenzhen (Disabled)", value: "shenzhen", disabled: true },
    { label: "Guangzhou", value: "guangzhou" },
  ]}
/>
```

### Set Default Option

通过调用 `setDefaultOption` 方法动态追加并设置默认选项，适用于选项列表中不包含目标值的场景。

```tsx
const ref = useRef<any>();

<>
  <WrappedEoDropdownSelect
    ref={ref}
    defaultValue="beijing"
    options={[
      { label: "Beijing", value: "beijing" },
      { label: "Shenzhen", value: "shenzhen" },
    ]}
  />
  <button
    onClick={() =>
      ref.current?.setDefaultOption({ label: "Tokyo", value: "tokyo" })
    }
  >
    Add Tokyo
  </button>
</>;
```
