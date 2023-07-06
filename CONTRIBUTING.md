# 贡献指南

## 构件开发

### Playground

运行 `yarn serve:playground` 然后打开浏览器访问 `http://localhost:8082/`。

Playground 左侧可以编写 HTML 或 YAML 代码，右侧显示实时预览。可以下拉选择预设的示例，或选择 `- local -` 进行本地代码编写。

### Playground 示例

Playground 中的示例列表来自约定的示例文件和文档文件。

- 示例文件：`src/**/*/example.html` 或 `src/**/*/example.yaml`
- 文档文件：`docs/*.md`

**不再推荐使用单独的示例文件，建议迁移至文档文件。**

[点击查看构件文档的编写](#构件文档)。

### 新构件

运行 `yarn yo`，按提示输入，可以快速创建新构件（或新的构件包、provider）。

![Screen shot for yarn yo](assets/yo.png)

更多细节可以参考 [`bricks/basic/src/button/index.tsx`](bricks/basic/src/button/index.tsx) 实现。

> **注意：**
>
> - 由于我们采用了 [Module Federation](https://webpack.js.org/concepts/module-federation/)，构件文件需要在 `src/bootstrap.ts` 中引入。
> - 由于我们采用了 [Pure ESM package](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c)，相对文件的引入需要使用完整路径并携带> 扩展名（但 ts/tsx 扩展实际需要写成 js），VS Code 的 import 补全能力可以按预期正常工作，其他 IDE 未知。
> - 如果构件基于 `ReactNextElement`，其 `render()` 函数应直接返回一个 `JSX.Element`。
> - 目前 `ReactNextElement` 仅支持 ShadowDOM 模式，样式文件需要使用 `*.shadow.css` 并在 `@defineElement` 中通过 `styleTexts` 传递进去。
> - 一次 `createDecorators()` 调用返回的装饰器，只能用于一个构件。
> - `@property()` 和 `@event()` 装饰器需要添加 [`accessor`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.> html#a-nameauto-accessors-in-classes-auto-accessors-in-classes) 关键字，其中 `@event()` 需要使用 private 形式例如 `#clickEvent`。
> - 通常来说，构件的主插槽不要有名字，以便支持 TextNode 作为构件的子节点，同时方便 Visual Builder 做相关优化（作为默认插槽）。
> - 运行 lerna 命令时，最好始终加上 `npx` 来运行。

### 预览和调试

先启动构件的实时打包 `npx lerna run start --scope @next-bricks/basic`，然后参考前一章节启动 playground。

## 构件文档

构件文档由手工编写的 markdown 文档和写在源代码中的注释共同组成。手工编写的文档主要提供场景化的示例，而源代码中的注释主要提供构件的属性、插槽、事件和方法等 API 的说明。

### Markdown 文档

手工编写的文档统一放在各个构件包内的 `docs` 目录中，以构件名（不带点号前的 namespace）作为文件名编写 markdown，可参考 [bricks/basic/docs/general-button.md](bricks/basic/docs/general-button.md)。

该 markdown 文档的第一部分内容主要描述构件的用途，可以附上基本的示例。

第二部分是场景化示例列表，示例应进行分类，每个分类的标题使用第三级标题，例如 `### Types`。如有需要，分类中可以有附带描述说明性内容，每个分类也可以有多个示例。

示例可以用 HTML 或 YAML 编写。通常来说，如果可以只使用简单属性（可以使用 HTML attributes）完成的编排，应使用 HTML；而如果涉及复合类型属性（需要使用 properties）或配置事件等编排，应使用 YAML。

使用 ` ```html preview ` 或 ` ```yaml preview `标注的代码块，可以在文档中实时预览、并在 playground 中作为示例。例如：

````md
```html preview
<eo-button type="primary">I'm a button</eo-button>
```
````

我们提供了示例 HTML 与 YAML 之间的自动的相互转译，开发者可以只编写其中一种，文档站点上用户可以自由切换示例语言。

为了使 HTML 与 YAML 的自动转译正常工作，示例的编写有一些规则需要遵守：

- 不要在 HTML 中使用 `<script>`，涉及复合属性和事件的编排请使用 YAML；
- 事件配置中尽量只使用 `console.*`、`message.*` 或调用构件方法、设置构件属性；
- 不要使用表达式，除了在事件中简单引用 `<% EVENT %>` 或 `<% EVENT.detail %>` 或 `<% EVENT.target %>`。

提示：如果一个示例中需要平铺多个行内（inline or inline-block）构件，如果使用 YAML 渲染，由于元素之间不像一般的 HTML 那样有一个间隔的空白，这些元素可能会挤在一起，为避免这种问题，可以为代码块再添加一个 meta 字段 `gap`，例如：

````md
```yaml preview gap
- brick: eo-button
- brick: eo-button
- brick: eo-button
```
````

如果使用 HTML 格式编排这种场景，仍然建议标注 `gap`，这样可以避免用户切换至自动转译的 YAML 时出现问题。

### 源代码注释

构件基本信息通过注释写在构件定义之前，例如：

```ts
/**
 * 通用弹出层构件
 *
 * @author sailor
 *
 * @slot - 弹出层内容
 * @slot anchor - 触发弹出层的元素
 */
@defineElement("eo-popover")
class Popover extends ReactNextElement {}
```

> **注意**：相比于 v2 构件的注释，v3 构件的注释将尽量遵循 JSDoc 的惯例，并移除了一些冗余的注释字段。例如：
>
> - 不再填写 `@description`，而是将说明内容直接写在第一段正文中；
> - 也不再填写 `@id` `@name` `@kind` 等信息，这些信息将从源代码中自动识别；
> - 布尔类型的字段，例如 `@required`，不填写表示 `false`，填写 `@required` 时表示 `true`

属性、事件和方法的定义：

```ts
class Popover extends ReactNextElement {
  /**
   * 弹出层如何定位
   * @default "absolute"
   */
  @property()
  accessor strategy: "absolute" | "fixed" | undefined;

  /**
   * 当弹出层可见性变化时触发
   * @detail 当前是否可见
   */
  @event({ type: "visible.change" })
  accessor #visibleChangeEvent!: EventEmitter<boolean>;

  /**
   * 显示弹出层
   */
  @method()
  toggle(active: boolean): void {
    // ...
  }
}
```

对于属性，其默认值可以从代码中自动识别，但如果默认值的逻辑在其他地方实现，则需要填写 `@default xxx`，例如：

```ts
/** ... */
@property({ type: Boolean })
accessor active: boolean | undefined = false;

/**
 * ...
 * @default "absolute"
 */
@property()
  accessor strategy: "absolute" | "fixed" | undefined;
```

对于事件 `detail` 字段的 TS 类型，将自动从源代码中识别，例如，如果事件对应的类型为 `EventEmitter<boolean>`，则其 `detail` 的 TS 类型为 `boolean`。

对于方法，其参数类型和返回类型也都将自动从源代码中识别。
