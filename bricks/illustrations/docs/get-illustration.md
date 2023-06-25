获取插画。

## Examples

```yaml preview
brick: basic.general-button
properties:
  textContent: View illustration
events:
  click:
    useProvider: illustrations.get-illustration
    args:
      - category: feedback
        name: fail
    callback:
      success:
        action: window.open
        args:
          - "<% EVENT.detail %>"
          - _blank
```

## Usage in pro-code

```jsx
import { unwrapProvider } from "@next-core/utils/general";

// Use `unwrapProvider` to get the original function of a provider
const getIllustration = unwrapProvider("illustrations.get-illustration");

function MyComponent() {
  const src = getIllustration({ category: "feedback", name: "fail" });
  return <img src={src}>;
}
```
