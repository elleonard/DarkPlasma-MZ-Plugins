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
  equipsForEquipTypeStatusBonus(): (MZ.Weapon | MZ.Armor)[]
  paramPlusWithEquipTypeTraits(paramId: number): number;
  validParamPlusWithEquipTypeTraits(paramId: number): MZ.Trait[];
  xparamPlusWithEquipTypeTraits(xparamId: number): number;
  validXParamPlusWithEquipTypeTraits(xparamId: number): MZ.Trait[];
}
