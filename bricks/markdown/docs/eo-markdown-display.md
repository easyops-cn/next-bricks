用于展示 markdown 内容的构件。

## Examples

### Basic

````yaml preview
brick: eo-markdown-display
properties:
  content: |
    Heading
    =======

    Sub-heading
    -----------

    # Alternative heading

    ## Alternative sub-heading

    Paragraphs are separated 
    by a blank line.

    Two spaces at the end of a line  
    produce a line break.

    Text attributes _italic_, **bold**, `monospace`.

    Horizontal rule:

    ---

    Bullet lists nested within numbered list:

    1. fruits
        * apple
        * banana
    2. vegetables
        - carrot
        - broccoli

    An [external link](http://example.com).

    An [internal link](/playground).

    ![Image](https://upload.wikimedia.org/wikipedia/commons/5/5c/Icon-pictures.png "icon")

    An image in a link:

    [![Image](https://upload.wikimedia.org/wikipedia/commons/5/5c/Icon-pictures.png "icon")](http://example.com)

    > Markdown uses email-style
    characters for blockquoting.
    >
    > Multiple paragraphs need to be prepended individually.

    Here is a `javascript` code below:

    ```js
    function test() {
      alert("Hello");
    }
    ```

    | Name | Gender | Age |
    | - | - | -: |
    | Jim | Male | 16 |
    | Lucy | Female | 17 |

    Most inline <abbr title="Hypertext Markup Language">HTML</abbr> tags are supported.

    Note: inline HTML are sanitized, and attributes like `class` and `style` are removed, see [`defaultScheme`](https://github.com/syntax-tree/hast-util-sanitize?tab=readme-ov-file#defaultschema) of hast-util-sanitize.

    <em class="em" title="em" style="color:blue">em</em>

    <img src="https://upload.wikimedia.org/wikipedia/commons/3/3f/Fronalpstock_big.jpg" alt="pictures">

    <img src="/404" onerror="alert('oops')">
````
