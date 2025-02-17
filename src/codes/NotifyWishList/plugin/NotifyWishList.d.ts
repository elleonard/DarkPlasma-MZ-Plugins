/// <reference path="../../../typings/rmmz.d.ts" />
/// <reference path="../../StoreWishList/plugin/StoreWishList.d.ts" />
/// <reference path="../../../common/external/Torigoya_NotifyMessage.d.ts" />

declare interface Game_Temp {
  _recentNotifiedWishListItems: (MZ.Item|MZ.Weapon|MZ.Armor)[];
  _reservedWishListNotifyItems: Torigoya.NotifyMessage.NotifyItem[];

  pushRecentNotifiedWishListItem(item: MZ.Item|MZ.Weapon|MZ.Armor): void;
  removeRecentNotifiedWishListItem(item: MZ.Item|MZ.Weapon|MZ.Armor): void;
  isRecentNotifiedWishListItem(item: MZ.Item|MZ.Weapon|MZ.Armor): boolean;
  clearRecentNotifiedWishListItems(): void;

  reservedWishListNotifyItems(): Torigoya.NotifyMessage.NotifyItem[];
  reserveWishListNotification(notifyItem: Torigoya.NotifyMessage.NotifyItem): void;
  shiftReservedWishListNotification(): Torigoya.NotifyMessage.NotifyItem|undefined;
}

declare interface Game_WishList {
  mustNotifyCompletion(result: MZ.Item|MZ.Weapon|MZ.Armor): boolean;
  notifyCompletionByGainMaterial(material: MZ.Item|MZ.Weapon|MZ.Armor): void;
}

declare class Game_WishList {}

declare interface Scene_Base {
  notifyWishListItem(): void;
  canNotifyWishListItem(): boolean;
}
