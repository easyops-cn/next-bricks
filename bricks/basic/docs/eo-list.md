---
tagName: eo-list
displayName: WrappedEoList
description: 通用列表构件，支持默认、导航和排名三种展示变体
category: display-component
source: "@next-bricks/basic"
---

# eo-list

> 通用列表构件，支持默认、导航和排名三种展示变体

## Props

| 属性       | 类型                        | 必填 | 默认值      | 说明                                                       |
| ---------- | --------------------------- | ---- | ----------- | ---------------------------------------------------------- |
| variant    | `ListVariant`               | -    | `"default"` | 列表变体，支持 "default"、"navigation"、"ranking" 三种样式 |
| dataSource | `Record<string, unknown>[]` | -    | -           | 列表数据源                                                 |
| fields     | `ListFields`                | -    | -           | 字段映射，用于将数据源中的字段映射到列表项的对应属性       |

## Examples

### 导航列表

使用 `variant="navigation"` 展示带图标和链接的导航列表，适用于应用入口场景。

```yaml preview
brick: eo-list
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
```

### 默认列表

使用默认 `variant` 展示纯文本列表，数据项可以包含标题和可选的链接。

```yaml preview
brick: eo-list
properties:
  dataSource:
    - title: 文档中心
      url: /docs
    - title: API 参考
      url: /api
    - title: 更新日志
      href: https://github.com/easyops-cn/changelog
  fields:
    title: title
    url: url
    href: href
```

### 使用字段映射

通过 `fields` 映射数据源中的自定义字段名到列表项属性，方便对接不同数据结构的接口。

```yaml preview
brick: eo-list
properties:
  variant: navigation
  dataSource:
    - name: 监控告警
      desc: 实时监控和告警管理
      iconData:
        lib: antd
        icon: alert
      link: /monitoring
    - name: 日志分析
      desc: 日志收集与分析平台
      iconData:
        lib: antd
        icon: file-text
      link: /logs
  fields:
    title: name
    description: desc
    icon: iconData
    url: link
```
