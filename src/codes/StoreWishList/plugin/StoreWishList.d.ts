/// <reference path="../../../typings/rmmz.d.ts" />
/// <reference path="../../../common/manager/DataManagerMixIn.d.ts" />

declare namespace ColorManager {
  function wishListRegisteredColor(): string;
}

type ItemWeaponArmorId = {
  kind: number;
  dataId: number;
};

type Game_WishListItemMaterial = ItemWeaponArmorId & {
  count: number;
};

declare interface Game_WishListItem {
  _result: ItemWeaponArmorId;
  _materials: Game_WishListItemMaterial[];

  readonly result: ItemWeaponArmorId;
  readonly materials: Game_WishListItemMaterial[];

  resultData(): MZ.Item|MZ.Weapon|MZ.Armor|null;
}

declare interface Game_WishList {
  _items: Game_WishListItem[];

  readonly items: Game_WishListItem[];

  add(result: MZ.Item|MZ.Weapon|MZ.Armor, materials: Game_WishListItemMaterial[]): void;
  delete(result: MZ.Item|MZ.Weapon|MZ.Armor): void;
  isInList(result: MZ.Item|MZ.Weapon|MZ.Armor): boolean;
  item(result: MZ.Item|MZ.Weapon|MZ.Armor): Game_WishListItem|undefined;
  isMaterialCompleted(result: MZ.Item|MZ.Weapon|MZ.Armor): boolean;
  itemsHaveMaterial(material: MZ.Item|MZ.Weapon|MZ.Armor): Game_WishListItem[];
  toItemWeaponArmorId(data: MZ.Item | MZ.Weapon | MZ.Armor): ItemWeaponArmorId;
}

declare interface Game_Party {
  _wishList: Game_WishList;

  wishList(): Game_WishList;
  addWishListItem(result: MZ.Item|MZ.Weapon|MZ.Armor, materials: Game_WishListItemMaterial[]): void;
  deleteWishListItem(result: MZ.Item|MZ.Weapon|MZ.Armor): void;
  isInWishList(result: MZ.Item|MZ.Weapon|MZ.Armor|null): boolean;
}
