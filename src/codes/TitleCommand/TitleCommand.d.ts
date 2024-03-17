/// <reference path="../../typings/rmmz.d.ts" />

declare interface Scene_Title {
  commandSceneChange(): void;
  commandShutdown(): void;
}

declare interface Window_TitleCommand {
  addCommandAt(index: number, name: string, symbol: string, enabled?: boolean, ext?: any): void;
}
