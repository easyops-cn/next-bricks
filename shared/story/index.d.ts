import type { BrickConf, I18nData } from "@next-core/types";

export interface Story {
  storyId: string;
  category?: string;
  text: I18nData;
  conf: StoryConf | StoryConf[] | SnippetConf[] /*  | V3StoryConf */;
  description?: I18nData;
  tags?: I18nData[];
  actions?: Action[];
  icon?: unknown;
  previewColumns?: number;
  author?: string;
}

export interface StoryConf extends BrickConf {
  description?: {
    title: string;
    message?: string;
  };
}

export interface SnippetConf {
  snippetId: string;
  bricks: BrickConf | BrickConf[];
  title: I18nData;
  message?: I18nData;
  // Workaround: svg in stories is parsed as string instead of React component
  thumbnail?: unknown;
  // thumbnail?: string;
  actions?: Action[];
}

// export interface V3StoryConf {
//   doc: string;
// }

export interface Action {
  text: string;
  method: string;
  type?: "link" | "ghost" | "default" | "primary" | "dashed" | "danger";
  args?: unknown[];
  prompt?: boolean;
}

// export type LayerType = "layout" | "widget" | "brick";
