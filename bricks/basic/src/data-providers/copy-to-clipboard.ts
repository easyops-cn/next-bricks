import { createProviderClass } from "@next-core/utils/general";

export async function copyToClipboard(text: string): Promise<unknown> {
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
        resolve(void 0);
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
