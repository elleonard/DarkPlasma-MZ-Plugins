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

declare interface FusionItemMaterialInterface {
  readonly data: MZ.Item|MZ.Weapon|MZ.Armor;
  readonly count: number;
}

declare interface FusionItemGoodsInterface {
  readonly result: MZ.Item|MZ.Weapon|MZ.Armor;
  readonly materials: FusionItemMaterialInterface[];
  readonly gold: number;

  isValid(): boolean;
}

declare interface Game_Party {
  numUsableItemsForFusion(item: MZ.Item | MZ.Weapon | MZ.Armor): number;
  numItemsWithEquip(item: MZ.Item|MZ.Weapon|MZ.Armor): number;
  numEquippedItem(item: MZ.Item|MZ.Weapon|MZ.Armor): number;
}

declare interface Scene_FusionItem extends Scene_ShopLike<Window_FusionShopBuy> {

}

declare class Scene_ShopLike<TBuyWindow> extends Scene_MenuBase {
  _goods: FusionItemGoodsInterface[];
  public _item: MZ.Item | MZ.Weapon | MZ.Armor | null;
  public _helpWindow: Window_Help;
  public _goldWindow: Window_Gold;
  public _commandWindow: Window_ShopCommand;
  public _dummyWindow: Window_Base;
  public _numberWindow: Window_ShopNumber;
  public _statusWindow: Window_ShopStatus;
  public _buyWindow: TBuyWindow;
  public _categoryWindow: Window_ItemCategory;
  public _sellWindow: Window_ShopSell;

  prepare(goods: TGoods[]): void;

  create(): void;
  createGoldWindow(): void;
  goldWindowRect(): Rectangle;
  commandWindowRect(): Rectangle;
  createDummyWindow(): void;
  dummyWindowRect(): Rectangle;
  createNumberWindow(): void;
  numberWindowRect(): Rectangle;
  statusWindowRect(): Rectangle;
  buyWindowRect(): Rectangle;
  createCategoryWindow(): void;
  categoryWindowRect(): Rectangle;
  createSellWindow(): void;
  sellWindowRect(): Rectangle;
  statusWidth(): number;

  activateBuyWindow(): void;
  activateSellWindow(): void;

  commandBuy(): void;
  commandSell(): void;

  onCategoryOk(): void;
  onCategoryCancel(): void;
  onBuyOk(): void;
  onBuyCancel(): void;
  onSellOk(): void;
  onSellCancel(): void;
  onNumberOk(): void;
  onNumberCancel(): void;

  doBuy(number: number): void;
  doSell(number: number): void;
  endNumberInput(): void;

  maxBuy(): number;
  maxSell(): number;
  money(): number;
  currencyUnit(): string;
  sellingPrice(): number;
}

type Constructor<T = Scene_MenuBase> = new (...args: any[]) => T;
function Scene_ShopLikeMixIn<TScene extends Constructor, TBuyWindow>(sceneClass: TScene): Scene_ShopLike<TBuyWindow>;

declare interface Window_FusionShopStatus extends Window_ShopStatus {
  _materials: FusionItemMaterialInterface[];

  materialLineHeight(): number;
}

declare interface Window_FusionShopBuy extends Window_ShopBuy {
  _materials: FusionItemMaterialInterface[][];

  setupFusionGoods(fusionGoods: FusionItemGoodsInterface[]): void;
  drawPrice(price: number, x: number, y: number, width: number): void;
  includes(goods: FusionItemGoodsInterface): boolean;
}
