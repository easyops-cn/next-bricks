构件 `eo-snapshot`

## Examples

### Basic

```yaml preview
- brick: eo-snapshot
  properties:
    id: snapshot
  events:
    save:
      action: console.log
    upload:
      action: console.log
- brick: eo-button
  properties:
    textContent: Save As Image
    style:
      margin-right: 10px
  events:
    click:
      - action: console.log
      - target: "#snapshot"
        method: saveAsImage
        args:
          - name: image
- brick: eo-button
  properties:
    textContent: Save As PDF
    style:
      margin-right: 10px
  events:
    click:
      - action: console.log
      - target: "#snapshot"
        method: saveAsPDF
        args:
          - name: pdf
- brick: eo-button
  properties:
    textContent: Capture And Upload
  events:
    click:
      - action: console.log
      - target: "#snapshot"
        method: captureImageAndUpload
        args:
          - name: upload
            bucketName: examples
```
