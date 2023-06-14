通用表格构件。

```yaml preveiw
- brick: advanced.general-table
  events:
    filter.update:
      action: console.log
    page.update:
      action: console.log
    select.update:
      action: console.log
    select.update.args:
      action: console.log
  properties:
    columns:
      - dataIndex: name
        key: name
        title: Name
      - dataIndex: age
        key: age
        title: Age
      - dataIndex: address
        key: address
        title: Address
      - dataIndex: tags
        key: tags
        title: Tags
    dataSource:
      list:
        - address: New York No. 1 Lake Park
          age: 32
          id: "1"
          name: John Brown
          tags:
            - nice
            - good
        - address: London No. 1 Lake Park
          age: 42
          id: "2"
          name: Jim Green
          tags:
            - loser
            - bad
      page: 1
      pageSize: 10
      total: 2
    hiddenColumns:
      - name
    rowKey: id
    rowSelection: true
    showCard: false
```

## Examples

### Expand & Sort

```yaml preveiw
- brick: advanced.general-table
  events:
    expand.rows.change:
      action: console.log
    row.expand:
      action: console.log
    sort.update:
      - properties:
          expandedRowKeys: []
        target: "#expandable-and-sortable-demo"
  properties:
    columns:
      - dataIndex: name
        sorter: true
        title: Pod 名称
      - dataIndex: status
        title: 状态
      - dataIndex: ip
        title: 实例 IP
    dataSource:
      list:
        - containerList:
            - name: container-1
              number: 1
            - name: container-2
              number: 2
          id: "1"
          ip: 192.168.100.1
          name: RG-deployment-1
          status: 运行中
        - containerList:
            - name: container-5
              number: 5
          id: "3"
          ip: 192.168.100.3
          name: RG-deployment-3
          status: 推出成功
        - containerList:
            - name: container-3
              number: 3
            - name: container-4
              number: 4
          id: "2"
          ip: 192.168.100.2
          name: RG-deployment-2
          status: 准备中
      page: 1
      pageSize: 10
      total: 3
    expandedRowBrick:
      useBrick:
        brick: advanced.general-table
        properties:
          columns:
            - dataIndex: name
              title: 容器名称
            - dataIndex: number
              title: 重启次数
            - dataIndex: operate
              key: operate
              title: 操作
              useBrick:
                brick: basic.general-link
                events:
                  click:
                    action: console.log
                    args:
                      - <% DATA.rowData %>
                properties:
                  icon:
                    icon: tools
                    lib: fa
                    prefix: fas
          configProps:
            bordered: false
          dataSource:
            list: <% DATA.rowData.containerList %>
          pagination: false
          showCard: false
          style:
            background: "#f5f5f5"
    rowKey: id
```

### Custom Expand Icon

```yaml preview
- brick: advanced.general-table
  events:
    expand.rows.change:
      action: console.log
    row.expand:
      action: console.log
  properties:
    columns:
      - dataIndex: name
        title: 名称
      - dataIndex: resourcePool
        title: 所属资源池
      - dataIndex: ip
        title: 路由地址
      - dataIndex: rulesDesc
        title: 转发规则
    dataSource:
      list:
        - id: "1"
          ip: 105.33.44.123
          name: 构建任务1
          resourcePool: pool1
          rules:
            - path: /cmdb
              port: 80
              service: cmdb-service
            - path: /tool
              port: 80
              service: tool
          rulesDesc: 点击查看两条转发规则
        - id: "2"
          ip: 105.33.44.122
          name: 构建任务2
          resourcePool: pool2
          rules:
            - path: /topboard
              port: 80
              service: topboard
          rulesDesc: 点击查看一条转发规则
      page: 1
      pageSize: 10
      total: 2
    expandIcon:
      collapsedIcon:
        icon: angle-double-up
        lib: fa
        prefix: fas
      expandedIcon:
        icon: angle-double-down
        lib: fa
        prefix: fas
    expandIconAsCell: false
    expandIconColumnIndex: 3
    expandedRowBrick:
      useBrick:
        - brick: presentational.general-descriptions
          properties:
            list:
              - label: "协议："
                text: HTTP
              - label: "监听端口："
                text: 8080
              - label: 系统
                text: Linus
              - label: 线程
                text: 8
    rowKey: id
```

### Cell Status

```yaml preview
- brick: advanced.general-table
  events:
    filter.update:
      action: console.log
    page.update:
      action: console.log
    select.update:
      action: console.log
    select.update.args:
      action: console.log
  properties:
    columns:
      - cellStatus:
          dataIndex: status
          mapping:
            - leftBorderColor: green
              value: success
            - leftBorderColor: red
              value: failed
            - leftBorderColor: orange
              value: warning
        dataIndex: branch
        title: 分支
        useBrick:
          brick: basic.general-link
          properties:
            textContent: <% DATA.cellData %>
      - dataIndex: id
        title: 编号
      - dataIndex: pipeline
        title: 流水线
      - dataIndex: status
        title: 状态
        useBrick:
          brick: basic.general-tag
          properties:
            textContent: <% DATA.cellData %>
    dataSource:
      list:
        - branch: develop
          id: "#7220"
          pipeline: contract-center / build_giraffe_sdk
          status: success
        - branch: master
          id: "#7221"
          pipeline: container / demo
          status: failed
        - branch: feature
          id: "#7222"
          pipeline: container / table
          status: warning
      page: 1
      pageSize: 10
      total: 3
    dataset:
      testid: cell-status-and-filter-demo
    filters:
      status:
        - failed
        - warning
    frontSearch: true
    rowKey: id
    shouldUpdateUrlParams: false
```

### Tree DataSource

```yaml preview
- brick: advanced.general-table
  events:
    select.update:
      action: console.log
  properties:
    columns:
      - dataIndex: name
        key: name
        title: Name
      - dataIndex: age
        key: age
        title: Age
      - dataIndex: address
        key: address
        title: Address
      - dataIndex: tags
        key: tags
        title: Tags
        useBrick:
          brick: basic.general-tag-list
          properties:
            showCard: false
            list: <% DATA.cellData %>
            color: var(--color-brand)
      - dataIndex: operate
        key: operate
        title: 操作
        useBrick:
          - brick: basic.general-link
            events:
              link.click:
                action: console.log
            properties:
              dataSource: <% DATA.rowData %>
              textContent: 查看
          - brick: basic.general-link
            events:
              link.click:
                action: console.log
            properties:
              dataSource: <% DATA.rowData %>
              textContent: 订阅警报
              style:
                marginLeft: 8px
          - brick: basic.general-link
            events:
              link.click:
                action: console.log
            properties:
              dataSource: <% DATA.rowData %>
              textContent: 删除
              labelColor: red
              style:
                marginLeft: 8px
    dataSource:
      list:
        - address: New York No. 1 Lake Park
          age: 60
          children:
            - address: New York No. 2 Lake Park
              age: 50
              children:
                - address: New York No. 3 Lake Park
                  age: 25
                  id: "111"
                  name: John Brown jr.
                  tags:
                    - nice
                    - good
              id: "11"
              name: John Brown
              tags:
                - nice
                - good
            - address: New York No. 3 Lake Park
              age: 45
              id: "22"
              name: Jimmy Brown
              tags:
                - nice
                - good
          id: "1"
          name: John Brown sr.
          tags:
            - nice
            - good
        - address: London No. 1 Lake Park
          age: 72
          children:
            - address: London No. 1 Lake Park
              age: 42
              id: dd
              name: Jim Green
              tags:
                - nice
                - good
          id: "2"
          name: Jim Green sr.
          tags:
            - loser
            - bad
        - address: Sidney No. 1 Lake Park
          age: 32
          id: "3"
          name: Joe Black
          tags:
            - teacher
            - lucky
            - lay
      page: 1
      pageSize: 10
      total: 7
    defaultExpandAllRows: true
    rowKey: id
    rowSelection: true
```

### Drag to Sort

```yaml preview
- brick: advanced.general-table
  events:
    row.drag:
      action: console.log
    select.update:
      action: console.log
  properties:
    columns:
      - dataIndex: packageName
        title: 包名称
      - dataIndex: installPath
        title: 部署路径
      - dataIndex: version
        title: 版本
    dataSource:
      list:
        - id: "1"
          installPath: /usr/local/easyops/container
          packageName: container
          version: 1.10.0
        - id: "2"
          installPath: /usr/local/easyops/webshell
          packageName: webshell
          version: 1.0.0
        - id: "3"
          installPath: /usr/local/easyops/nginx
          packageName: nginx
          version: 3.6.0
    dataset:
      testid: draggable-sort-demo
    pagination: false
    rowKey: id
    rowSelection: true
    showCard: false
    tableDraggable: true
```

### Frontend Search

```yaml preview
- brick: containers.general-card
  slots:
    "":
      bricks:
        - brick: form.general-input
          events:
            change:
              - action: console.log
              - method: filterSourceData
                target: "#front-search-table"
                args:
                  - detail:
                      q: <% EVENT.detail %>
          properties:
            placeholder: 输入关键字搜索
        - brick: advanced.general-table
          events:
            select.update:
              action: console.log
          properties:
            columns:
              - dataIndex: packageName
                title: 包名称
              - dataIndex: installPath
                title: 部署路径
              - dataIndex: version
                title: 版本
            dataSource:
              list:
                - id: "1"
                  installPath: /usr/local/easyops/container
                  packageName: container
                  version: 1.10.0
                - id: "2"
                  installPath: /usr/local/easyops/webshell
                  packageName: webshell
                  version: 1.0.0
                - id: "3"
                  installPath: /usr/local/easyops/nginx
                  packageName: nginx
                  version: 3.6.0
            dataset:
              testid: front-search-table
            frontSearch: true
            frontSearchFilterKeys:
              - packageName
            id: front-search-table
            pagination: false
            rowKey: id
            rowSelection: true
            shouldUpdateUrlParams: false
            showCard: false
```

### Content Scroll

```yaml preview
- brick: advanced.general-table
  events:
    select.update:
      action: console.log
  properties:
    columns:
      - dataIndex: packageName
        title: 包名称
      - dataIndex: installPath
        title: 部署路径
      - dataIndex: version
        title: 版本
      - dataIndex: description
        title: 描述
    dataSource:
      list:
        - description: >-
            some
            lonnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnng
            content
          id: "1"
          installPath: /usr/local/easyops/container
          packageName: container
          version: 1.10.0
        - description: some content
          id: "2"
          installPath: /usr/local/easyops/webshell
          packageName: webshell
          version: 1.0.0
        - description: some content
          id: "3"
          installPath: /usr/local/easyops/nginx
          packageName: nginx
          version: 3.6.0
    dataset:
      testid: scroll-demo
    rowKey: id
    scrollConfigs:
      x: true
```

### Checked

```yaml preview
- brick: advanced.general-table
  events:
    select.update:
      - action: console.log
        args:
          - "${EVENT.detail}"
  properties:
    columns:
      - dataIndex: name
        key: name
        title: 规则名称
    dataSource:
      list:
        - name: 用户测试
        - name: 账号测试
        - name: 安全测试
    rowKey: name
    rowSelection: true
    shouldRenderWhenUrlParamsUpdate: false
    shouldUpdateUrlParams: true
    showSelectInfo: true
```

### Merge Columns

```yaml preview
- brick: advanced.general-table
  properties:
    childrenColumnName: packages
    columns:
      - colSpanKey: ipColSpan
        dataIndex: ip
        rowSpanKey: ipRowSpan
        title: IP
        useBrick:
          brick: span
          properties:
            textContent: <% DATA.cellData || DATA.rowData.clusterName %>
      - colSpanKey: nameColSpan
        dataIndex: packageName
        title: 包名称
      - colSpanKey: pathColSpan
        dataIndex: installPath
        title: 部署路径
      - colSpanKey: versionColSpan
        dataIndex: version
        title: 版本
    dataSource:
      list:
        - clusterName: Lonnnnnnnnnnnnnnnnnnnnnnnnnng Cluster Name
          id: "1"
          ipColSpan: 4
          nameColSpan: 0
          packages:
            - id: 1-1
              installPath: /usr/local/easyops/container
              ip: 192.168.100.162
              packageName: container
              version: 1.10.0
            - id: 1-2
              installPath: /usr/local/easyops/webshell
              ip: 192.168.100.163
              ipRowSpan: 2
              packageName: webshell
              version: 1.0.0
            - id: 1-3
              installPath: /usr/local/easyops/nginx
              ip: 192.168.100.163
              ipRowSpan: 0
              packageName: nginx
              version: 3.6.0
          pathColSpan: 0
          versionColSpan: 0
    defaultExpandAllRows: true
    rowKey: id
```
