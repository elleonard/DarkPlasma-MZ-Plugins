/// <reference path="../../../typings/rmmz.d.ts" />

declare interface Game_SharedSaveInfo {
}

declare namespace DataManager {
  var _isSharedInfoLoaded: boolean;

  function saveSharedInfo(): void;
  function loadSharedInfo(): void;
  function onLoadSharedInfo(sharedInfo: Game_SharedSaveInfo): 0;
  function isSharedInfoLoaded(): boolean;
  function makeSharedInfo(): Game_SharedSaveInfo;
}
