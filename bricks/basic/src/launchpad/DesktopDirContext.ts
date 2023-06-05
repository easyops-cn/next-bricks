import React from "react";
import { NormalizedDesktopDir } from "./interfaces.js";

export interface DirWithCoordinates {
  dir: NormalizedDesktopDir;
  coordinates: {
    x: number;
    y: number;
  };
  activeIndex: number;
}

export interface ContextOfDesktopDir {
  desktopDir?: DirWithCoordinates;
  setDesktopDir?: React.Dispatch<DirWithCoordinates | undefined>;
}

export const DesktopDirContext = React.createContext<ContextOfDesktopDir>({});

export const useDesktopDirContext = (): ContextOfDesktopDir =>
  React.useContext(DesktopDirContext);
