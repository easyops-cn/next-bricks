告警提示

## Examples

### Basic

```yaml preview
brick: div
properties:
  style:
    display: flex
    flex-direction: column
    gap: 10px
slots:
  "":
    type: bricks
    bricks:
      - brick: eo-alert
        properties:
          textContent: 你好！欢迎使用EasyOps 2.0专业版，你可以根据自身需求添加业务模块。
          type: info
          closable: true
      - brick: eo-alert
        properties:
          textContent: 恭喜！你所提交的信息已经审核通过。
          type: success
          closable: true
      - brick: eo-alert
        properties:
          textContent: "系统将于 15 : 00 - 17 : 00 进行升级，请及时保存你的资料！"
          type: warning
          closable: true
      - brick: eo-alert
        properties:
          textContent: 系统错误，请稍后重试。
          type: error
          closable: true
```

### HasTitle

```yaml preview
brick: div
properties:
  style:
    display: flex
    flex-direction: column
    gap: 10px
slots:
  "":
    type: bricks
    bricks:
      - brick: eo-alert
        properties:
          textContent: 你好，由于你的良好信用，我们决定赠送你三个月产品会员，欲了解会员特权与活动请进首页会员专区查看。
          type: info
          closable: true
          hasTitle: true
        slots:
          title:
            type: bricks
            bricks:
              - brick: div
                properties:
                  textContent: 帮助信息
      - brick: eo-alert
        properties:
          textContent: 你所提交的审核信息已全部通过审核，请及时跟进申请状况。
          type: success
          closable: true
          hasTitle: true
        slots:
          title:
            type: bricks
            bricks:
              - brick: div
                properties:
                  textContent: 已成功
      - brick: eo-alert
        properties:
          textContent: 你所提交的审核信息审核失败，可以进入个人信箱查看原因。如有疑问，请联系客服人员。
          type: warning
          closable: true
          hasTitle: true
        slots:
          title:
            type: bricks
            bricks:
              - brick: div
                properties:
                  textContent: 请注意
      - brick: eo-alert
        properties:
          textContent: 你的账户会员使用权限将在3天后到期，请及时跟进申请状况，如有疑问，请联系审核人员。
          type: error
          closable: true
          hasTitle: true
        slots:
          title:
            type: bricks
            bricks:
              - brick: div
                properties:
                  textContent: 出错了
```
