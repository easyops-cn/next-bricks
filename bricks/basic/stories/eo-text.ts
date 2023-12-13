import {
  eoTextAuxiliaryTextSvg,
  eoTextBannerTitleSvg,
  eoTextCategoryTitleSvg,
  eoTextContainerCardTitleSvg,
  eoTextMainSvg,
  eoTextSvg,
} from "./images/index.js";

export const eoTextStory = {
  storyId: "eo-text",
  text: {
    en: "General text",
    zh: "通用文本",
  },
  description: {
    en: "General text",
    zh: "通用文本",
  },
  icon: {
    imgSrc: eoTextSvg,
  },
  conf: [
    {
      bricks: [
        {
          brick: "eo-text",
          properties: {
            textContent: "容器卡片标题",
            fontSize: "var(--card-title-font-size)",
            color: "var(--color-header-text)",
            fontWeight: "var(--font-weight-500)",
            display: "block",
          },
        },
      ],
      snippetId: "eo-text[containerCardTitle]",
      title: {
        en: "Container Card Title",
        zh: "容器卡片标题",
      },
      thumbnail: eoTextContainerCardTitleSvg,
    },
    {
      bricks: [
        {
          brick: "eo-text",
          properties: {
            textContent: "正文",
            fontSize: "var(--normal-font-size)",
            color: "var(--color-normal-text)",
            fontWeight: "var(--font-weight-400)",
          },
        },
      ],
      snippetId: "eo-text[main]",
      title: {
        en: "main",
        zh: "正文",
      },
      thumbnail: eoTextMainSvg,
    },
    {
      bricks: [
        {
          brick: "eo-text",
          properties: {
            textContent: "辅助文字",
            fontSize: "var(--normal-font-size)",
            color: "var(--color-secondary-text)",
            fontWeight: "var(--font-weight-400)",
          },
        },
      ],
      snippetId: "eo-text[auxiliaryText]",
      title: {
        en: "Auxiliary Text",
        zh: "辅助文字	",
      },
      thumbnail: eoTextAuxiliaryTextSvg,
    },
    {
      bricks: [
        {
          brick: "eo-text",
          properties: {
            textContent: "banner标题",
            fontSize: "var(--special-title-font-size-small)",
            color: "var(--color-header-text)",
            fontWeight: "var(--font-weight-500)",
            display: "block",
          },
        },
      ],
      snippetId: "eo-text[bannerTitle]",
      title: {
        en: "Banner Title",
        zh: "banner标题",
      },
      thumbnail: eoTextBannerTitleSvg,
    },
    {
      bricks: [
        {
          brick: "eo-text",
          properties: {
            textContent: "分类标题",
            fontSize: "var(--sub-title-font-size-small)",
            color: "var(--color-secondary-text)",
            fontWeight: "var(--font-weight-400)",
            display: "block",
          },
        },
      ],
      snippetId: "eo-text[categoryTitle]",
      title: {
        en: "Category Title",
        zh: "分类标题",
      },
      thumbnail: eoTextCategoryTitleSvg,
    },
  ],
};
