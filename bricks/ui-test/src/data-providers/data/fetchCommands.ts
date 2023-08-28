import type { CommandDoc } from "../../interface.js";

export default function fetchCommands() {
  return Promise.resolve<CommandDoc[]>([
    {
      name: "visit",
      category: "action",
      chain: "parent",
      from: "cypress",
      params: [
        {
          label: "URL",
          required: true,
          type: "string",
        },
        {
          label: "Options",
          type: "object",
        },
      ],
    },
    {
      name: "get",
      category: "query",
      chain: "parent",
      from: "cypress",
      params: [
        {
          label: "Selector",
          required: true,
          type: "string",
        },
        {
          label: "Options",
          type: "object",
        },
      ],
    },
    {
      name: "contains",
      category: "query",
      chain: "dual",
      from: "cypress",
      overloads: [
        {
          label: "By content",
          params: [
            {
              label: "Content",
              required: true,
              type: "string",
            },
            {
              label: "Options",
              type: "object",
            },
          ],
        },
        {
          label: "By selector and content",
          params: [
            {
              label: "Selector",
              required: true,
              type: "string",
            },
            {
              label: "Content",
              required: true,
              type: "string",
            },
            {
              label: "Options",
              type: "object",
            },
          ],
        },
      ],
    },
    {
      name: "click",
      category: "action",
      chain: "child",
      from: "cypress",
      params: [
        {
          label: "Options",
          type: "object",
        },
      ],
    },
    {
      name: "type",
      category: "action",
      chain: "child",
      from: "cypress",
      params: [
        {
          label: "Text",
          required: true,
          type: "string",
        },
        {
          label: "Options",
          type: "object",
        },
      ],
    },
    {
      name: "should:have.length",
      category: "assertion",
      chain: "child",
      from: "cypress",
      params: [
        {
          label: "value",
          required: true,
          type: "number",
        },
      ],
    },
    {
      name: "should:exist",
      category: "assertion",
      chain: "child",
      from: "cypress",
    },
    {
      name: "findByTestId",
      category: "query",
      chain: "dual",
      from: "third-party",
      params: [
        {
          label: "Test ID",
          required: true,
          type: "string",
        },
        {
          label: "Options",
          type: "object",
        },
      ],
      keywords: ["find", "test", "testid", "test-id"],
    },
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
  ]);
}
