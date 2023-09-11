import { describe, test, expect, jest } from "@jest/globals";
import { CollectService } from "./CollectService.js";

jest.mock("@next-core/easyops-runtime", () => ({
  auth: {
    getAuth: jest.fn().mockReturnValue({ username: "easyops" }),
  },
}));

describe("CollectService", () => {
  const collectService = new CollectService(2);
  test("should work", () => {
    expect(collectService.getFavoritesById("monitor")).toEqual([]);

    collectService.setItemAsFavorite("monitor", {
      text: "集群",
      to: "/cluster",
    });

    expect(collectService.getFavoritesById("monitor")).toEqual([
      { text: "集群", to: "/cluster" },
    ]);

    collectService.setItemAsFavorite("monitor", {
      text: "主机",
      to: "/host",
    });

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
      }),
    ).toEqual(true);

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
});
