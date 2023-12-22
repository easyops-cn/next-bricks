页面视图

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
        height: 50px
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
        width: 208px
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

### With Main View

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
        height: 50px
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
        width: 208px
        height: 100%
        background: red
      textContent: Sub-Sidebar
  - brick: eo-main-view
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
          textContent: Say hello to everyone! And then say goodbye to everyone!
```
