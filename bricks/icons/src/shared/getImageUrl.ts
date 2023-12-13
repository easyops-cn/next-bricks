import { getBasePath } from "@next-core/runtime";

export function getImageUrl(
  src: string | undefined,
  noPublicRoot: boolean | undefined
): string | undefined {
  return src
    ? /^(?:https?|data):|^\//.test(src) || src.startsWith("api/")
      ? src
      : `${noPublicRoot ? getBasePath() : window.PUBLIC_ROOT ?? ""}${src}`
    : undefined;
}
