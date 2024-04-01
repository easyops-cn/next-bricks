import React, { useMemo } from "react";
import { wrapBrick } from "@next-core/react-element";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import type { Role } from "../../ChatViewContext.js";

const WrapperIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");

export function Avatar({ role }: { role: Role }): React.ReactNode {
  const isUser = useMemo(() => role === "user", [role]);

  return isUser ? (
    <WrapperIcon
      className="avatar"
      lib="easyops"
      icon="user-avatar"
      category="colored-common"
    />
  ) : (
    <WrapperIcon
      className="avatar"
      lib="easyops"
      icon="robot-avatar"
      category="colored-common"
    />
  );
}
