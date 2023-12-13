import { eoMarkdownEditorSvg } from "./images";

export const eoMarkdownEditorStory = {
  storyId: "eo-markdown-editor",
  text: {
    en: "Markdown editor",
    zh: "Markdown编辑",
  },
  description: {
    en: "",
    zh: "Markdown编辑构件",
  },
  icon: {
    imgSrc: eoMarkdownEditorSvg,
  },
  conf: [
    {
      snippetId: "eo-markdown-editor[normal]",
      title: {
        en: "",
        zh: "基础Markdown编辑构件",
      },
      thumbnail: eoMarkdownEditorSvg,
      bricks: [
        {
          brick: "eo-markdown-editor",
          description: {
            title: "Markdown Editor",
            bucketName: "test",
          },
          properties: {
            value: "### 三级标题\n- 列表1\n- 列表2\n- 列表3",
          },
        },
      ],
    },
  ],
};
