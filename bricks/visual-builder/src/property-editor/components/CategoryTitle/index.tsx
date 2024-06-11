import React from "react";

interface categoryTitleProps {
  text: string;
}
export function CategoryTitle(props: categoryTitleProps): React.ReactElement {
  return <div className="custom-category-title">{props.text}</div>;
}
