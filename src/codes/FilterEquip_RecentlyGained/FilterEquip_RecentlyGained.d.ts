/// <reference path="../../typings/rmmz.d.ts" />
/// <reference path="../AllocateUniqueTraitId/AllocateUniqueTraitId.d.ts" />
/// <reference path="../FilterEquip/FilterEquip.d.ts" />

declare interface Game_Party {
  _gainWeaponHistory: number[];
  _gainArmorHistory: number[];

  pushGainWeaponHistory(weapon: MZ.Weapon): void;
  pushGainArmorHistory(armor: MZ.Armor): void;
  gainWeaponHistory(): number[];
  gainArmorHistory(): number[];
  isRecentlyGained(item: MZ.Item|MZ.Weapon|MZ.Armor): boolean;
}

declare class EquipFilterBuilder {}
