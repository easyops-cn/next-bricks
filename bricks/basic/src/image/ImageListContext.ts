import React, { createContext } from "react";

export interface PreviewImage {
  uuid: number;
  index: number;
  src?: string;
  alt?: string;
  preview?: boolean;
}

interface ContextOfImageList {
  previewImageList: PreviewImage[];
  currentUUid: number | undefined;
  onlyPreview?: boolean;
  setCurrentUUid: React.Dispatch<React.SetStateAction<number | undefined>>;
  registerImage: (uuid: number, previewImage: PreviewImage) => () => void;
}

export const ImageListContext = createContext<ContextOfImageList>({
  previewImageList: [],
  currentUUid: undefined,
  onlyPreview: false,
  setCurrentUUid: () => null,
  registerImage: () => () => null,
});
