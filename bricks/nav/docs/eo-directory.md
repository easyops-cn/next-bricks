构件 `eo-directory`

## Examples

### Basic

```yaml preview
- brick: div
  properties:
    style:
      width: 200px
      height: 500px
  slots:
    "":
      type: bricks
      bricks:
        - brick: eo-directory
          events:
            menu.item.click:
              - action: console.log
            suffix.icon.click:
              - action: console.log
          properties:
            defaultSelectedKeys:
              - strategy1
            directoryTitle: 目录标题
            menuItems:
              - title: 测试
                type: group
                suffixIcon:
                  lib: antd
                  icon: plus-circle
                  theme: outlined
                key: test
                children:
                  - key: strategy1
                    title: 数据1
                  - key: strategy2
                    title: 数据2
              - title: 其他
                type: group
                suffixIcon:
                  lib: antd
                  icon: plus-circle
                  theme: outlined
                suffixIconDisabled: true
                suffixIconTooltip: 禁止点击
                key: otherKey
                children:
                  - key: manual-strategy1
                    title: 数据3
```
