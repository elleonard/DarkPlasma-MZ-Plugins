/// <reference path="../../../typings/rmmz.d.ts" />
/// <reference path="../../ConcurrentParty/plugin/ConcurrentParty.d.ts" />
/// <reference path="../../SelectActorCharacterWindow/plugin/SelectActorCharacterWindow.d.ts" />

type DevidePartyInfo = {
  count: number;
  locations: Game_DevidedPartyPosition[];
};

declare interface Game_Temp {
  _devidePartyInfo: DevidePartyInfo|undefined;

  setDevidePartyInfo(count: number, locations: Game_DevidedPartyPosition[]): void;
  devidePartyInfo(): DevidePartyInfo|undefined;
  devidePartyCount(): number;
  devidePartyLocation(index: number): Game_DevidedPartyPosition;
}

declare class Game_DevidedParty {}

declare class Window_SelectActorCharacter extends Window_StatusBase {}
