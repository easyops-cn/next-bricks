import React, { createElement } from "react";
import { customEditors } from "@next-core/runtime";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type { EditorComponentProps } from "@next-bricks/visual-builder/property-editor";
import { eoButtonSchema } from "./eoButton.schema";
// import { newSchema } from "./new.schema";

function EoButtonComponent(props: EditorComponentProps): React.ReactElement {
  const { SchemaFieldComponent, formilySchemaFormatter, advancedMode } = props;

  // 设置表达 effect
  // useEffect(() => {
  //   // console.log(props);
  //   const { onFieldValueChange } = props.effects;
  //   props.form.addEffects('abc',() => {
  //     onFieldValueChange("url", (field) => {
  //       console.log(field);
  //     });
  //   })
  // }, []);

  return createElement(SchemaFieldComponent, {
    schema: formilySchemaFormatter(eoButtonSchema, advancedMode),
  });
}

customEditors.define("eo-button-editor", EoButtonComponent);
