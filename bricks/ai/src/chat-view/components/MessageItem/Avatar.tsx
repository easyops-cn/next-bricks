import React, { useMemo } from "react";
import type { Role } from "../../ChatViewContext.js";

export function Avatar({ role }: { role: Role }): React.ReactNode {
  const isUser = useMemo(() => role === "user", [role]);

  return <div className={`avatar ${isUser ? "user" : "robot"}`} />;
}
