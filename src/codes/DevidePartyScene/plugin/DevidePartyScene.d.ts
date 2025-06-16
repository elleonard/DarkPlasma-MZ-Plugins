/// <reference path="../../../typings/rmmz.d.ts" />
/// <reference path="../../ConcurrentParty/plugin/ConcurrentParty.d.ts" />
/// <reference path="../../SelectActorCharacterWindow/plugin/SelectActorCharacterWindow.d.ts" />

declare interface Game_Temp {
  _devidePartyCount: number;

  setDevidePartyCount(count: number): void;
  devidePartyCount(): number;
}

declare class Window_SelectActorCharacter extends Window_StatusBase {}
