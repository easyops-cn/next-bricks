导航栏图标

## Examples

### Basic

```yaml preview minHeight="500px"
brick: nav.poll-announce
properties:
  realTimeMessage:
    title: Hello
    data: World
    instanceId: docs-basic
events:
  notification.open:
    action: console.log
    args:
      - notification.open
  notification.close:
    action: console.log
    args:
      - notification.close
```
