显示对话框。

## Examples

### Confirm

```yaml preview
brick: div
properties:
  style:
    height: 320px
children:
  - brick: basic.general-button
    properties:
      type: primary
      textContent: Confirm
    events:
      click:
        useProvider: basic.show-dialog
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
```

### Alert

```yaml preview
brick: div
properties:
  style:
    height: 320px
    display: grid
children:
  - brick: basic.general-button
    properties:
      textContent: Success
    events:
      click:
        useProvider: basic.show-dialog
        args:
          - type: success
            title: Success
            content: You've done!
        callback:
          success:
            action: message.info
            args:
              - That's ok.
  - brick: basic.general-button
    properties:
      textContent: Error
    events:
      click:
        useProvider: basic.show-dialog
        args:
          - type: error
            title: Error
            content: Something went wrong.
  - brick: basic.general-button
    properties:
      textContent: Info
    events:
      click:
        useProvider: basic.show-dialog
        args:
          - type: info
            title: Info
            content: Something happened.
  - brick: basic.general-button
    properties:
      textContent: Warn
    events:
      click:
        useProvider: basic.show-dialog
        args:
          - type: warn
            title: Warn
            content: Something went wrong.
```

### Delete

```yaml preview
brick: div
properties:
  style:
    height: 320px
children:
  - brick: basic.general-button
    properties:
      textContent: Delete
      danger: true
      type: primary
    events:
      click:
        useProvider: basic.show-dialog
        args:
          - type: delete
            title: Delete Confirm
            content: Please enter {{ expect }} to delete the file.
            expect: cat.png
        callback:
          success:
            action: message.success
            args:
              - Deleted successfully!
```
