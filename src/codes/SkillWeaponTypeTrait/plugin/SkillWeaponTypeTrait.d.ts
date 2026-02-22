/// <reference path="../../../typings/rmmz.d.ts" />
/// <reference path="../../AllocateUniqueTraitId/AllocateUniqueTraitId.d.ts" />
/// <reference path="../../LazyExtractData/plugin/LazyExtractData.d.ts" />

declare namespace DataManager {
  function extractSkillWeaponTypeMeta(data: MZ.Actor | MZ.Class | MZ.Weapon | MZ.Armor | MZ.State | MZ.Enemy): void;
}

declare interface Game_Actor {
  skillWeaponTypeIds(): number[];
}

declare interface Scene_Boot {
  extractSkillWeaponTypeMeta(): void;
}
