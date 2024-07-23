import { createProviderClass } from "@next-core/utils/general";
import { RequestCustomOptions, http } from "@next-core/http";

/**
 * 用于 form-builder 第三方转发请求
 */
export async function customRequest(
  url: string,
  init?: RequestInit,
  options?: RequestCustomOptions
): Promise<unknown> {
  const prefix = "api/gateway/logic.gateway_service";

  const finalUrl = /^https?:/.test(url) ? url : `${prefix}${url}`;
  return http.request(finalUrl, init, options);
}

customElements.define(
  "form-renderer.custom-request",
  createProviderClass(customRequest)
);
