显示通知消息。

## Examples

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

### placement

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

### icon 、title

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
            title: 标题
            placement: topRight
            icon:
              icon: star
              theme: outlined
              lib: antd
```

### closable

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

### opertate

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
            confirmText: 自定义文本
            cancelText: 取消文本
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
