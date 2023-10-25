构件 `eo-page-view`

## Examples

### Basic

```yaml preview
brick: eo-page-view
properties:
  style:
    height: 300px
children:
  - brick: div
    slot: header
    properties:
      style:
        height: 60px
        background: green
      textContent: Header
  - brick: div
    slot: sidebar
    properties:
      style:
        width: 220px
        height: 100%
        background: purple
      textContent: Sidebar
  - brick: div
    slot: subSidebar
    properties:
      style:
        width: 220px
        height: 100%
        background: red
      textContent: Sub-Sidebar
  - brick: div
    properties:
      style:
        width: 100%
        height: 100%
        background: blue
      textContent: Content
```

### With Content

```yaml preview
brick: eo-page-view
properties:
  style:
    height: 300px
children:
  - brick: div
    slot: header
    properties:
      style:
        height: 60px
        background: green
      textContent: Header
  - brick: div
    slot: sidebar
    properties:
      style:
        width: 220px
        height: 100%
        background: purple
      textContent: Sidebar
  - brick: div
    slot: subSidebar
    properties:
      style:
        width: 220px
        height: 100%
        background: red
      textContent: Sub-Sidebar
  - brick: eo-main-view
    children:
      - brick: div
        slot: breadcrumb
        properties:
          textContent: Home / List / Detail
      - brick: h1
        slot: pageTitle
        properties:
          textContent: Hello World
      - brick: div
        properties:
          textContent: Say hello to everyone!
```
