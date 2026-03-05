---
tagName: eo-drawer
displayName: WrappedEoDrawer
description: 通用抽屉构件
category: container-display
source: "@next-bricks/containers"
---

# WrappedEoDrawer

> 通用抽屉构件

## 导入

```tsx
import { WrappedEoDrawer } from "@easyops/wrapped-components";
```

## Props

| 属性                | 类型                   | 必填 | 默认值    | 说明                                                                                      |
| ------------------- | ---------------------- | ---- | --------- | ----------------------------------------------------------------------------------------- |
| customTitle         | `string`               | -    | -         | 标题                                                                                      |
| subTitle            | `string`               | -    | -         | 副标题                                                                                    |
| width               | `number \| string`     | -    | `500`     | 宽度(placement为left，right时生效)                                                        |
| height              | `number \| string`     | -    | `378`     | 高度(placement为top，bottom时生效)                                                        |
| closable            | `boolean`              | -    | `true`    | 是否显示右上角的关闭按钮                                                                  |
| mask                | `boolean`              | -    | `true`    | 是否展示遮罩层                                                                            |
| maskClosable        | `boolean`              | -    | `true`    | 点击遮罩层是否关闭抽屉                                                                    |
| visible             | `boolean`              | -    | `false`   | 抽屉是否显示                                                                              |
| footerSlot          | `boolean`              | -    | `false`   | 是否存在底部插槽，启用后显示 footer 插槽区域                                              |
| placement           | `Placement`            | -    | `"right"` | 抽屉弹出方向，可选 "left" \| "right" \| "top" \| "bottom"                                 |
| scrollToTopWhenOpen | `boolean`              | -    | `true`    | 打开抽屉时内容区是否自动滚动到顶部（仅初始设置有效）                                      |
| maskStyle           | `object`               | -    | `{}`      | 自定义遮罩层的样式                                                                        |
| keyboard            | `boolean`              | -    | -         | 是否支持键盘 esc 关闭                                                                     |
| themeVariant        | `"default" \| "elevo"` | -    | -         | 主题变体，可选 "default" \| "elevo"，通过 CSS 属性选择器控制样式                          |
| stackable           | `boolean`              | -    | -         | 是否可堆叠，开启后每次打开抽屉会将新的抽屉置于上层（zIndex ++）（仅初始设置有效，已废弃） |

## Events

| 事件    | detail | 说明         |
| ------- | ------ | ------------ |
| onOpen  | -      | 抽屉开启事件 |
| onClose | -      | 抽屉关闭事件 |

## Methods

| 方法  | 参数 | 返回值 | 说明         |
| ----- | ---- | ------ | ------------ |
| open  | -    | `void` | 抽屉开启方法 |
| close | -    | `void` | 抽屉关闭方法 |

## Slots

| 名称       | 说明                       |
| ---------- | -------------------------- |
| -          | 抽屉内容插槽               |
| headerLeft | 头部左上角（标题右侧）     |
| extra      | 头部右上角（关闭按钮左侧） |
| footer     | 抽屉底部插槽               |

## Examples

### Basic

通过按钮触发 open 方法打开抽屉，展示基本用法。

```tsx
import { useRef } from "react";
import { WrappedEoDrawer, WrappedEoButton } from "@easyops/wrapped-components";

function BasicDrawerExample() {
  const drawerRef = useRef<any>(null);

  return (
    <>
      <WrappedEoButton
        textContent="打开抽屉"
        onClick={() => drawerRef.current?.open()}
      />
      <WrappedEoDrawer ref={drawerRef} customTitle="抽屉标题" subTitle="副标题">
        <div>抽屉内容</div>
      </WrappedEoDrawer>
    </>
  );
}
```

### Placement

通过 placement 属性设置抽屉从不同方向弹出。

```tsx
import { useRef } from "react";
import { WrappedEoDrawer, WrappedEoButton } from "@easyops/wrapped-components";

function PlacementDrawerExample() {
  const drawerTopRef = useRef<any>(null);
  const drawerLeftRef = useRef<any>(null);
  const drawerRightRef = useRef<any>(null);
  const drawerBottomRef = useRef<any>(null);

  return (
    <>
      <WrappedEoButton
        textContent="Top"
        onClick={() => drawerTopRef.current?.open()}
      />
      <WrappedEoButton
        textContent="Left"
        onClick={() => drawerLeftRef.current?.open()}
      />
      <WrappedEoButton
        textContent="Right"
        onClick={() => drawerRightRef.current?.open()}
      />
      <WrappedEoButton
        textContent="Bottom"
        onClick={() => drawerBottomRef.current?.open()}
      />
      <WrappedEoDrawer
        ref={drawerTopRef}
        customTitle="抽屉标题"
        placement="top"
      />
      <WrappedEoDrawer
        ref={drawerLeftRef}
        customTitle="抽屉标题"
        placement="left"
      />
      <WrappedEoDrawer
        ref={drawerRightRef}
        customTitle="抽屉标题"
        placement="right"
      />
      <WrappedEoDrawer
        ref={drawerBottomRef}
        customTitle="抽屉标题"
        placement="bottom"
      />
    </>
  );
}
```

### Width

通过 width 属性设置左右方向抽屉的宽度。

```tsx
import { useRef } from "react";
import { WrappedEoDrawer, WrappedEoButton } from "@easyops/wrapped-components";

function WidthDrawerExample() {
  const drawerRef = useRef<any>(null);

  return (
    <>
      <WrappedEoButton
        textContent="open"
        onClick={() => drawerRef.current?.open()}
      />
      <WrappedEoDrawer ref={drawerRef} customTitle="抽屉标题" width={200}>
        <div>抽屉内容</div>
      </WrappedEoDrawer>
    </>
  );
}
```

### Height

通过 height 属性设置上下方向抽屉的高度。

```tsx
import { useRef } from "react";
import { WrappedEoDrawer, WrappedEoButton } from "@easyops/wrapped-components";

function HeightDrawerExample() {
  const drawerRef = useRef<any>(null);

  return (
    <>
      <WrappedEoButton
        textContent="open"
        onClick={() => drawerRef.current?.open()}
      />
      <WrappedEoDrawer
        ref={drawerRef}
        customTitle="抽屉标题"
        height={200}
        placement="top"
      >
        <div>抽屉内容</div>
      </WrappedEoDrawer>
    </>
  );
}
```

### Closable

通过 closable 属性控制是否显示右上角关闭按钮。

```tsx
import { useRef } from "react";
import { WrappedEoDrawer, WrappedEoButton } from "@easyops/wrapped-components";

function ClosableDrawerExample() {
  const drawerShowCloseRef = useRef<any>(null);
  const drawerHideCloseRef = useRef<any>(null);

  return (
    <>
      <WrappedEoButton
        textContent="Show Close"
        onClick={() => drawerShowCloseRef.current?.open()}
      />
      <WrappedEoButton
        textContent="Hide Close"
        onClick={() => drawerHideCloseRef.current?.open()}
      />
      <WrappedEoDrawer ref={drawerShowCloseRef} customTitle="抽屉标题">
        <div>抽屉内容</div>
      </WrappedEoDrawer>
      <WrappedEoDrawer
        ref={drawerHideCloseRef}
        customTitle="抽屉标题"
        closable={false}
      >
        <div>抽屉内容</div>
      </WrappedEoDrawer>
    </>
  );
}
```

### Mask

通过 mask 属性控制是否展示遮罩层，maskClosable 控制点击遮罩层是否关闭抽屉。

```tsx
import { useRef } from "react";
import { WrappedEoDrawer, WrappedEoButton } from "@easyops/wrapped-components";

function MaskDrawerExample() {
  const drawerShowMaskRef = useRef<any>(null);
  const drawerHideMaskRef = useRef<any>(null);

  return (
    <>
      <WrappedEoButton
        textContent="Show Mask"
        onClick={() => drawerShowMaskRef.current?.open()}
      />
      <WrappedEoDrawer
        ref={drawerShowMaskRef}
        customTitle="抽屉标题"
        mask={true}
        maskClosable={true}
      >
        <div>抽屉内容</div>
      </WrappedEoDrawer>
      <WrappedEoButton
        textContent="Hide Mask"
        onClick={() => drawerHideMaskRef.current?.open()}
      />
      <WrappedEoDrawer
        ref={drawerHideMaskRef}
        customTitle="抽屉标题"
        mask={false}
        maskClosable={false}
      >
        <div>抽屉内容</div>
      </WrappedEoDrawer>
    </>
  );
}
```

### Slots

使用 footerSlot、headerLeft、extra 和 footer 插槽来自定义抽屉的头部和底部区域。

```tsx
import { useRef } from "react";
import { WrappedEoDrawer, WrappedEoButton } from "@easyops/wrapped-components";

function SlotsDrawerExample() {
  const drawerRef = useRef<any>(null);

  return (
    <>
      <WrappedEoButton
        textContent="open"
        onClick={() => drawerRef.current?.open()}
      />
      <WrappedEoDrawer ref={drawerRef} customTitle="抽屉标题" footerSlot={true}>
        <div>抽屉内容</div>
        <div slot="footer">底部内容</div>
        <div slot="extra">头部右上角</div>
        <div slot="headerLeft">头部左上角</div>
      </WrappedEoDrawer>
    </>
  );
}
```

### Open Event & Close Event

监听抽屉的 onOpen 和 onClose 事件，支持 keyboard（esc 键）关闭以及通过 close 方法关闭。

```tsx
import { useRef } from "react";
import { WrappedEoDrawer, WrappedEoButton } from "@easyops/wrapped-components";

function EventsDrawerExample() {
  const drawerRef = useRef<any>(null);

  return (
    <>
      <WrappedEoButton
        textContent="open"
        onClick={() => drawerRef.current?.open()}
      />
      <WrappedEoDrawer
        ref={drawerRef}
        customTitle="抽屉标题"
        placement="left"
        keyboard={true}
        onOpen={() => console.log("Drawer Open")}
        onClose={() => console.log("Drawer Close")}
      >
        <WrappedEoButton
          textContent="关闭弹窗"
          onClick={() => drawerRef.current?.close()}
        />
      </WrappedEoDrawer>
    </>
  );
}
```

### Nested

抽屉支持嵌套，在一个抽屉中打开另一个抽屉。

```tsx
import { useRef } from "react";
import { WrappedEoDrawer, WrappedEoButton } from "@easyops/wrapped-components";

function NestedDrawerExample() {
  const drawerRef1 = useRef<any>(null);
  const drawerRef2 = useRef<any>(null);

  return (
    <>
      <WrappedEoButton
        textContent="Open drawer"
        onClick={() => drawerRef1.current?.open()}
      />
      <WrappedEoDrawer
        ref={drawerRef1}
        customTitle="Drawer Title"
        keyboard={true}
      >
        <WrappedEoButton
          textContent="Open nested drawer"
          onClick={() => drawerRef2.current?.open()}
        />
      </WrappedEoDrawer>
      <WrappedEoDrawer
        ref={drawerRef2}
        customTitle="Nested Drawer Title"
        keyboard={true}
        width={400}
      >
        This is a nested drawer.
      </WrappedEoDrawer>
    </>
  );
}
```

### Custom Mask Style & Scroll To Top

自定义遮罩层样式，并设置 scrollToTopWhenOpen 控制打开时是否滚动到顶部。

```tsx
import { useRef } from "react";
import { WrappedEoDrawer, WrappedEoButton } from "@easyops/wrapped-components";

function MaskStyleDrawerExample() {
  const drawerRef = useRef<any>(null);

  return (
    <>
      <WrappedEoButton
        textContent="open"
        onClick={() => drawerRef.current?.open()}
      />
      <WrappedEoDrawer
        ref={drawerRef}
        customTitle="自定义遮罩样式"
        scrollToTopWhenOpen={true}
        maskStyle={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
      >
        <div>抽屉内容</div>
      </WrappedEoDrawer>
    </>
  );
}
```

### Theme Variant

通过 themeVariant 属性切换主题变体。

```tsx
import { useRef } from "react";
import { WrappedEoDrawer, WrappedEoButton } from "@easyops/wrapped-components";

function ThemeVariantDrawerExample() {
  const drawerRef = useRef<any>(null);

  return (
    <>
      <WrappedEoButton
        textContent="open"
        onClick={() => drawerRef.current?.open()}
      />
      <WrappedEoDrawer
        ref={drawerRef}
        customTitle="Elevo 主题"
        themeVariant="elevo"
      >
        <div>抽屉内容</div>
      </WrappedEoDrawer>
    </>
  );
}
```
