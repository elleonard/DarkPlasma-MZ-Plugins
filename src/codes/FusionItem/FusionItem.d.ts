/// <reference path="../../typings/rmmz.d.ts" />

declare namespace FusionItem {
  namespace Settings {
    type PresetItemBaseMaterial = {
      id: number,
      count: number,
    };
    type PresetItemBaseCondition = {
      switchId: number,
      variableId: number,
      threshold: number,
    };
    type PresetItemBase = {
      materialItems: PresetItemBaseMaterial[],
      materialWeapons: PresetItemBaseMaterial[],
      materialArmors: PresetItemBaseMaterial[],
      gold: number,
      condition: PresetItemBaseCondition,
    };
    type PresetItem = {
      result: number,
      base: PresetItemBase,
    };
    type Preset = {
      id: number,
      items: PresetItem[],
      weapons: PresetItem[],
      armors: PresetItem[]
    };
  }
}

declare class FusionItemMaterial {
  _data: MZ.Item | MZ.Weapon | MZ.Armor;
  _count: number;

  readonly data: MZ.Item | MZ.Weapon | MZ.Armor;
  readonly count: number;
}

declare interface Game_Party {
  numUsableItemsForFusion(item: MZ.Item | MZ.Weapon | MZ.Armor): number;
  numItemsWithEquip(item: MZ.Item|MZ.Weapon|MZ.Armor): number;
  numEquippedItem(item: MZ.Item|MZ.Weapon|MZ.Armor): number;
}

declare interface Scene_FusionItem extends Scene_Shop {

}

declare interface Window_FusionShopStatus extends Window_ShopStatus {
  _materials: FusionItemMaterial[];

  materialLineHeight(): number;
}
