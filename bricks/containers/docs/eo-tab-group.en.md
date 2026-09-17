---
tagName: eo-tab-group
displayName: WrappedEoTabGroup
description: Tab container group
category: container-layout
source: "@next-bricks/containers"
---

# eo-tab-group

> Tab container group

## Props

| property | type | required | default | description |
| --- | --- | --- | --- | --- |
| type | `TabType` | - | `"default"` | Style type |
| activePanel | `string` | - | - | Name of the currently active panel, corresponding to the `panel` property of tab-item |
| contentStyle | `React.CSSProperties` | - | - | Content style |
| outline | `TabsOutline` | - | `"default"` | Outline. By default a shadow is used, while under 8.2 there is no outline by default. This property has no effect on the panel type (which never has an outline). |
| fillContainer | `boolean` | - | - | Whether to fill the container height; when enabled, the tab component height becomes 100% and the content area automatically fills the remaining space |

## Events

| event | detail | description |
| --- | --- | --- |
| tab.select | `string` — Name of the currently selected panel | Triggered when a tab is selected |

## Slots

| name | description |
| --- | --- |
| nav | Navigation area, holds eo-tab-item components |
| extra | Extra content on the right of the navigation bar |

## Examples

### Basic Usage

Displays a tab container group with the default style, containing multiple tab-items that switch panels.

```yaml preview
- brick: eo-tab-group
  properties:
    activePanel: "panel1"
  events:
    tab.select:
      action: console.log
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
                    panel: "panel1"
                    label: "Tab One"
                - brick: eo-tab-item
                  properties:
                    panel: "panel2"
                    label: "Tab Two"
                - brick: eo-tab-item
                  properties:
                    panel: "panel3"
                    label: "Tab Three"
    panel1:
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: "Content of panel one"
    panel2:
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: "Content of panel two"
    panel3:
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: "Content of panel three"
```

### Capsule Style

Uses the capsule type to display a capsule-style tab container.

```yaml preview
- brick: eo-tab-group
  properties:
    type: "capsule"
    activePanel: "panel1"
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
                    panel: "panel1"
                    label: "Capsule One"
                - brick: eo-tab-item
                  properties:
                    panel: "panel2"
                    label: "Capsule Two"
    panel1:
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: "Content of capsule panel one"
    panel2:
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: "Content of capsule panel two"
```

### Panel Style

Uses the panel type to display panel-style tabs; this type never has an outline.

```yaml preview
- brick: eo-tab-group
  properties:
    type: "panel"
    activePanel: "panel1"
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
                    panel: "panel1"
                    label: "Panel One"
                - brick: eo-tab-item
                  properties:
                    panel: "panel2"
                    label: "Panel Two"
    panel1:
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: "Panel type content one"
    panel2:
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: "Panel type content two"
```

### Text Style

Uses the text type to display text-only tabs.

```yaml preview
- brick: eo-tab-group
  properties:
    type: "text"
    activePanel: "panel1"
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
                    panel: "panel1"
                    label: "Text One"
                - brick: eo-tab-item
                  properties:
                    panel: "panel2"
                    label: "Text Two"
    panel1:
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: "Text style panel one"
    panel2:
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: "Text style panel two"
```

### Shadow Outline and Custom Content Style

Uses the outline property to set a shadow outline, and contentStyle to customize the style of the content area.

```yaml preview
- brick: eo-tab-group
  properties:
    outline: "shadow"
    activePanel: "panel1"
    contentStyle:
      padding: "24px"
      background: "#fafafa"
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
                    panel: "panel1"
                    label: "Tab One"
                - brick: eo-tab-item
                  properties:
                    panel: "panel2"
                    label: "Tab Two"
    extra:
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: "Extra actions"
    panel1:
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: "Shadow outline panel one"
    panel2:
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: "Shadow outline panel two"
```

### Fill Container

Enables fillContainer so that the tab component fills the height of its parent container.

```yaml preview
- brick: div
  properties:
    style:
      height: "300px"
  slots:
    "":
      type: bricks
      bricks:
        - brick: eo-tab-group
          properties:
            fillContainer: true
            activePanel: "panel1"
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
                            panel: "panel1"
                            label: "Tab One"
                        - brick: eo-tab-item
                          properties:
                            panel: "panel2"
                            label: "Tab Two"
            panel1:
              type: bricks
              bricks:
                - brick: div
                  properties:
                    textContent: "Fill container panel one"
            panel2:
              type: bricks
              bricks:
                - brick: div
                  properties:
                    textContent: "Fill container panel two"
```
