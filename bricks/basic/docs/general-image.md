通用图片构件。

```yaml preview
- brick: basic.general-image
  properties:
    imgList:
      - src: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        width: 100
```

## Examples

### Preview

```yaml preview
- brick: basic.general-image
  properties:
    imgList:
      - src: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        width: 100
        preview: true
- brick: basic.general-image
  properties:
    imgList:
      - src: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200"
        width: 100
        preview: false
```

### Fallback

```yaml preview
- brick: basic.general-image
  properties:
    imgList:
      - src: "https://www.error.com/test.png"
        fallback: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200"
        width: 100
```
