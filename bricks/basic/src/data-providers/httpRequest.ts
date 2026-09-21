import { createProviderClass } from "@next-core/utils/general";
import { RequestCustomOptions, http } from "@next-core/http";

/**
 * 发送 HTTP 请求。
 * @en Send an HTTP request.
 *
 * @param url 请求地址
 * @paramEn url Request URL
 * @param init 请求初始化数据
 * @paramEn init Request init data
 * @param options 请求选项
 * @paramEn options Request options
 * @returns 响应结果
 */
export function httpRequest<T = unknown>(
  url: string,
  init?: RequestInit,
  options?: RequestCustomOptions
): Promise<T> {
  return http.request<T>(url, init, options);
}

customElements.define("basic.http-request", createProviderClass(httpRequest));
