/// <reference path="../../typings/rmmz.d.ts" />

declare namespace ColorManager {
  function colorByName(name: string): string | number;
  function coloredName(name: string): string;
}

declare interface Game_Actors {
  byName(name: string): Game_Actor | null;
}

declare interface Window_Message {
  convertNameWindow(text: string): string;
  findNameWindowTextInfo(text: string): { name: string; eraseTarget: RegExp | string } | null;
}
