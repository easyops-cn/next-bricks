import { describe, test, expect, jest } from "@jest/globals";
import { CollectService } from "./CollectService.js";
import { DRAG_DIRECTION } from "./constants.js";
import { MyCollectionApi_listMyCollection } from "@next-api-sdk/user-service-sdk";

jest.mock("@next-api-sdk/user-service-sdk");
const mockListCollectionApi = MyCollectionApi_listMyCollection as jest.Mock;

jest.mock("@next-core/easyops-runtime", () => ({
  auth: {
    getAuth: jest.fn().mockReturnValue({ username: "easyops" }),
  },
}));

describe("CollectService", () => {
  test("should work", async () => {
    const collectService = new CollectService(2);

    mockListCollectionApi.mockResolvedValueOnce({
      module: "sidebarMenuCollect",
      collectionName: "monitor",
      payloads: [
        {
          name: "集群",
          to: "/cluster",
          extInfo: { text: "集群", to: "/cluster" },
        },
      ],
    } as never);

    await collectService.fetchFavorites("monitor");
    expect(collectService.getFavoritesById("monitor")).toEqual([
      { text: "集群", to: "/cluster" },
    ]);

    collectService.setItemAsFavorite("monitor", {
      text: "主机",
      to: "/host",
    });

    expect(collectService.getFavoritesById("monitor")).toEqual([
      {
        text: "主机",
        to: "/host",
      },
      { text: "集群", to: "/cluster" },
    ]);

    await collectService.fetchFavorites("monitor");
    expect(collectService.getFavoritesById("monitor")).toEqual([
      {
        text: "主机",
        to: "/host",
      },
      { text: "集群", to: "/cluster" },
    ]);

    expect(collectService.getFavoritesById("monitor").length).toEqual(2);

    collectService.setItemAsFavorite("monitor", {
      text: "交换机",
      to: "/switch",
    });

    expect(collectService.getFavoritesById("monitor").length).toEqual(2);

    expect(
      collectService.isCollected("monitor", {
        text: "交换机",
        to: "/switch",
      })
    ).toEqual(true);

    expect(
      collectService.toggleFavorite("monitor", {
        text: "newItem",
        to: "/new-item",
      })
    );

    expect(collectService.getFavoritesById("monitor").length).toEqual(2);

    collectService.removeItemFromFavorite("monitor", {
      text: "交换机",
      to: "/switch",
    });

    expect(collectService.getFavoritesById("monitor").length).toEqual(1);

    collectService.toggleFavorite("monitor", { text: "cmdb", to: "/cmdb" });

    expect(collectService.getFavoritesById("monitor")).toEqual([
      { text: "cmdb", to: "/cmdb" },
      { text: "主机", to: "/host" },
    ]);

    collectService.toggleFavorite("monitor", { text: "cmdb", to: "/cmdb" });

    expect(collectService.getFavoritesById("monitor")).toEqual([
      { text: "主机", to: "/host" },
    ]);
  });

  test("should work with move items", () => {
    const collectService = new CollectService(5);
    collectService.setItemAsFavorite("resource", {
      text: "交换机",
      to: "/switch",
    });

    collectService.setItemAsFavorite("resource", {
      text: "cmdb",
      to: "/cmdb",
    });

    collectService.setItemAsFavorite("resource", {
      text: "主机",
      to: "/host",
    });

    expect(collectService.getFavoritesById("resource")).toEqual([
      { text: "主机", to: "/host" },
      { text: "cmdb", to: "/cmdb" },
      { text: "交换机", to: "/switch" },
    ]);

    expect(
      collectService.moveFavoriteTo("resource", {
        from: { text: "主机", to: "/host" },
        to: { text: "主机", to: "/host" },
        direction: DRAG_DIRECTION.Left,
      })
    ).toEqual([
      { text: "主机", to: "/host" },
      { text: "cmdb", to: "/cmdb" },
      { text: "交换机", to: "/switch" },
    ]);

    expect(
      collectService.moveFavoriteTo("resource", {
        from: {
          text: "交换机",
          to: "/switch",
        },
        to: {
          text: "cmdb",
          to: "/cmdb",
        },
        direction: DRAG_DIRECTION.Left,
      })
    ).toEqual([
      { text: "主机", to: "/host" },
      { text: "交换机", to: "/switch" },
      { text: "cmdb", to: "/cmdb" },
    ]);

    expect(
      collectService.moveFavoriteTo("resource", {
        from: {
          text: "主机",
          to: "/host",
        },
        to: {
          text: "交换机",
          to: "/switch",
        },
        direction: DRAG_DIRECTION.Right,
      })
    ).toEqual([
      { text: "交换机", to: "/switch" },
      { text: "主机", to: "/host" },
      { text: "cmdb", to: "/cmdb" },
    ]);
  });

  test("should work with cache promise", async () => {
    const collectService = new CollectService(5);

    mockListCollectionApi.mockResolvedValueOnce({
      module: "sidebarMenuCollect",
      collectionName: "monitor",
      payloads: [
        {
          name: "集群",
          to: "/cluster",
          extInfo: { text: "集群", to: "/cluster" },
        },
      ],
    } as never);

    collectService.fetchFavorites("monitor");

    expect(mockListCollectionApi).toHaveBeenCalledTimes(1);

    await collectService.fetchFavorites("monitor");

    expect(mockListCollectionApi).toHaveBeenCalledTimes(1);
  });
});
