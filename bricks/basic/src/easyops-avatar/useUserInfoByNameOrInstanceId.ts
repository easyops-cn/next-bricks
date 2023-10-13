import { makeThrottledAggregation } from "@next-shared/general/makeThrottledAggregation";
import {
  UserAdminApi_searchAllUsersInfo,
  type UserAdminApi_SearchAllUsersInfoResponseBody,
} from "@next-api-sdk/user-service-sdk";
import { useEffect, useState } from "react";

export interface UserInfo {
  instanceId: string;
  name: string;
  user_icon: string;
}

type UseUserInfoByNameOrInstanceIdReturn = {
  user: UserInfo | null;
  loading: boolean;
};

const getUserInfoByNameOrInstanceId = makeThrottledAggregation(
  "getUserInfoByNameOrInstanceId",
  (ids: string[]) =>
    UserAdminApi_searchAllUsersInfo({
      query: {
        $or: [
          {
            name: {
              $in: ids,
            },
          },
          {
            instanceId: {
              $in: ids,
            },
          },
        ],
      },
      fields: {
        name: true,
        user_icon: true,
      },
    }),
  ({ list }: UserAdminApi_SearchAllUsersInfoResponseBody, id: string) =>
    list?.find((item) => item.instanceId === id || item.name === id) as UserInfo
);

export function useUserInfoByNameOrInstanceId(
  nameOrInstanceId?: string
): UseUserInfoByNameOrInstanceIdReturn {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setUser(null);
    if (!nameOrInstanceId) {
      return;
    }
    let isSubscribed = true;
    setLoading(true);
    getUserInfoByNameOrInstanceId(nameOrInstanceId)
      .then(
        (userInfo) => {
          if (isSubscribed) {
            setUser(userInfo);
          }
        },
        (err) => {
          // eslint-disable-next-line no-console
          console.error("Load user info failed:", err);
        }
      )
      .finally(() => {
        setLoading(false);
      });
    return () => {
      isSubscribed = false;
    };
  }, [nameOrInstanceId]);

  return {
    user,
    loading,
  };
}
