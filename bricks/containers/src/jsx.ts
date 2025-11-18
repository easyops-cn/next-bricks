import type { DetailedHTMLProps, HTMLAttributes } from "react";
import type { EoBanner, BannerProps } from "./banner";
import type { Card, CardProps } from "./card";
import type { Category, CategoryContainerProps } from "./category";
import type { EoContentLayout } from "./content-layout";
import type { Drawer, DrawerProps } from "./drawer";
import type { EasyViewElement } from "./easy-view";
import type { FlexLayout } from "./flex-layout";
import type { GridLayout, GridProps } from "./grid-layout";
import type { EoMainView, MainViewProps } from "./main-view";
import type { MicroView } from "./micro-view";
import type { Modal, ModalProps } from "./modal";
import type { EoNarrowView, NarrowViewProps } from "./narrow-view";
import type { EoPageView, PageViewProps } from "./page-view";
import type { EoPopup, EoPopupProps } from "./popup";
import type { ResizableBox, ResizableBoxProps } from "./resizable-box";
import type { SearchBar, SearchBarProps } from "./search-bar";
import type { EoSpin, EoSpinProps } from "./spin";
import type { TabList, TabListProps } from "./tab/tab-list";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "eo-banner": DetailedHTMLProps<HTMLAttributes<EoBanner>, EoBanner> &
        BannerProps;
      "eo-card": DetailedHTMLProps<HTMLAttributes<Card>, Card> & CardProps;
      "eo-category": DetailedHTMLProps<HTMLAttributes<Category>, Category> &
        CategoryContainerProps;
      "eo-content-layout": DetailedHTMLProps<
        HTMLAttributes<EoContentLayout>,
        EoContentLayout
      >;
      "eo-drawer": DetailedHTMLProps<HTMLAttributes<Drawer>, Drawer> &
        DrawerProps & {
          onClose?: (event: CustomEvent<void>) => void;
          onOpen?: (event: CustomEvent<void>) => void;
        };
      "eo-easy-view": DetailedHTMLProps<
        HTMLAttributes<EasyViewElement>,
        EasyViewElement
      >;
      "eo-flex-layout": DetailedHTMLProps<
        HTMLAttributes<FlexLayout>,
        FlexLayout
      >;
      "eo-grid-layout": DetailedHTMLProps<
        HTMLAttributes<GridLayout>,
        GridLayout
      > &
        GridProps;
      "eo-main-view": DetailedHTMLProps<
        HTMLAttributes<EoMainView>,
        EoMainView
      > &
        MainViewProps & {
          onDashboardExit?: (event: CustomEvent<void>) => void;
        };
      "eo-micro-view": DetailedHTMLProps<HTMLAttributes<MicroView>, MicroView>;
      "eo-modal": DetailedHTMLProps<HTMLAttributes<Modal>, Modal> &
        ModalProps & {
          onOpen?: (event: CustomEvent<void>) => void;
          onClose?: (event: CustomEvent<void>) => void;
          onConfirm?: (event: CustomEvent<void>) => void;
          onCancel?: (event: CustomEvent<void>) => void;
        };
      "eo-narrow-view": DetailedHTMLProps<
        HTMLAttributes<EoNarrowView>,
        EoNarrowView
      > &
        NarrowViewProps;
      "eo-page-view": DetailedHTMLProps<
        HTMLAttributes<EoPageView>,
        EoPageView
      > &
        PageViewProps;
      "eo-popup": DetailedHTMLProps<HTMLAttributes<EoPopup>, EoPopup> &
        EoPopupProps;
      "eo-resizable-box": DetailedHTMLProps<
        HTMLAttributes<ResizableBox>,
        ResizableBox
      > &
        ResizableBoxProps;
      "eo-search-bar": DetailedHTMLProps<HTMLAttributes<SearchBar>, SearchBar> &
        SearchBarProps;
      "eo-spin": DetailedHTMLProps<HTMLAttributes<EoSpin>, EoSpin> &
        EoSpinProps;
      "eo-tab-list": DetailedHTMLProps<HTMLAttributes<TabList>, TabList> &
        TabListProps & {
          onTabSelect?: (event: CustomEvent<string>) => void;
        };
    }
  }
}
