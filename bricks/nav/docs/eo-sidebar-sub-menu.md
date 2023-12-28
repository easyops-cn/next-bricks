构件 `eo-sidebar-sub-menu`

## Examples

### Basic

```yaml preview
- brick: eo-sidebar-sub-menu
  properties:
    style:
      width: 220px
      display: block
    menu:
      title: mock data
      menuItems:
        - exact: true
          icon:
            lib: easyops
            category: third-menu
            icon: advanced-settings-third-menu
          text: 测试标题
          to: /developers/brick-book/atom/sub-menu
          type: default
          key: "0"
        - items:
            - icon:
                lib: easyops
                category: third-menu
                icon: application-activity-third-menu
              text: 主机测试兼容复杂场景
              to: /developers/brick-book/atom/sub-menu/1
              key: "1.0"
            - icon:
                lib: easyops
                category: third-menu
                icon: dashboard-third-menu
              text: Docker
              to: /developers/brick-book/atom/sub-menu/2
              key: "1.1"
          title: 平台资源
          type: group
          key: "1"
        - items:
            - icon:
                lib: easyops
                category: third-menu
                icon: host-instance-maintenance-third-menu
              text: 开发负责人
              to: /developers/brick-book/atom/sub-menu/3
              key: "2.0"
            - icon:
                lib: easyops
                category: third-menu
                icon: inspection-overview-third-menu
              text: 运维负责人
              to: /developers/brick-book/atom/sub-menu/4
              key: "2.1"
            - icon:
                lib: easyops
                category: third-menu
                icon: job-management-third-menu
              text: 测试负责人
              to: /developers/brick-book/atom/sub-menu/5
              key: "2.2"
          title: 负责人
          type: group
          key: "2"
        - items:
            - icon:
                lib: easyops
                category: third-menu
                icon: plugin-market-third-menu
              items:
                - text: 被调方
                  to: /developers/brick-book/atom/sub-menu/8
                  key: 3.1.0
              title: 被调方
              type: subMenu
              key: "3.1"
          title: 调用关系
          type: group
          key: "3"
```
