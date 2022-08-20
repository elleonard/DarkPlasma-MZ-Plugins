/// <reference path="../../typings/rmmz/rmmz.d.ts" />

declare interface Game_Party {
  _newItemIds: number[];
  _newWeaponIds: number[];
  _newArmorIds: number[];

  initializeNewItems(): void;
  touchItem(item: MZ.Item|MZ.Weapon|MZ.Armor): void;
  addNewItems(item: MZ.Item|MZ.Weapon|MZ.Armor): void;
  hasItemAsNew(item: MZ.Item|MZ.Weapon|MZ.Armor): boolean;
  newItemIds(): number[];
  newWeaponIds(): number[];
  newArmorIds(): number[];
}

declare interface Window_ItemList {
  drawNewItemName(item: MZ.Item|MZ.Weapon|MZ.Armor, x: number, y: number, width: number): void;
  isNewItem(item: DataManager.Item|null): item is MZ.Item|MZ.Weapon|MZ.Armor;
}
