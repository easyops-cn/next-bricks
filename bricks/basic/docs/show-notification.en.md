Displays a notification message.

By default, when the notification box is closed in any way, `callback.success` is triggered.

If both `showConfirm: true` and `showCancel: true` are set, `callback.success` is triggered only when the confirm button is pressed; when the notification box is closed for any other reason, `callback.error` is triggered instead.

## Examples

### Types

```yaml preview
brick: div
properties:
  style:
    display: grid
    gap: 1em
children:
  - brick: eo-button
    properties:
      textContent: Info
    events:
      click:
        useProvider: basic.show-notification
        args:
          - message: It works!
  - brick: eo-button
    properties:
      textContent: Success
    events:
      click:
        useProvider: basic.show-notification
        args:
          - message: Success!
            type: success
  - brick: eo-button
    properties:
      textContent: Error
    events:
      click:
        useProvider: basic.show-notification
        args:
          - message: Error!
            type: error
  - brick: eo-button
    properties:
      textContent: Warn
    events:
      click:
        useProvider: basic.show-notification
        args:
          - message: Warn!
            type: warn
```

### voice play

```yaml preview minHeight="500px"
brick: div
properties:
  style:
    display: grid
    gap: 1em
children:
  - brick: eo-button
    properties:
      textContent: Voice alarm notification
    events:
      click:
        useProvider: basic.show-notification
        args:
          - message: Alarm message!
            type: error
            voiceContent: An alarm was raised
```

### Placement

```yaml preview minHeight="500px"
brick: div
properties:
  style:
    display: grid
    gap: 1em
children:
  - brick: eo-button
    properties:
      textContent: topRight
    events:
      click:
        useProvider: basic.show-notification
        args:
          - message: It works!
            placement: topRight
            styleType: rectAngle
```

### Icon and title

```yaml preview
brick: div
properties:
  style:
    display: grid
    gap: 1em
children:
  - brick: eo-button
    properties:
      textContent: icon and title
    events:
      click:
        useProvider: basic.show-notification
        args:
          - message: It works!
            title: Title
            placement: topRight
            icon:
              icon: star
              theme: outlined
              lib: antd
```

### Closable

```yaml preview
brick: div
properties:
  style:
    display: grid
    gap: 1em
children:
  - brick: eo-button
    properties:
      textContent: Closable
    events:
      click:
        useProvider: basic.show-notification
        args:
          - message: It works!
            duration: 20000
            closable: true
```

### Operations

```yaml preview minHeight="500px"
brick: div
properties:
  style:
    display: grid
    gap: 1em
children:
  - brick: eo-button
    properties:
      textContent: Normal notification
    events:
      click:
        useProvider: basic.show-notification
        args:
          - type: success
            title: This is a overflow hidden test title!
            message: |
              This is a message test! This is a message test! This is a message test! This is a message test! This is a message test!
            placement: topRight
            closable: true
            showConfirm: true
            showCancel: true
        callback:
          success:
            - action: message.success
              args:
                - You just confirm
          error:
            - action: message.info
              args:
                - You just canceled
  - brick: eo-button
    properties:
      textContent: Custom Text Notification
    events:
      click:
        useProvider: basic.show-notification
        args:
          - type: error
            title: This is a overflow hidden test title!
            message: |
              This is a message test! This is a message test! This is a message test! This is a message test! This is a message test!
            closable: true
            showConfirm: true
            showCancel: true
            placement: topRight
            confirmText: Custom text
            cancelText: Cancel text
        callback:
          success:
            - action: message.success
              args:
                - You just confirm
          error:
            - action: message.info
              args:
                - You just canceled
  - brick: eo-button
    properties:
      textContent: hideCancel Notification
    events:
      click:
        useProvider: basic.show-notification
        args:
          - type: warn
            title: This is a overflow hidden test title!
            message: |
              This is a message test! This is a message test! This is a message test! This is a message test! This is a message test!
            hasOperate: true
            placement: topRight
            showConfirm: true
        callback:
          success:
            - action: message.success
              args:
                - You just confirm
          error:
            - action: message.error
              args:
                - This should never happen
```

## Usage in pro-code

```tsx
import { unwrapProvider } from "@next-core/utils/general";
import type { showNotification as _showNotification } from "@next-bricks/basic/data-providers/show-notification/show-notification";

// Use `unwrapProvider` to get the original function of a provider
const showNotification = unwrapProvider<typeof _showNotification>(
  "basic.show-notification"
);

function MyComponent() {
  const handleClick = useCallback(() => {
    showNotification({
      type: "success",
      message: "Done!",
    });
  }, []);
  return <button onClick={handleClick} />;
}
```
