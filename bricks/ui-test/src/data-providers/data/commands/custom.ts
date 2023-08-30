import { CommandDoc } from "../../../interface.js";

export default function getCustomCommands(): CommandDoc[] {
  return [
    // <!-- Testing-library commands start
    {
      name: "login",
      category: "other",
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
      chain: "dual",
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
