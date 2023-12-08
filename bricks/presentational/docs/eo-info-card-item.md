构件 `eo-info-card-item`

## Examples

### Basic

```yaml preview
- brick: eo-info-card-item
  properties:
    style:
      width: 100%
    cardTitle: 资产盘点
    cardIcon:
      color: orange
      icon:
        icon: patch-management
        lib: easyops
        category: app
    description: 资产盘点为设备运维人员提供便捷的设备资产盘点能力，使用自动化的盘点方式替换原有人工盘点，解放设备运维人员的双手
    detailList:
      - desc: 7M
        title: 大小
      - desc: "863"
        title: 下载次数
      - desc: 80%
        title: 下载率
      - desc: 2%
        title: 失败率
  slots:
    title:
      type: bricks
      bricks:
        - brick: eo-tag
          properties:
            textContent: 生产
            color: blue
    action:
      type: bricks
      bricks:
        - brick: eo-dropdown-actions
          events:
            advanced.setting:
              - action: message.success
                args:
                  - click advanced button
            button.delete:
              - useProvider: basic.show-dialog
                args:
                  - type: confirm
                    title: Please Confirm
                    content: Are you sure?
                callback:
                  success:
                    action: message.success
                    args:
                      - You just confirmed!
                  error:
                    action: message.warn
                    args:
                      - You just canceled.
          children:
            - brick: eo-button
              properties:
                type: link
                icon:
                  lib: fa
                  icon: ellipsis-v
                size: small
          properties:
            actions:
              - text: 高级设置
                icon:
                  icon: setting
                  lib: antd
                event: advanced.setting
              - text: 删除
                icon:
                  lib: easyops
                  category: default
                  icon: delete
                event: button.delete
                tooltip: 删除
                tooltipPlacement: right
                color: var(--theme-red-color)
- brick: div
  properties:
    style:
      height: 20px
- brick: eo-info-card-item
  properties:
    style:
      width: 100%
    cardTitle: 资源监控微应用
    cardIcon:
      color: blue
      icon:
        icon: chart-pie
        lib: fa
    description: F5管理将企业F5BIG-IP设备统一管理，可在F5设备卡片页概览全部设备的状态，了解 VirtualServer、Pool、iRules资源信息
    detailList:
      - useBrick:
          brick: eo-switch
          properties:
            name: enabled
            size: small
            style:
              marginTop: "-2.5px"
            value: true
        title: 是否启用
      - desc: "7663"
        title: 下载次数
      - desc: 90%
        title: 下载率
      - desc: 3%
        title: 失败率
  slots:
    title:
      type: bricks
      bricks:
        - brick: eo-tag
          properties:
            textContent: 测试
            color: green
    action:
      type: bricks
      bricks:
        - brick: eo-dropdown-actions
          events:
            advanced.setting:
              - action: message.success
                args:
                  - click advanced button
            button.delete:
              - useProvider: basic.show-dialog
                args:
                  - type: confirm
                    title: Please Confirm
                    content: Are you sure?
                callback:
                  success:
                    action: message.success
                    args:
                      - You just confirmed!
                  error:
                    action: message.warn
                    args:
                      - You just canceled.
          children:
            - brick: eo-button
              properties:
                type: link
                icon:
                  lib: fa
                  icon: ellipsis-v
                size: small
          properties:
            actions:
              - text: 高级设置
                icon:
                  icon: setting
                  lib: antd
                event: advanced.setting
              - text: 删除
                icon:
                  lib: easyops
                  category: default
                  icon: delete
                event: button.delete
                tooltip: 删除
                tooltipPlacement: right
                color: var(--theme-red-color)
- brick: div
  properties:
    style:
      height: 50px
```
