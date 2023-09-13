import React, { useMemo } from "react";
import { Column, RecordType } from "./interface.js";
import { Table, ConfigProvider, theme } from "antd";
import { StyleProvider, createCache } from "@ant-design/cssinjs";
import { useCurrentTheme } from "@next-core/react-runtime";

// --- NOTE: uncomment these lines below to enable i18n for your brick ---
// import { useTranslation, initializeReactI18n } from "@next-core/i18n/react";
// import { K, NS, locales } from "./i18n.js";
// initializeReactI18n(NS, locales);

interface NextTableComponentProps {
  shadowRoot: ShadowRoot | null;
  columns?: Column[];
  dataSource?: RecordType[];
}

export function NextTableComponent(props: NextTableComponentProps) {
  const { shadowRoot, columns, dataSource } = props;

  // const { t } = useTranslation(NS);
  // const hello = t(K.HELLO);

  const styleCache = useMemo(() => {
    return createCache();
  }, []);

  const currentTheme = useCurrentTheme();

  return (
    <ConfigProvider
      theme={{
        algorithm:
          currentTheme === "dark-v2"
            ? theme.darkAlgorithm
            : theme.defaultAlgorithm,
      }}
    >
      <StyleProvider container={shadowRoot as ShadowRoot} cache={styleCache}>
        <Table columns={columns} dataSource={dataSource} />
      </StyleProvider>
    </ConfigProvider>
  );
}
