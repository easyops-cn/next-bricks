import {
  eoInputBasicSvg,
  // eoInputCopyableSvg,
  eoInputPasswordSvg,
  eoInputSvg,
  eoInputWithAddonSvg,
} from "./images";

export const eoInputStory = {
  storyId: "eo-input",
  text: {
    en: "Input",
    zh: "输入框",
  },
  description: {
    en: "",
    zh: "",
  },
  icon: {
    imgSrc: eoInputSvg,
  },
  conf: [
    {
      bricks: [
        {
          brick: "eo-input",
          description: {
            title: "基本使用",
          },
          properties: {
            name: "username",
            type: "text",
            label: "用户名",
            value: "test",
            placeholder: "请输入用户名",
          },
        },
      ],
      snippetId: "eo-input[basic]",
      title: {
        en: "Basic General Input",
        zh: "基础输入框",
      },
      thumbnail: eoInputBasicSvg,
    },
    {
      bricks: [
        {
          brick: "eo-input",
          description: {
            title: "密码框",
          },
          properties: {
            name: "password",
            type: "password",
            label: "密码",
            value: "123456",
            placeholder: "请输入密码",
          },
        },
      ],
      snippetId: "eo-input[password]",
      title: {
        en: "Password General Input",
        zh: "密码输入框",
      },
      thumbnail: eoInputPasswordSvg,
    },
    {
      bricks: [
        {
          brick: "eo-input",
          description: {
            title: "前缀，后缀",
          },
          properties: {
            placeholder: "addon slot",
          },
          slots: {
            addonBefore: {
              type: "bricks",
              bricks: [
                {
                  brick: "span",
                  properties: {
                    textContent: "https://",
                  },
                },
              ],
            },
            addonAfter: {
              type: "bricks",
              bricks: [
                {
                  brick: "span",
                  properties: {
                    textContent: ".com",
                  },
                },
              ],
            },
          },
        },
      ],
      snippetId: "eo-input[with-addon]",
      title: {
        en: "General Input with Addon",
        zh: "带前后缀的输入框",
      },
      thumbnail: eoInputWithAddonSvg,
    },
  ],
};
