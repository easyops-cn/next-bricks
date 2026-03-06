---
tagName: eo-link
displayName: WrappedEoLink
description: 通用链接构件
category: text
source: "@next-bricks/basic"
---

# WrappedEoLink

> 通用链接构件

## 导入

```tsx
import { WrappedEoLink } from "@easyops/wrapped-components";
```

## Props

| 属性             | 类型                                             | 必填 | 默认值   | 说明                                                          |
| ---------------- | ------------------------------------------------ | ---- | -------- | ------------------------------------------------------------- |
| type             | `LinkType`                                       | -    | `"link"` | 链接类型                                                      |
| disabled         | `boolean`                                        | -    | `false`  | 是否禁用                                                      |
| href             | `string`                                         | -    | -        | 设置 `href` 时将使用原生 `<a>` 标签，通常用于外链的跳转       |
| url              | `ExtendedLocationDescriptor`                     | -    | -        | 链接地址                                                      |
| inApp            | `boolean`                                        | -    | -        | 标识 `url` 是否为微应用内链接（即使用 APP.homepage 作为前缀） |
| target           | `Target`                                         | -    | -        | 链接跳转目标                                                  |
| showExternalIcon | `boolean`                                        | -    | -        | target 为 \_blank 时，是否在后面显示特定图标                  |
| underline        | `boolean`                                        | -    | -        | 是否显示下划线                                                |
| replace          | `boolean`                                        | -    | `false`  | 是否使用 `history.replace` 而不是默认的 `history.push`        |
| icon             | `GeneralIconProps & HTMLAttributes<GeneralIcon>` | -    | -        | 图标                                                          |
| danger           | `boolean`                                        | -    | -        | 是否开启危险状态                                              |
| tooltip          | `string`                                         | -    | -        | 文字提示                                                      |
| linkStyle        | `React.CSSProperties`                            | -    | -        | 链接样式                                                      |
| themeVariant     | `"default" \| "elevo"`                           | -    | -        | 主题变体                                                      |

## Slots

| 名称      | 说明     |
| --------- | -------- |
| (default) | 链接内容 |

## CSS Parts

| 名称 | 说明   |
| ---- | ------ |
| link | 锚元素 |

## Examples

### 外部链接

使用 `href` 属性跳转到外部网址，适合在新标签页打开外链。

```tsx
<WrappedEoLink href="https://baidu.com/" target="_blank">
  Link to Baidu
</WrappedEoLink>
```

### 内部链接

设置 `url` 用于单页应用内的链接跳转。

```tsx
<WrappedEoLink url="/some/internal/page">Internal page</WrappedEoLink>
```

### 带外部跳转图标

如果设置了 `href`，将使用原生 `<a>` 标签来实现链接跳转，通常用于外链的跳转；配合 `showExternalIcon` 可在链接后展示跳转图标。

```tsx
<WrappedEoLink href="https://baidu.com/" target="_blank" showExternalIcon>
  Link to Baidu
</WrappedEoLink>
```

### 文本样式

设置 `type="text"` 可以将链接以普通文本的样式进行渲染，适合嵌入正文中。

```tsx
<p>
  There is a{" "}
  <WrappedEoLink type="text" href="https://baidu.com/" target="_blank">
    link to Baidu
  </WrappedEoLink>{" "}
  that is hidden in the normal text.
</p>
```

### 禁用状态

禁用链接后点击不会触发跳转，支持所有链接类型。

```tsx
<>
  <p>
    <WrappedEoLink disabled href="https://baidu.com/" target="_blank">
      Link to Baidu
    </WrappedEoLink>
  </p>
  <p>
    <WrappedEoLink disabled url="/some/internal/page">
      Internal page
    </WrappedEoLink>
  </p>
  <p>
    There is a{" "}
    <WrappedEoLink
      disabled
      type="text"
      href="https://baidu.com/"
      target="_blank"
    >
      link to Baidu
    </WrappedEoLink>{" "}
    that is hidden in the normal text.
  </p>
</>
```

### 无样式链接

设置 `type="plain"` 链接不会拥有额外样式，适合搭配其他构件使用。

```tsx
import { WrappedEoTag } from "@easyops/wrapped-components";

<WrappedEoLink href="https://baidu.com/" target="_blank" type="plain">
  <WrappedEoTag color="blue">Link to Baidu</WrappedEoTag>
</WrappedEoLink>;
```

### 带图标的链接

通过 `icon` 属性为链接添加前置图标。

```tsx
<WrappedEoLink icon={{ lib: "antd", icon: "search" }}>Search</WrappedEoLink>
```

### 危险状态与下划线

通过 `danger` 展示危险色样式，通过 `underline` 为链接添加下划线。

```tsx
<WrappedEoLink href="https://baidu.com/" target="_blank" danger underline>
  危险链接
</WrappedEoLink>
```

### 自定义样式与提示

使用 `linkStyle` 自定义链接样式，使用 `tooltip` 为链接添加悬停提示文字。

```tsx
<WrappedEoLink
  href="https://baidu.com/"
  target="_blank"
  tooltip="跳转到百度"
  linkStyle={{ fontSize: "16px", fontWeight: "bold" }}
>
  打开百度
</WrappedEoLink>
```

### 微应用内链接

设置 `inApp` 使链接自动使用当前微应用的 `homepage` 作为前缀，配合 `replace` 可控制导航方式。

```tsx
<WrappedEoLink url="/relative/path" inApp replace>
  微应用内链接
</WrappedEoLink>
```

### 主题变体

通过 `themeVariant` 属性切换链接的主题风格，支持 `"default"` 和 `"elevo"` 两种变体。

```tsx
<WrappedEoLink href="https://baidu.com/" target="_blank" themeVariant="elevo">
  Elevo 主题链接
</WrappedEoLink>
```
