import { MicroApp } from "@next-core/types";

export function getImageUrl(app: MicroApp, defaultAppIcon: string): string {
  return app.icons && app.icons.large
    ? /^(?:https?|data):|^\//.test(app.icons.large)
      ? app.icons.large
      : `${
          window.STANDALONE_MICRO_APPS
            ? // 如果是独立打包模式
              app.standaloneMode
              ? // 如果是独立打包模式下的standalone app, 则使用 PUBLIC_ROOT 再去掉末尾的 '-/'
                // 例如: sa-static/my-app/versions/1.1.1/webroot/-/micro-apps/my-app/large.png （没设置cdn）
                // 例如: https://cdn-air.uwintech.cn/next/sa-static/my-app/versions/1.1.1/webroot/-/micro-apps/my-app/large.png （设置了cdn）
                `${window.PUBLIC_ROOT?.replace(/-\/$/, "")}${app.id}/versions/${
                  app.currentVersion
                }/webroot/-/micro-apps/${app.id}/${app.icons.large}`
              : // 如果是独立打包模式下的普通app，则使用PUBLIC_CDN + 默认前缀micro-apps
                `${window.PUBLIC_CDN || ""}micro-apps/${app.id}/${
                  app.icons.large
                }`
            : // 非独立打包应用使用旧模式进行设置
              `${window.PUBLIC_ROOT || ""}micro-apps/${app.id}/${
                app.icons.large
              }`
        }`
    : defaultAppIcon;
}
