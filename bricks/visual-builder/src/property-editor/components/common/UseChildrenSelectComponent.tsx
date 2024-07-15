import React from "react";
import { Select } from "@formily/antd-v5";
import { Tooltip, SelectProps } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import styles from "./UseChildrenSelectComponent.module.css";

type UseChildrenSelectComponentProps = SelectProps & {
  triggerAction: (action: string) => void;
};

export function UseChildrenSelectComponent(
  props: UseChildrenSelectComponentProps
) {
  const handlePlusIconClick = () => {
    props?.triggerAction?.("add-slot");
  };

  return (
    <div className={styles.useChildrenSelectWrapper}>
      <Select {...props} />
      <Tooltip title="点击添加子节点">
        <PlusCircleOutlined
          className={styles.plusIcon}
          onClick={handlePlusIconClick}
        />
      </Tooltip>
    </div>
  );
}
