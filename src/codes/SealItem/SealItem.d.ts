/// <reference path="../../typings/rmmz.d.ts" />
/// <reference path="../AllocateUniqueTraitId/AllocateUniqueTraitId.d.ts" />

declare namespace DataManager {
  function sealItems(object: DataManager.NoteHolder): number[];
  function isHealItem(item: MZ.Item): boolean;
  function isResurrectionItem(item: MZ.Item): boolean;
}

declare interface Game_Map {
  isItemSealed(item: MZ.Item): boolean;
  isAllItemSealed(): boolean;
}

declare interface Game_Actor {
  isItemSealed(item: MZ.Item): boolean;
}