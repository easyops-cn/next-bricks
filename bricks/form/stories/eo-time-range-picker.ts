import { eoTimeRangePickerBasicSvg, eoTimeRangePickerSvg } from "./images";

export const eoTimeRangePickerStory = {
  storyId: "eo-time-range-picker",
  text: {
    en: "Time Range Picker",
    zh: "时间段选择器",
  },
  description: {
    en: "combined by two time pickers",
    zh: "由两个时间选择器组成",
  },
  icon: {
    imgSrc: eoTimeRangePickerSvg,
  },
  conf: [
    {
      bricks: [
        {
          brick: "eo-time-range-picker",
          properties: {
            label: "hello",
            name: "time",
            rangeType: "time",
            required: true,
          },
        },
      ],
      snippetId: "eo-time-range-picker[basic]",
      title: {
        en: "Basic Time Range Picker",
        zh: "基础时间段选择器",
      },
      thumbnail: eoTimeRangePickerBasicSvg,
    },
  ],
};
