构件 `eo-dropdown-select`

## Examples

### Basic

```yaml preview
brick: eo-dropdown-select
properties:
  size: large
  defaultValue: shenzhen
  options:
    - label: Beijing
      value: beijing
    - label: Shenzhen
      value: shenzhen
children:
  - brick: eo-search
    slot: prefix
    properties:
      style:
        marginBottom: 8px
    events:
      input.focus:
        target: eo-dropdown-select
        properties:
          options:
            - label: Beijing
              value: beijing
            - label: Shenzhen
              value: shenzhen
            - label: Guangzhou
              value: guangzhou
```
