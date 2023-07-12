通用链接构件。

```html preview
<eo-link href="https://baidu.com/" target="_blank"> Link to Baidu </eo-link>
```

## Examples

### Internal links

设置 `url` 用于单页应用内的链接跳转。

```html preview
<eo-link url="/some/internal/page">Internal page</eo-link>
```

### External links

如果设置了 `href`，将使用原生 `<a>` 标签来实现链接跳转，通常用于外链的跳转。

```html preview
<eo-link href="https://baidu.com/" target="_blank"> Link to Baidu </eo-link>
```

### As text

设置 `type="text"` 可以将链接以普通文本的样式进行渲染。

```html preview
<p>
  There is a
  <eo-link type="text" href="https://baidu.com/" target="_blank">
    link to Baidu
  </eo-link>
  that is hidden in the normal text.
</p>
```

### Disabled

```html preview
<p>
  <eo-link disabled href="https://baidu.com/" target="_blank">
    Link to Baidu
  </eo-link>
</p>

<p>
  <eo-link disabled url="/some/internal/page"> Internal page </eo-link>
</p>

<p>
  There is a
  <eo-link disabled type="text" href="https://baidu.com/" target="_blank">
    link to Baidu
  </eo-link>
  that is hidden in the normal text.
</p>
```

### Plain

设置 `type="plain"` 链接不会拥有额外样式，适合搭配其他构件使用。

```html preview
<eo-link href="https://baidu.com/" target="_blank" type="plain">
  <eo-tag color="blue">Link to Baidu</eo-tag>
</eo-link>
```
