import React from "react";
import { Radio } from "antd";
import {
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
} from "@ant-design/icons";

export function TextAlignRadioComponent(props: any): React.ReactElement {
  return (
    <Radio.Group {...props} size="small">
      <Radio.Button value="left">
        <AlignLeftOutlined />
      </Radio.Button>
      <Radio.Button value="center">
        <AlignCenterOutlined />
      </Radio.Button>
      <Radio.Button value="right">
        <AlignRightOutlined />
      </Radio.Button>
    </Radio.Group>
  );
}
