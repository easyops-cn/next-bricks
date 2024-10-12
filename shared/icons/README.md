# 图标库

https://bricks.js.org/icons/

图标库由 V2 框架仓库迁移至此，在此之前的变更记录请查看 [d280e19](https://github.com/easyops-cn/next-core/tree/d280e19253d6daa996e116e8281f0cf25f0d24d2/packages/brick-icons)。

## 新增图标

**注意：现在我们已支持在微应用菜单中使用项目自行上传的 SVG 图标，对于一些不适合放到统一的图标库里的图标，比如应用菜单专用的图标或定制化项目图标，应直接在项目里上传。**

只需将文件拖入 `src/icons` 目录，并重新执行开发构建 `@next-bricks/icons` 即可。请注意命名规范（`lower-kebab-case`）和表达准确。

直接放置在 `src/icons` 下的图标为默认分类 `default`，放置在其中子目录的图标，以子目录作为分类。

注意区分三种类型的图标：

- 默认都是「字体图标」，和字体一样，本身不提供颜色，而是跟随页面文本颜色的设定（原始 SVG 文件仅使用一种颜色）；
- 需要固定原始颜色（通常会使用多种颜色）的图标，需要放置在特定的分类下（以 `colored-` 开头），这些图标保留图标原始颜色，不能由消费端指定其他颜色；
- 可以让一个图标中的一部分内容带有透明度设置，变相实现类似「双色」的能力（一深一浅）。

---

不确定你的 SVG 图片转换为图标后是否符合预期？点击以下链接并导入 SVG 图片提前在线预览：

https://bricks.js.org/playground/?mode=yaml&example=icons%2Feo-svg-icon%2Fsvgcontent&collapsed=1
