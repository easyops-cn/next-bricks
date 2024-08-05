构件 `eo-resizable-box`

## Examples

### Basic

```yaml preview
brick: div
properties:
  style:
    display: flex
    height: calc(100vh - 4em)
    border: 1px solid var(--theme-gray-border-color)
children:
  - brick: eo-resizable-box
    properties:
      textContent: Hello
      storageKey: demo-basic
  - brick: div
    properties:
      textContent: World
      style:
        flex: 1
        borderLeft: 1px solid var(--theme-gray-border-color)
```

### Sizing

```yaml preview
brick: div
properties:
  style:
    display: flex
    height: calc(100vh - 4em)
    border: 1px solid var(--theme-gray-border-color)
children:
  - brick: eo-resizable-box
    properties:
      textContent: Hello
      storageKey: demo-sizing
      minSize: 100
      minSpace: 100
  - brick: div
    properties:
      textContent: World
      style:
        flex: 1
        borderLeft: 1px solid var(--theme-gray-border-color)
```

### Dashboard

```yaml preview
brick: div
properties:
  style:
    display: flex
    height: calc(100vh - 4em)
    border: 1px solid var(--theme-gray-border-color)
children:
  - brick: eo-resizable-box
    properties:
      textContent: Hello
      storageKey: demo-dashboard
      variant: dashboard
  - brick: div
    properties:
      textContent: World
      style:
        flex: 1
        borderLeft: 1px solid var(--theme-gray-border-color)
```
