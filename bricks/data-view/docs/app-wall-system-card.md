系统卡片

## Examples

### Basic

```yaml preview
- brick: data-view.app-wall-system-card
  properties:
    cardTitle: A系统
    itemList:
      - key: 实例ID
        value: xxxx
      - key: 系统英文缩写
        value: system-fms
      - key: 实例ID
        value: xxx
      - key: 系统英文名称
        value: app-fms
      - key: 系统中文名称
        value: A财务系统
      - key: 归属部门
        value: 财务系统部
      - key: 系统类型
        value: 应用系统
      - key: 系统描述
        value: 1、使用场景概述：财务应收和应付结算
    buttonName: 应用墙大屏
    style:
      background: rgba(40, 46, 58, 100%)
      box-shadow: "0 0 12px 2px rgba(80, 255, 255, 0.45), inset 0 0 22px 0 #20242A"
      border: "2px solid #50FFFF"
      overflow: hidden
      height: 400px
```

### Status

```yaml preview
- brick: data-view.app-wall-system-card
  properties:
    cardTitle: B系统
    itemList:
      - key: 实例ID
        value: xxxx
      - key: 系统英文缩写
        value: system-fms-B
      - key: 系统描述
        value: 1、使用场景概述：财务应收和应付结算
    buttonName: 应用墙大屏
    status: warning
    style:
      background: "linear-gradient(180deg, #CC0066 0%, rgba(204, 0, 102, 0.2) 100%),#0F1117FF"
      box-shadow: "0 0 12px 2px rgba(204, 0, 102, 0.4), inset 0 4px 10px 0 rgba(255, 255, 255, 0.65)"
      overflow: hidden
      height: 400px
```
