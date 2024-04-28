import React, { useEffect, useMemo, useState } from "react";
import { useNodeViewContext } from "@prosemirror-adapter/react";
import InstanceList from "./InstanceList/index.js";
import { ProgressText } from "./ProgressText.js";

export const CodeBlock = () => {
  const [language, setLanguage] = useState("");
  const { contentRef, node } = useNodeViewContext();
  const defaultContent = useMemo(
    () => (
      <pre spellCheck={false}>
        <code ref={contentRef} />
      </pre>
    ),
    [contentRef]
  );

  const renderContent = useMemo(() => {
    if (!node.firstChild?.text) return null;
    switch (language) {
      case "easy_cmd_progress":
        return <ProgressText text={node.firstChild?.textContent} />;
      case "easy_cmd_cmdb_instance_list":
      case "easy_cmd_cmdb_instance_table":
        return <InstanceList text={node.firstChild?.textContent} />;
      default:
        return defaultContent;
    }
  }, [node, language, defaultContent]);

  useEffect(() => {
    if (!language) {
      const {
        attrs: { language },
      } = node;
      if (language) {
        setLanguage(language);
      }
    }
  }, [node, language]);

  return renderContent;
};
