import { useEffect, useState } from "react";
import { ContractCenterApi_searchContract } from "@next-api-sdk/next-builder-sdk";

interface ContractParams {
  pageSize?: number;
  q?: string;
}

interface ContractField {
  fullContractName?: string;
  version: string[];
}

export function useContractList({
  pageSize = 20,
  q = "",
}: ContractParams): ContractField[] {
  const [contractList, setContractList] = useState<ContractField[]>([]);
  const [query, setQ] = useState<string>(q);
  const [count, setCount] = useState(pageSize);

  useEffect(() => {
    setQ(q);
  }, [q]);

  useEffect(() => {
    setCount(pageSize);
  }, [pageSize]);

  useEffect(() => {
    (async () => {
      try {
        const { list } = await ContractCenterApi_searchContract(
          {
            page: 1,
            pageSize: count,
            fullContractName: query,
          },
          {
            interceptorParams: { ignoreLoadingBar: true },
          }
        );

        setContractList(list as ContractField[]);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        setContractList([]);
      }
    })();
  }, [query, count]);

  return contractList;
}
