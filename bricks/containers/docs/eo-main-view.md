主内容视图

## Examples

### Basic

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

### Narrow

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

### Banner

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
