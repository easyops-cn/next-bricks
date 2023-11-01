import { ColProps } from "@next-shared/form";
import {
  convertToItemColName,
  calcWrapperColOffsetWithoutLabel,
} from "./convertToItemColName.js";
import { Layout } from "../interface.js";

describe("processor", () => {
  describe("convertToItemColName", () => {
    test.each([
      [undefined, "horizontal", ""],
      [{}, "vertical", ""],
      [
        {
          span: 2,
        },
        "horizontal",
        "form-item-col-2 ",
      ],
      [
        {
          span: 2,
          offset: 2,
        },
        "horizontal",
        "form-item-col-2 form-item-col-offset-2 ",
      ],
      [
        {
          sm: 8,
          md: 10,
          lg: 12,
        },
        "horizontal",
        "form-item-col-sm-8 form-item-col-md-10 form-item-col-lg-12 ",
      ],
      [
        {
          sm: {
            span: 8,
            offset: 2,
          },
          md: {
            span: 10,
            offset: 2,
          },
          lg: {
            span: 10,
            offset: 2,
          },
        },
        "horizontal",
        "form-item-col-sm-8 form-item-col-sm-offset-2 form-item-col-md-10 form-item-col-md-offset-2 form-item-col-lg-10 form-item-col-lg-offset-2 ",
      ],
    ])("should work", (colConf, layout, result) => {
      expect(
        convertToItemColName(colConf as ColProps, layout as Layout)
      ).toEqual(result);
    });
  });

  describe("calcWrapperColOffsetWithoutLabel", () => {
    test.each([
      [
        {
          span: 2,
        },
        {
          span: 3,
        },
        { offset: 2, span: 3 },
      ],
      [
        { span: 2, offset: 2 },
        {
          span: 3,
        },
        { offset: 4, span: 3 },
      ],
      [
        {
          sm: 2,
          md: 3,
          lg: 4,
          xl: 5,
          xxl: 6,
        },
        {
          sm: 8,
          md: 9,
          lg: 10,
          xl: 11,
          xxl: 12,
        },
        {
          lg: { offset: 4, span: 10 },
          md: { offset: 3, span: 9 },
          sm: { offset: 2, span: 8 },
          xl: { offset: 5, span: 11 },
          xxl: { offset: 6, span: 12 },
        },
      ],
      [
        {
          sm: {
            span: 2,
            offset: 1,
          },
          md: {
            span: 3,
            offset: 1,
          },
          lg: {
            span: 4,
            offset: 1,
          },
          xl: {
            span: 5,
            offset: 1,
          },
          xxl: {
            span: 6,
            offset: 1,
          },
        },
        {
          sm: {
            span: 6,
          },
          md: {
            span: 7,
          },
          lg: {
            span: 8,
            offset: 1,
          },
          xl: {
            span: 9,
            offset: 1,
          },
          xxl: {
            span: 10,
            offset: 1,
          },
        },
        {
          lg: { offset: 6, span: 8 },
          md: { offset: 4, span: 7 },
          sm: { offset: 3, span: 6 },
          xl: { offset: 7, span: 9 },
          xxl: { offset: 8, span: 10 },
        },
      ],
      [
        {
          sm: {
            span: 2,
            offset: 1,
          },
          md: {
            span: 3,
            offset: 1,
          },
        },
        {
          sm: {
            span: 24,
          },
          md: {
            span: 24,
          },
        },
        { md: { offset: 0, span: 24 }, sm: { offset: 0, span: 24 } },
      ],
    ])("should work", (labelCol, wrapperCol, result) => {
      expect(calcWrapperColOffsetWithoutLabel(labelCol, wrapperCol)).toEqual(
        result
      );
    });
  });
});
