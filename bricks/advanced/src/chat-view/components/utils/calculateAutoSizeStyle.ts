const HIDDEN_TEXTAREA_STYLE = `
  min-height:0 !important;
  max-height:none !important;
  height:0 !important;
  visibility:hidden !important;
  overflow:hidden !important;
  position:absolute !important;
  z-index:-1000 !important;
  top:0 !important;
  right:0 !important;
  padding: 10px !important;
  pointer-events: none !important;
`;

const SIZING_STYLE = [
  "letter-spacing",
  "line-height",
  "padding-top",
  "padding-bottom",
  "font-family",
  "font-weight",
  "font-size",
  "font-variant",
  "text-rendering",
  "text-transform",
  "width",
  "text-indent",
  "padding-left",
  "padding-right",
  "border-width",
  "box-sizing",
  "word-break",
  "white-space",
];
let hiddenTextarea: HTMLTextAreaElement;

/**
 * 计算 textare 高度
 * https://github.com/react-component/textarea/blob/1c0026fbe30e5f7dff1fca695b2cf262246381ca/src/calculateNodeHeight.tsx
 * */
export default function calculateAutoSizeStyle(
  uiTextNode: HTMLTextAreaElement,
  minRows: number | null = null,
  maxRows: number | null = null
): React.CSSProperties {
  if (!hiddenTextarea) {
    hiddenTextarea = document.createElement("textarea");
    hiddenTextarea.setAttribute("tab-index", "-1");
    hiddenTextarea.setAttribute("aria-hidden", "true");
    document.body.appendChild(hiddenTextarea);
  }

  const uiTextNodeStyle = window.getComputedStyle(uiTextNode);
  const sizingStyle = SIZING_STYLE.map(
    (name) => `${name}:${uiTextNodeStyle.getPropertyValue(name)}`
  ).join(";");

  // equal style
  hiddenTextarea.setAttribute(
    "style",
    `${sizingStyle};${HIDDEN_TEXTAREA_STYLE}`
  );
  hiddenTextarea.value = uiTextNode.value || uiTextNode.placeholder || "";

  let minHeight: number | undefined = undefined;
  let maxHeight: number | undefined = undefined;
  // let overflowY: any;

  const borderSize = 2;
  const paddingSize = 20;
  let height = hiddenTextarea.scrollHeight - paddingSize + borderSize;

  if (minRows !== null || maxRows !== null) {
    // measure height of a textarea with a single row
    hiddenTextarea.value = " ";
    const singleRowHeight = hiddenTextarea.scrollHeight - paddingSize;
    if (minRows !== null) {
      minHeight = singleRowHeight * minRows - paddingSize + borderSize;
      height = Math.max(paddingSize, height);
    }
    if (maxRows !== null) {
      maxHeight = singleRowHeight * maxRows - paddingSize + borderSize;
      // overflowY = height > maxHeight ? "" : "hidden";
      height = Math.min(maxHeight, height);
    }
  }

  const style: React.CSSProperties = {
    height,
    overflowY: "scroll",
    resize: "none",
  };

  if (minHeight) {
    style.minHeight = minHeight;
  }
  if (maxHeight) {
    style.maxHeight = maxHeight;
  }

  return style;
}
