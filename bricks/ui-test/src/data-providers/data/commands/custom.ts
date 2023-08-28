import { CommandDoc } from "../../../interface.js";

export default function getCustomCommands(): CommandDoc[] {
  return [
    // <!-- Testing-library commands start
    {
      name: "login",
      category: "action",
      chain: "parent",
      from: "custom",
    },
    {
      name: "logout",
      category: "action",
      chain: "parent",
      from: "custom",
    },
    {
      name: "setLanguage",
      category: "action",
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
    },
    // Testing-library commands end -->
  ];
}
