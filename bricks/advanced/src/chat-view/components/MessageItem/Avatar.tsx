import React, { useMemo } from "react";
import { wrapBrick } from "@next-core/react-element";
// import type { EoEasyopsAvatar, EoEasyopsAvatarProps } from '@next-bricks/basic/easyops-avatar';
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
// import { auth } from "@next-core/easyops-runtime";
import type { Role } from "../../ChatViewContext.js";

// const WrapperEasyopsAvatar = wrapBrick<EoEasyopsAvatar, EoEasyopsAvatarProps>("eo-easyops-avatar");
// <WrapperEasyopsAvatar nameOrInstanceId={user} />
const WrapperIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");

export function Avatar({ role }: { role: Role }): React.ReactNode {
  // const user = auth.getAuth().username;
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
