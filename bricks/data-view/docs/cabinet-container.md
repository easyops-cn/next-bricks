data-view.cabinet-container

## Examples

### Basic

```yaml preview
- brick: data-view.cabinet-container
  properties:
    customTitle: 集群容器
    data:
      - type: physical-machine
        nodeTitle: "255.255.255"
      - type: physical-machine
        nodeTitle: "255.255.255"
    style:
      width: 400px
      height: 500px
```

### Status

```yaml preview
- brick: data-view.cabinet-container
  properties:
    customTitle: 集群容器
    status: active
    data:
      - type: physical-machine
        nodeTitle: "255.255.255"
      - type: physical-machine
        nodeTitle: "255.255.255"
    style:
      width: 400px
      height: 500px
```
