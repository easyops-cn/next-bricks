import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./";
import { useUserInfoByNameOrInstanceId } from "./useUserInfoByNameOrInstanceId.js";
import { EoEasyopsAvatar } from "./index.js";

jest.mock("@next-core/theme", () => ({}));
jest.mock("./useUserInfoByNameOrInstanceId.js");

(useUserInfoByNameOrInstanceId as jest.Mock).mockReturnValue({
  user: {
    "#showKey": ["easyops", "carrel6"],
    instanceId: "5c6bbc5010976",
    name: "easyops",
    nickname: "haha",
    user_email: "test@easyops.cn",
    user_icon: "/test.jpg",
    user_tel: "123456789",
    state: "valid",
    user_memo: "memo",
  },
  loading: false,
});

describe("eo-easyops-avatar", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "eo-easyops-avatar"
    ) as EoEasyopsAvatar;
    element.nameOrInstanceId = "easyops";
    element.bordered = true;

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);
    expect(element.shadowRoot?.innerHTML).toMatchInlineSnapshot(
      `"<style>styles.shadow.css</style><eo-avatar src="/test.jpg" name="easyops" size="medium" bordered="" part="eo-avatar" exportparts="avatar, avatar-img, avatar-icon, avatar-text"></eo-avatar>"`
    );

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
