大型表格

## Examples

### Basic

```yaml preview
- brick: eo-next-table
  events:
    page.change:
      - action: console.log
    page.size.change:
      - action: console.log
  properties:
    pagination:
      pageSizeOptions:
        - 5
        - 10
        - 20
    columns:
      - dataIndex: name
        key: name
        title: Name
        headerBrick:
          useBrick:
            brick: span
            properties:
              style:
                color: red
              textContent: <% DATA.title %>
        useBrick:
          - brick: span
            properties:
              style:
                color: pink
              textContent: <% DATA.cellData %>
      - dataIndex: age
        key: age
        title: Age
      - dataIndex: address
        key: address
        title: Address
    dataSource:
      pageSize: 5
      page: 1
      list:
        - key: 0
          name: Jack
          age: 18
          address: Guangzhou
        - key: 1
          name: Alex
          age: 20
          address: Shanghai
        - key: 2
          name: Lucy
          age: 16
          address: Yunnan
        - key: 3
          name: Sam
          age: 28
          address: Guangzhou
        - key: 4
          name: Bob
          age: 35
          address: Hainan
        - key: 5
          name: Ava
          age: 23
          address: Beijing
        - key: 6
          name: Sophia
          age: 20
          address: Shanghai
        - key: 7
          name: Charlotte
          age: 33
          address: Chongqing
        - key: 8
          name: Mia
          age: 18
          address: Chengdu
        - key: 9
          name: Noah
          age: 38
          address: Hainan
        - key: 10
          name: William
          age: 16
          address: Taiwan
```

### Front Search

```yaml preview
- brick: eo-search-bar
  children:
    - brick: eo-search
      slot: start
      properties:
        placeholder: Enter keyword
      events:
        search:
          target: "#table"
          method: search
          args:
            - q: <% EVENT.detail %>
- brick: eo-next-table
  events:
    page.change:
      - action: console.log
    page.size.change:
      - action: console.log
  properties:
    id: table
    searchFields:
      - address
    pagination:
      pageSizeOptions:
        - 5
        - 10
        - 20
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
    dataSource:
      pageSize: 5
      page: 1
      list:
        - key: 0
          name: Jack
          age: 18
          address: Guangzhou
        - key: 1
          name: Alex
          age: 20
          address: Shanghai
        - key: 2
          name: Lucy
          age: 16
          address: Yunnan
        - key: 3
          name: Sam
          age: 28
          address: Guangzhou
        - key: 4
          name: Bob
          age: 35
          address: Hainan
        - key: 5
          name: Ava
          age: 23
          address: Beijing
        - key: 6
          name: Sophia
          age: 20
          address: Shanghai
        - key: 7
          name: Charlotte
          age: 33
          address: Chongqing
        - key: 8
          name: Mia
          age: 18
          address: Chengdu
        - key: 9
          name: Noah
          age: 38
          address: Hainan
        - key: 10
          name: William
          age: 16
          address: Taiwan
```

### Row Selection

```yaml preview
- brick: eo-next-table
  events:
    row.select:
      - action: console.log
  properties:
    rowSelection: true
    pagination:
      pageSizeOptions:
        - 5
        - 10
        - 20
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
    dataSource:
      pageSize: 5
      page: 1
      list:
        - key: 0
          name: Jack
          age: 18
          address: Guangzhou
        - key: 1
          name: Alex
          age: 20
          address: Shanghai
        - key: 2
          name: Lucy
          age: 16
          address: Yunnan
        - key: 3
          name: Sam
          age: 28
          address: Guangzhou
        - key: 4
          name: Bob
          age: 35
          address: Hainan
        - key: 5
          name: Ava
          age: 23
          address: Beijing
        - key: 6
          name: Sophia
          age: 20
          address: Shanghai
        - key: 7
          name: Charlotte
          age: 33
          address: Chongqing
        - key: 8
          name: Mia
          age: 18
          address: Chengdu
        - key: 9
          name: Noah
          age: 38
          address: Hainan
        - key: 10
          name: William
          age: 16
          address: Taiwan
```
