/// <reference path="../../typings/rmmz/rmmz.d.ts" />

type DropItemSet = {
  dropRate: number;
  items: number[];
  weapons: number[];
  armors: number[];
}

declare interface Game_Troop {
  isCommonItemDropSetEnabled(): boolean;
  makeCommonDropItems(): (MZ.Item | MZ.Weapon | MZ.Armor | null)[];
}

declare interface Game_Enemy {
  isCommonItemDropSetEnabled(): boolean;
  makeCommonDropItems(): (MZ.Item | MZ.Weapon | MZ.Armor | null)[];
}
