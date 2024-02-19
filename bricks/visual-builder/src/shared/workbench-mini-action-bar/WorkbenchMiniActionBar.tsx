import React, { useCallback, useMemo } from "react";
import { wrapBrick } from "@next-core/react-element";
import classNames from "classnames";
import { checkIfByTransform } from "@next-core/runtime";
import { WorkbenchTreeAction, ActionClickDetail } from "../../interfaces.js";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";

export const WrappedGeneralIcon = wrapBrick<GeneralIcon, GeneralIconProps>(
  "eo-icon"
);

export interface WorkbenchSubActionBarProps {
  data?: unknown;
  className?: string;
  gap?: number;
  isFirst?: boolean;
  isLast?: boolean;
  actions?: WorkbenchTreeAction[];
  actionsHidden?: boolean;
  onActionClick?(detail: ActionClickDetail): void;
}

export function WorkbenchMiniActionBar({
  data,
  className,
  gap,
  isFirst,
  isLast,
  actions,
  actionsHidden,
  onActionClick,
}: WorkbenchSubActionBarProps): React.ReactElement {
  const enabledActions = useMemo(
    () => actions?.filter((item) => checkIfByTransform(item, data)),
    [actions, data]
  );

  if (actionsHidden || !enabledActions?.length) {
    return null;
  }

  return (
    <div className={classNames("actionsBar", className)} style={{ gap }}>
      {enabledActions.map((item) => (
        <WorkbenchSubAction
          key={item.action}
          action={item}
          data={data}
          isFirst={isFirst}
          isLast={isLast}
          onActionClick={onActionClick}
        />
      ))}
    </div>
  );
}

interface WorkbenchSubActionProps {
  action: WorkbenchTreeAction;
  data?: unknown;
  isFirst?: boolean;
  isLast?: boolean;
  onActionClick?(detail: ActionClickDetail): void;
}

function WorkbenchSubAction({
  action,
  data,
  isFirst,
  isLast,
  onActionClick,
}: WorkbenchSubActionProps): React.ReactElement {
  const disabled =
    (isFirst && action.action === "move-up") ||
    (isLast && action.action === "move-down");

  const handleActionClick = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      disabled ||
        onActionClick?.({
          action: action.action,
          data: data,
        });
    },
    [action.action, data, disabled, onActionClick]
  );

  const preventMouseEvent = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  return (
    <a
      className={classNames("action", { disabled: disabled })}
      title={action.title}
      role="button"
      onClick={handleActionClick}
      onContextMenu={preventMouseEvent}
      onMouseDown={preventMouseEvent}
    >
      <WrappedGeneralIcon {...action.icon} />
    </a>
  );
}
