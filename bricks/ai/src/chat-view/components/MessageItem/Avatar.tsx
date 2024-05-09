import React, { useMemo } from "react";
import { useChatViewContext, type Role } from "../../ChatViewContext.js";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import { wrapBrick } from "@next-core/react-element";

const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");

export function Avatar({
  role,
  agentId,
}: {
  role: Role;
  agentId?: string;
}): React.ReactNode {
  const isUser = useMemo(() => role === "user", [role]);
  const { quickAnswerConfig } = useChatViewContext();

  const agentList = useMemo(
    () => quickAnswerConfig?.list ?? [],
    [quickAnswerConfig]
  );

  const matchAgent = useMemo(() => {
    return agentList.find((item) => item.id === agentId);
  }, [agentList, agentId]);

  return !isUser && matchAgent ? (
    <WrappedIcon
      className="avatar"
      {...matchAgent.icon}
      style={{
        color: `var(--theme-${matchAgent.icon.color}-color)`,
        background: `var(--theme-${matchAgent.icon.color}-background)`,
      }}
    />
  ) : (
    <div className={`avatar ${isUser ? "user" : "robot"}`} />
  );
}
