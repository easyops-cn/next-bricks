---
tagName: eo-main-view
displayName: WrappedEoMainView
description: Main content view
category: container-layout
source: "@next-bricks/containers"
---

# eo-main-view

> Main content view

## Props

| property          | type             | required | default    | description                                                                                |
| ----------------- | ---------------- | -------- | ---------- | ------------------------------------------------------------------------------------------ |
| contentGap        | `MainViewGap`    | -        | `"medium"` | Gap between the title bar and the content area. If the content area already has some visual padding, you can set `contentGap: small`. |
| narrow            | `NarrowViewSize` | -        | `"full"`   | Set the narrow layout mode (centered). Allowed values: `"full"`, `"small"`, `"medium"`, `"large"` |
| fillContainer     | `boolean`        | -        | -          | Set whether to fill the container                                                          |
| bannerAlone       | `boolean`        | -        | -          | Set when only the banner is used; the breadcrumb, title and toolbar will not be displayed  |
| bannerTitle       | `string`         | -        | -          | Banner title, effective only in bannerAlone mode                                           |
| bannerDescription | `string`         | -        | -          | Banner description text, effective only in bannerAlone mode                                |
| bannerImage       | `string`         | -        | -          | Banner background image, using CSS background-image syntax (such as url(...))              |
| bannerSunk        | `boolean`        | -        | -          | Whether the banner is displayed sunk                                                       |
| showBanner        | `boolean`        | -        | `true`     | Whether to show the banner (including the breadcrumb, page title and toolbar)              |
| noPadding         | `boolean`        | -        | -          | Whether there is no padding                                                                |
| showFooter        | `boolean`        | -        | -          | Whether to show the footer (usually holds buttons). Deprecated, please use the footer of eo-page-view |
| showDashboardLogo | `boolean`        | -        | `true`     | Whether to show the logo (dashboard mode)                                                  |
| showDashboardExit | `boolean`        | -        | `true`     | Whether to show the exit button (dashboard mode)                                           |

## Events

| event          | detail | description                                              |
| -------------- | ------ | -------------------------------------------------------- |
| dashboard.exit | -      | Triggered when the exit button is clicked to leave dashboard mode |

## Slots

| name       | description                                                                 |
| ---------- | --------------------------------------------------------------------------- |
| ""         | Content area                                                                |
| breadcrumb | Breadcrumb                                                                  |
| pageTitle  | Page title                                                                  |
| toolbar    | Toolbar                                                                     |
| banner     | Banner content                                                              |
| footer     | Footer (usually holds buttons). Deprecated, please use the footer of eo-page-view |

## Examples

### Basic

Displays the basic main view layout, including the breadcrumb, page title, toolbar and content area.

```yaml preview
brick: eo-main-view
children:
  - brick: eo-frame-breadcrumb
    slot: breadcrumb
    properties:
      breadcrumb:
        - text: Home
          to: /Home
        - text: Detail
          to: /Detail
        - text: List
          to: /List
  - brick: eo-page-title
    slot: pageTitle
    properties:
      pageTitle: Hello World
  - brick: div
    properties:
      textContent: Say hello to everyone!
  - brick: eo-button
    slot: toolbar
    properties:
      type: primary
      textContent: Toolbar Button
      icon:
        lib: antd
        icon: search
```

### Fill Container

Enable fillContainer to make the main view fill the height of its parent container.

```yaml preview
brick: eo-main-view
properties:
  fillContainer: true
  style:
    height: 300px
children:
  - brick: eo-frame-breadcrumb
    slot: breadcrumb
    properties:
      breadcrumb:
        - text: Home
          to: /Home
        - text: Detail
          to: /Detail
        - text: List
          to: /List
  - brick: eo-page-title
    slot: pageTitle
    properties:
      pageTitle: Hello World
  - brick: div
    properties:
      textContent: Say hello to everyone!
      style:
        height: 100%
        border: 1px solid gray
```

### Narrow Layout

Use the narrow property to set a small centered narrow layout.

```yaml preview
brick: eo-main-view
properties:
  narrow: small
children:
  - brick: eo-frame-breadcrumb
    slot: breadcrumb
    properties:
      breadcrumb:
        - text: Home
          to: /Home
        - text: Detail
          to: /Detail
        - text: List
          to: /List
  - brick: eo-page-title
    slot: pageTitle
    properties:
      pageTitle: Hello World
  - brick: div
    properties:
      textContent: Say hello to everyone!
      style:
        border: 1px solid gray
```

### Banner Alone Mode

Enable bannerAlone and configure bannerTitle, bannerDescription and bannerImage; in this case the breadcrumb, title and toolbar are not displayed.

```yaml preview
brick: eo-main-view
properties:
  bannerAlone: true
  bannerTitle: hello
  bannerDescription: abc
  bannerImage: url(https://img2.baidu.com/it/u=2221802320,2425828997&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500)
children:
  - brick: div
    properties:
      textContent: Say hello to everyone!
      style:
        height: 100%
```

### No Padding And Hidden Banner

Set noPadding to remove the padding and showBanner to false to hide the banner area.

```yaml preview
brick: eo-main-view
properties:
  noPadding: true
  showBanner: false
children:
  - brick: div
    properties:
      textContent: Say hello to everyone!
      style:
        height: 100%
```

### Content Gap And Sunk Banner

Use contentGap to set a small gap and bannerSunk to display the banner sunk, and show the footer through showFooter.

```yaml preview
brick: eo-main-view
properties:
  contentGap: small
  bannerSunk: true
  showFooter: true
children:
  - brick: eo-frame-breadcrumb
    slot: breadcrumb
    properties:
      breadcrumb:
        - text: Home
          to: /Home
        - text: Detail
          to: /Detail
  - brick: eo-page-title
    slot: pageTitle
    properties:
      pageTitle: Hello World
  - brick: div
    properties:
      textContent: Main Content Area
  - brick: div
    slot: banner
    properties:
      textContent: Banner Content
  - brick: eo-button
    slot: footer
    properties:
      type: primary
      textContent: Footer Button
```

### Dashboard Mode Configuration

Configure showDashboardLogo and showDashboardExit to control the visibility of the logo and the exit button in dashboard mode, and listen for the dashboard.exit event.

```yaml preview
brick: eo-main-view
properties:
  showDashboardLogo: true
  showDashboardExit: true
events:
  dashboard.exit:
    action: console.log
children:
  - brick: eo-page-title
    slot: pageTitle
    properties:
      pageTitle: Dashboard Page
  - brick: div
    properties:
      textContent: Dashboard Mode Content
```
