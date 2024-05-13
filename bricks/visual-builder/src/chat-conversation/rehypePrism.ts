import { visit } from "unist-util-visit";
import { toString } from "hast-util-to-string";
import { refractor, type RefractorElement } from "refractor";

export function rehypePrism() {
  function visitor(
    node: RefractorElement,
    _index: number,
    parent: RefractorElement
  ) {
    if (!parent || parent.tagName !== "pre" || node.tagName !== "code") {
      return;
    }

    const lang = getLanguage(node);

    if (lang === null) {
      return;
    }

    let result;
    try {
      parent.properties.className = (
        (parent.properties.className as string[]) || []
      ).concat("language-" + lang);
      result = refractor.highlight(toString(node), lang);
    } catch {
      return;
    }

    node.children = result.children;
  }
  return (tree: RefractorElement) => {
    visit(tree, "element", visitor);
  };
}

function getLanguage(node: RefractorElement) {
  const className = (node.properties.className as string[]) || [];

  for (const classListItem of className) {
    if (classListItem.slice(0, 9) === "language-") {
      return classListItem.slice(9).toLowerCase();
    }
  }

  return null;
}
