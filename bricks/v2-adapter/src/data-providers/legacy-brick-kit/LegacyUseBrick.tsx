/** @jsx LegacyReact.createElement */
/** @jsxFrag LegacyReact.Fragment */
import type React from "react";
import type { UseSingleBrickConf } from "@next-core/types";
import { __secret_internals, handleHttpError } from "@next-core/runtime";
import { getLegacyReact } from "../dll.js";

export interface ReactUseBrickProps {
  useBrick: UseSingleBrickConf;
  data?: unknown;
}

// Note: always synchronize code in LegacyUseBrick:
// `bricks/v2-adapter/src/data-providers/legacy-brick-kit/LegacyUseBrick.tsx`
export function ReactUseBrick({
  useBrick,
  data,
}: ReactUseBrickProps): React.ReactElement | null {
  const LegacyReact = getLegacyReact();
  const [renderResult, setRenderResult] =
    LegacyReact.useState<__secret_internals.RenderUseBrickResult | null>(null);
  const mountResult =
    LegacyReact.useRef<__secret_internals.MountUseBrickResult>();
  const [renderKey, setRenderKey] = LegacyReact.useState<number>();
  const IdCounterRef = LegacyReact.useRef(0);

  LegacyReact.useEffect(() => {
    async function init() {
      try {
        setRenderResult(
          await __secret_internals.renderUseBrick(useBrick, data)
        );
        setRenderKey(getUniqueId(IdCounterRef));
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Render useBrick failed:", useBrick, "with data:", data);
        handleHttpError(error);
      }
    }
    init();
  }, [data, useBrick]);

  const refCallback = LegacyReact.useCallback(
    (element: HTMLElement | null) => {
      if (element) {
        mountResult.current = __secret_internals.mountUseBrick(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          renderResult!,
          element
        );
      } else {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        __secret_internals.unmountUseBrick(renderResult!, mountResult.current!);
        mountResult.current = undefined;
      }
    },
    [renderResult]
  );

  if (!renderResult) {
    // Fallback when loading/
    return null;
    // return <span>🌀 Loading...</span>;
  }

  const { tagName } = renderResult;
  if (tagName === null) {
    return null;
  }

  const WebComponent = tagName as any;
  return <WebComponent key={renderKey} ref={refCallback} />;
}

function getUniqueId(ref: React.MutableRefObject<number>): number {
  return ++ref.current;
}

export interface ReactUseMultipleBricksProps {
  useBrick: UseSingleBrickConf | UseSingleBrickConf[];
  data?: unknown;
}

export function ReactUseMultipleBricks({
  useBrick,
  data,
}: ReactUseMultipleBricksProps): React.ReactElement | null {
  const LegacyReact = getLegacyReact();
  if (Array.isArray(useBrick)) {
    return (
      <>
        {useBrick.map((item, index) => (
          <ReactUseBrick key={index} useBrick={item} data={data} />
        ))}
      </>
    );
  }
  return <ReactUseBrick useBrick={useBrick} data={data} />;
}
