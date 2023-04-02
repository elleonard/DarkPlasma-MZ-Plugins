/// <reference path="../../typings/rmmz.d.ts" />
/// <reference path="../OrderEquip/OrderEquip.d.ts" />

declare interface StorageCategories {
  categories(): string[];
  count(): number;
}

declare interface Game_StorageItems {
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
