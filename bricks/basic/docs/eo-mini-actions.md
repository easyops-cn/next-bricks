小尺寸按钮组

## Examples

### Basic

```yaml preview minHeight="160px"
brick: eo-mini-actions
properties:
  actions:
    - icon:
        lib: antd
        theme: outlined
        icon: star
      isDropdown: false
      event: collect
    - icon:
        lib: antd
        icon: copy
        theme: outlined
      text: 复制链接
      isDropdown: true
      event: copy
    - icon:
        lib: antd
        icon: download
        theme: outlined
      text: 下载
      isDropdown: true
      disabled: true
      event: download
events:
  collect:
    - action: console.log
  copy:
    - action: console.log
  download:
    - action: console.log
```
