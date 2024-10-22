import { visit } from "unist-util-visit";
import type { Element } from "hast";
import isAbsoluteUrl from "is-absolute-url";

export interface LinkOptions {
  blankTarget?: {
    policy?: "never" | "always" | "external-only" | "absolute-only";
  };
}

export function rehypeLinks(options?: LinkOptions) {
  // Ref https://github.com/rehypejs/rehype-external-links
  function visitor(node: Element) {
    const blankTargetPolicy = options?.blankTarget?.policy ?? "external-only";
    if (blankTargetPolicy === "never") {
      return;
    }
    const href = node.properties.href;
    if (node.tagName === "a" && typeof href === "string") {
      let shouldUseBlankTarget = false;

      switch (blankTargetPolicy) {
        case "always":
          shouldUseBlankTarget = true;
          break;
        case "absolute-only":
          shouldUseBlankTarget = isAbsoluteUrl(href) || href.startsWith("//");
          break;
        default: {
          const url = new URL(href, location.origin).toString();
          shouldUseBlankTarget = !url.startsWith(`${location.origin}/`);
          break;
        }
      }

      if (shouldUseBlankTarget) {
        node.properties.target = "_blank";
        node.properties.rel = "noopener noreferrer nofollow";
      }
    }
  }

  return (tree: Element) => {
    visit(tree, "element", visitor);
  };
}
