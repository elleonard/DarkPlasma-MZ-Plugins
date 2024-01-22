/// <reference path="../../../typings/rmmz.d.ts" />
/// <reference path="../../IndividualItemCommand/plugin/IndividualItemCommand.d.ts" />

declare interface Scene_Item {
  determineEquip(): void;
  equipItem(): void;
}

declare interface Window_MenuActor {
  _equip: MZ.Weapon|MZ.Armor|undefined;

  selectForEquip(equip: MZ.Weapon|MZ.Armor): void;
}

declare class Window_ItemCommand {}
