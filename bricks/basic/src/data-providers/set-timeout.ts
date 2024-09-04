import { createProviderClass } from "@next-core/utils/general";

/**
 * @param delay Delay in milliseconds
 * @param returnValue
 */
export function providerSetTimeout(
  delay?: number,
  returnValue?: unknown
): Promise<unknown> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(returnValue);
    }, delay);
  });
}

customElements.define(
  "basic.set-timeout",
  createProviderClass(providerSetTimeout)
);
