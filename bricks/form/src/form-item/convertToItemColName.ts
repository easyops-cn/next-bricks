import type { ColProps, ColSize } from "@next-shared/form";
import type { Layout } from "../interface.js";

export function convertToItemColName(
  colConf: ColProps | undefined,
  layout: Layout
): string {
  let cls = "";
  if (!colConf || layout !== "horizontal") return cls;

  if (colConf.span) {
    cls += `form-item-col-${colConf.span} `;
  }

  if (colConf.offset) {
    cls += `form-item-col-offset-${colConf.offset} `;
  }

  ["sm", "md", "lg", "xl", "xxl"].forEach((size) => {
    const sizeConf = colConf[size as keyof ColProps];
    if (sizeConf) {
      if (["number", "string"].includes(typeof sizeConf)) {
        cls += `form-item-col-${size}-${sizeConf} `;
      } else {
        (sizeConf as ColSize).span &&
          (cls += `form-item-col-${size}-${(sizeConf as ColSize).span} `);

        (sizeConf as ColSize).offset &&
          (cls += `form-item-col-${size}-offset-${
            (sizeConf as ColSize).offset
          } `);
      }
    }
  });

  return cls;
}

export function addLabelSizeToWrapperOffset(
  labelCol: number | string | ColSize,
  wrapperCol: number | string | ColSize
): ColSize {
  let wrapperSpan: number | string;
  let wrapperOffset: number;

  if (typeof wrapperCol === "number" || typeof wrapperCol === "string") {
    wrapperSpan = wrapperCol;
    wrapperOffset = 0;
  } else {
    wrapperSpan = wrapperCol.span!;
    wrapperOffset = +(wrapperCol.offset ?? 0);
  }

  let offset =
    (typeof labelCol === "number" || typeof labelCol === "string"
      ? +labelCol
      : +(labelCol.span ?? 0) + +(labelCol.offset ?? 0)) + wrapperOffset;

  if (+wrapperSpan + offset > 24) {
    offset = wrapperOffset;
  }

  return {
    span: wrapperSpan,
    offset,
  };
}

export function calcWrapperColOffsetWithoutLabel(
  labelCol: ColProps,
  wrapperCol: ColProps
): ColProps {
  if (wrapperCol.span !== undefined) {
    return addLabelSizeToWrapperOffset(labelCol, wrapperCol);
  }

  return Object.fromEntries(
    Object.entries(wrapperCol).map(([key, value]) => {
      return [
        key,
        addLabelSizeToWrapperOffset(
          labelCol[key as keyof ColProps] as ColSize,
          value
        ),
      ];
    })
  );
}
