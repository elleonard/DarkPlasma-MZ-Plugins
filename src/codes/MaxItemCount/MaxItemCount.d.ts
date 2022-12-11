/// <reference path="../../typings/rmmz.d.ts" />

declare interface Game_Party {
  _defaultMaxItemCount: number;
  _maxItemCount: {
    [key: string]: number
  };

  changeDefaultMaxItemCount(count: number): void;
  changeMaxItemCount(item: MZ.Item|MZ.Weapon|MZ.Armor, count: number): void;
  changedMaxItemCount(item: MZ.Item|MZ.Weapon|MZ.Armor): number|null;
  itemMaxCountKey(item: MZ.Item|MZ.Weapon|MZ.Armor): string|null;
  maxOfMaxItemCount(): number;
  setItemCountToMax(item: MZ.Item|MZ.Weapon|MZ.Armor): void;

}
