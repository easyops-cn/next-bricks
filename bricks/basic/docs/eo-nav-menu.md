菜单构件

## Examples

### basic

```yaml preview
- brick: eo-nav-menu
  properties:
    menu:
      title: mock data
      menuItems:
        - text: 创造
          to: /a
          type: default
        - title: 资源库
          type: subMenu
          items:
            - text: 构件库
              to: /b
              type: default
            - title: 契约中心
              to: /c
              type: subMenu
              items:
                - text: cmdb契约
                  to: /cmdb
                  type: default
                - title: devops契约
                  type: subMenu
                  items:
                    - text: flow
                      to: /flow
                      type: default
                    - text: tool
                      to: /tool
                      type: default
        - text: 文档中心
          href: "http://www.baidu.com"
          type: default
        - title: 接口与数据
          type: subMenu
          items:
            - text: Api Gateway
              to: /d
              type: default
            - title: 测试组
              type: group
              items:
                - text: 挂件
                  to: /e
                  type: default
                - text: 构件
                  to: /f
                  type: default
```

### 分类的三级菜单

```yaml preview
- brick: eo-nav-menu
  properties:
    menu:
      title: mock data
      menuItems:
        - text: 创造
          to: /a
          type: default
        - title: 资源库
          type: subMenu
          items:
            - text: 构件库
              to: /b
              type: default
            - title: 契约中心
              to: /c
              type: subMenu
              items:
                - text: cmdb契约
                  to: /cmdb
                  type: default
                - title: devops契约
                  type: subMenu
                  items:
                    - text: flow
                      to: /flow
                      type: default
                    - text: tool
                      to: /tool
                      type: default
        - title: 服务
          type: group
          childLayout: category
          items:
            - title: 接入
              type: group
              items:
                - text: Nginx
                  type: default
                  to: /Nginx
                - text: HAProxy
                  type: default
                  to: /HAProxy
                - text: LVS
                  type: default
                  to: /LVS
            - title: 逻辑
              type: group
              items:
                - text: Apache
                  type: default
                  to: /Apache
            - title: 存储
              type: group
              items:
                - text: NFS
                  type: default
                  to: /NFS
                - text: Ceph
                  type: default
                  to: /Ceph
```
