import React, { forwardRef, useEffect } from "react";
import styles from "./SiteMap.module.css";
import { MicroApp } from "@next-core/types";
import { launchpadService } from "../LaunchpadService.js";
import { wrapBrick } from "@next-core/react-element";
import { Link, LinkProps } from "../../link/index.js";

const WrappedLink = wrapBrick<Link, LinkProps>("basic.general-link");

interface SiteCategory {
  name: string;
  id: string;
  order: string;
  apps: {
    id?: string;
    sort?: string;
    name?: string;
    homepage?: string;
  }[];
}
export interface SiteMapProps {
  categoryList: SiteCategory[];
  containerStyle?: React.CSSProperties;
  onLoad?: () => void;
}

export function LeacySiteMap(
  props: SiteMapProps,
  ref: any
): React.ReactElement {
  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
  };

  useEffect(() => {
    props.onLoad?.();
  }, []);

  const handleClick = (app: MicroApp): void => {
    launchpadService.pushVisitor("app", app);
  };

  return (
    <div
      className={styles.scrollContainer}
      style={props.containerStyle}
      ref={ref}
      onWheel={handleWheel}
    >
      <div className={styles.siteMapContainer}>
        {props.categoryList?.map((item) => (
          <div className={styles.groupWrapper} key={item.name}>
            <div>{item.name}</div>
            <ul className={styles.group}>
              {item.apps?.map((row, index) => (
                <li className={styles.item} key={index}>
                  <WrappedLink
                    url={row.homepage}
                    onClick={() => handleClick(row as MicroApp)}
                  >
                    {row.name}
                  </WrappedLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export const SiteMap = forwardRef(LeacySiteMap);
