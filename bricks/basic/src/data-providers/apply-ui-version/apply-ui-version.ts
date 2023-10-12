import { createProviderClass } from "@next-core/utils/general";

enum UI_VERSION {
  EIGHT = "8.0",
  EIGHT_TWO = "8.2",
}

export async function applyUIVersion(version: string): Promise<void> {
  const getUIVersion = (version: string): string => {
    switch (version) {
      case UI_VERSION.EIGHT:
        return "ui-v8";
      case UI_VERSION.EIGHT_TWO:
        return "ui-v8-2";
      default:
        return "ui-v8";
    }
  };

  let lastVersion = "";
  document.body.classList.forEach((item) => {
    if (item.startsWith("ui")) {
      lastVersion = item;
    }
  });

  const uiVersion = getUIVersion(version);

  await import(`./css/${uiVersion}.css`);

  if (lastVersion) {
    document.body.classList.remove(lastVersion);
  }

  document.body.classList.add(uiVersion);

  return;
}

customElements.define(
  "basic.apply-ui-version",
  createProviderClass(applyUIVersion)
);
