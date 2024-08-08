import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import { Worker, Viewer } from "@react-pdf-viewer/core";

// Plugins
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

// Import styles
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const { defineElement, property } = createDecorators();

export interface PdfViewerProps {
  url: string;
  page?: number;
  search?: string;
  viewerStyle?: React.CSSProperties | undefined;
}

/**
 * 构件 `advanced.pdf-viewer`
 */
export
@defineElement("advanced.pdf-viewer", {
  // 样式文件引入报错，使用非shadow dom模式正常
  shadowOptions: false,
})
class PdfViewer extends ReactNextElement implements PdfViewerProps {
  @property()
  accessor url!: string;

  @property({
    type: Number,
  })
  accessor page: number | undefined;

  @property()
  accessor search: string | undefined;

  @property({
    attribute: false,
  })
  accessor viewerStyle: React.CSSProperties | undefined;

  render() {
    return (
      <PdfViewerComponent
        url={this.url}
        page={this.page ? this.page - 1 : 0}
        search={this.search}
        viewerStyle={this.viewerStyle}
      />
    );
  }
}

export interface PdfViewerComponentProps extends PdfViewerProps {
  // Define event handlers here.
}

export function PdfViewerComponent({
  url,
  search,
  page,
  viewerStyle,
}: PdfViewerComponentProps) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    toolbarPlugin: {
      searchPlugin: {
        keyword: search,
      },
    },
  });

  return (
    // See: https://react-pdf-viewer.dev/examples/compile-and-set-the-worker-source-with-webpack/
    <Worker
      workerUrl={`${process.env.NODE_ENV === "test" ? "" : __webpack_public_path__}pdf.worker.min.js`}
    >
      <div style={viewerStyle}>
        <Viewer
          fileUrl={url}
          initialPage={page}
          plugins={[defaultLayoutPluginInstance]}
        />
      </div>
    </Worker>
  );
}
