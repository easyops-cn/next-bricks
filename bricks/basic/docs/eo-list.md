构件 `eo-list`

## Examples

### Basic

```yaml preview
brick: ai-portal.home-container
properties:
  style:
    padding: 2em
    backgroundColor: "#d8d8d8"
children:
  - brick: eo-list
    properties:
      variant: navigation
      dataSource:
        - title: IT资源管理
          description: 管理IT基础设施和资源
          icon:
            lib: fa
            prefix: fas
            icon: server
          url: /cmdb-instance-management
        - title: 个人工作台
          description: 您的个人工作区和任务管理
          icon:
            lib: fa
            prefix: fas
            icon: desktop
          url: /portal
        - title: 持续集成
          description: CI/CD流水线和自动化部署
          icon:
            lib: fa
            prefix: fas
            icon: code-branch
          url: /ci
      fields:
        title: title
        description: description
        icon: icon
        url: url
      dataset:
        componentId: navigation-list
```
