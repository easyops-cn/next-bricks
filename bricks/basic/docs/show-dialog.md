显示对话框。

## Examples

### Confirm

```yaml preview minHeight="400px"
brick: eo-button
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

```yaml preview gap minHeight="400px"
- brick: eo-button
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
- brick: eo-button
  properties:
    textContent: Error
  events:
    click:
      useProvider: basic.show-dialog
      args:
        - type: error
          title: Error
          content: Something went wrong.
- brick: eo-button
  properties:
    textContent: Info
  events:
    click:
      useProvider: basic.show-dialog
      args:
        - type: info
          title: Info
          content: Something happened.
- brick: eo-button
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

```yaml preview minHeight="400px"
brick: eo-button
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

## Usage in pro-code

```tsx
import { unwrapProvider } from "@next-core/utils/general";
import type { showDialog as _showDialog } from "@next-bricks/basic/data-providers/show-dialog/show-dialog";

// Use `unwrapProvider` to get the original function of a provider
const showDialog = unwrapProvider<typeof _showDialog>("basic.show-dialog");

function MyComponent() {
  const handleClick = useCallback(() => {
    showDialog({
      type: "confirm",
      content: "Are you sure?",
    });
  }, []);
  return <button onClick={handleClick} />;
}
```
