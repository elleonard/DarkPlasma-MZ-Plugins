/// <reference path="../../typings/rmmz.d.ts" />

declare namespace DataManager {
  interface SaveFileInfo {
    mapName: string;
  }
}

declare interface Window_SavefileList {
  drawMapName(info: DataManager.SaveFileInfo, x: number, y: number, width: number): void;
}
