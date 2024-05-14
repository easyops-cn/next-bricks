import React from "react";
import { Remark } from "react-remark";
import { rehypePrism } from "./rehypePrism.js";

export interface MarkdownComponentProps {
  content: string;
}

export function MarkdownComponent({ content }: MarkdownComponentProps) {
  return <Remark rehypePlugins={[rehypePrism as any]}>{content}</Remark>;
}
