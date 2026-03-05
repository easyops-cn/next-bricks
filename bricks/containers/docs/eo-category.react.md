---
tagName: eo-category
displayName: WrappedEoCategory
description: 通用分类容器
category: container-display
source: "@next-bricks/containers"
---

# WrappedEoCategory

> 通用分类容器

## 导入

```tsx
import { WrappedEoCategory } from "@easyops/wrapped-components";
```

## Props

| 属性           | 类型                  | 必填 | 默认值 | 说明             |
| -------------- | --------------------- | ---- | ------ | ---------------- |
| categories     | `CategoryProps[]`     | yes  | -      | 分类信息         |
| contentStyle   | `React.CSSProperties` | -    | -      | 内容样式         |
| headerStyle    | `React.CSSProperties` | -    | -      | 头部样式         |
| containerStyle | `React.CSSProperties` | -    | -      | 容器样式         |
| split          | `boolean`             | -    | -      | 是否展示分割线   |
| headerMask     | `boolean`             | -    | `true` | 是否显示头部线条 |
| showIndex      | `boolean`             | -    | -      | 是否显示序号     |

## Slots

| 名称                      | 说明                                             |
| ------------------------- | ------------------------------------------------ |
| {categoryKey}             | 每个分类项的内容插槽，名称为对应 category 的 key |
| {categoryKey}.titleSuffix | 每个分类项标题后缀插槽                           |
| headerToolbar             | 头部右侧工具栏插槽                               |

## Examples

### Basic

基本用法，展示带标题和内容的分类容器。

```tsx
<WrappedEoCategory
  categories={[
    { title: "Item 1", key: "Item 1" },
    { title: "Item 2", key: "Item 2" },
  ]}
>
  <div slot="Item 1">Item 1 Content</div>
  <div slot="Item 2">Item 2 Content</div>
</WrappedEoCategory>
```

### Content Style

通过 contentStyle 自定义分类内容区域的样式。

```tsx
<WrappedEoCategory
  categories={[
    { title: "Item 1", key: "Item 1" },
    { title: "Item 2", key: "Item 2" },
  ]}
  contentStyle={{ background: "#abc" }}
>
  <div slot="Item 1">Item 1 Content</div>
  <div slot="Item 2">Item 2 Content</div>
</WrappedEoCategory>
```

### Header Style

通过 headerStyle 自定义分类头部区域的样式。

```tsx
<WrappedEoCategory
  categories={[
    { title: "Item 1", key: "Item 1" },
    { title: "Item 2", key: "Item 2" },
  ]}
  headerStyle={{
    background: "#abc",
    padding: "10px 20px",
    marginTop: "20px",
  }}
>
  <div slot="Item 1">Item 1 Content</div>
  <div slot="Item 2">Item 2 Content</div>
</WrappedEoCategory>
```

### Container Style

通过 containerStyle 自定义整个容器的样式。

```tsx
<WrappedEoCategory
  categories={[
    { title: "Item 1", key: "Item 1" },
    { title: "Item 2", key: "Item 2" },
  ]}
  containerStyle={{
    background: "#abc",
    padding: "10px 20px",
    borderRadius: "8px",
  }}
>
  <div slot="Item 1">Item 1 Content</div>
  <div slot="Item 2">Item 2 Content</div>
</WrappedEoCategory>
```

### Show Index

展示序号模式，同时启用分割线并隐藏头部标记线。

```tsx
function CategoryWithForms() {
  const [formHadSave, setFormHadSave] = React.useState(false);
  const formRef = React.useRef<any>();

  return (
    <WrappedEoCategory
      split={true}
      headerMask={false}
      showIndex={true}
      categories={[
        { title: "表单一", key: "Item 1" },
        { title: "表单二", key: "Item 2" },
      ]}
    >
      <WrappedEoForm
        slot="Item 1"
        ref={formRef}
        onValidateSuccess={() => {
          message.success("表单一保存了");
          setFormHadSave(true);
        }}
      >
        <WrappedEoInput
          label="姓名"
          name="name"
          required={true}
          disabled={formHadSave}
        />
        <WrappedEoLink
          textContent={formHadSave ? "已保存" : "保存按钮"}
          icon={
            formHadSave
              ? { lib: "antd", icon: "check" }
              : { lib: "antd", icon: "save" }
          }
          size="small"
          style={{
            marginTop: "4px",
            pointerEvents: formHadSave ? "none" : undefined,
          }}
          onClick={() => {
            if (!formHadSave) {
              formRef.current?.validate();
            }
          }}
        />
      </WrappedEoForm>
      <WrappedEoForm slot="Item 2">
        <WrappedEoInput label="学校" name="school" />
        <WrappedEoLink
          textContent="已保存"
          icon={{ lib: "antd", icon: "check" }}
          size="small"
          style={{ pointerEvents: "none", marginTop: "4px" }}
        />
      </WrappedEoForm>
    </WrappedEoCategory>
  );
}
```
