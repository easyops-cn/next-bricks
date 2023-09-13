import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import { NextTableComponent } from "./Table.js";
import { Column, RecordType } from "./interface.js";

// --- NOTE: uncomment these lines below to enable i18n for your brick ---
// import { useTranslation, initializeReactI18n } from "@next-core/i18n/react";
// import { K, NS, locales } from "./i18n.js";
// initializeReactI18n(NS, locales);

const { defineElement, property } = createDecorators();

/**
 * 大型表格
 */
export
@defineElement("eo-next-table", {
  styleTexts: [styleText],
})
class EoNextTable extends ReactNextElement {
  @property({
    attribute: false,
  })
  accessor columns: Column[] | undefined;

  @property({
    attribute: false,
  })
  accessor dataSource: RecordType[] | undefined;

  render() {
    return (
      <NextTableComponent
        shadowRoot={this.shadowRoot}
        columns={this.columns}
        dataSource={this.dataSource}
      />
    );
  }
}
