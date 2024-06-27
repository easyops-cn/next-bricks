信息类卡片 —— 通用卡片

## Examples

### Basic

```yaml preview
brick: eo-card-item
properties:
  style:
    width: 300px
  hasHeader: true
  auxiliaryText: 初级应用
  cardTitle: 资源监控微应用
  description: 资源监控微应用相关前后台
  url: /test
  target: _blank
  avatar:
    icon:
      lib: easyops
      category: default
      icon: monitor
    color: "#167be0"
    size: 20
    bgColor: var(--theme-geekblue-background)
  actions:
    - icon:
        lib: antd
        theme: outlined
        icon: star
      isDropdown: false
      event: collect
    - icon:
        lib: antd
        icon: copy
        theme: outlined
      text: 复制链接
      isDropdown: true
      event: copy
    - icon:
        lib: antd
        icon: download
        theme: outlined
      text: 下载
      isDropdown: true
      disabled: true
      event: download
```

### showActions

```yaml preview
brick: eo-card-item
properties:
  style:
    width: 300px
  hasHeader: true
  auxiliaryText: 初级应用
  cardTitle: 资源监控微应用
  description: 资源监控微应用相关前后台
  avatar:
    icon:
      lib: easyops
      category: default
      icon: monitor
    color: "#167be0"
    size: 20
    bgColor: var(--theme-geekblue-background)
  actions:
    - icon:
        lib: antd
        theme: outlined
        icon: star
      isDropdown: false
      event: collect
    - icon:
        lib: antd
        icon: copy
        theme: outlined
      text: 复制链接
      isDropdown: true
      event: copy
    - icon:
        lib: antd
        icon: download
        theme: outlined
      text: 下载
      isDropdown: true
      disabled: true
      event: download
  showActions: hover
```

### Single Expanded Area

```yaml preview gap
- brick: eo-card-item
  properties:
    style:
      width: 300px
    hasHeader: true
    auxiliaryText: 初级应用
    cardTitle: 资源监控微应用
    description: 资源监控微应用相关前后台
    avatar:
      icon:
        lib: easyops
        category: default
        icon: monitor
      color: "#167be0"
      size: 20
      bgColor: var(--theme-geekblue-background)
  slots:
    expanded-area-1:
      type: bricks
      bricks:
        - brick: eo-tag-list
          properties:
            size: small
            list:
              - text: IT 资源管理
                key: IT_resource_management
                color: gray
              - text: 资源套餐
                key: resource_package
                color: gray
              - text: 存储设备
                key: storage_device
                color: gray
- brick: eo-card-item
  properties:
    style:
      width: 300px
    hasHeader: true
    auxiliaryText: 初级应用
    cardTitle: 资源监控微应用
    description: 资源监控微应用相关前后台
    avatar:
      icon:
        lib: easyops
        category: default
        icon: monitor
      color: "#167be0"
      size: 20
      bgColor: var(--theme-geekblue-background)
  slots:
    expanded-area-2:
      type: bricks
      bricks:
        - brick: eo-flex-layout
          properties:
            style:
              width: 100%
            justifyContent: space-between
            alignItems: center
          children:
            - brick: span
              properties:
                textContent: 张元 更新于 2 小时前
                style:
                  color: var(--text-color-secondary)
            - brick: eo-switch
              properties:
                size: small
```

### Multiple Expanded Area

```yaml preview gap
- brick: eo-card-item
  properties:
    style:
      width: 300px
    hasHeader: true
    auxiliaryText: 初级应用
    cardTitle: 资源监控微应用
    description: 资源监控微应用相关前后台
    avatar:
      icon:
        lib: easyops
        category: default
        icon: monitor
      color: "#167be0"
      size: 20
      bgColor: var(--theme-geekblue-background)
  slots:
    expanded-area-1:
      type: bricks
      bricks:
        - brick: eo-tag-list
          properties:
            size: small
            list:
              - text: IT 资源管理
                key: IT_resource_management
                color: gray
              - text: 资源套餐
                key: resource_package
                color: gray
              - text: 存储设备
                key: storage_device
                color: gray
    expanded-area-2:
      type: bricks
      bricks:
        - brick: eo-flex-layout
          properties:
            style:
              width: 100%
            justifyContent: space-between
            alignItems: center
          children:
            - brick: span
              properties:
                textContent: 张元 更新于 2 小时前
                style:
                  color: var(--text-color-secondary)
            - brick: eo-switch
              properties:
                size: small
```

### Cover

```yaml preview
- brick: eo-card-item
  properties:
    style:
      width: 280px
    hasCover: true
    coverImage: https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png
    cardTitle: 信息卡片
    description: 这是一只可爱的北极熊
    url: /test
    target: _blank
- brick: eo-card-item
  properties:
    style:
      width: 280px
    hasCover: true
    coverColor: "#167be0"
    cardTitle: 资源监控微应用
    description: 资源监控微应用相关前后台
    url: /test
    target: _blank
    avatarPosition: cover
    avatar:
      icon:
        lib: easyops
        category: default
        icon: monitor
      color: "#fff"
    actions:
      - icon:
          lib: antd
          theme: outlined
          icon: star
          startColor: "#fff"
          endColor: "#fff"
        isDropdown: false
        event: collect
      - icon:
          lib: antd
          icon: copy
          theme: outlined
        text: 复制链接
        isDropdown: true
        event: copy
      - icon:
          lib: antd
          icon: download
          theme: outlined
        text: 下载
        isDropdown: true
        disabled: true
        event: download
```

### cardStyle

```yaml preview
- brick: eo-card-item
  properties:
    style:
      width: 280px
    cardStyle:
      backgroundColor: var(--palette-gray-blue-6)
    cardTitle: 信息卡片
    description: 这是一只可爱的北极熊
```

### Style type

```yaml preview
brick: eo-card-item
properties:
  styleType: grayish
  style:
    width: 300px
  cardTitle: 资源监控微应用
  description: 资源监控微应用相关前后台
  url: /test
  target: _blank
  avatar:
    icon:
      lib: easyops
      category: default
      icon: monitor
    size: 20
```

### selected

```yaml preview
- brick: eo-card-item
  properties:
    selected: true
    style:
      width: 300px
    cardTitle: 资源监控微应用
    description: 资源监控微应用相关前后台
    avatar:
      icon:
        lib: easyops
        category: default
        icon: monitor
      size: 20
- brick: eo-card-item
  properties:
    styleType: grayish
    selected: true
    style:
      width: 300px
    cardTitle: 资源监控微应用
    description: 资源监控微应用相关前后台
    avatar:
      icon:
        lib: easyops
        category: default
        icon: monitor
      size: 20
```

### Tag

```yaml preview
- brick: div
  properties:
    textContent: Text Tag
    style:
      marginBottom: 10px
- brick: eo-grid-layout
  properties:
    gap: 16px
    columns: 4
  children:
    - brick: eo-card-item
      properties:
        tagConfig:
          text: 禁用
          bgColor: gray
        cardTitle: 资源监控微应用
        description: 资源监控微应用相关前后台
    - brick: eo-card-item
      properties:
        tagConfig:
          text: 蓝色
          bgColor: blue
        cardTitle: 资源监控微应用
        description: 资源监控微应用相关前后台
    - brick: eo-card-item
      properties:
        tagConfig:
          text: 绿色
          bgColor: green
        cardTitle: 资源监控微应用
        description: 资源监控微应用相关前后台
    - brick: eo-card-item
      properties:
        tagConfig:
          text: 黄色
          bgColor: yellow
        cardTitle: 资源监控微应用
        description: 资源监控微应用相关前后台
    - brick: eo-card-item
      properties:
        tagConfig:
          text: 红色
          bgColor: red
        cardTitle: 资源监控微应用
        description: 资源监控微应用相关前后台
    - brick: eo-card-item
      properties:
        tagConfig:
          text: 青色
          bgColor: cyan
        cardTitle: 资源监控微应用
        description: 资源监控微应用相关前后台
    - brick: eo-card-item
      properties:
        tagConfig:
          text: 灰蓝色
          bgColor: grayblue
        cardTitle: 资源监控微应用
        description: 资源监控微应用相关前后台
    - brick: eo-card-item
      properties:
        tagConfig:
          text: 紫色
          bgColor: purple
        cardTitle: 资源监控微应用
        description: 资源监控微应用相关前后台
    - brick: eo-card-item
      properties:
        tagConfig:
          text: 自定义
          bgColor: "rgb(228 236 183)"
          color: "#000"
        cardTitle: 资源监控微应用
        description: 资源监控微应用相关前后台
- brick: div
  properties:
    textContent: Icon Tag
    style:
      margin: 10px
- brick: eo-grid-layout
  properties:
    gap: 16px
    columns: 4
  children:
    - brick: eo-card-item
      properties:
        tagConfig:
          icon:
            lib: antd
            icon: info-circle
            theme: outlined
          bgColor: blue
        cardTitle: 资源监控微应用
        description: 资源监控微应用相关前后台
        url: /test
        target: _blank
    - brick: eo-card-item
      properties:
        tagConfig:
          icon:
            lib: antd
            icon: check-circle
            theme: outlined
          bgColor: green
        cardTitle: 资源监控微应用
        description: 资源监控微应用相关前后台
        url: /test
        target: _blank
    - brick: eo-card-item
      properties:
        tagConfig:
          icon:
            lib: antd
            icon: info-circle
            theme: outlined
          bgColor: yellow
        cardTitle: 资源监控微应用
        description: 资源监控微应用相关前后台
        url: /test
        target: _blank
    - brick: eo-card-item
      properties:
        tagConfig:
          icon:
            lib: antd
            icon: close-circle
            theme: outlined
          bgColor: red
        cardTitle: 资源监控微应用
        description: 资源监控微应用相关前后台
        url: /test
        target: _blank
    - brick: eo-card-item
      events:
        tag.click:
          - action: message.success
            args:
              - 收藏成功
          - target: _self
            properties:
              tagConfig:
                icon:
                  lib: antd
                  icon: star
                  theme: filled
                  startColor: yellow
                  endColor: yellow
                bgColor: blue
      properties:
        tagConfig:
          icon:
            lib: antd
            icon: star
            theme: filled
          bgColor: blue
        cardTitle: 资源监控微应用
        description: 资源监控微应用相关前后台
        url: /test
        target: _blank
```
