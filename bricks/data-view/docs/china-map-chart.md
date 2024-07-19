构件 `data-view.china-map-chart`

## Examples

### Basic

```yaml preview
- brick: data-view.china-map-chart
  slots:
    detail:
      bricks:
        - brick: div
          properties:
            textContent:
  events:
    detail.open.change:
      - action: console.log
  properties:
    detailContentStyle:
      background: "red"
    dataSource:
      - text: "西藏 1234"
        detailDisplayLocation: "textBottom"
        lngLat:
          lng: 90.132212
          lat: 30.660361
      - text: "四川 8978569"
        detailDisplayLocation: "textBottom"
        lngLat:
          lng: 103.065735
          lat: 30.659462
      - text: "台湾 2348"
        detailDisplayLocation: "pageCenter"
        lngLat:
          lng: 121.509062
          lat: 24.044332
      - text: "湖北 2348"
        detailDisplayLocation: "pageCenter"
        lngLat:
          lng: 112.598572
          lat: 30.984355
```
