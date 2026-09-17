---
tagName: eo-list
displayName: WrappedEoList
description: A general-purpose list brick that supports three display variants: default, navigation and ranking
category: display-component
source: "@next-bricks/basic"
---

# eo-list

> A general-purpose list brick that supports three display variants: default, navigation and ranking

## Props

| property   | type                        | required | default     | description                                                          |
| ---------- | --------------------------- | -------- | ----------- | -------------------------------------------------------------------- |
| variant    | `ListVariant`               | -        | `"default"` | List variant. Supports the "default", "navigation" and "ranking" styles |
| dataSource | `Record<string, unknown>[]` | -        | -           | List data source                                                     |
| fields     | `ListFields`                | -        | -           | Field mapping, used to map fields in the data source to the corresponding properties of list items |

## Examples

### Navigation List

Use `variant="navigation"` to display a navigation list with icons and links, suitable for application entry scenarios.

```yaml preview
brick: eo-list
properties:
  variant: navigation
  dataSource:
    - title: IT Resource Management
      description: Manage IT infrastructure and resources
      icon:
        lib: fa
        prefix: fas
        icon: server
      url: /cmdb-instance-management
    - title: Personal Workspace
      description: Your personal workspace and task management
      icon:
        lib: fa
        prefix: fas
        icon: desktop
      url: /portal
    - title: Continuous Integration
      description: CI/CD pipelines and automated deployment
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

### Default List

Use the default `variant` to display a plain text list; data items may contain a title and an optional link.

```yaml preview
brick: eo-list
properties:
  dataSource:
    - title: Documentation Center
      url: /docs
    - title: API Reference
      url: /api
    - title: Changelog
      href: https://github.com/easyops-cn/changelog
  fields:
    title: title
    url: url
    href: href
```

### Field Mapping

Use `fields` to map custom field names in the data source to list item properties, making it easy to integrate with APIs that use different data structures.

```yaml preview
brick: eo-list
properties:
  variant: navigation
  dataSource:
    - name: Monitoring & Alerts
      desc: Real-time monitoring and alert management
      iconData:
        lib: antd
        icon: alert
      link: /monitoring
    - name: Log Analysis
      desc: Log collection and analysis platform
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
