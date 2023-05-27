import React from "react";
import { createDecorators } from "@next-core/element";
import type { Link, LinkProps } from "@next-bricks/basic/link";
import { GeneralIcon, GeneralIconProps } from "@next-bricks/icons/general-icon";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import styleText from "./workbench-action.shadow.css";
import classNames from "classnames";

const { defineElement, property } = createDecorators();

const WrapLink = wrapBrick<Link, LinkProps>("basic.general-link");
const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>(
  "icons.general-icon"
);

export interface WorkbenchActionProps {
  icon?: GeneralIconProps;
  to?: string;
  target?: string;
  active?: boolean;
  href?: string;
}

@defineElement("visual-builder.workbench-action", {
  styleTexts: [styleText],
})
class WorkbenchAction extends ReactNextElement {
  @property({
    attribute: false,
  })
  accessor icon: GeneralIconProps | undefined;

  @property() accessor to: string | undefined;

  @property({
    type: Boolean,
  })
  accessor active: boolean | undefined;

  @property() accessor href: string | undefined;

  @property() accessor target: string | undefined;

  render(): React.ReactNode {
    return (
      <WorkbenchActionComponent
        to={this.to}
        icon={this.icon}
        active={this.active}
        href={this.href}
        target={this.target}
      />
    );
  }
}

function WorkbenchActionComponent({
  icon,
  to,
  active,
  href,
  target,
}: WorkbenchActionProps) {
  return (
    <WrapLink
      className={classNames("action", { active })}
      url={to}
      href={href}
      target={target as LinkProps["target"]}
    >
      <WrappedIcon {...icon} />
    </WrapLink>
  );
}

export { WorkbenchAction };
