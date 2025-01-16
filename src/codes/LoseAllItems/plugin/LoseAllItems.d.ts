/// <reference path="../../../typings/rmmz.d.ts" />

type ItemCategory = "item"|"weapon"|"armor"|"keyItem";

declare interface Game_Party {
  loseAllItems(category: ItemCategory): void;
}
