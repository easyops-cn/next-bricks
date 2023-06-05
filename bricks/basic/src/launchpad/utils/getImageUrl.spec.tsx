import { MicroApp } from "@next-core/types";
import { getImageUrl } from "./getImageUrl.js";

describe("getImageUrl should work", () => {
  const defaultIcon = "defaultIcon";
  it.each<[MicroApp, string, string, boolean, string]>([
    [
      {
        id: "app-1",
        name: "app-1",
        homepage: "/page1",
        currentVersion: "1.0.1",
        icons: {
          large: "assets/large.png",
        },
        standaloneMode: false,
      } as MicroApp,
      "",
      "",
      true,
      "micro-apps/app-1/assets/large.png",
    ],
    [
      {
        id: "app-1",
        name: "app-1",
        homepage: "/page1",
        currentVersion: "1.0.1",
        icons: {
          large: "assets/large.png",
        },
        standaloneMode: false,
      } as MicroApp,
      "/public/cdn/",
      "/sa-static/",
      true,
      "/public/cdn/micro-apps/app-1/assets/large.png",
    ],
    [
      {
        id: "app-1",
        name: "app-1",
        homepage: "/page1",
        currentVersion: "1.0.1",
        icons: {
          large: "assets/large.png",
        },
        standaloneMode: true,
      } as MicroApp,
      "/public/cdn/",
      "",
      false,
      "micro-apps/app-1/assets/large.png",
    ],
    [
      {
        id: "app-1",
        name: "app-1",
        homepage: "/page1",
        currentVersion: "1.0.1",
        icons: {
          large: "assets/large.png",
        },
        standaloneMode: true,
      } as MicroApp,
      "/public/cdn/",
      "/sa-static/",
      false,
      "/sa-static/micro-apps/app-1/assets/large.png",
    ],
    [
      {
        id: "app-1",
        name: "app-1",
        homepage: "/page1",
        currentVersion: "1.0.1",
        icons: {
          large: "assets/large.png",
        },
        standaloneMode: true,
      } as MicroApp,
      "/public/cdn/",
      "/sa-static/",
      true,
      "/sa-static/app-1/versions/1.0.1/webroot/-/micro-apps/app-1/assets/large.png",
    ],
    [
      {
        id: "app-1",
        name: "app-1",
        homepage: "/page1",
        currentVersion: "1.0.1",
        icons: {
          large: "/object_store/test.png",
        },
        standaloneMode: true,
      } as MicroApp,
      "/public/cdn/",
      "/sa-static/",
      true,
      "/object_store/test.png",
    ],
    [
      {
        id: "app-1",
        name: "app-1",
        homepage: "/page1",
        currentVersion: "1.0.1",
        standaloneMode: true,
      } as MicroApp,
      "/public/cdn/",
      "/sa-static/",
      true,
      "defaultIcon",
    ],
  ])("should work", (app, cdnUrl, rootUrl, isStandalone, result) => {
    window.PUBLIC_CDN = cdnUrl;
    window.PUBLIC_ROOT = rootUrl;
    window.STANDALONE_MICRO_APPS = isStandalone;
    expect(getImageUrl(app, defaultIcon)).toBe(result);
  });
});
