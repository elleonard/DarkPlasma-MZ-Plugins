/// <reference path="../../typings/rmmz.d.ts" />
/// <reference path="../OrderEquip/OrderEquip.d.ts" />

declare interface StorageCategories {
  categories(): string[];
  count(): number;
}

declare interface Game_StorageItems {
  items(): MZ.Item[];

  storeItem(item: MZ.Item|MZ.Weapon|MZ.Armor, amount: number): void;
  fetchItem(item: MZ.Item|MZ.Weapon|MZ.Armor, amount: number): void;
  numItems(item: MZ.Item|MZ.Weapon|MZ.Armor): number;
  allItems(): (MZ.Item|MZ.Weapon|MZ.Armor)[];
  maxItems(): number;
}

declare interface Game_Temp {
  _storageCategories: StorageCategories|null;
  createStorageCategories(item: boolean, weapon: boolean, armor: boolean, keyItem: boolean): void;
  storageCategories(): StorageCategories|null;
}

declare interface Game_Party {
  _storageItems: Game_StorageItems;
  initStorageItems(): void;
  storageItems(): Game_StorageItems;
  storeItemToStorage(item: MZ.Item|MZ.Weapon|MZ.Armor, amount: number): void;
  fetchItemFromStorage(item: MZ.Item|MZ.Weapon|MZ.Armor, amount: number): void;
}

declare interface Scene_ItemStorage extends Scene_MenuBase {
  _inventoryWindow: Window_StorageItemsParty;
  _storageWindow: Window_StorageItems;
  _storeMode: boolean;
  createInventoryWindow(): void;
  createStorageWindow(): void;

  onInventoryOk(): void;
  onStorageOk(): void;
  onNumberOk(): void;
}

declare interface Window_StorageItems extends Window_ItemList {
  isPartyItem(): boolean;
}

declare interface Window_StorageItemsParty extends Window_StorageItems {

}
