import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import { useLaunchpadInfo } from "../launchpad-button-v2/useLaunchpadInfo";
import type { Link, LinkProps, Target } from "@next-bricks/basic/link";

const WrappedLink = wrapBrick<Link, LinkProps>("eo-link");

const { defineElement, property } = createDecorators();

/**
 * launchpad 最近访问
 * @insider
 */
export
@defineElement("eo-launchpad-recent-visits", {
  styleTexts: [styleText],
})
class EoLaunchpadRecentVisits extends ReactNextElement {
  @property({
    attribute: false,
  })
  accessor target: Target | undefined;

  render() {
    return <EoLaunchpadRecentVisitsComponent />;
  }
}

interface EoLaunchpadRecentVisitsComponentProps {
  target?: Target;
}
export function EoLaunchpadRecentVisitsComponent({
  target,
}: EoLaunchpadRecentVisitsComponentProps) {
  const { recentVisits, pushRecentVisit } = useLaunchpadInfo(true);

  return (
    <ul className="recent-visits">
      {recentVisits.map((item, index) => (
        <li key={index}>
          <WrappedLink
            onClick={() => pushRecentVisit(item)}
            {...(item.type === "app"
              ? {
                  url: item.url,
                  target,
                }
              : {
                  href: item.url,
                  target: "_blank",
                })}
          >
            <span>{item.name}</span>
          </WrappedLink>
        </li>
      ))}
    </ul>
  );
}
