Bricks for Brick Next V3

## 构件开发

### Brick Playground

1. `yarn`
4. `yarn serve:playground`
5. 打开浏览器访问 `http://localhost:8082/`

在左侧 HTML 一栏内输入：

```html
<basic.general-button type="primary">Hello World</basic.general-button>
```

点击右侧 Preview 一栏的 `Run`，则可以在预览区中看到渲染结果。

在左侧 JavaScript 一栏内输入：

```javascript
const button = document.querySelector("basic\\.general-button");
button.type = "default";
```

再次点击 `Run`，可以看到不同的结果。

在 Brick Next V3 中，构件按标准的自定义元素开发，并且可以脱离我们的核心框架运行，因此也按标准的自定义元素来开发和调试构件。

对于简单属性（`string|number|boolean`）可以直接在 HTML 中定义，而对于复合属性，可以在 JavaScript 中设置。

### 新构件

参考 `bricks/basic` 实现。

可以先拷贝以下文件：

```bash
build.config.js
package.json
tsconfig.json
src/index.ts
src/bootstrap.ts
```

然后运行 `yarn`。

新构件参考 `bricks/basic/src/general-button` 实现。

注意：

- 由于我们采用了 [Module Federation](https://webpack.js.org/concepts/module-federation/)，构件文件需要在 `src/bootstrap.ts` 中引入。
- 由于我们采用了 [Pure ESM package](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c)，相对文件的引入需要使用完整路径并携带扩展名（但 ts/tsx 扩展实际需要写成 js），VS Code 的 import 补全能力可以按预期正常工作，其他 IDE 未知。
- 如果构件基于 `ReactNextElement`，其 `render()` 函数应直接返回一个 `JSX.Element`。
- 目前 `ReactNextElement` 仅支持 ShadowDOM 模式，样式文件需要使用 `*.shadow.css` 并在 `@defineElement` 中通过 `styleTexts` 传递进去。
- 一次 `createDecorators()` 调用返回的装饰器，只能用于一个构件。
- `@property()` 和 `@event()` 装饰器需要添加 [`accessor`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#a-nameauto-accessors-in-classes-auto-accessors-in-classes) 关键字，其中 `@event()` 需要使用 private 形式例如 `#clickEvent`。
- 通常来说，构件的主插槽不要有名字，以便支持 TextNode 作为构件的子节点，同时方便 Visual Builder 做相关优化（作为默认插槽）。
- 运行 lerna 命令时，最好始终加上 `npx` 来运行。

### 预览和调试

参考前一章节启动 Brick Playground，然后可以启动构件的实时打包 `npx lerna run start --scope @next-bricks/basic`。
