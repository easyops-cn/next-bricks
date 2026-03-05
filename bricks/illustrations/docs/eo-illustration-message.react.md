---
tagName: eo-illustration-message
displayName: WrappedEoIllustrationMessage
description: 插画消息构件
category: display-component
source: "@next-bricks/illustrations"
---

# WrappedEoIllustrationMessage

> 插画消息构件

## 导入

```tsx
import { WrappedEoIllustrationMessage } from "@easyops/wrapped-components";
```

## Props

| 属性           | 类型                                                                                                                                                                 | 必填 | 默认值            | 说明                                      |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- | ----------------- | ----------------------------------------- |
| heading        | `string`                                                                                                                                                             | 否   | -                 | 标题文字                                  |
| description    | `string`                                                                                                                                                             | 否   | -                 | 描述文字                                  |
| variant        | `"internet-disconnected" \| "no-permission" \| "license-expired" \| "not-found" \| "search-empty" \| "unknown-error" \| "success" \| "error" \| "warning" \| "info"` | 否   | `"unknown-error"` | 消息类型变体，影响展示的插画或状态图标    |
| customizeImage | `{ category: string; name: string }`                                                                                                                                 | 否   | -                 | 自定义插画图片，指定分类和名称            |
| errorTitle     | `string`                                                                                                                                                             | 否   | -                 | （已废弃）标题文字，请使用 `heading` 代替 |

## Examples

### Basic

展示默认 `unknown-error` 变体的插画消息，带有标题和描述。

```tsx
<WrappedEoIllustrationMessage
  heading="糟糕！页面出现了一些问题"
  description="HttpParseError: OK"
/>
```

### Variant: internet-disconnected

使用 `internet-disconnected` 变体展示网络断开连接的插画。

```tsx
<WrappedEoIllustrationMessage
  variant="internet-disconnected"
  heading="网络错误，请检查您的网络连接。"
/>
```

### Variant: no-permission

使用 `no-permission` 变体展示无权限的插画。

```tsx
<WrappedEoIllustrationMessage
  variant="no-permission"
  heading="您没有权限访问此页面"
/>
```

### Variant: not-found

使用 `not-found` 变体展示 404 页面未找到的插画。

```tsx
<WrappedEoIllustrationMessage variant="not-found" heading="页面未找到" />
```

### Variant: search-empty

使用 `search-empty` 变体展示搜索结果为空的插画。

```tsx
<WrappedEoIllustrationMessage
  variant="search-empty"
  heading="暂无搜索结果"
  description="请尝试其他关键词"
/>
```

### Variant: success

使用状态变体展示成功、失败、警告、信息状态图标。

```tsx
<div style={{ display: "flex", gap: "2em" }}>
  <WrappedEoIllustrationMessage variant="success" heading="工具执行成功！" />
  <WrappedEoIllustrationMessage variant="error" heading="操作失败" />
  <WrappedEoIllustrationMessage variant="warning" heading="请注意" />
  <WrappedEoIllustrationMessage variant="info" heading="提示信息" />
</div>
```

### Customize Image

通过 `customizeImage` 使用自定义插画图片。

```tsx
<WrappedEoIllustrationMessage
  description="请先创建应用"
  customizeImage={{ category: "default", name: "create-content" }}
/>
```

### Children

在消息构件内添加子元素，例如操作按钮。

```tsx
<WrappedEoIllustrationMessage
  heading="糟糕！页面出现了一些问题"
  description="HttpParseError: OK"
>
  <a href="#" onClick={() => history.back()}>
    回到上一页
  </a>
</WrappedEoIllustrationMessage>
```
