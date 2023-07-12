data-view.cabinet-thumbnail 部署架构拓扑缩略图

## Examples

### Basic

```yaml preview
- brick: data-view.cabinet-thumbnail
  properties:
    appName: inventory-api
    clusters:
      - title: inventory-api##aaaaa
        type: host
        data:
          - nodeTitle: 244.244.244.244
            key: 244.244.244.244
            type: physical-machine
          - nodeTitle: 244.244.244.245
            key: 244.244.244.245
            type: virtual-machine
          - nodeTitle: 244.244.245.245
            key: 244.244.245.245
            type: physical-machine
          - nodeTitle: 244.244.245.244
            key: 244.244.245.244
            type: virtual-machine
      - title: K8S集群xxx
        key: k8s-cluster
        type: k8s
        data:
          - nodeTitle: a容器组
            key: aa
            type: container-group
          - nodeTitle: b容器组
            key: bb
            type: container-group
      - title: K8S集群xx
        key: xxxx
        type: k8s-blue
        data:
          - nodeTitle: a1容器组
            key: aaa
            type: pod
          - nodeTitle: b1容器组
            key: bbb
            type: pod
```
