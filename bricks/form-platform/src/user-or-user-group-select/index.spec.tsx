import { describe, test, expect, jest } from "@jest/globals";
import { render, act, createEvent, fireEvent } from "@testing-library/react";
import "./";
import { EoUserOrUserGroupSelect } from "./index.js";
import {
  InstanceApi_postSearch,
  CmdbModels,
  CmdbObjectApi_getObjectRef,
} from "@next-api-sdk/cmdb-sdk";

const mockPostSearch = InstanceApi_postSearch as jest.Mock;
jest.mock("@next-api-sdk/cmdb-sdk");

jest.mock("@next-core/theme", () => ({}));
jest.mock("@next-core/runtime", () => {
  return {
    getAuth: jest.fn().mockReturnValue({ username: "easyops2" }),
    getV2RuntimeFromDll: jest.fn(),
  };
});

describe("eo-user-or-user-group-select", () => {
  test("basic usage", async () => {
    mockPostSearch.mockResolvedValue({
      list: [
        {
          instanceId: "59eea4ad40bf8",
          name: "easyops",
          nickname: "uwin",
        },
        {
          instanceId: ":59eea4ad40bw2",
          name: "test",
          nickname: "xxx",
        },
      ],
    } as never);
    (CmdbObjectApi_getObjectRef as jest.Mock).mockResolvedValue({
      data: [
        {
          objectId: "USER",
          view: {
            show_key: ["name", "nickname"],
          },
        },
        {
          objectId: "USER_GROUP",
          view: {
            show_key: ["name"],
          },
        },
      ],
    } as never);
    const element = document.createElement(
      "eo-user-or-user-group-select"
    ) as EoUserOrUserGroupSelect;

    Object.assign(element, {
      name: "user",
      label: "用户",
      query: {
        instanceId: { $in: ["59eea4ad40bf8", "59eea4ad40bw2"] },
      },
    });

    expect(element.shadowRoot).toBeFalsy();

    const mockValueChangeEvent = jest.fn();
    element.addEventListener("change", mockValueChangeEvent);

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);
    const select = element.shadowRoot?.querySelector("eo-select");

    await act(async () => {
      fireEvent.focus(select as HTMLElement);
    });

    expect(InstanceApi_postSearch).toBeCalled();

    await act(async () => {
      fireEvent.change(select as HTMLElement, {
        detail: { value: ["easyops", ":59eea4ad40bw2"] },
      });
    });
    expect(mockValueChangeEvent).toBeCalled();

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("basic usage multiple false", async () => {
    jest.useFakeTimers({
      legacyFakeTimers: true,
    });
    // jest.runOnlyPendingTimers();
    mockPostSearch.mockResolvedValue({
      list: [
        {
          instanceId: "59eea4ad40bf8",
          name: "easyops",
          nickname: "uwin",
        },
        {
          instanceId: ":59eea4ad40bw2",
          name: "test",
          nickname: "xxx",
        },
      ],
    } as never);
    const element = document.createElement(
      "eo-user-or-user-group-select"
    ) as EoUserOrUserGroupSelect;

    Object.assign(element, {
      name: "user",
      label: "用户",
      mergeUseAndUserGroup: true,
      isMultiple: false,
      value: [":59eea4ad40bw2"],
      staticList: ["easyops"],
      objectList: [
        {
          objectId: "USER",
          name: "用户",
          memo: "",
          protected: false,
          system: "",
          notifyDenied: false,
          view: {
            show_key: ["name", "nickname"],
            visible: true,
          },
        },
      ],
      query: {
        instanceId: { $in: ["59eea4ad40bf8", "59eea4ad40bw2"] },
      },
    });

    expect(element.shadowRoot).toBeFalsy();
    mockPostSearch.mockClear();

    act(() => {
      document.body.appendChild(element);
    });
    const select = element.shadowRoot?.querySelector("eo-select");
    expect(InstanceApi_postSearch).toBeCalledTimes(1);

    act(() => {
      fireEvent.focus(select as HTMLElement);
    });
    expect(InstanceApi_postSearch).toBeCalledTimes(3);

    act(() => {
      fireEvent(
        select as HTMLElement,
        new CustomEvent("search", { detail: { value: "easyops" } })
      );
    });
    expect(InstanceApi_postSearch).toBeCalledTimes(3);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  }, 6000);

  test("add me quickly", async () => {
    mockPostSearch.mockResolvedValue({
      list: [
        {
          instanceId: "59eea4ad40bf82",
          name: "easyops2",
          nickname: "uwin2",
        },
      ],
    } as never);
    (CmdbObjectApi_getObjectRef as jest.Mock).mockResolvedValue({
      data: [
        {
          objectId: "USER",
          view: {
            show_key: ["name", "nickname"],
          },
        },
        {
          objectId: "USER_GROUP",
          view: {
            show_key: ["name"],
          },
        },
      ],
    } as never);
    const element = document.createElement(
      "eo-user-or-user-group-select"
    ) as EoUserOrUserGroupSelect;

    Object.assign(element, {
      name: "user",
      label: "用户",
      hideAddMeQuickly: false,
    });

    expect(element.shadowRoot).toBeFalsy();

    const mockValueChangeEvent = jest.fn();
    element.addEventListener("change", mockValueChangeEvent);

    act(() => {
      document.body.appendChild(element);
    });
    const select = element.shadowRoot?.querySelector("eo-select");
    const addMeBtn = element.shadowRoot?.querySelector("eo-button");

    await act(async () => {
      fireEvent.click(addMeBtn as HTMLElement);
    });

    expect(InstanceApi_postSearch).toBeCalled();
    expect(mockValueChangeEvent).toBeCalled();

    mockValueChangeEvent.mockClear();

    await act(async () => {
      fireEvent.click(addMeBtn as HTMLElement);
    });

    // expect(mockValueChangeEvent).not.toBeCalled();

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
