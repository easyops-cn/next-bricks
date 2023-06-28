import { createProviderClass } from "@next-core/utils/general";

/**
 * 复制文本内容到粘贴板。
 *
 *  @param text 文本内容
 */
export async function copyToClipboard(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!navigator.clipboard) {
      const textArea = document.createElement("textarea");
      textArea.value = text;

      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand("copy");
        resolve();
      } catch (err) {
        reject(err);
      } finally {
        document.body.removeChild(textArea);
      }
    } else {
      navigator.clipboard.writeText(text).then(resolve).catch(reject);
    }
  });
}

customElements.define(
  "basic.copy-to-clipboard",
  createProviderClass(copyToClipboard)
);
