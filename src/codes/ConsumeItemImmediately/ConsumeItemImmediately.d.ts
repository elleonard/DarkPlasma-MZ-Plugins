/// <reference path="../../typings/rmmz.d.ts" />

declare interface BattleManager {
  _reservedItems: MZ.Item[];

  reserveItem(item: MZ.Item): void;
  cancelItem(): void;
  reservedItemCount(item: MZ.Item): number;
}

declare interface Game_Party {
  numItemsForDisplay(item: MZ.Item|MZ.Weapon|MZ.Armor): number;
}
