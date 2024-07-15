import { Schema, SchemaKey, useField, useFieldSchema } from "@formily/react";
import React, { createContext, useContext, useMemo, useState } from "react";
import styles from "./CustomTab.module.css";
import classNames from "classnames";

interface CustomTabContextProps {
  activeTab?: string;
}

const CustomTabContext = createContext<CustomTabContextProps>({});
const useCustonTabContext = () => useContext(CustomTabContext);

const useTabs = () => {
  const tabsField = useField();
  const schema = useFieldSchema();
  const tabs: { name: SchemaKey; props: any; schema: Schema }[] = [];
  schema.mapProperties((schema, name) => {
    const field = tabsField.query(tabsField.address.concat(name)).take();
    if (field?.display === "none" || field?.display === "hidden") return;
    if (schema["x-component"]?.indexOf("CustomTab.TabPanel") > -1) {
      const key =
        field?.componentProps?.key ||
        schema?.["x-component-props"]?.key ||
        name;
      tabs.push({
        name,
        props: {
          ...schema?.["x-component-props"],
          ...field?.componentProps,
          key,
        },
        schema,
      });
    }
  });
  return tabs;
};

export function CustomTab(props: any) {
  const tabs = useTabs();
  const [activeTab, setActiveTab] = useState<string>(tabs[0]?.name as string);

  return (
    <CustomTabContext.Provider
      value={{
        activeTab: activeTab,
      }}
    >
      <div className={styles.customTabWrapper}>
        <div className={styles.customTabList}>
          {tabs.map((item) => {
            return (
              <div
                className={classNames(styles.customTabItem, {
                  [styles.active]: activeTab === item.props?.key,
                })}
                key={item.props?.key}
                onClick={() => setActiveTab(item.props.key)}
              >
                <div className={styles.customTabItemLabel}>
                  {item.props.title}
                </div>
              </div>
            );
          })}
        </div>
        {props.children}
      </div>
    </CustomTabContext.Provider>
  );
}

CustomTab.TabPanel = function TabPanel(props: any) {
  const { activeTab } = useCustonTabContext();

  const isActive = useMemo(
    () => props.tab === activeTab,
    [activeTab, props.tab]
  );

  if (!isActive) return null;

  return <div className={styles.customTabPanel}>{props.children}</div>;
};
