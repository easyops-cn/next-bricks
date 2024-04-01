import React from "react";
import { wrapBrick } from "@next-core/react-element";
import type { Link, LinkProps } from "@next-bricks/basic/link";

interface GuideItemProps {
  text: string;
  prompts?: string[];
}

const WrappedLink = wrapBrick<Link, LinkProps>("eo-link");

export function GuideItem({ text, prompts }: GuideItemProps) {
  return (
    <div className="guide-item">
      {text}
      <div className="prompts-list">
        {prompts
          ? prompts.map((item, index) => (
              <WrappedLink key={index}>{item}</WrappedLink>
            ))
          : null}
      </div>
    </div>
  );
}
