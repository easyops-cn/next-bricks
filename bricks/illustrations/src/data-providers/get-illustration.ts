import { createProviderClass } from "@next-core/utils/storyboard";
import { hasOwnProperty } from "@next-core/utils/general";
import type { SiteTheme } from "@next-core/types";
import categories from "../generated/categories.js";

export interface IllustrationProps {
  name: string;
  category?: string;
  theme?: SiteTheme;
}

export function determineIllustrationName(
  category: string,
  theme: string,
  name: string
): string {
  const isEasyopsIllustration =
    category === "default" ||
    category === "exception" ||
    category === "feedback" ||
    category === "easyops2";
  return isEasyopsIllustration && theme === "dark-v2" ? `${name}-dark` : name;
}

export function getIllustration(props: IllustrationProps): string | undefined {
  const theme = props.theme || "light";
  const category = props.category || "default";
  const name = determineIllustrationName(category, theme, props.name);
  if (
    hasOwnProperty(categories, category) &&
    hasOwnProperty(categories[category], name)
  ) {
    return categories[category][name];
  }
}

export function translateIllustrationConfig(
  useNewIllustration: boolean,
  illustrationsConfig: IllustrationProps
): IllustrationProps {
  const { category, name, theme } = illustrationsConfig;
  const showNewIllustration = useNewIllustration && category === "default";
  const illustrationNames = ["create-content", "browser-version-low"];
  const illustrationCategory = showNewIllustration ? "easyops2" : category;
  const illustrationName =
    showNewIllustration && !illustrationNames.includes(name)
      ? `${name}-dynamic`
      : name;
  return {
    name: illustrationName,
    category: illustrationCategory,
    theme,
  };
}

customElements.define(
  "illustrations.get-illustration",
  createProviderClass(getIllustration)
);

customElements.define(
  "illustrations.translate-illustration-config",
  createProviderClass(translateIllustrationConfig)
);
