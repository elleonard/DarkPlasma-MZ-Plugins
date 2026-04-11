/// <reference path="../../../typings/rmmz.d.ts" />

declare interface Scene_Title {
  adjustCommandWindowHeight(): void;
}

declare interface Scene_GameEnd {
  adjustCommandWindowHeight(): void;
}

declare interface Window_Command {
  commandCount(): number;
}

declare interface Window_GameEnd {
  addShutdownCommand(): void;
}
