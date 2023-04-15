/// <reference path="../../typings/rmmz.d.ts" />
/// <reference path="../ItemStorage/ItemStorage.d.ts" />

declare interface Game_Temp {
  _isAutoStoreItemEnabled: boolean;
  isAutoStoreItemEnabled(): boolean;
  enableAutoStoreItem(): void;
  disableAutoStoreItem(): void;
}

declare interface Game_Party {
  autoStoreAmount(item: MZ.Item|MZ.Weapon|MZ.Armor, amount: number): number;
}
