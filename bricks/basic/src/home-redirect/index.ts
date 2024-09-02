import { createDecorators, NextElement } from "@next-core/element";
import { RuntimeApi_searchMicroAppStandalone } from "@next-api-sdk/micro-app-standalone-sdk";
import styleText from "./styles.shadow.css";

const { defineElement, property } = createDecorators();

export interface HomeRedirectProps {
  appId?: string;
  redirectUrl?: string;
}

/**
 * 构件 `basic.home-redirect`
 */
export
@defineElement("basic.home-redirect", {
  styleTexts: [styleText],
})
class HomeRedirect extends NextElement implements HomeRedirectProps {
  /** 指定的应用 Id */
  @property() accessor appId: string | undefined;

  /**  指定的跳转 url */
  @property() accessor redirectUrl: string | undefined;

  protected async _render() {
    if (!this.isConnected || !(this.appId || this.redirectUrl)) {
      return;
    }
    let finalUrl = this.redirectUrl;
    // Assert: now we have only standalone micro-apps
    if (!finalUrl) {
      try {
        const result = await RuntimeApi_searchMicroAppStandalone({
          query: { appId: this.appId, installStatus: { $ne: "running" } },
          fields: ["appId", "homepage", "installStatus"],
        });
        if (result.list?.length) {
          finalUrl = result.list[0].homepage;
        }
      } catch (error) {
        // Allow search micro app to fail, and
        // make it not crash when the backend service is not updated.
        // eslint-disable-next-line no-console
        console.error(
          "Search micro app '%s' for redirect failed:",
          this.appId,
          error
        );
        return;
      }
    }
    if (finalUrl) {
      location.replace(finalUrl.replace(/^\/*/, ""));
    } else {
      // eslint-disable-next-line no-console
      console.error("Redirect target not found, appId:", this.appId);
    }
  }
}
