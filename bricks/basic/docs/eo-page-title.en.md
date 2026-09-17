---
tagName: eo-page-title
description: A page title brick; once set it also updates the browser tab title, and in dashboard mode it is displayed with a larger font size (38px)
category: text
source: "@next-bricks/basic"
---

# eo-page-title

> A page title brick; once set it also updates the browser tab title, and in dashboard mode it is displayed with a larger font size (38px)

## Props

| property | type | required | default | description |
| --- | --- | --- | --- | --- |
| pageTitle | `string \| undefined` | - | - | Page title; once set it also updates the browser page title. When the page is in dashboard mode, the title is displayed with a larger font size (38px). |

## Examples

### Basic

Basic usage: sets the page title.

```yaml preview
- brick: eo-page-title
  properties:
    pageTitle: Hello world
```
