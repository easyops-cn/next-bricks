import React, { useMemo } from "react";
import { wrapBrick } from "@next-core/react-element";
import type {
  EoNextTable,
  NextTableComponentProps,
} from "../../../next-table/index.js";

interface MarkdownItemProps {
  text: string;
}

const WrappedNextTable = wrapBrick<EoNextTable, NextTableComponentProps>(
  "eo-next-table"
);

export function TableItem({ text }: MarkdownItemProps) {
  const parseContent = useMemo((): NextTableComponentProps => {
    let content: NextTableComponentProps;
    try {
      content = JSON.parse(text);
    } catch {
      content = {} as NextTableComponentProps;
    }
    return content;
  }, [text]);

  return (
    <div className="table-item">
      <WrappedNextTable pagination={false} {...parseContent} />
    </div>
  );
}
