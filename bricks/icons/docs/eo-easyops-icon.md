```yaml preview
- brick: div
  properties:
    style:
      display: flex
      gap: 1em
      fontSize: 32px
  children:
    - brick: eo-icon
      properties:
        lib: easyops
        icon: honeycomb
    - brick: eo-icon
      properties:
        lib: easyops
        category: monitor
        icon: host
    - brick: eo-icon
      properties:
        lib: easyops
        category: model
        icon: app
```

## Examples

### Raw image icons

```yaml preview
- brick: div
  properties:
    style:
      display: flex
      gap: 1em
      fontSize: 32px
  children:
    - brick: eo-icon
      properties:
        lib: easyops
        category: image
        icon: ai-robot-png
    - brick: eo-icon
      properties:
        lib: easyops
        category: image
        icon: ai-robot-gif
```
