import { describe, test, expect } from "@jest/globals";
import { updateRoute } from "./index.js";
import { mockData } from "./mockData.js";

describe("basic", () => {
  test("basic", () => {
    const result = updateRoute(mockData as any);
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "context": "[{"name":"DATA0","resolve":{"useProvider":"providers-of-cmdb.instance-api-post-search-v3","args":["DEVELOPMENT_ENVS",{"fields":["openApiIP","openApiPort","accessKey","secretKey","protocol","previewIP"],"page":1,"pageSize":3000}]}},{"name":"test2","path":"root","value":"test2"},{"name":"a","path":""}]",
          "instanceId": "5e653a1459032",
          "objectId": "STORYBOARD_ROUTE",
        },
        {
          "brick": "containers.tab-list",
          "context": null,
          "instanceId": "5f81a29b25a4b",
          "mountPoint": "bricks",
          "objectId": "STORYBOARD_BRICK",
          "properties": "{"activeTabPanel":0,"size":"small","slotType":"bricks","tabs":[{"key":"Tab1","text":"Tab1","panel":"Tab1"},{"disabled":true,"key":"Tab2","text":"Tab2","panel":"Tab2"},{"badgeConf":{"color":"red","count":100,"dot":true},"key":"Tab3","text":"Tab3","panel":"Tab3"}],"dataset":{"testid":"tabs-container-normal"}}",
        },
        {
          "instanceId": "5f81a29b5b60f",
          "mountPoint": "Tab1",
        },
        {
          "brick": "div",
          "context": null,
          "instanceId": "5f81a29b5b60f",
          "lifeCycle": "{"useResolves":[{"useProvider":"providers-of-cmdb.instance-api-post-search-v3","args":["DEVELOPMENT_ENVS",{"fields":["openApiIP","openApiPort","accessKey","secretKey","protocol","previewIP"],"page":1,"pageSize":3000}],"transform":{"textContent":"<% DATA.list[0].openApiIP %>"},"dataUid":0}]}",
          "mountPoint": "Tab1",
          "objectId": "STORYBOARD_BRICK",
          "properties": "{"textContent":"<% CTX.DATA0.list[0].openApiIP %>"}",
        },
        {
          "brick": "form.general-select",
          "context": null,
          "events": "{"change":"[{\\"action\\":\\"console.log\\",\\"args\\":[\\"gender\\",\\"<% EVENT.detail.value %>\\"]}]"}",
          "instanceId": "5f82954ebae5b",
          "mountPoint": "content",
          "objectId": "STORYBOARD_BRICK",
          "properties": "{"emptyOption":{"label":"不分性别","value":""},"inputStyle":{"width":120},"label":"性别","name":"gender","options":[{"label":"男","value":"male"},{"label":"女","value":"female"}],"multiple":true,"placeholder":"请选择性别","value":"female","dataset":{"testid":"basic-usage-demo"}}",
        },
        {
          "brick": "containers.general-tag-list",
          "context": null,
          "events": "{"checked":"{\\"action\\":\\"console.log\\",\\"args\\":[\\"tag.close\\",\\"\${EVENT.detail.item}\\",\\"<% EVENT.detail.list %>\\"]}","tag.click":{"action":"console.log","args":["tag.click","\${EVENT.detail}"]}}",
          "instanceId": "5f8299196d0ab",
          "mountPoint": "content",
          "objectId": "STORYBOARD_BRICK",
          "properties": "{"closable":true,"showCard":false,"list":[{"disabled":true,"key":"p1","label":"紧急变更"},{"disabled":true,"key":"p2","label":"计划变更"},{"key":"p3","label":"发布流程"},{"key":"p4","label":"发布流程"},{"key":"p5","label":"发布计划"},{"key":"p6","label":"测试计划"}],"dataset":{"testid":"tag"}}",
        },
        {
          "instanceId": "5f81a29b81a2b",
          "mountPoint": "Tab2",
        },
        {
          "brick": "div",
          "context": null,
          "instanceId": "5f81a29b81a2b",
          "mountPoint": "Tab2",
          "objectId": "STORYBOARD_BRICK",
        },
        {
          "instanceId": "5f81a29ba9427",
          "mountPoint": "Tab3",
        },
        {
          "brick": "div",
          "context": null,
          "instanceId": "5f81a29ba9427",
          "mountPoint": "Tab3",
          "objectId": "STORYBOARD_BRICK",
        },
      ]
    `);
  });
});
