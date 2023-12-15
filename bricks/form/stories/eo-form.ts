import { eoFormBasicSvg, eoFormDynamicSvg, eoFormSvg } from "./images";

export const eoFormStory = {
  storyId: "eo-form",
  text: {
    en: "General Form",
    zh: "普通表单",
  },
  description: {
    en: "",
    zh: "通用表单容器",
  },
  icon: {
    imgSrc: eoFormSvg,
  },
  conf: [
    {
      bricks: [
        {
          description: {
            title: "基础表单",
            message: "基础用法",
          },
          brick: "eo-form",
          properties: {
            name: "basic-form",
            layout: "vertical",
            values: {
              nickname: "lucy",
              username: "easyops",
            },
          },
          slots: {
            "": {
              bricks: [
                {
                  brick: "eo-input",
                  properties: {
                    label: "用户名",
                    labelTooltip: "一些帮助信息",
                    name: "username",
                    placeholder: "请输入用户名",
                    required: true,
                  },
                },
                {
                  brick: "eo-select",
                  properties: {
                    helpBrick: "这里是一些说明信息",
                    inputStyle: {
                      width: "100%",
                    },
                    label: "昵称",
                    name: "nickname",
                    options: ["jack", "lucy"],
                    placeholder: "请输入密码",
                  },
                },
                {
                  brick: "eo-submit-buttoms",
                  properties: {
                    cancelText: "取消",
                    submitText: "提交",
                  },
                },
              ],
              type: "bricks",
            },
          },
        },
      ],
      snippetId: "eo-form[basic]",
      title: {
        en: "Basic General Form",
        zh: "基础表单",
      },
      thumbnail: eoFormBasicSvg,
    },
    {
      bricks: [
        {
          description: {
            title: "动态表单",
            message:
              "通过表单子项的notRender属性和setNotRender方法，实现动态表单",
          },
          brick: "eo-form",
          properties: {
            name: "hello",
            layout: "vertical",
            values: {
              change: "descriptionA",
              username: "easyops",
            },
          },
          slots: {
            "": {
              bricks: [
                {
                  brick: "eo-input",
                  properties: {
                    label: "用户名",
                    message: {
                      pattern:
                        "只能包含小写字母、数字和-，且要以字母开头，不能超过64个字符",
                      required: "用户名为必填项",
                    },
                    name: "username",
                    pattern: "^[a-z][-a-z0-9]{0,63}$",
                    placeholder: "请输入用户名",
                    required: true,
                  },
                },
                {
                  brick: "eo-radio",
                  properties: {
                    label: "动态切换",
                    name: "change",
                    options: ["descriptionA", "descriptionB"],
                  },
                  events: {
                    change: [
                      {
                        args: ["<% EVENT.detail.value !== 'descriptionA' %>"],
                        method: "setNotRender",
                        target: "#descriptionA",
                      },
                      {
                        args: ["<% EVENT.detail.value !== 'descriptionB' %>"],
                        method: "setNotRender",
                        target: "#descriptionB",
                      },
                    ],
                  },
                },
                {
                  brick: "eo-textarea",
                  properties: {
                    id: "descriptionA",
                    label: "描述A",
                    max: 10,
                    message: {
                      max: "最长长度限制，10",
                      required: "请输入内容",
                    },
                    name: "descriptionA",
                    placeholder: "请填写描述",
                    required: true,
                    value: "This is a long description",
                  },
                },
                {
                  brick: "eo-select",
                  properties: {
                    hidden: true,
                    id: "descriptionB",
                    inputStyle: {
                      width: "100%",
                    },
                    label: "描述B",
                    name: "descriptionB",
                    notRender: true,
                    options: [
                      {
                        label: "男",
                        value: "male",
                      },
                      {
                        label: "女",
                        value: "female",
                      },
                    ],
                    placeholder: "请填写描述",
                    required: true,
                  },
                },
                {
                  brick: "eo-submit-buttons",
                  properties: {
                    cancelText: "取消",
                    submitText: "提交",
                  },
                },
              ],
              type: "bricks",
            },
          },
        },
      ],
      snippetId: "eo-form[dynamic]",
      title: {
        en: "Dynamic General Form",
        zh: "动态表单",
      },
      thumbnail: eoFormDynamicSvg,
    },
  ],
};
