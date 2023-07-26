data-view.loading-panel

## Examples

### Basic

```yaml preview
- brick: data-view.loading-panel
  properties:
    customTitle: Hello World!!
    loading: false
    style:
      height: 300px
      display: block
```

### Progress

```yaml preview
- brick: data-view.loading-panel
  properties:
    customTitle: Hello World!!
    progress: 60
    useRealTimeProgress: true
    intervalTime: 300
    style:
      height: 300px
      display: block
  events:
    end:
      - action: console.log
```
