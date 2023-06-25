import { Location, LocationDescriptorObject } from "history";
import { NextHistoryState } from "@next-core/runtime";

export type ExtendedLocationDescriptorObject =
  LocationDescriptorObject<NextHistoryState> & {
    /**
     * Whether to keep current search when click on links, defaults to `false`.
     *
     * `true` - Keep all current search params.
     * `false` - Ignore all current search params.
     * `[...]` - Keep specified current search params.
     */
    keepCurrentSearch?: boolean | string[];
  };

export type ExtendedLocationDescriptor =
  | string
  | ExtendedLocationDescriptorObject;

export function getExtendedLocationDescriptor(
  _to: ExtendedLocationDescriptorObject,
  currentLocation: Location
): LocationDescriptorObject<NextHistoryState> {
  const { keepCurrentSearch, ...to } = _to;
  if (!keepCurrentSearch) {
    return to;
  }

  const currentUrlSearchParams = new URLSearchParams(currentLocation.search);
  const newUrlSearchParams = new URLSearchParams(to.search ?? "");

  for (const [key, value] of currentUrlSearchParams.entries()) {
    if (
      !newUrlSearchParams.has(key) &&
      (keepCurrentSearch === true || keepCurrentSearch.includes(key))
    ) {
      newUrlSearchParams.append(key, value);
    }
  }
  const search = newUrlSearchParams.toString();
  return {
    ...to,
    search: search ? `?${search}` : search,
  };
}
