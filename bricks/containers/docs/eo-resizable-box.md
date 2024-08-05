可以左右或上下调整尺寸的容器。

注意与 v2 构件 `basic-bricks.resizable-box` 的差别：

- 移除属性 `resizable`，改为使用 `disabled` 控制是否可调整尺寸；
- 放在 `containers-NB` 包，而不是 `basic-bricks-NB`。

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

### Direction

```yaml preview
brick: div
properties:
  style:
    display: flex
    flexDirection: column
    height: calc(100vh - 4em)
    border: 1px solid var(--theme-gray-border-color)
children:
  - brick: eo-resizable-box
    properties:
      textContent: Hello
      storageKey: demo-direction
      resizeDirection: bottom
  - brick: div
    properties:
      textContent: World
      style:
        flex: 1
        borderTop: 1px solid var(--theme-gray-border-color)
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
