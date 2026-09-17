---
tagName: eo-link
displayName: WrappedEoLink
description: A general-purpose link brick
category: text
source: "@next-bricks/basic"
---

# eo-link

> A general-purpose link brick

## Props

| property | type | required | default | description |
| --- | --- | --- | --- | --- |
| type | `LinkType` | - | `"link"` | Link type |
| disabled | `boolean` | - | `false` | Whether it is disabled |
| href | `string` | - | - | When `href` is set, the native `<a>` tag is used, usually for navigating to external links |
| url | `ExtendedLocationDescriptor` | - | - | Link address |
| inApp | `boolean` | - | - | Whether `url` is a micro-app internal link (i.e. using APP.homepage as the prefix) |
| target | `Target` | - | - | Link target |
| showExternalIcon | `boolean` | - | - | When target is \_blank, whether to show a specific icon after the link |
| underline | `boolean` | - | - | Whether to show an underline |
| replace | `boolean` | - | `false` | Whether to use `history.replace` instead of the default `history.push` |
| icon | `GeneralIconProps & HTMLAttributes<GeneralIcon>` | - | - | Icon |
| danger | `boolean` | - | - | Whether to enable the danger state |
| tooltip | `string` | - | - | Tooltip text |
| linkStyle | `React.CSSProperties` | - | - | Link style |
| themeVariant | `"default" \| "elevo"` | - | - | Theme variant |

## Slots

| name | description |
| --- | --- |
| (default) | Link content |

## CSS Parts

| name | description |
| --- | --- |
| link | Anchor element |

## Examples

### External Links

Uses the `href` property to navigate to an external URL; suitable for opening external links in a new tab.

```html preview
<eo-link href="https://baidu.com/" target="_blank"> Link to Baidu </eo-link>
```

### Internal Links

Sets `url` for link navigation within a single-page application.

```html preview
<eo-link url="/some/internal/page">Internal page</eo-link>
```

### With External Icon

When `href` is set, the native `<a>` tag is used for link navigation, usually for external links; combined with `showExternalIcon` it shows an external-link icon after the link.

```html preview
<eo-link href="https://baidu.com/" target="_blank" show-external-icon>
  Link to Baidu
</eo-link>
```

### Text Type

Setting `type="text"` renders the link in the style of normal text; suitable for embedding in body text.

```html preview
<p>
  There is a
  <eo-link type="text" href="https://baidu.com/" target="_blank">
    link to Baidu
  </eo-link>
  that is hidden in the normal text.
</p>
```

### Disabled

Clicking a disabled link does not navigate; all link types are supported.

```html preview
<p>
  <eo-link disabled href="https://baidu.com/" target="_blank">
    Link to Baidu
  </eo-link>
</p>

<p>
  <eo-link disabled url="/some/internal/page"> Internal page </eo-link>
</p>

<p>
  There is a
  <eo-link disabled type="text" href="https://baidu.com/" target="_blank">
    link to Baidu
  </eo-link>
  that is hidden in the normal text.
</p>
```

### Plain Link

Setting `type="plain"` gives the link no extra style; suitable for use together with other bricks.

```html preview
<eo-link href="https://baidu.com/" target="_blank" type="plain">
  <eo-tag color="blue">Link to Baidu</eo-tag>
</eo-link>
```

### Link with Icon

Adds a leading icon to the link via the `icon` property.

```yaml preview
- brick: eo-link
  properties:
    icon:
      lib: antd
      icon: search
    textContent: Search
```

### Danger and Underline

Shows the danger color style via `danger` and adds an underline to the link via `underline`.

```yaml preview
- brick: eo-link
  properties:
    href: "https://baidu.com/"
    target: "_blank"
    danger: true
    underline: true
    textContent: Danger link
```

### Custom Style and Tooltip

Uses `linkStyle` to customize the link style and `tooltip` to add hover tooltip text to the link.

```yaml preview
- brick: eo-link
  properties:
    href: "https://baidu.com/"
    target: "_blank"
    tooltip: "Go to Baidu"
    linkStyle:
      fontSize: "16px"
      fontWeight: bold
    textContent: Open Baidu
```

### In-app Link

Setting `inApp` makes the link automatically use the current micro app's `homepage` as the prefix; combined with `replace` it controls the navigation mode.

```yaml preview
- brick: eo-link
  properties:
    url: "/relative/path"
    inApp: true
    replace: true
    textContent: In-app link
```

### Theme Variant

Switches the theme style of the link via the `themeVariant` property; both `"default"` and `"elevo"` variants are supported.

```yaml preview
- brick: eo-link
  properties:
    href: "https://baidu.com/"
    target: "_blank"
    themeVariant: elevo
    textContent: Elevo theme link
```
