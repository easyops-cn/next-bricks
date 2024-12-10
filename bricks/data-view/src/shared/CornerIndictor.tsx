import React from "react";
import { wrapBrick } from "@next-core/react-element";
import type { Tag, TagProps } from "@next-bricks/basic/tag";
import { formatValue } from "./formatValue";

const WrappedTag = wrapBrick<Tag, TagProps>("eo-tag");

export interface CornerDataItem {
  label: string;
  value: string | number;
  color?: string;
}

export interface CornerIndictorProps {
  cornerDataSource?: CornerDataItem[];
}

export function CornerIndictor({ cornerDataSource }: CornerIndictorProps) {
  return (
    <div className="corner">
      {cornerDataSource?.map((item, index) => (
        <div key={index} className="corner-item">
          <div className="corner-label">{item.label}</div>
          <WrappedTag
            className="corner-value"
            outline
            color={item.color}
            tagStyle={{
              fontSize: 18,
              padding: "2px 16px",
            }}
          >
            {formatValue(item.value)}
          </WrappedTag>
        </div>
      ))}
    </div>
  );
}
