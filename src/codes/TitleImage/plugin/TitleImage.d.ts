/// <reference path="../../../typings/rmmz.d.ts" />
/// <reference path="../../SharedSaveInfo/plugin/SharedSaveInfo.d.ts" />

declare interface Game_SharedSaveInfo {
  title1Name: string;
  title2Name: string;
}

declare interface Game_Temp {
  _title1Name?: string;
  _title2Name?: string;

  setTitleImage(title1Name?: string, title2Name?: string): void;
  title1Name(): string;
  title2Name(): string;
}
