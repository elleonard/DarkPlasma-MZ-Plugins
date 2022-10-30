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
  _isSortedByNewItem: boolean;
  _newItemsForSort: MZ.Item[];
  _newWeaponsForSort: MZ.Weapon[];
  _newArmorsForSort: MZ.Armor[];

  drawNewItemName(item: MZ.Item|MZ.Weapon|MZ.Armor, x: number, y: number, width: number): void;
  isNewItem(item: DataManager.DrawableItem|null): item is MZ.Item|MZ.Weapon|MZ.Armor;
  isNewItemForSort(item: MZ.Item|MZ.Weapon|MZ.Armor): boolean;
}
