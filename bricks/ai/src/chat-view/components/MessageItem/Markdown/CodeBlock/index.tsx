import React, { useEffect, useMemo, useState } from "react";
import { useNodeViewContext } from "@prosemirror-adapter/react";
import { ProgressText } from "./ProgressText.js";
import CustomComponent from "./CustomComponent.js";

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
    const text = node.firstChild?.textContent;
    switch (language) {
      case "easy_cmd_progress":
        return <ProgressText text={text} />;
      case "easy_cmd_cmdb_instance_list":
      case "easy_cmd_monitor_dashboard":
        return <CustomComponent text={text} language={language} />;
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
