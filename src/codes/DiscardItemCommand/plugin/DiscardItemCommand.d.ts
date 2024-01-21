/// <reference path="../../../typings/rmmz.d.ts" />
/// <reference path="../../IndividualItemCommand/plugin/IndividualItemCommand.d.ts" />

declare interface Game_Party {
  canDiscard(item: MZ.Item|MZ.Weapon|MZ.Armor|null): boolean;
}

declare interface Scene_Item {
  discardItem(): void;
}

declare class Window_ItemCommand {}
