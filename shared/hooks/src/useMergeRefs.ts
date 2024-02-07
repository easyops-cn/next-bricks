import { Ref, RefCallback, MutableRefObject, useMemo } from "react";

export function useMergeRefs<Instance>(
  refs: (Ref<Instance> | undefined)[]
): RefCallback<Instance> {
  const mergeRefs = useMemo(() => {
    return (value: Instance) => {
      refs.forEach((ref) => {
        if (typeof ref === "function") {
          ref(value);
        } else if (ref != null) {
          (ref as MutableRefObject<Instance | null>).current = value;
        }
      });
    };
  }, refs);

  return mergeRefs;
}
