import React, { CSSProperties, useEffect, useRef } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import { unwrapProvider } from "@next-core/utils/general";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import type { copyToClipboard as _copyToClipboard } from "@next-bricks/basic/data-providers/copy-to-clipboard";
import type { showNotification as _showNotification } from "@next-bricks/basic/data-providers/show-notification/show-notification";
import { useTranslation, initializeReactI18n } from "@next-core/i18n/react";
import { K, NS, locales } from "./i18n.js";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import classNames from "classnames";

import { saveAs } from "file-saver";
import Prism from "prismjs";
import "prismjs/plugins/line-numbers/prism-line-numbers.js";

Prism.manual = true;
initializeReactI18n(NS, locales);

const { defineElement, property } = createDecorators();

const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");
const copyToClipboard = unwrapProvider<typeof _copyToClipboard>(
  "basic.copy-to-clipboard"
);
const showNotification = unwrapProvider<typeof _showNotification>(
  "basic.show-notification"
);

export interface CodeDisplayProps {
  value?: string;
  language?: string;
  hideLineNumber?: boolean;
  maxLines?: number;
  minLines?: number;
  showCopyButton?: boolean;
  showExportButton?: boolean;
  exportFileName?: string;
}

/**
 * 代码展示
 */
export
@defineElement("eo-code-display", {
  styleTexts: [styleText],
  alias: ["presentational.code-display"],
})
class CodeDisplay extends ReactNextElement implements CodeDisplayProps {
  /**
   * 代码内容
   */
  @property()
  accessor value: string | undefined;

  /**
   * 语言，具体查阅 [Supported languages](https://prismjs.com/#supported-languages)
   */
  @property()
  accessor language: string | undefined;

  /**
   * 是否隐藏行号
   */
  @property({
    type: Boolean,
  })
  accessor hideLineNumber: boolean | undefined;

  /**
   * 最大行数
   */
  @property({
    type: Number,
  })
  accessor maxLines: number | undefined;

  /**
   * 最小行数
   */
  @property({
    type: Number,
  })
  accessor minLines: number | undefined;

  /**
   * 是否显示复制按钮
   */
  @property({
    type: Boolean,
  })
  accessor showCopyButton: boolean = true;

  /**
   * 是否显示导出按钮
   */
  @property({
    type: Boolean,
  })
  accessor showExportButton: boolean | undefined;

  /**
   * 导出的文件名
   * @default download.txt
   */
  @property()
  accessor exportFileName: string | undefined;

  render() {
    return (
      <CodeDisplayComponent
        value={this.value}
        language={this.language}
        hideLineNumber={this.hideLineNumber}
        maxLines={this.maxLines}
        minLines={this.minLines}
        showCopyButton={this.showCopyButton}
        showExportButton={this.showExportButton}
        exportFileName={this.exportFileName}
      />
    );
  }
}

export function CodeDisplayComponent(props: CodeDisplayProps) {
  const {
    value,
    language,
    hideLineNumber,
    maxLines,
    minLines,
    showCopyButton,
    showExportButton,
    exportFileName,
  } = props;
  const { t } = useTranslation(NS);

  const codeRef = useRef<HTMLElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    Prism.highlightElement(codeRef.current);
  }, [value, language, hideLineNumber]);

  useEffect(() => {
    const handleResize = (): void => {
      !hideLineNumber && Prism.plugins.lineNumbers.resize(preRef.current);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(preRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const handleCopyIconClick = () => {
    copyToClipboard(value)
      .then(() =>
        showNotification({ type: "success", message: t(K.COPY_SUCCESS) })
      )
      .catch(() =>
        showNotification({ type: "error", message: t(K.COPY_FAILED) })
      );
  };

  const handleExportIconClick = () => {
    saveAs(new Blob([value]), exportFileName);
  };

  return (
    <div className="code-wrapper">
      <pre
        ref={preRef}
        className={classNames(
          "pre",
          hideLineNumber ? "no-line-numbers" : "line-numbers"
        )}
        style={
          {
            "--max-lines": maxLines - 0 > 0 ? maxLines : null,
            "--min-lines": minLines - 0 > 0 ? minLines : null,
          } as CSSProperties
        }
      >
        <code
          className={classNames("code", `language-${language}`)}
          ref={codeRef}
        >
          {value}
        </code>
      </pre>
      <div className="tool-bar">
        {showCopyButton && (
          <WrappedIcon
            lib="antd"
            theme="outlined"
            icon="copy"
            className="copy-icon"
            onClick={handleCopyIconClick}
          />
        )}
        {showExportButton && (
          <WrappedIcon
            lib="antd"
            theme="outlined"
            icon="export"
            className="export-icon"
            onClick={handleExportIconClick}
          />
        )}
      </div>
    </div>
  );
}
