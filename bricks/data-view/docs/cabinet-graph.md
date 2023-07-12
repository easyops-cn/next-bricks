data-view.cabinet-graph 部署架构拓扑

## Examples

### Basic

```yaml preview
- brick: data-view.cabinet-graph
  properties:
    dataSource:
      appName: inventory-api
      key: inventory-api
      clusters:
        - clusterName: inventory-api##aaaaa
          key: inventory-api##aaaaa
          type: host
          nodes:
            - nodeTitle: 244.244.244.244
              key: 244.244.244.244
              type: physical-machine
              isAlert: true
            - nodeTitle: 244.244.244.245
              key: 244.244.244.245
              type: virtual-machine
              isAlert: true
            - nodeTitle: 244.244.245.245
              key: 244.244.245.245
              type: physical-machine
            - nodeTitle: 244.244.245.244
              key: 244.244.245.244
              type: virtual-machine
        - clusterName: K8S集群xxx
          key: k8s-cluster
          type: k8s
          nodes:
            - nodeTitle: a容器组
              key: aa
              type: container-group
              isAlert: true
            - nodeTitle: b容器组
              key: bb
              type: container-group
        - clusterName: K8S集群xx
          key: xxxx
          type: k8s-blue
          nodes:
            - nodeTitle: a容器组
              key: aa
              type: pod
              isAlert: true
            - nodeTitle: b容器组
              key: bb
              type: pod
```
