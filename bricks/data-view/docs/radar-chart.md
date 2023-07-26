雷达图构件

## Examples

### Basic

```yaml preview
- brick: data-view.radar-chart
  properties:
    dataSource:
      - name: JavaScript
        maxValue: 100
        value: 60
        percentValue: 45.8%
      - name: Java
        maxValue: 100
        value: 30
        percentValue: 45.8%
      - name: CSS
        maxValue: 100
        value: 70
        percentValue: 45.8%
      - name: Python
        maxValue: 100
        value: 30
        percentValue: 45.8%
      - name: Three.js
        maxValue: 100
        value: 50
        percentValue: 45.8%
    value: 85.9
    dataCircle:
      fillStyle: red
      r: 3
    style:
      display: block
      background-color: "#1c1e21"
```
