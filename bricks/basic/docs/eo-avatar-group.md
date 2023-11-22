头像组

## Examples

### Basic

```yaml preview
brick: eo-avatar-group
properties:
  size: small
children:
  - brick: eo-avatar
    properties:
      src: https://images.unsplash.com/photo-1490150028299-bf57d78394e0?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80&crop=right
      name: Lucy
  - brick: eo-avatar
    properties:
      icon:
        lib: antd
        icon: user
        theme: outlined
        color: "#167be0"
      name: Lucy
  - brick: eo-easyops-avatar
    properties:
      nameOrInstanceId: easyops
  - brick: eo-avatar
    properties:
      name: Lucy
```
