import React, { useCallback, useEffect, useState } from "react";
import {
  InstanceApi_postSearchV3,
  InstanceApi_PostSearchV3RequestBody,
} from "@next-api-sdk/cmdb-sdk";
import { wrapBrick } from "@next-core/react-element";
import type { Link, LinkProps } from "@next-bricks/basic/link";
import { TableColumn, TableComponent } from "./Table";
import { ChatItemLoading } from "../../../../Loading.js";
import { useMsgItemContext } from "../../../MsgItemContext.js";
import { getBasePath } from "@next-core/runtime";

export type RequestParams = InstanceApi_PostSearchV3RequestBody & {
  objectId: string;
};

const computedTableColumns = (data: Record<string, any>[]) => {
  const columns: TableColumn[] = [];
  const matchItem = data[0];
  Object.keys(matchItem)?.forEach((key) => {
    columns.push({
      title: key,
      dataIndex: key,
      key: key,
    });
  });
  return columns;
};

const WrappedLink = wrapBrick<Link, LinkProps>("eo-link");

export default function InstanceList({ text }: { text: string }) {
  const { chatting } = useMsgItemContext();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isEnd, setIsEnd] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [objectId, setObjectId] = useState<string>("");
  const [tableColumn, setTableColumn] = useState<TableColumn[]>([]);
  const [tableData, setTableData] = useState<Record<string, any>[]>([]);
  const [showMore, setShowMore] = useState<boolean>(false);

  const handleClickShowMoreBtn = () => {
    setShowMore((isShow) => !isShow);
  };

  const fetchInstanceList = useCallback(
    async (objectId: string, params: InstanceApi_PostSearchV3RequestBody) => {
      if (isFetching) return;
      setIsFetching(true);
      try {
        const request = await InstanceApi_postSearchV3(objectId, {
          page: 1,
          page_size: 10,
          ...params,
        });
        setTableData(request.list ?? []);
        setTableColumn(computedTableColumns(request.list!));
        setIsError(false);
      } catch {
        setIsError(true);
      }
      setIsFetching(false);
      setIsLoading(false);
    },
    [isFetching]
  );

  useEffect(() => {
    let data: InstanceApi_PostSearchV3RequestBody & { objectId: string };
    try {
      data = JSON.parse(text);
    } catch {
      setIsError(true);
      if (isEnd) {
        setIsLoading(false);
      }
      return;
    }
    setObjectId(data.objectId);
    fetchInstanceList(data.objectId, data);
  }, [text, isEnd]);

  useEffect(() => {
    if (chatting) {
      if (text.match(/\n[`]{0,3}$/)) {
        setIsEnd(true);
        if (!isFetching) {
          setIsLoading(false);
        }
      }
    } else {
      setIsEnd(true);
    }
  }, [text, chatting, isFetching]);

  return (
    <div className="instance-list-wrapper">
      {isLoading || isFetching ? (
        <ChatItemLoading />
      ) : isEnd && isError ? (
        <div className="error-tip">
          <WrappedLink onClick={handleClickShowMoreBtn}>
            {showMore ? "收起" : "查询失败, 点击查看原始查询语句"}
          </WrappedLink>
          {showMore ? (
            <div className="params">
              <div className="params-tip">【查询语句】: </div>
              <pre>
                <code>{text}</code>
              </pre>
            </div>
          ) : null}
        </div>
      ) : (
        <div>
          <TableComponent columns={tableColumn} dataSource={tableData} />
          {objectId ? (
            <div className="open-more">
              <WrappedLink
                href={`${getBasePath()}/next-cmdb-instance-management/next/${objectId}/list`}
              >
                查看更多
              </WrappedLink>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
