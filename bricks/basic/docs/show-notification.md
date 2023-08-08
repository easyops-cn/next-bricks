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

```yaml preview
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
            styleType: rectAngle
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

## Usage in pro-code

```jsx
import { unwrapProvider } from "@next-core/utils/general";
import type { showNotification as _showNotification } from "@next-bricks/basic/data-providers/show-notification/show-notification";

// Use `unwrapProvider` to get the original function of a provider
const showNotification =
  unwrapProvider < typeof _showNotification > "basic.show-notification";

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
