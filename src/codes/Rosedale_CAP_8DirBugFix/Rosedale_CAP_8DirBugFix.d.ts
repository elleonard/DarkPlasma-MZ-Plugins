/// <reference path="../../typings/rmmz.d.ts" />

declare namespace DataManager {
  function characterNameToActor(characterName: string): MZ.Actor|undefined;

  interface SaveFileInfo {
    partyMembers?: number[];
  }
}

declare interface Game_Actor {
  maxCharacterPattern(): number;
  defaultCharacterPattern(): number;
  characterPatternYCount(): number;
}

declare interface Window_Base {
  drawActorCharacterWith8Dir(actor: Game_Actor, x: number, y: number): void;
}
