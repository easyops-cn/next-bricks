import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  lazy,
} from "react";
import {
  InstanceApi_postSearchV3,
  InstanceApi_PostSearchV3RequestBody,
} from "@next-api-sdk/cmdb-sdk";
import { ChatItemLoading } from "../../../Loading.js";
import { useMsgItemContext } from "../../MsgItemContext.js";
import { getBasePath } from "@next-core/runtime";
import { http } from "@next-core/http";

const TableComponent = lazy(() => import("./Table/index.js"));
const ChartComponent = lazy(() => import("./Chart/index.js"));

type CustomLanguage =
  | "easy_cmd_cmdb_instance_list"
  | "easy_cmd_monitor_dashboard";

interface UseFetchDataProps {
  text: string;
  chatting: boolean;
  language: CustomLanguage;
}

function useFetchData({ text, chatting, language }: UseFetchDataProps) {
  const cahceTextRef = useRef<string>("");
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isEnd, setIsEnd] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [parseData, setParseData] = useState<any>();
  const [data, setData] = useState<any>({});

  const requestPromise = useCallback(
    async (data: any) => {
      switch (language) {
        case "easy_cmd_cmdb_instance_list":
          return await InstanceApi_postSearchV3(data.objectId, {
            page: 1,
            page_size: 10,
            ...data,
          });
        case "easy_cmd_monitor_dashboard":
          return await http.request<any>(
            `${getBasePath()}/api/gateway/logic.data_exchange/api/v1/data_exchange/olap`,
            {
              method: "POST",
              body: text,
            }
          );
      }
    },
    [language, text, parseData]
  );

  const fetchData = useCallback(
    async (data: any) => {
      if (isFetching) return;
      setIsFetching(true);
      try {
        const response = await requestPromise(data);
        setData(response);
        setIsError(false);
      } catch {
        setIsError(true);
      }
      setIsFetching(false);
      setIsLoading(false);
    },
    [isFetching, requestPromise]
  );

  useEffect(() => {
    if (cahceTextRef.current !== text) {
      cahceTextRef.current = text;
      let data: InstanceApi_PostSearchV3RequestBody & { objectId: string };
      try {
        data = JSON.parse(text);
      } catch {
        setIsError(true);
        return;
      }
      setParseData(data);
      fetchData(data);
    }
  }, [text]);

  useEffect(() => {
    if (chatting) {
      if (text.match(/\n[`]{0,3}$/)) {
        setIsEnd(true);
      }
    } else {
      setIsEnd(true);
    }
  }, [text, chatting, isFetching]);

  return {
    data,
    parseData,
    isError: isEnd && isError,
    isLoading: isLoading || isFetching,
  };
}

export default function CustomComponent({
  text,
  language,
}: {
  text: string;
  language: CustomLanguage;
}) {
  const { chatting } = useMsgItemContext();

  const { data, parseData, isError, isLoading } = useFetchData({
    text,
    language,
    chatting: !!chatting,
  });

  const component = useMemo(() => {
    switch (language) {
      case "easy_cmd_cmdb_instance_list":
        return <TableComponent data={data} params={parseData} />;
      case "easy_cmd_monitor_dashboard":
        return <ChartComponent data={data.data} params={parseData} />;
    }
  }, [language, data, parseData]);

  return (
    <div className="custom-component-wrapper">
      <div className="params">
        <div className="params-tip">【查询语句】: </div>
        <pre>
          <code>{text}</code>
        </pre>
      </div>
      {isLoading ? (
        <ChatItemLoading />
      ) : isError ? (
        <div className="error-tip">【查询失败】</div>
      ) : (
        <>
          <div className="result-tip">【查询结果】:</div>
          {component}
        </>
      )}
    </div>
  );
}
