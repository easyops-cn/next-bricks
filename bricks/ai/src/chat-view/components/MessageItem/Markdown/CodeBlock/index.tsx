import React, { useEffect, useMemo, useState } from "react";
import { useNodeViewContext } from "@prosemirror-adapter/react";
import { ProgressText } from "./ProgressText.js";
import CustomComponent from "./CustomComponent.js";
import { wrapBrick } from "@next-core/react-element";
import { GeneralIcon, GeneralIconProps } from "@next-bricks/icons/general-icon";
import { Tooltip, message } from "antd";
import { useChatViewContext } from "../../../../ChatViewContext";

const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");

const copyIcon: GeneralIconProps = {
  lib: "antd",
  icon: "copy",
  theme: "outlined",
};

export const CodeBlock = () => {
  const [language, setLanguage] = useState("");
  const { contentRef, node, view } = useNodeViewContext();
  const { commandBricks } = useChatViewContext();
  const [messageApi, contextHolder] = message.useMessage();

  const handleCopy = async () => {
    const text = node.content.firstChild?.text;
    try {
      if (text) {
        await navigator.clipboard.writeText(text);
        messageApi.success("复制成功");
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Failed to copy: ", err);
      messageApi.error("复制失败");
    }
  };

  const defaultContent = useMemo(
    () => (
      <div className="default-container">
        {contextHolder}
        <pre spellCheck={false}>
          <code ref={contentRef} style={{ position: "relative" }}>
            <div className="default-toolbar-container">
              <Tooltip title="复制" color="#474747" arrow={false}>
                <WrappedIcon
                  {...(copyIcon as GeneralIconProps)}
                  onClick={handleCopy}
                  style={{ cursor: "pointer" }}
                />
              </Tooltip>
            </div>
          </code>
        </pre>
      </div>
    ),
    [contentRef]
  );

  const renderContent = useMemo(() => {
    if (!node.firstChild?.text) return null;
    const text = node.firstChild?.textContent;
    const lang = language || node.attrs?.language;
    if (commandBricks && commandBricks[lang]) {
      // 使 markdown 默认样式不生效, 防止样式穿透
      view.dom.classList.contains("prose") &&
        view.dom.classList.replace("prose", "not-prose");
      return <CustomComponent text={text} language={lang} />;
    }
    switch (lang) {
      case "easy_cmd_progress":
        return <ProgressText text={text} />;
      default:
        return defaultContent;
    }
  }, [node, view, language, defaultContent, commandBricks]);

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
