import React from "react";
import { IconSelect, IconSelectProps } from "@next-bricks/form/icon-select";
import { wrapBrick } from "@next-core/react-element";
interface IconSelectComponentProps extends IconSelectProps {
  onChange?: (value?: any) => void;
}
interface IconSelectEvents {
  change?: (value?: any) => void;
}
export interface IconSelectEventsMapping {
  onChange: "change";
}
const WrappedIconSelect = wrapBrick<
  IconSelect,
  IconSelectProps,
  IconSelectEvents,
  IconSelectEventsMapping
>("eo-icon-select", {
  onChange: "change",
});
export function IconSelectComponent(props: IconSelectComponentProps) {
  return <WrappedIconSelect {...props} />;
}
