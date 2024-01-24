import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { handleHttpError } from "@next-core/runtime";
import {
  InstanceApi_postSearchV3,
  InstanceApi_updateInstanceV2,
  InstanceApi_createInstance,
} from "@next-api-sdk/cmdb-sdk";
import { createAsyncQueue } from "../processors/createAsyncQueue";
import {
  NodeUserView,
  UserView,
  UserViewNodesMap,
  UserViewQuery,
} from "../interfaces";

const USER_VIEW_MODEL_ID = "GRAPH_USER_VIEW@EASYOPS";

export interface UserViewHook {
  userViewReady: boolean;
  userViewNodesMap: UserViewNodesMap | null;
  saveUserView: (nodes: NodeUserView[]) => void;
}

export function useUserView(query: UserViewQuery | undefined): UserViewHook {
  const [userViewReady, setUserViewReady] = useState(!query);
  const userViewIdRef = useRef<string>();
  const [userViewNodesMap, setUserViewNodesMap] =
    useState<UserViewNodesMap | null>(null);
  const queue = useMemo(() => createAsyncQueue(), []);

  useEffect(() => {
    async function getUserView(): Promise<void> {
      if (!query) {
        setUserViewReady(true);
        return;
      }
      const { namespace, key } = query;
      if (!(namespace && key)) {
        // eslint-disable-next-line no-console
        console.error("Namespace and key are required to save graph user view");
        setUserViewReady(true);
        return;
      }
      try {
        const list = (
          await InstanceApi_postSearchV3(USER_VIEW_MODEL_ID, {
            fields: ["nodes"],
            query: {
              namespace: {
                $eq: namespace,
              },
              key: {
                $eq: key,
              },
            },
            page: 1,
            page_size: 30,
          })
        ).list as UserView[];
        if (list.length > 0) {
          const userView = list[0];
          const userViewNodesMap = new Map(
            userView.nodes?.map((node) => [node.id, node])
          );
          userViewIdRef.current = userView.instanceId;
          setUserViewNodesMap(userViewNodesMap);
        } else {
          setUserViewNodesMap(null);
        }
      } catch (error) {
        handleHttpError(error as Error);
      } finally {
        setUserViewReady(true);
      }
    }
    getUserView();
  }, [query]);

  const saveUserView = useCallback(
    (nodes: NodeUserView[]) => {
      const { namespace, key } = query ?? {};
      if (!(namespace && key)) {
        return;
      }
      queue(async () => {
        const userViewData = {
          namespace,
          key,
          nodes,
        };
        try {
          if (userViewIdRef.current) {
            await InstanceApi_updateInstanceV2(
              USER_VIEW_MODEL_ID,
              userViewIdRef.current,
              userViewData,
              {
                interceptorParams: {
                  ignoreLoadingBar: true,
                },
              }
            );
          } else {
            const userView = await InstanceApi_createInstance(
              USER_VIEW_MODEL_ID,
              userViewData,
              {
                interceptorParams: {
                  ignoreLoadingBar: true,
                },
              }
            );
            userViewIdRef.current = userView.instanceId;
          }
        } catch (error) {
          handleHttpError(error);
        }
      });
    },
    [query, queue]
  );

  return {
    userViewReady,
    userViewNodesMap,
    saveUserView,
  };
}
