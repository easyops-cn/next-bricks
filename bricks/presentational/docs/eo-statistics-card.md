统计卡片

## Examples

### Basic

```yaml preview gap
- brick: eo-statistics-card
  properties:
    cardTitle: 安全评分
    value: 93
    valueStyle:
      color: var(--color-success)
    icon:
      lib: easyops
      category: monitor
      icon: infra-monitor
      bgColor: "#E6F0FC"
      color: "#3480EA"
    style:
      width: 300px
  children:
    - brick: eo-tooltip
      slot: titleSuffix
      properties:
        content: 安全评分是根据您的资产状态进行的评分
        trigger: hover
        placement: top-start
      children:
        - brick: eo-icon
          properties:
            lib: antd
            icon: question-circle
            theme: outlined
            style:
              font-size: 12px
              color: var(--text-color-secondary)
```

### Outline

```yaml preview gap
- brick: eo-statistics-card
  properties:
    cardTitle: 事件总数
    value: 1.2K
    unit: 个
    outline: border
    icon:
      lib: easyops
      category: monitor
      icon: infra-monitor
      bgColor: "#E6F0FC"
      color: "#3480EA"
    style:
      width: 300px
- brick: eo-statistics-card
  properties:
    cardTitle: 事件总数
    value: 1.2K
    unit: 个
    outline: background
    icon:
      lib: easyops
      category: monitor
      icon: infra-monitor
      bgColor: "#E6F0FC"
      color: "#3480EA"
    style:
      width: 300px
- brick: eo-statistics-card
  properties:
    cardTitle: 事件总数
    value: 1.2K
    unit: 个
    outline: none
    icon:
      lib: easyops
      category: monitor
      icon: infra-monitor
      bgColor: "#E6F0FC"
      color: "#3480EA"
    style:
      width: 300px
```

### Size

```yaml preview gap
- brick: eo-statistics-card
  properties:
    cardTitle: 事件总数
    value: 1.2K
    unit: 个
    size: large
    icon:
      lib: easyops
      category: monitor
      icon: infra-monitor
      bgColor: "#E6F0FC"
      color: "#3480EA"
    style:
      width: 300px
- brick: eo-statistics-card
  properties:
    cardTitle: 事件总数
    value: 1.2K
    unit: 个
    size: medium
    icon:
      lib: easyops
      category: monitor
      icon: infra-monitor
      bgColor: "#E6F0FC"
      color: "#3480EA"
    style:
      width: 300px
- brick: eo-statistics-card
  properties:
    cardTitle: 事件总数
    value: 1.2K
    unit: 个
    size: small
    icon:
      lib: easyops
      category: monitor
      icon: infra-monitor
      bgColor: "#E6F0FC"
      color: "#3480EA"
    style:
      width: 300px
```

### Overview card

```yaml preview
brick: eo-statistics-card
properties:
  cardTitle: 事件响应率
  value: <% PIPES.unitFormat(0.783, "percent(1)", 2)[0] %>
  icon:
    lib: easyops
    category: monitor
    icon: infra-monitor
    bgColor: "#FEF3EC"
    color: "#F89B64"
children:
  - brick: div
    slot: description
    children:
      - brick: span
        properties:
          textContent: 同比上周
      - brick: span
        properties:
          style:
            color: var(--color-success)
          textContent: "上升3.45%"
  - brick: chart-v2.tiny-line-chart
    slot: basicContent
    properties:
      data:
        - month: Jan
          temperature: 3.9
        - month: Feb
          temperature: 4.2
        - month: Mar
          temperature: 5.7
        - month: Apr
          temperature: 8.5
        - month: May
          temperature: 11.9
        - month: Jun
          temperature: 15.2
        - month: Jul
          temperature: 17
        - month: Aug
          temperature: 16.6
        - month: Sep
          temperature: 10.2
        - month: Oct
          temperature: 10.3
        - month: Nov
          temperature: 6.6
        - month: Dec
          temperature: 4.8
      width: 200px
      height: 60px
      xField: month
      yField: temperature
```

### Complex usage

```yaml preview
brick: eo-statistics-card
properties:
  cardTitle: 事件响应数量
  value: 4,089
  descriptionPosition: right
  style:
    width: 500px
children:
  - brick: eo-icon
    slot: titlePrefix
    properties:
      lib: antd
      icon: check-circle
      theme: filled
      style:
        font-size: 12px
        color: var(--color-success)
  - brick: div
    slot: description
    children:
      - brick: span
        properties:
          textContent: 同比上周
      - brick: span
        properties:
          style:
            color: var(--color-success)
          textContent: "上升31.45%"
  - brick: chart-v2.time-series-chart
    slot: extraContent
    properties:
      axis:
        yAxis:
          precision: 2
      data:
        - host_load_5_per_core: 3.95
          time: 1626600960
        - host_load_5_per_core: 3.88
          time: 1626601020
        - host_load_5_per_core: 3.91
          time: 1626601080
        - host_load_5_per_core: 4
          time: 1626601140
        - host_load_5_per_core: 4.08
          time: 1626601200
        - host_load_5_per_core: 3.91
          time: 1626601260
        - host_load_5_per_core: 3.92
          time: 1626601320
        - host_load_5_per_core: 3.81
          time: 1626601380
        - host_load_5_per_core: 3.93
          time: 1626601440
        - host_load_5_per_core: 3.9
          time: 1626601500
        - host_load_5_per_core: 3.9
          time: 1626601560
        - host_load_5_per_core: 3.8
          time: 1626601620
        - host_load_5_per_core: 3.74
          time: 1626601680
        - host_load_5_per_core: 4.16
          time: 1626601740
        - host_load_5_per_core: 4.12
          time: 1626601800
        - host_load_5_per_core: 4.08
          time: 1626601860
        - host_load_5_per_core: 3.98
          time: 1626601920
        - host_load_5_per_core: 3.79
          time: 1626601980
        - host_load_5_per_core: 3.65
          time: 1626602040
        - host_load_5_per_core: 3.83
          time: 1626602100
        - host_load_5_per_core: 3.7
          time: 1626602160
        - host_load_5_per_core: 3.69
          time: 1626602220
        - host_load_5_per_core: 3.81
          time: 1626602280
        - host_load_5_per_core: 3.81
          time: 1626602340
        - host_load_5_per_core: 3.87
          time: 1626602400
        - host_load_5_per_core: 4.07
          time: 1626602460
        - host_load_5_per_core: 4.02
          time: 1626602520
        - host_load_5_per_core: 4
          time: 1626602580
        - host_load_5_per_core: 3.91
          time: 1626602640
        - host_load_5_per_core: 3.82
          time: 1626602700
        - host_load_5_per_core: 3.76
          time: 1626602760
        - host_load_5_per_core: 3.75
          time: 1626602820
        - host_load_5_per_core: 3.7
          time: 1626602880
        - host_load_5_per_core: 3.86
          time: 1626602940
        - host_load_5_per_core: 3.97
          time: 1626603000
        - host_load_5_per_core: 3.8
          time: 1626603060
        - host_load_5_per_core: 3.91
          time: 1626603120
        - host_load_5_per_core: 3.92
          time: 1626603180
        - host_load_5_per_core: 3.92
          time: 1626603240
        - host_load_5_per_core: 4.03
          time: 1626603300
        - host_load_5_per_core: 4.05
          time: 1626603360
        - host_load_5_per_core: 3.98
          time: 1626603420
        - host_load_5_per_core: 4.26
          time: 1626603480
        - host_load_5_per_core: 4.59
          time: 1626603540
        - host_load_5_per_core: 4.59
          time: 1626603600
        - host_load_5_per_core: 4.45
          time: 1626603660
        - host_load_5_per_core: 4.41
          time: 1626603720
        - host_load_5_per_core: 4.37
          time: 1626603780
        - host_load_5_per_core: 4.17
          time: 1626603840
        - host_load_5_per_core: 4.41
          time: 1626603900
        - host_load_5_per_core: 4.36
          time: 1626603960
        - host_load_5_per_core: 4.25
          time: 1626604020
        - host_load_5_per_core: 4.37
          time: 1626604080
        - host_load_5_per_core: 4.33
          time: 1626604140
        - host_load_5_per_core: 4.43
          time: 1626604200
        - host_load_5_per_core: 4.48
          time: 1626604260
        - host_load_5_per_core: 4.42
          time: 1626604320
        - host_load_5_per_core: 4.55
          time: 1626604380
        - host_load_5_per_core: 4.64
          time: 1626604440
        - host_load_5_per_core: 4.68
          time: 1626604500
        - host_load_5_per_core: 4.67
          time: 1626604560
        - host_load_5_per_core: 4.75
          time: 1626604620
        - host_load_5_per_core: 4.62
          time: 1626604680
        - host_load_5_per_core: 4.95
          time: 1626604740
        - host_load_5_per_core: 5.29
          time: 1626604800
        - host_load_5_per_core: 5.61
          time: 1626604860
        - host_load_5_per_core: 5.5
          time: 1626604920
        - host_load_5_per_core: 5.96
          time: 1626604980
        - host_load_5_per_core: 5.62
          time: 1626605040
        - host_load_5_per_core: 5.67
          time: 1626605100
        - host_load_5_per_core: 5.56
          time: 1626605160
        - host_load_5_per_core: 5.37
          time: 1626605220
        - host_load_5_per_core: 5.53
          time: 1626605280
        - host_load_5_per_core: 5.46
          time: 1626605340
        - host_load_5_per_core: 5.42
          time: 1626605400
        - host_load_5_per_core: 5.4
          time: 1626605460
        - host_load_5_per_core: 5.33
          time: 1626605520
        - host_load_5_per_core: 5.35
          time: 1626605580
        - host_load_5_per_core: 5.21
          time: 1626605640
        - host_load_5_per_core: 5.22
          time: 1626605700
        - host_load_5_per_core: 5.25
          time: 1626605760
        - host_load_5_per_core: 5.42
          time: 1626605820
        - host_load_5_per_core: 5.51
          time: 1626605880
        - host_load_5_per_core: 5.31
          time: 1626605940
        - host_load_5_per_core: 5.4
          time: 1626606000
        - host_load_5_per_core: 5.76
          time: 1626606060
        - host_load_5_per_core: 5.64
          time: 1626606120
        - host_load_5_per_core: 5.36
          time: 1626606180
        - host_load_5_per_core: 5.53
          time: 1626606240
        - host_load_5_per_core: 5.38
          time: 1626606300
        - host_load_5_per_core: 5.25
          time: 1626606360
        - host_load_5_per_core: 5.24
          time: 1626606420
        - host_load_5_per_core: 5.09
          time: 1626606480
        - host_load_5_per_core: 5.15
          time: 1626606540
        - host_load_5_per_core: 5.14
          time: 1626606600
        - host_load_5_per_core: 5.03
          time: 1626606660
        - host_load_5_per_core: 4.96
          time: 1626606720
        - host_load_5_per_core: 4.74
          time: 1626606780
        - host_load_5_per_core: 4.49
          time: 1626606840
        - host_load_5_per_core: 4.51
          time: 1626606900
        - host_load_5_per_core: 4.44
          time: 1626606960
        - host_load_5_per_core: 4.54
          time: 1626607020
        - host_load_5_per_core: 4.46
          time: 1626607080
        - host_load_5_per_core: 4.53
          time: 1626607140
        - host_load_5_per_core: 4.27
          time: 1626607200
        - host_load_5_per_core: 4.31
          time: 1626607260
        - host_load_5_per_core: 4.3
          time: 1626607320
        - host_load_5_per_core: 4.07
          time: 1626607380
        - host_load_5_per_core: 3.97
          time: 1626607440
        - host_load_5_per_core: 4.31
          time: 1626607500
        - host_load_5_per_core: 4.19
          time: 1626607560
        - host_load_5_per_core: 4.2
          time: 1626607620
        - host_load_5_per_core: 4.21
          time: 1626607680
        - host_load_5_per_core: 4.08
          time: 1626607740
        - host_load_5_per_core: 3.94
          time: 1626607800
        - host_load_5_per_core: 3.9
          time: 1626607860
        - host_load_5_per_core: 3.78
          time: 1626607920
        - host_load_5_per_core: 3.8
          time: 1626607980
        - host_load_5_per_core: 3.83
          time: 1626608040
        - host_load_5_per_core: 3.92
          time: 1626608100
        - host_load_5_per_core: 3.88
          time: 1626608160
        - host_load_5_per_core: 4.05
          time: 1626608220
        - host_load_5_per_core: 4.04
          time: 1626608280
        - host_load_5_per_core: 4.01
          time: 1626608340
        - host_load_5_per_core: 4.13
          time: 1626608400
        - host_load_5_per_core: 3.94
          time: 1626608460
        - host_load_5_per_core: 3.91
          time: 1626608520
        - host_load_5_per_core: 3.86
          time: 1626608580
        - host_load_5_per_core: 3.75
          time: 1626608640
        - host_load_5_per_core: 3.82
          time: 1626608700
        - host_load_5_per_core: 4
          time: 1626608760
        - host_load_5_per_core: 3.88
          time: 1626608820
        - host_load_5_per_core: 3.8
          time: 1626608880
        - host_load_5_per_core: 4.05
          time: 1626608940
        - host_load_5_per_core: 4.42
          time: 1626609000
        - host_load_5_per_core: 4.53
          time: 1626609060
      height: 200
      showPoint: false
      xField: time
      xRange:
        from: 1626601000
        step: 60
        to: 1626609200
      yField: host_load_5_per_core
```

### Interaction

#### Operator slot

```yaml preview gap
- brick: eo-statistics-card
  properties:
    cardTitle: 安全评分
    value: 93
    valueStyle:
      color: var(--color-success)
    icon:
      lib: easyops
      category: monitor
      icon: infra-monitor
      bgColor: "#E6F0FC"
      color: "#3480EA"
    style:
      width: 300px
  children:
    - brick: eo-mini-actions
      slot: operator
      properties:
        actions:
          - icon:
              lib: antd
              icon: edit
              theme: outlined
            text: 编辑
            isDropdown: true
            event: edit
          - icon:
              lib: antd
              icon: delete
              theme: outlined
            text: 删除
            isDropdown: true
            disabled: true
            event: delete
      events:
        edit:
          - action: console.log
        delete:
          - action: console.log
```

#### Whole card

```yaml preview gap
- brick: eo-link
  properties:
    type: plain
    url: /detail
    target: _blank
  children:
    - brick: eo-statistics-card
      properties:
        interactable: true
        outline: border
        cardTitle: 安全评分
        value: 93
        valueStyle:
          color: var(--color-success)
        icon:
          lib: easyops
          category: monitor
          icon: infra-monitor
          bgColor: "#E6F0FC"
          color: "#3480EA"
        style:
          width: 200px
- brick: eo-link
  properties:
    type: plain
    url: /detail
    target: _blank
  children:
    - brick: eo-statistics-card
      properties:
        interactable: true
        outline: background
        cardTitle: 安全评分
        value: 93
        valueStyle:
          color: var(--color-success)
        icon:
          lib: easyops
          category: monitor
          icon: infra-monitor
          bgColor: "#E6F0FC"
          color: "#3480EA"
        style:
          width: 200px
- brick: eo-link
  properties:
    type: plain
    url: /detail
    target: _blank
  children:
    - brick: eo-statistics-card
      properties:
        interactable: true
        outline: none
        cardTitle: 安全评分
        value: 93
        valueStyle:
          color: var(--color-success)
        icon:
          lib: easyops
          category: monitor
          icon: infra-monitor
          bgColor: "#E6F0FC"
          color: "#3480EA"
        style:
          width: 200px
```
