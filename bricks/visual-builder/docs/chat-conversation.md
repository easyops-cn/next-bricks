用于 Visual Builder 的智能聊天对话列表

## Examples

### Basic

````yaml preview
brick: visual-builder.chat-conversation
properties:
  messages:
    - role: user
      content: 生成一个主机列表页面
      key: 1
    - role: assistant
      content: |
        好的，我们来逐步确认页面的各个区块需求。

        1. **页头区**：您需要在这个区域放置什么内容？比如标题、横幅图片或者搜索框等。
        2. **全局操作区**：您希望有哪些全局操作的按钮？如您所示，已有“管理”、“刷新”、“新建”、“删除”、“执行”、“导入”和“导出”，这些都足够了吗？
        3. **标签导航区**：是否需要多个标签页？如果有，需要显示哪些内容或数据？
        4. **数据控制区**：对于搜索，需要哪些字段作为搜索条件？“最近访问”和“基础筛选”需要哪些具体筛选条件？
        5. **列表区**：列表中应显示主机的哪些属性？例如，是否显示`主机名`、`IP`、`供应商`等信息？是否需要编辑和删除功能？列表是否可排序？用户是否可以多选列表项？分页功能需要吗？

        请根据您的需求回答这些问题，或者告诉我哪些区块的默认设置即可。
      key: 2
    - role: user
      content: |
        不包含页头区。
        全局操作区包含新建、删除两个按钮。数据控制区提供搜索功能，用户可以按IP搜索。列表区展示每条主机的IP、主机名、运营状态、创建时间。
        其他区块不需要。
      key: 3
    - role: assistant
      content: |
        了解了您的需求，以下是根据您的回答总结的最终需求：

        ```json
        {
          "requirement": "生成一个主机列表页面，不包含页头区。全局操作区包含'新建'和'删除'两个按钮。数据控制区提供搜索功能，用户可以按IP进行搜索。列表区展示每条主机的IP、主机名、运营状态和创建时间。其他区块如标签导航区、数据控制区的其他功能（如最近访问、基础筛选）以及列表区的编辑、排序、选择和分页功能都不需要。"
        }
        ```

        ```easy_cmd_vb_block_page
        [{"uuid": "96e55a2a556049eba1e5c1a8cd1e6ef3", "seq": 0, "conversationId": "db2e41dc-932c-4f76-aad4-19da09bea036", "brick": "", "brick_desc": "包含新建和删除按钮", "user_desc": "", "storyboard": null, "type": "block", "name": "全局操作区", "children": ["d7ef5946776445ba96ebf2beb2f680a5", "da3e65baf08d4fc28b938d1efd768265"], "parent": "", "properties": null, "hasContainer": false}, {"uuid": "d7ef5946776445ba96ebf2beb2f680a5", "seq": 0, "conversationId": "db2e41dc-932c-4f76-aad4-19da09bea036", "brick": "", "brick_desc": "生成一个新建按钮，textContent为新建，type为primary（主要按钮），大小为medium，形状为默认方形，非禁用状态，无危险状态，无图标，无tooltip", "user_desc": "", "storyboard": null, "type": "item", "name": "新建", "children": [], "parent": "96e55a2a556049eba1e5c1a8cd1e6ef3", "properties": null, "hasContainer": false}, {"uuid": "da3e65baf08d4fc28b938d1efd768265", "seq": 1, "conversationId": "db2e41dc-932c-4f76-aad4-19da09bea036", "brick": "", "brick_desc": "生成一个删除按钮，textContent为删除，type为danger（危险按钮），大小为medium，形状为默认方形，非禁用状态，有危险状态，无图标，无tooltip", "user_desc": "", "storyboard": null, "type": "item", "name": "删除", "children": [], "parent": "96e55a2a556049eba1e5c1a8cd1e6ef3", "properties": null, "hasContainer": false}, {"uuid": "92c07992c61d4f43b41e6a56e500622a", "seq": 1, "conversationId": "db2e41dc-932c-4f76-aad4-19da09bea036", "brick": "", "brick_desc": "提供按IP搜索的功能", "user_desc": "", "storyboard": null, "type": "block", "name": "数据控制区", "children": ["e2f986f8379f4fd4bd3627855051c50e"], "parent": "", "properties": null, "hasContainer": true}, {"uuid": "e2f986f8379f4fd4bd3627855051c50e", "seq": 0, "conversationId": "db2e41dc-932c-4f76-aad4-19da09bea036", "brick": "eo-search", "brick_desc": "提供按IP地址搜索的功能，允许用户输入IP地址进行精确匹配或模糊搜索", "user_desc": "", "storyboard": null, "type": "item", "name": "IP搜索", "children": [], "parent": "92c07992c61d4f43b41e6a56e500622a", "properties": null, "hasContainer": false}, {"uuid": "a66ff62152ea4b808f2e5d957c24b2ef", "seq": 2, "conversationId": "db2e41dc-932c-4f76-aad4-19da09bea036", "brick": "", "brick_desc": "展示每条主机的供应商、主机名、MAC地址和操作系统", "user_desc": "", "storyboard": null, "type": "block", "name": "列表区", "children": ["8ed6175b7bc94b40b28f1f7687cb1a3a", "a52c680f3e364eff84fc169b8d8c191e", "c04fef1e64ca4200a5843b579f71fbcf", "0b485a8a1b924d54adb8914763096723"], "parent": "", "properties": null, "hasContainer": true}, {"uuid": "8ed6175b7bc94b40b28f1f7687cb1a3a", "seq": 0, "conversationId": "db2e41dc-932c-4f76-aad4-19da09bea036", "brick": "", "brick_desc": "使用文本构件，显示供应商信息。", "user_desc": "", "storyboard": null, "type": "item", "name": "供应商", "children": [], "parent": "a66ff62152ea4b808f2e5d957c24b2ef", "properties": null, "hasContainer": false}, {"uuid": "a52c680f3e364eff84fc169b8d8c191e", "seq": 1, "conversationId": "db2e41dc-932c-4f76-aad4-19da09bea036", "brick": "", "brick_desc": "使用链接构件，显示主机名，跳转到主机详情页面。", "user_desc": "", "storyboard": null, "type": "item", "name": "主机名", "children": [], "parent": "a66ff62152ea4b808f2e5d957c24b2ef", "properties": null, "hasContainer": false}, {"uuid": "c04fef1e64ca4200a5843b579f71fbcf", "seq": 2, "conversationId": "db2e41dc-932c-4f76-aad4-19da09bea036", "brick": "", "brick_desc": "使用文本构件，显示MAC地址信息。", "user_desc": "", "storyboard": null, "type": "item", "name": "物理地址", "children": [], "parent": "a66ff62152ea4b808f2e5d957c24b2ef", "properties": null, "hasContainer": false}, {"uuid": "0b485a8a1b924d54adb8914763096723", "seq": 3, "conversationId": "db2e41dc-932c-4f76-aad4-19da09bea036", "brick": "", "brick_desc": "使用文本构件，显示操作系统类型信息。", "user_desc": "", "storyboard": null, "type": "item", "name": "操作系统类型", "children": [], "parent": "a66ff62152ea4b808f2e5d957c24b2ef", "properties": null, "hasContainer": false}]
        ```

        ```easy_cmd_vb_block_storyboard
        {"uuid": "d7ef5946776445ba96ebf2beb2f680a5", "storyboard": {"brick": "eo-button", "events": {"click": []}, "properties": {"textContent": "新建", "type": "primary", "size": "medium", "shape": "default", "buttonStyle": {"padding": "0 8px"}, "dataset": {"testid": "create-eo-button"}}}}
        ```

        ```easy_cmd_vb_block_storyboard
        {"uuid": "da3e65baf08d4fc28b938d1efd768265", "storyboard": {"brick": "eo-button", "events": {"click": []}, "properties": {"textContent": "删除", "type": "danger", "size": "medium", "buttonStyle": {"padding": "0px 8px"}, "danger": true, "dataset": {"testid": "delete-button"}, "properties": {"danger": true, "type": "danger"}}}}
        ```

        ```easy_cmd_vb_block_storyboard
        {"uuid": "92c07992c61d4f43b41e6a56e500622a", "storyboard": {"brick": "eo-form", "properties": {"layout": "inline"}}}
        ```

        ```easy_cmd_vb_block_storyboard
        {"uuid": "e2f986f8379f4fd4bd3627855051c50e", "storyboard": {"brick": "eo-search", "events": {"search": []}, "properties": {"placeholder": "按IP地址搜索", "dataset": {"testid": "search"}}}}
        ```

        ```easy_cmd_vb_block_storyboard
        {"uuid": "a66ff62152ea4b808f2e5d957c24b2ef", "storyboard": {"brick": "eo-next-table", "properties": {"columns": [{"title": "供应商", "dataIndex": "provider", "useChildren": "[provider]"}, {"title": "主机名", "dataIndex": "hostname", "useChildren": "[hostname]"}, {"title": "MAC地址", "dataIndex": "_mac", "useChildren": "[_mac]"}, {"title": "操作系统", "dataIndex": "osSystem", "useChildren": "[osSystem]"}], "dataSource": "<% CTX.hostList %>"}, "context": [{"name": "hostList", "value": {"list": [{"provider": "供应商A", "hostname": "主机1", "_mac": "00:11:22:33:44:55", "osSystem": "Windows 10"}, {"provider": "供应商B", "hostname": "主机2", "_mac": "AA:BB:CC:DD:EE:FF", "osSystem": "Ubuntu 20.04"}], "total": 2}}]}}
        ```

        ```easy_cmd_vb_block_storyboard
        {"uuid": "8ed6175b7bc94b40b28f1f7687cb1a3a", "storyboard": {"brick": "eo-text", "properties": {"textContent": "<% DATA.cellData %>", "dataset": {"testid": "textContent"}}, "slot": "[provider]"}}
        ```

        ```easy_cmd_vb_block_storyboard
        {"uuid": "a52c680f3e364eff84fc169b8d8c191e", "storyboard": {"brick": "eo-link", "events": {"click": []}, "properties": {"url": "<% DATA.cellData %>", "target": "_blank", "showIcon": true, "textContent": "<% DATA.cellData %>", "dataset": {"testid": "nodeUrl"}}, "slot": "[hostname]"}}
        ```

        ```easy_cmd_vb_block_storyboard
        {"uuid": "c04fef1e64ca4200a5843b579f71fbcf", "storyboard": {"brick": "eo-text", "properties": {"textContent": "<% DATA.cellData %>", "dataset": {"testid": "textContent"}}, "slot": "[_mac]"}}
        ```

        ```easy_cmd_vb_block_storyboard
        {"uuid": "0b485a8a1b924d54adb8914763096723", "storyboard": {"brick": "eo-text", "properties": {"textContent": "<% DATA.cellData %>", "dataset": {"testid": "textContent"}}, "slot": "[osSystem]"}}
        ```
      key: 4
      partial: true
events:
  storyboard.update:
    action: console.log
````

### Errors

```yaml preview
brick: visual-builder.chat-conversation
properties:
  messages:
    - role: user
      content: Create a page to show server host list.
      key: 1
    - role: assistant
      content: OK, let's do it
      key: 2
      failed: true
    - role: assistant
      content: Internal Server Error
      key: 3
      failed: true
```
