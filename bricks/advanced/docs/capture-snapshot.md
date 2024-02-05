构件 `advanced.capture-snapshot`

## Examples

### Basic

```yaml preview
- brick: eo-button
  properties:
    textContent: Save As Image
    style:
      margin-right: 10px
  events:
    click:
      - useProvider: advanced.capture-snapshot
        args:
          - fileType: image
            name: image
        callback:
          success:
            - action: console.log
          error:
            - action: console.error
- brick: eo-button
  properties:
    textContent: Save As PDF
    style:
      margin-right: 10px
  events:
    click:
      - useProvider: advanced.capture-snapshot
        args:
          - fileType: pdf
            name: pdf
        callback:
          success:
            - action: console.log
          error:
            - action: console.error
- brick: eo-button
  properties:
    textContent: Capture And Upload
  events:
    click:
      - useProvider: advanced.capture-snapshot
        args:
          - fileType: image
            name: upload
            bucketName: examples
            id: uploadImage
        callback:
          success:
            - action: console.log
          error:
            - action: console.error
```
