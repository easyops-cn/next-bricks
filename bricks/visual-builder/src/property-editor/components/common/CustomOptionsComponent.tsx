import React, { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./CutomOptionsComponent.module.css";
import { PlusCircleOutlined } from "@ant-design/icons";
import { FormProvider } from "@formily/react";
import { Modal, Button } from "antd";
import {
  DataNode,
  formilySchemaFormatter,
} from "../../utils/formilySchemaFormatter";
import { SchemaField } from "../..";
import { createForm } from "@formily/core";
import { omit } from "lodash";

interface ActionOptionsComponentProps {
  onChange: (value: any[]) => void;
  displayLabel: string;
  schema: DataNode[];
  value: any;
}

const CUSTOM_WRAPPER = "$custom_wrapper";
const OPTION_ID = "$option_id";

export function CustomOptionsComponent({
  schema,
  displayLabel,
  value,
  onChange,
}: ActionOptionsComponentProps) {
  const [editItem, setEditItem] = useState<any>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [options, setOptions] = useState<any[]>([]);
  const formatSchema: any = useMemo(
    () =>
      formilySchemaFormatter(
        {
          name: CUSTOM_WRAPPER,
          type: "void",
          children: schema,
        },
        {
          isDefault: false,
        }
      ),
    [schema]
  );

  const form = useMemo(() => createForm(), []);

  const handleAddAction = () => {
    setEditItem(null);
    form.reset();
    setIsModalOpen(true);
  };

  const handleEditItem = (data: any) => {
    setEditItem(data);
    form.setValues(data, "overwrite");
    setIsModalOpen(true);
  };

  const handleOk = useCallback(() => {
    let newOptions = options;
    if (editItem) {
      newOptions = options.map((item) => {
        if (item[OPTION_ID] === editItem[OPTION_ID]) {
          return form.values;
        }
        return item;
      });
    } else {
      newOptions = options.concat(form.values);
    }
    setOptions(newOptions);

    onChange(newOptions.map((item) => omit(item, [OPTION_ID])));
    setIsModalOpen(false);
  }, [form, onChange, options, editItem]);

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleDelete = useCallback(() => {
    const newOptions = options.filter(
      (item) => item[OPTION_ID] !== editItem[OPTION_ID]
    );
    setOptions(newOptions);

    onChange(newOptions.map((item) => omit(item, [OPTION_ID])));

    setIsModalOpen(false);
  }, [options, editItem, onChange]);

  useEffect(() => {
    if (value) {
      setOptions(
        value.map((item: any) => ({
          ...item,
          [OPTION_ID]: Math.random(),
        }))
      );
    }
  }, [value]);

  return (
    <div className={styles.actionOptionsWrapper}>
      <Modal
        title={`${editItem ? "编辑" : "新增"}数据`}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={() => (
          <div className={styles.modalFooter}>
            <div>
              {editItem && (
                <Button danger type="primary" onClick={handleDelete}>
                  删除
                </Button>
              )}
            </div>
            <div>
              <Button type="text" onClick={handleCancel}>
                取消
              </Button>
              <Button type="primary" onClick={handleOk}>
                确认
              </Button>
            </div>
          </div>
        )}
      >
        <FormProvider form={form}>
          <SchemaField schema={formatSchema?.[CUSTOM_WRAPPER]} />
        </FormProvider>
      </Modal>
      <div className={styles.optionList}>
        {options.length ? (
          options.map((item, index) => {
            return (
              <div
                className={styles.optionItem}
                key={index}
                onClick={() => handleEditItem(item)}
              >
                {item[displayLabel]}
              </div>
            );
          })
        ) : (
          <div className={styles.emptyItem}>无数据</div>
        )}
      </div>
      <PlusCircleOutlined
        className={styles.addIcon}
        onClick={handleAddAction}
      />
    </div>
  );
}
