通用链接构件。

```html preview
<basic.general-link href="https://baidu.com/" target="_blank">
  Link to Baidu
</basic.general-link>
```

## Examples

### Internal links

设置 `url` 用于单页应用内的链接跳转。

```html preview
<basic.general-link url="/some/internal/page">Internal page</basic.general-link>
```

### External links

如果设置了 `href`，将使用原生 `<a>` 标签来实现链接跳转，通常用于外链的跳转。

```html preview
<basic.general-link href="https://baidu.com/" target="_blank">
  Link to Baidu
</basic.general-link>
```

### As text

设置 `type="text"` 可以将链接以普通文本的样式进行渲染。

```html preview
<p>
  There is a
  <basic.general-link type="text" href="https://baidu.com/" target="_blank">
    link to Baidu
  </basic.general-link>
  that is hidden in the normal text.
</p>
```

### Disabled

```html preview
<p>
  <basic.general-link disabled href="https://baidu.com/" target="_blank">
    Link to Baidu
  </basic.general-link>
</p>

<p>
  <basic.general-link disabled url="/some/internal/page">
    Internal page
  </basic.general-link>
</p>

<p>
  There is a
  <basic.general-link
    disabled
    type="text"
    href="https://baidu.com/"
    target="_blank"
  >
    link to Baidu
  </basic.general-link>
  that is hidden in the normal text.
</p>
```
