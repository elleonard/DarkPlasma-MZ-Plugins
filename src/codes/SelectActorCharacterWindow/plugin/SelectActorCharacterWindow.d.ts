/// <reference path="../../../typings/rmmz.d.ts" />
/// <reference path="../../ForceFormation/ForceFormation.d.ts" />

declare interface Window_SelectActorCharacter extends Window_StatusBase {
  setActivateByHover(func: () => void): void;
  setPendingIndex(pendingIndex: number): void;
  actor(): Game_Actor | undefined;
  members(): Game_Actor[];
  pendingIndex(): number;
}
