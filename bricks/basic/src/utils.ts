import { getRuntime } from "@next-core/runtime";
import { BrickConf, RouteConfOfBricks } from "@next-core/types";
export function getNewUIStatus(isSetPageTitleStyle?: boolean): boolean {
  const { getFeatureFlags, getCurrentRoute } = getRuntime();
  const flags = getFeatureFlags();
  if (flags["migrate-to-brick-next-v3"]) return true;

  const featureFlag = flags["support-ui-8.0-base-layout"];
  const { bricks = [] } = (getCurrentRoute() ?? {}) as RouteConfOfBricks;
  const tplNames = [
    "base-layout.tpl-base-page-module",
    "base-layout.tpl-base-page-module-cmdb",
    "base-layout.tpl-homepage-base-module",
    "base-layout.tpl-homepage-base-module-cmdb",
  ];
  if (
    bricks.some((v: BrickConf) => tplNames.includes(v?.brick)) &&
    !!featureFlag
  ) {
    if (isSetPageTitleStyle) {
      return bricks.some((v: BrickConf) =>
        tplNames.slice(0, 2).includes(v?.brick)
      );
    }
    return true;
  }
  return false;
}
