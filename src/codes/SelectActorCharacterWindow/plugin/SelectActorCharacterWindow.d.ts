/// <reference path="../../../typings/rmmz.d.ts" />
/// <reference path="../../ForceFormation/ForceFormation.d.ts" />

declare interface Scene_Base {
  characterSize(): {
    width: number;
    height: number;
  };
  defaultCharacterSize(): {
    width: number;
    height: number;
  };
  useTallCharacter(): boolean;
}

declare interface Window_SelectActorCharacter extends Window_StatusBase {
  setActivateByHover(func: () => void): void;
  setPendingIndex(pendingIndex?: number): void;
  currentActor(): Game_Actor | undefined;
  pendingActor(): Game_Actor | undefined;
  actor(index: number): Game_Actor | undefined;
  members(): (Game_Actor|undefined)[];
  pendingIndex(): number;
  spacing(): number;
  characterSize(): {
    width: number;
    height: number;
  };
  defaultCharacterSize(): {
    width: number;
    height: number;
  };
  useTallCharacter(): boolean;
}

function Scene_SelectActorCharacterMixIn(sceneClass: Scene_Base): void;
