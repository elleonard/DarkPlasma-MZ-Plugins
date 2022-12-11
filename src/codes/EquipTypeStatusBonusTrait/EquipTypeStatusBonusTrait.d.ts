/// <reference path="../../typings/rmmz.d.ts" />
/// <reference path="../AllocateUniqueTraitId/AllocateUniqueTraitId.d.ts" />

declare namespace DataManager {
  function loadExtraTraits(): void;
  function extractExtraTraits(data: DataManager.NoteHolder): void;

  function weaponTypeIdForStatusBonusTrait(weapon: MZ.Weapon): number;
  function armorTypeIdForStatusBonusTrait(armor: MZ.Armor): number;
}

declare interface Scene_Boot {
  loadExtraTraits(): void;
}

declare namespace Game_Battler {
  let TRAIT_PARAM_PLUS_WITH_WEAPON_TYPE: number;
  let TRAIT_XPARAM_PLUS_WITH_WEAPON_TYPE: number;
  let TRAIT_PARAM_PLUS_WITH_ARMOR_TYPE: number;
  let TRAIT_XPARAM_PLUS_WITH_ARMOR_TYPE: number;
}

declare interface Game_Actor {
  equipsForEquipTypeStatusBonus(): (MZ.Weapon | MZ.Armor)[]
  paramPlusWithEquipTypeTraits(paramId: number): number;
  validParamPlusWithEquipTypeTraits(paramId: number): MZ.Trait[];
  xparamPlusWithEquipTypeTraits(xparamId: number): number;
  validXParamPlusWithEquipTypeTraits(xparamId: number): MZ.Trait[];
}
