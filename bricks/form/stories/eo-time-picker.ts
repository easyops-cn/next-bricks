import { Story } from "@next-shared/story";
import { eoTimePickerBasicSvg, eoTimePickerSvg } from "./images";

export const eoTimePickerStory: Story = {
  storyId: "eo-time-picker",
  text: {
    en: "Time Picker",
    zh: "时间选择器",
  },
  description: {
    en: "",
    zh: "",
  },
  icon: {
    imgSrc: eoTimePickerSvg,
  },
  conf: [
    {
      bricks: [
        {
          brick: "eo-time-picker",
          properties: {
            configProps: {
              format: "HH:mm",
              minuteStep: 5,
            },
            name: "time",
            label: "hello",
            placeholder: "when",
            value: "09:14:30",
          },
          events: {
            "general.time.change": {
              action: "console.log",
              args: ["time", "${EVENT.detail}"],
            },
            "general.time.close": {
              action: "console.log",
            },
          },
        },
      ],
      snippetId: "eo-time-picker[basic]",
      title: {
        en: "Basic General Time Picker",
        zh: "基础时间选择器",
      },
      thumbnail: eoTimePickerBasicSvg,
    },
  ],
};
