---
tagName: eo-tab-item
displayName: WrappedEoTabItem
description: A tab item brick
category: container-layout
source: "@next-bricks/containers"
---

# eo-tab-item

> A tab item brick

## Props

| property   | type               | required | default     | description                                                                                         |
| ---------- | ------------------ | -------- | ----------- | --------------------------------------------------------------------------------------------------- |
| type       | `TabType`          | -        | `"default"` | Style type                                                                                          |
| panel      | `string`           | ✅       | -           | Panel name, corresponding to a slot name in tab-group, used to associate the content panel          |
| icon       | `GeneralIconProps` | -        | -           | Icon configuration, displayed on the left of the tab text                                           |
| disabled   | `boolean`          | -        | -           | Whether it is disabled; when disabled, clicks have no effect and the style is greyed out            |
| active     | `boolean`          | -        | -           | Whether it is active; usually managed automatically by tab-group                                    |
| badgeConf  | `BadgeProps`       | -        | -           | Badge count configuration, displayed on the right of the tab text or at the top right (panel type)  |
| panelColor | `string`           | -        | -           | Panel color, controlling both the text and icon colors in the default and active states             |

## Slots

| name | description                        |
| ---- | ---------------------------------- |
| ""   | Default slot, holds the tab text   |

## CSS Parts

| name     | description       |
| -------- | ----------------- |
| tab-item | Tab item container |

## Examples

### Basic Usage

Displays a basic tab item, including the tab text and the panel association.

```yaml preview
- brick: eo-tab-group
  properties:
    activePanel: "tab1"
  slots:
    nav:
      type: bricks
      bricks:
        - brick: eo-tab-list
          slots:
            "":
              type: bricks
              bricks:
                - brick: eo-tab-item
                  properties:
                    panel: "tab1"
                  slots:
                    "":
                      type: bricks
                      bricks:
                        - brick: span
                          properties:
                            textContent: "Tab One"
                - brick: eo-tab-item
                  properties:
                    panel: "tab2"
                  slots:
                    "":
                      type: bricks
                      bricks:
                        - brick: span
                          properties:
                            textContent: "Tab Two"
                - brick: eo-tab-item
                  properties:
                    panel: "tab3"
                  slots:
                    "":
                      type: bricks
                      bricks:
                        - brick: span
                          properties:
                            textContent: "Tab Three"
    tab1:
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: "Content One"
    tab2:
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: "Content Two"
    tab3:
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: "Content Three"
```

### With Icon

Use the icon property to display an icon on the left of the tab text.

```yaml preview
- brick: eo-tab-group
  properties:
    activePanel: "tab1"
  slots:
    nav:
      type: bricks
      bricks:
        - brick: eo-tab-list
          slots:
            "":
              type: bricks
              bricks:
                - brick: eo-tab-item
                  properties:
                    panel: "tab1"
                    icon:
                      lib: "antd"
                      icon: "home"
                  slots:
                    "":
                      type: bricks
                      bricks:
                        - brick: span
                          properties:
                            textContent: "Home"
                - brick: eo-tab-item
                  properties:
                    panel: "tab2"
                    icon:
                      lib: "antd"
                      icon: "setting"
                  slots:
                    "":
                      type: bricks
                      bricks:
                        - brick: span
                          properties:
                            textContent: "Settings"
    tab1:
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: "Home content"
    tab2:
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: "Settings content"
```

### Disabled

Use the disabled property to disable a tab item.

```yaml preview
- brick: eo-tab-group
  properties:
    activePanel: "tab1"
  slots:
    nav:
      type: bricks
      bricks:
        - brick: eo-tab-list
          slots:
            "":
              type: bricks
              bricks:
                - brick: eo-tab-item
                  properties:
                    panel: "tab1"
                  slots:
                    "":
                      type: bricks
                      bricks:
                        - brick: span
                          properties:
                            textContent: "Available Tab"
                - brick: eo-tab-item
                  properties:
                    panel: "tab2"
                    disabled: true
                  slots:
                    "":
                      type: bricks
                      bricks:
                        - brick: span
                          properties:
                            textContent: "Disabled Tab"
    tab1:
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: "Available tab content"
    tab2:
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: "Disabled tab content"
```

### Badge

Use badgeConf to display a badge count on the tab.

```yaml preview
- brick: eo-tab-group
  properties:
    activePanel: "tab1"
  slots:
    nav:
      type: bricks
      bricks:
        - brick: eo-tab-list
          slots:
            "":
              type: bricks
              bricks:
                - brick: eo-tab-item
                  properties:
                    panel: "tab1"
                    badgeConf:
                      count: 5
                  slots:
                    "":
                      type: bricks
                      bricks:
                        - brick: span
                          properties:
                            textContent: "Messages"
                - brick: eo-tab-item
                  properties:
                    panel: "tab2"
                    badgeConf:
                      count: 99
                  slots:
                    "":
                      type: bricks
                      bricks:
                        - brick: span
                          properties:
                            textContent: "Notifications"
    tab1:
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: "Messages content"
    tab2:
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: "Notifications content"
```

### Custom Panel Color and Active State

Use panelColor to customize the tab color, and active to control the active state manually.

```yaml preview
- brick: eo-tab-group
  properties:
    activePanel: "tab1"
  slots:
    nav:
      type: bricks
      bricks:
        - brick: eo-tab-list
          slots:
            "":
              type: bricks
              bricks:
                - brick: eo-tab-item
                  properties:
                    panel: "tab1"
                    panelColor: "#52c41a"
                    active: true
                  slots:
                    "":
                      type: bricks
                      bricks:
                        - brick: span
                          properties:
                            textContent: "Green Tab"
                - brick: eo-tab-item
                  properties:
                    panel: "tab2"
                    panelColor: "#fa8c16"
                  slots:
                    "":
                      type: bricks
                      bricks:
                        - brick: span
                          properties:
                            textContent: "Orange Tab"
    tab1:
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: "Green panel content"
    tab2:
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: "Orange panel content"
```
