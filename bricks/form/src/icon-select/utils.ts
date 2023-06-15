export enum Colors {
  green = "green",
  red = "red",
  blue = "blue",
  orange = "orange",
  cyan = "cyan",
  purple = "purple",
  geekblue = "geekblue",
  gray = "gray",
}

export const COLORS_MAP: Record<
  Colors,
  { color: string; background: string; borderColor: string }
> = {
  [Colors.green]: {
    color: "var(--theme-green-color)",
    background: "var(--theme-green-background)",
    borderColor: "var(--theme-green-border-color)",
  },
  [Colors.red]: {
    color: "var(--theme-red-color)",
    background: "var(--theme-red-background)",
    borderColor: "var(--theme-red-border-color)",
  },
  [Colors.blue]: {
    color: "var(--theme-blue-color)",
    background: "var(--theme-blue-background)",
    borderColor: "var(--theme-blue-border-color)",
  },
  [Colors.orange]: {
    color: "var(--theme-orange-color)",
    background: "var(--theme-orange-background)",
    borderColor: "var(--theme-orange-border-color)",
  },
  [Colors.cyan]: {
    color: "var(--theme-cyan-color)",
    background: "var(--theme-cyan-background)",
    borderColor: "var(--theme-cyan-border-color)",
  },
  [Colors.purple]: {
    color: "var(--theme-purple-color)",
    background: "var(--theme-purple-background)",
    borderColor: "var(--theme-purple-border-color)",
  },
  [Colors.geekblue]: {
    color: "var(--theme-geekblue-color)",
    background: "var(--theme-geekblue-background)",
    borderColor: "var(--theme-geekblue-border-color)",
  },
  [Colors.gray]: {
    color: "var(--theme-gray-color)",
    background: "var(--theme-gray-background)",
    borderColor: "var(--theme-gray-border-color)",
  },
};

/**
 * 如果提供的颜色值是平台提供的规范颜色，则转换为使用平台规范的颜色定义，包括color、background、borderColor，不是的话则原样输出。
 * @param color {string} 颜色值
 * @return {color:string;background:string;borderColor:string;} 返回处理后的对应颜色值
 */
export function getColor(color?: string): {
  color: string;
  background: string;
  borderColor: string;
} {
  if (!color) {
    return {
      color: "var(--antd-avatar-color)",
      background: "var(--antd-avatar-bg)",
      borderColor: "var(--antd-avatar-color)",
    };
  }
  return (
    COLORS_MAP[color as Colors] ?? {
      color,
      background: color,
      borderColor: color,
    }
  );
}
