复杂的搜索框

## Examples

### Basic

```yaml preview
- brick: data-view.complex-search
  properties:
    placeholder: Search
    style:
      background: "#1c1e21"
      display: block
      height: 300px
    options:
      - name: 主机1
        icon:
          lib: "antd"
          icon: "account-book"
          theme: "outlined"
      - name: 主机2
        icon:
          lib: "antd"
          icon: "account-book"
          theme: "outlined"
  events:
    select:
      - action: console.log
    search:
      - action: console.log
    focus:
      - action: console.log
```
