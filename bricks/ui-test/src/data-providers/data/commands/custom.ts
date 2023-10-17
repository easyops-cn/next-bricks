import { CommandDoc } from "../../../interface.js";

export default function getCustomCommands(): CommandDoc[] {
  return [
    // <!-- Testing-library commands start
    {
      name: "login",
      category: "other",
      description: "使用默认用户登录",
      chain: "parent",
      from: "custom",
      icon: {
        lib: "fa",
        icon: "sign-in-alt",
      },
    },
    {
      name: "logout",
      category: "other",
      description: "执行登出",
      chain: "parent",
      from: "custom",
      icon: {
        lib: "fa",
        icon: "sign-out-alt",
      },
    },
    {
      name: "setLanguage",
      category: "other",
      description: "设置平台语言",
      chain: "parent",
      from: "custom",
      params: [
        {
          label: "Language",
          required: true,
          type: "string",
          enum: ["zh", "en"],
        },
      ],
      icon: {
        lib: "fa",
        icon: "language",
      },
    },
    {
      name: "code",
      category: "other",
      description: "填写任意代码",
      chain: "parent",
      from: "custom",
      params: [
        {
          label: "Source",
          required: true,
          type: "string",
        },
      ],
      icon: {
        lib: "fa",
        icon: "code",
      },
    },
    // Testing-library commands end -->
  ];
}
