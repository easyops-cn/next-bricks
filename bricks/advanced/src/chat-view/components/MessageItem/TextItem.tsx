import React from "react";

interface TextItem {
  text: string;
}

export function TextItem({ text }: TextItem) {
  return <div className="text-item">{text}</div>;
}
