卡片项容器

## Examples

### Basic

```yaml preview
brick: eo-card-box
children:
  - brick: eo-avatar
    slot: avatar
    properties:
      icon:
        lib: easyops
        icon: account
      color: var(--theme-blue-color)
      bgColor: var(--theme-blue-background)
  - brick: span
    slot: title
    properties:
      textContent: Hello
  - brick: span
    slot: description
    properties:
      textContent: World
  - brick: eo-tag-list
    slot: footer
    properties:
      size: small
      list:
        - text: IT 资源管理
          key: IT_resource_management
          color: gray
        - text: 资源套餐
          key: resource_package
          color: gray
        - text: 存储设备
          key: storage_device
          color: gray
```
