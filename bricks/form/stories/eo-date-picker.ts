import { Story } from "@next-shared/story";
import { eoDatePickerBasicSvg, eoDatePickerSvg } from "./images";

export const eoDatePickerStory: Story = {
  storyId: "eo-date-picker",
  text: {
    en: "Date Picker",
    zh: "日期选择框",
  },
  description: {
    en: "",
    zh: "",
  },
  icon: {
    imgSrc: eoDatePickerSvg,
  },
  conf: [
    {
      bricks: [
        {
          brick: "eo-date-picker",
          properties: {
            name: "date",
            label: "hello",
            placeholder: "when",
            value: "2019-10-01",
            inputStyle: {
              width: 300,
            },
          },
        },
      ],
      snippetId: "eo-date-picker[basic]",
      title: {
        en: "Basic General Date Picker",
        zh: "基础日期选择框",
      },
      thumbnail: eoDatePickerBasicSvg,
    },
  ],
};
