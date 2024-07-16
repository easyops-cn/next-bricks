import { MatchOptions } from "@next-core/runtime";
import { LocationDescriptor } from "history";

type ThemeType = "filled" | "outlined" | "twoTone";

export interface SidebarMenu {
  /** 菜单标题。 */
  title: string;
  /** 菜单标题对应的图标。 */
  icon?: MenuIcon;
  /** 菜单标题对应的链接地址。 */
  link?: LocationDescriptor;
  /** 是否默认折叠。 */
  defaultCollapsed?: boolean;
  /** 针对小于特定尺寸的屏幕（例如 1600px），是否默认折叠。 */
  defaultCollapsedBreakpoint?: number;
  /** 菜单项列表。 */
  menuItems: SidebarMenuItem[];
}

/** 侧边栏菜单项配置。 */
export type SidebarMenuItem = SidebarMenuSimpleItem | SidebarMenuGroup;

/** 侧边栏基本菜单项的配置。 */
export interface SidebarMenuSimpleItem {
  /** 菜单项文本。 */
  text: string;

  /** 菜单项对应的系统内地址。 */
  to?: LocationDescriptor;

  /** 菜单项对应的外部链接地址。 */
  href?: string;

  /** 菜单项的图标。 */
  icon?: MenuIcon;

  /** 菜单项链接打开的目标。 */
  target?: string;

  type?: "default";

  /** 高亮菜单项时是否使用精确匹配来对比当前地址和菜单项地址。 */
  exact?: boolean;

  /** 设置额外包含的匹配高亮菜单项的地址列表。 */
  activeIncludes?: (string | MatchOptions)[];

  /** 设置需要被排除的匹配高亮菜单项的地址列表。 */
  activeExcludes?: (string | MatchOptions)[];

  /** 设置匹配高亮菜单项时是否还对 search 参数进行比较。 */
  activeMatchSearch?: boolean | Record<string, string | null>;

  /** @internal */
  key?: string;
}

/** 侧边栏分组菜单项的配置。 */
export interface SidebarMenuGroup {
  /** 分组 Id。 */
  groupId?: string;

  /** 分组来源。 */
  groupFrom?: string;

  /** 分组类型。 */
  type: "group" | "subMenu";

  /** 分组标题。 */
  title: string;

  /** {@inheritDoc SidebarMenuSimpleItem.icon } */
  icon?: MenuIcon;

  /** 该分组下的子菜单项列表。 */
  items: SidebarMenuItem[];

  /** @internal */
  key?: string;

  /** 该分组下的子菜单是否默认展开。 */
  defaultExpanded?: boolean;

  /** 子菜单项的布局方式。 */
  childLayout?: "default" | "category" | "siteMap";
}

/** 图标配置。 */
export type MenuIcon = AntdIcon | FaIcon | EasyopsIcon;

/** 渐变颜色配置 */
export interface GradientColor {
  startColor: string;
  endColor: string;
  direction?: "top-to-bottom" | "left-to-right";
}

/** Antd 图标配置。 */
export type AntdIcon = RefinedAntdIcon | LegacyAntdIcon;

/** 优化后的 Antd 图标配置。 */
export interface RefinedAntdIcon {
  lib: "antd";
  icon: string;
  theme?: ThemeType;
  color?: string | GradientColor;
}

/** 历史遗留的 Antd 图标配置。 */
export interface LegacyAntdIcon {
  lib: "antd";
  type: string;
  theme?: ThemeType;
  color?: string | GradientColor;
}

/** FontAwesome 图标配置。 */
export interface FaIcon {
  lib: "fa";
  icon: string;
  prefix?: "fas" | "fab" | "far";
  color?: string | GradientColor;
}

/** EasyOps 图标配置。 */
export interface EasyopsIcon {
  lib: "easyops";
  icon: string;
  category?: string;
  color?: string | GradientColor;
}
