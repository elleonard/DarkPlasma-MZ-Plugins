/// <reference path="../../../typings/rmmz.d.ts" />
/// <reference path="../../FusionItem/FusionItem.d.ts" />
/// <reference path="../../StoreWishList/plugin/StoreWishList.d.ts" />
/// <reference path="../../CustomKeyHandler/CustomKeyHandler.d.ts" />
/// <reference path="../../CustomKeyHandler/CustomKeyHandlerExport.d.ts" />

declare class Game_WishListItem {
  constructor(result: ItemWeaponArmorId, materials: Game_WishListItemMaterial[]);
}

declare interface Scene_FusionItem {
  registerWishListItem(): void;
}

declare class Scene_FusionItem {

}

declare interface Window_FusionShopBuy {
  currentItemForWishList(): Game_WishListItem;
}

declare class Window_FusionShopBuy {}
