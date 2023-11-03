主内容视图

## Examples

### Basic

```yaml preview
brick: eo-main-view
children:
  - brick: div
    slot: breadcrumb
    properties:
      textContent: Home / List / Detail
  - brick: h1
    slot: pageTitle
    properties:
      textContent: Hello World
  - brick: div
    properties:
      textContent: Say hello to everyone!
```

### Fill Container

```yaml preview
brick: eo-main-view
properties:
  fillContainer: true
  style:
    height: 300px
children:
  - brick: div
    slot: breadcrumb
    properties:
      textContent: Home / List / Detail
  - brick: h1
    slot: pageTitle
    properties:
      textContent: Hello World
  - brick: div
    properties:
      textContent: Say hello to everyone!
      style:
        height: 100%
        border: 1px solid gray
```

### Narrow

```yaml preview
brick: eo-main-view
properties:
  narrow: small
children:
  - brick: div
    slot: breadcrumb
    properties:
      textContent: Home / List / Detail
  - brick: h1
    slot: pageTitle
    properties:
      textContent: Hello World
  - brick: div
    properties:
      textContent: Say hello to everyone!
      style:
        border: 1px solid gray
```
