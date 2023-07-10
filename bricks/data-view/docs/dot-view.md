构件 `data-view.dot-view`

## Examples

### Basic

```html preview
- brick: div
  properties:
    style:
      width: 100%
      height: 100%
      background: "#000000FF"
  slots:
    "":
      type: bricks
      bricks:
        - brick: data-view.dot-view
          slots:
            toolBar: 
                type: bricks
                bricks:
                    - brick: div 
                      properties:
                        textContent: 大标题
            content:
                type: bricks 
                bricks:
                    - brick: div 
                      properties:
                        textContent: 内容
```
```
