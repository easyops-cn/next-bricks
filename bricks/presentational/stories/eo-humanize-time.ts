import {
  eoHumanizeTimeAccurateSvg,
  eoHumanizeTimeCostSvg,
  eoHumanizeTimeFormatSvg,
  eoHumanizeTimeFullSvg,
  eoHumanizeTimeRelativeSvg,
  eoHumanizeTimeSvg,
} from "./images";

export const eoHumanizeTimeStory = {
  storyId: "eo-humanize-time",
  text: {
    en: "humanize time",
    zh: "人性化时间展示",
  },
  description: {
    en: "1h ago",
    zh: "如：3天前、过去2小时等。也可显示消耗时间，如1小时2分钟，也可显示为链接",
  },
  icon: {
    imgSrc: eoHumanizeTimeSvg,
  },
  conf: [
    {
      snippetId: "eo-humanize-time[full]",
      title: {
        en: "Humanize time(full)",
        zh: "人性化时间展示(完整)",
      },
      thumbnail: eoHumanizeTimeFullSvg,
      bricks: [
        {
          brick: "eo-humanize-time",
          properties: {
            value: 1571017058,
            formatter: "full",
          },
        },
      ],
    },
    {
      snippetId: "eo-humanize-time[accurate]",
      title: {
        en: "Humanize time(accurate)",
        zh: "人性化时间展示(精确)",
      },
      bricks: [
        {
          brick: "eo-humanize-time",
          properties: {
            value: 1571017058,
            formatter: "accurate",
            isCostTime: true,
          },
        },
      ],
      thumbnail: eoHumanizeTimeAccurateSvg,
    },
    {
      snippetId: "eo-humanize-time[relative]",
      title: {
        en: "Humanize time(relative)",
        zh: "人性化时间展示(相对)",
      },
      thumbnail: eoHumanizeTimeRelativeSvg,
      bricks: [
        {
          brick: "eo-humanize-time",
          properties: {
            value: 1571017058000,
            isMicrosecond: true,
            formatter: "relative",
          },
        },
      ],
    },
    {
      snippetId: "eo-humanize-time[cost]",
      title: {
        en: "Humanize time(cost)",
        zh: "人性化时间展示(耗时)",
      },
      bricks: [
        {
          brick: "eo-humanize-time",
          properties: {
            value: 1000,
            formatter: "relative",
            isCostTime: true,
          },
        },
      ],
      thumbnail: eoHumanizeTimeCostSvg,
    },
    {
      snippetId: "eo-humanize-time[format]",
      title: {
        en: "Humanize time(format)",
        zh: "人性化时间展示(格式化)",
      },
      bricks: [
        {
          brick: "eo-humanize-time",
          properties: {
            value: "2020-02-27 16:36",
            inputFormat: "YYYY-MM-DD",
            outputFormat: "YYYY-MM-DD",
          },
        },
      ],
      thumbnail: eoHumanizeTimeFormatSvg,
    },
  ],
};
