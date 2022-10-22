/// <reference path="../../typings/rmmz/rmmz.d.ts" />
/// <reference path="../AllocateUniqueTraitId/AllocateUniqueTraitId.d.ts" />

declare namespace DataManager {
  function loadExtraTraits(): void;
  function extractExtraTraits(data: DataManager.NoteHolder): void;
}

declare interface Scene_Boot {
  loadExtraTraits(): void;
}

declare interface Game_Actor {
  paramPlusWithEquipTraits(paramId: number): number;
  validParamPlusWithEquipTraits(paramId: number): MZ.Trait[];
  xparamPlusWithEquipTraits(xparamId: number): number;
  validXParamPlusWithEquipTraits(xparamId: number): MZ.Trait[];
}
