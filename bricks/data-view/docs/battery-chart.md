电池显示构件

## Examples

### Basic

```yaml preview
- brick: data-view.battery-chart
  properties:
    value: 30
    style:
      background-color: "#1c1e21"
      display: block
```

### ThresholdValue

```yaml preview
- brick: data-view.battery-chart
  properties:
    value: 100
    thresholdValue: 120
    batteryHeight: 80
    batteryWidth: 50
    thresholdColors:
      - color: "linear-gradient(180deg, #246EFF 0%, #26CE90 100%)"
        startValue: 0
        endValue: 120
        headerColor: "#246EFF"
      - color: "linear-gradient(180deg, #FF772A 0%, #FFC22A 100%)"
        startValue: 120
        endValue: 200
        headerColor: "#FF772A"
    style:
      background-color: "#1c1e21"
      display: block
  slots:
    "":
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: 标题
            style:
              color: "#fff"
              opacity: 0.6
              marginTop: 10px
              fontSize: 14px
        - brick: div
          properties:
            textContent: 数据信息
            style:
              color: "#fff"
              fontSize: 20px
              line-height: 29px
              fontWeight: 500
    left:
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: 标题
            style:
              color: "#fff"
              opacity: 0.6
              marginTop: 10px
              fontSize: 14px
        - brick: div
          properties:
            textContent: 数据信息
            style:
              color: "#fff"
              fontSize: 20px
              line-height: 29px
              fontWeight: 500
```
