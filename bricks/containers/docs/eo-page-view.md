构件 `eo-page-view`

## Examples

### Basic

```yaml preview
brick: eo-page-view
children:
  - brick: div
    slot: menu
    properties:
      style:
        height: 60px
        background: green
      textContent: Menu
  - brick: div
    slot: sidebar
    properties:
      style:
        width: 220px
        height: 100%
        background: yellow
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
