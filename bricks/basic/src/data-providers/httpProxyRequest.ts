import { http } from "@next-core/http";
import { createProviderClass } from "@next-core/utils/general";

export interface HttpProxyData {
  url: string;
  method: string;
  headers?: Record<string, string>;
  queryParameters?: Record<string, any>;
  body?: any;
  timeout?: number;
}

/**
 * 用于对接第三方接口，请求将会被后台代理转发
 */
export async function httpProxyRequest(data: HttpProxyData) {
  const result = await http.post(
    "api/gateway/logic.next_builder_service/api/v1/next-builder/proxy-http",
    data
  );

  return (result as any)?.data;
}

customElements.define(
  "basic.http-proxy-request",
  createProviderClass(httpProxyRequest)
);
