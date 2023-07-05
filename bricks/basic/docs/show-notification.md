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
