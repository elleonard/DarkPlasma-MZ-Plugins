/// <reference path="../../typings/rmmz.d.ts" />

declare interface Game_Map {
  isItemCommandEnabled(): boolean;
}

declare interface Window_Command {
  itemCommand(): Window_Command.Command | undefined;
}
