---
tagName: eo-dropdown-select
displayName: WrappedEoDropdownSelect
description: A dropdown select brick, commonly used for titles
category: interact-basic
source: "@next-bricks/basic"
---

# eo-dropdown-select

> A dropdown select brick, commonly used for titles

## Props

| property         | type                                  | required | default    | description                                      |
| ---------------- | ------------------------------------- | -------- | ---------- | ------------------------------------------------ |
| defaultValue     | `string \| number \| undefined`       | no       | -          | Default value; only the initial setting takes effect |
| options          | `DropdownSelectOption[] \| undefined` | no       | -          | List of options                                  |
| size             | `"medium" \| "large" \| undefined`    | no       | `"medium"` | Select size                                      |
| loading          | `boolean \| undefined`                | no       | -          | Whether to show the loading state                |
| labelMaxWidth    | `string \| number \| undefined`       | no       | `"650px"`  | Maximum width of the currently selected label    |
| dropdownMaxWidth | `string \| number \| undefined`       | no       | `"500px"`  | Maximum width of the dropdown panel              |

## Events

| event  | detail                                                                                   | description                 |
| ------ | ---------------------------------------------------------------------------------------- | --------------------------- |
| change | `DropdownSelectOption` — { label: selected label text, value: selected value, disabled: whether it is disabled } | Triggered when the option changes |

## Methods

| method           | params                                                                  | returns | description                                                                   |
| ---------------- | ----------------------------------------------------------------------- | ------- | ----------------------------------------------------------------------------- |
| setDefaultOption | <ul><li>`option: DropdownSelectOption` - the option to set as the default</li></ul> | `void`  | Sets the default selected option; if the option does not exist in options, it is appended to the list |

## Slots

| name   | description                        |
| ------ | ---------------------------------- |
| prefix | Content placed before the dropdown list |

## Examples

### Basic

Basic usage of the dropdown select brick, suitable for selection scenarios in title areas.

```yaml preview minHeight="200px"
brick: eo-dropdown-select
properties:
  size: large
  defaultValue: shenzhen
  options:
    - label: Beijing
      value: beijing
    - label: Shenzhen
      value: shenzhen
    - label: Guangzhou
      value: guangzhou
```

### Change Event

Listen for option changes; the `change` event is triggered when a different option is selected.

```yaml preview minHeight="200px"
brick: eo-dropdown-select
properties:
  defaultValue: beijing
  options:
    - label: Beijing
      value: beijing
    - label: Shenzhen
      value: shenzhen
    - label: Guangzhou
      value: guangzhou
events:
  change:
    - action: message.success
      args:
        - "<% `Selected: ${EVENT.detail.label}` %>"
```

### Loading

Displays the loading state; a loading indicator is shown while options are fetched asynchronously.

```yaml preview minHeight="200px"
brick: eo-dropdown-select
properties:
  loading: true
  options:
    - label: Beijing
      value: beijing
    - label: Shenzhen
      value: shenzhen
```

### Custom Width

Customize the maximum label width and the maximum dropdown panel width.

```yaml preview minHeight="200px"
brick: eo-dropdown-select
properties:
  labelMaxWidth: 200px
  dropdownMaxWidth: 300px
  defaultValue: beijing
  options:
    - label: Beijing
      value: beijing
    - label: Shenzhen
      value: shenzhen
    - label: Guangzhou (Very Long Label Example)
      value: guangzhou
```

### Disabled Option

Displays a dropdown select that contains a disabled option.

```yaml preview minHeight="200px"
brick: eo-dropdown-select
properties:
  defaultValue: beijing
  options:
    - label: Beijing
      value: beijing
    - label: Shenzhen (Disabled)
      value: shenzhen
      disabled: true
    - label: Guangzhou
      value: guangzhou
```

### Set Default Option

Call the `setDefaultOption` method to dynamically append and set the default option; suitable when the option list does not contain the target value.

```yaml preview minHeight="200px"
- brick: eo-dropdown-select
  ref: myDropdownSelect
  properties:
    defaultValue: beijing
    options:
      - label: Beijing
        value: beijing
      - label: Shenzhen
        value: shenzhen
- brick: eo-button
  properties:
    type: primary
  events:
    click:
      - target: "#myDropdownSelect"
        method: setDefaultOption
        args:
          - label: Tokyo
            value: tokyo
  children:
    - brick: span
      properties:
        textContent: Add Tokyo
```
