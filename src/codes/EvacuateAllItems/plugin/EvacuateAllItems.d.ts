/// <reference path="../../../typings/rmmz.d.ts" />

type ItemCategory = "item"|"weapon"|"armor"|"keyItem";

declare interface Game_Party {
  _evacuatedInventory: Game_EvacuatedInventory;

  evacuatedInventory(): Game_EvacuatedInventory;
  evacuateAllItems(category: ItemCategory): void;
  evacuateItem(item: MZ.Item|MZ.Weapon|MZ.Armor, amount: number): void;
  regainEvacuatedItems(): void;
}

declare interface Game_EvacuatedInventory {
  _items: {
    [id: number]: number;
  };
  _weapons: {
    [id: number]: number;
  };
  _armors: {
    [id: number]: number;
  };

  initialize(): void;
  itemContainer(item: MZ.Item|MZ.Weapon|MZ.Armor): {
    [id: number]: number;
  };
  pushItem(item: MZ.Item|MZ.Weapon|MZ.Armor, amount: number): void;
  popAllItems(): {item: MZ.Item|MZ.Weapon|MZ.Armor, amount: number}[];
}
