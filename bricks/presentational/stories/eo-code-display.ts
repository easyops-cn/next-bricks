import { Story } from "@next-shared/story";
import {
  eoCodeDiplayCssSvg,
  eoCodeDiplayJsSvg,
  eoCodeDiplaySvg,
} from "./images";

export const eoCodeDisplayStory: Story = {
  storyId: "eo-code-display",
  text: {
    en: "Code Display",
    zh: "代码展示",
  },
  description: {
    en: "suport Shell、Python、CSS、HTML highlight",
    zh: "支持Shell、Python、CSS、HTML等语法高亮",
  },
  icon: {
    imgSrc: eoCodeDiplaySvg,
  },
  conf: [
    {
      bricks: [
        {
          brick: "eo-code-display",
          properties: {
            showLineNumber: true,
            language: "js",
            value: "const a = 1;",
          },
        },
      ],
      snippetId: "eo-code-display[js]",
      title: {
        en: "JS Code Display",
        zh: "JS代码展示",
      },
      thumbnail: eoCodeDiplayJsSvg,
    },
    {
      bricks: [
        {
          brick: "eo-code-display",
          properties: {
            language: "css",
            value:
              ".container{ \n  background: #ccc;\n  font-size: 16px;\n  line-height: 20px;\n  position: relative;\n}",
            minLines: 3,
            maxLines: 8,
          },
        },
      ],
      snippetId: "eo-code-display[css]",
      title: {
        en: "CSS Code Display",
        zh: "CSS代码展示",
      },
      thumbnail: eoCodeDiplayCssSvg,
    },
  ],
};
