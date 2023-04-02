/// <reference path="../../typings/rmmz.d.ts" />
/// <reference path="../OrderIdAlias/OrderIdAlias.d.ts" />

declare interface Window_Selectable {
  sortWeapons(weapons: MZ.Weapon[]): MZ.Weapon[];
  sortArmors(armors: MZ.Armor[]): MZ.Armor[];
}

declare interface Window_ItemList {
  sortEquips(): void;
  isWeaponList(): boolean;
  isArmorList(): boolean;
}
