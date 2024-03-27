import React from "react";
import { wrapBrick } from "@next-core/react-element";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";

const WrapperIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");

export function Loading({ loading }: { loading: boolean }) {
  return loading ? (
    <div className="loading-wrapper">
      <WrapperIcon lib="antd" icon="loading" spinning />
    </div>
  ) : null;
}
