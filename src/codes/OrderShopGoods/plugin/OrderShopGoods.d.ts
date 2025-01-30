/// <reference path="../../../typings/rmmz.d.ts" />
/// <reference path="../../OrderIdAlias/OrderIdAlias.d.ts" />
/// <reference path="../../FusionItem/FusionItem.d.ts" />

type ZippedGoods = [MZ.Item | MZ.Weapon | MZ.Armor, number, ...any];

declare interface Window_ShopBuy {
  sortGoods(zippedGoods: ZippedGoods[]): void;
  compareGoods(a: ZippedGoods, b: ZippedGoods): number;
  compareGoodsSub<T extends MZ.Item|MZ.Weapon|MZ.Armor>(a: [T, number], b: [T, number], keys: string[]): number;

  goodsSortKeyMap<T extends MZ.Item|MZ.Weapon|MZ.Armor>(item: T, price: number, key: string): number;

  zipGoods(): ZippedGoods[];
}

declare class Window_FusionShopBuy {

}
