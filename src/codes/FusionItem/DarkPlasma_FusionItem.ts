/// <reference path="./FusionItem.d.ts" />
import { pluginName } from '../../common/pluginName';
import { command_fusionShop, parseArgs_fusionShop } from './_build/DarkPlasma_FusionItem_commands';
import { settings } from './_build/DarkPlasma_FusionItem_parameters';

/**
 * @param {MZ.Item | MZ.Weapon | MZ.Armor} data
 * @param {object} item
 * @returns
 */
function toFusionItemGood(data: MZ.Item | MZ.Weapon | MZ.Armor, item: FusionItem.Settings.PresetItem) {
  return new FusionItemGoods(
    data,
    item.base.materialItems
      .map((material) => new FusionItemMaterial($dataItems[material.id], material.count))
      .concat(
        item.base.materialWeapons.map((material) => new FusionItemMaterial($dataWeapons[material.id], material.count))
      )
      .concat(
        item.base.materialArmors.map((material) => new FusionItemMaterial($dataArmors[material.id], material.count))
      ),
    item.base.gold,
    item.base.condition.switchId,
    item.base.condition.variableId,
    item.base.condition.threshold
  );
}

PluginManager.registerCommand(pluginName, command_fusionShop, function (args) {
  const parsedArgs = parseArgs_fusionShop(args);
  const goods = parsedArgs.presetIds
    .map((presetId: number) => {
      const preset = settings.presets.find((preset: FusionItem.Settings.Preset) => preset.id === presetId);
      if (!preset) {
        throw `無効なプリセットIDが指定されています。 ${presetId}`;
      }
      return preset.items
        .map((item: FusionItem.Settings.PresetItem) => toFusionItemGood($dataItems[item.result], item))
        .concat(preset.weapons.map((weapon: FusionItem.Settings.PresetItem) => toFusionItemGood($dataWeapons[weapon.result], weapon)))
        .concat(preset.armors.map((armor: FusionItem.Settings.PresetItem) => toFusionItemGood($dataArmors[armor.result], armor)));
    })
    .flat();
  SceneManager.push(Scene_FusionItem);
  SceneManager.prepareNextScene(goods);
});

class FusionItemMaterial implements FusionItemMaterialInterface {
  _data: MZ.Item | MZ.Weapon | MZ.Armor;
  _count: number;
  /**
   * @param {MZ.Item | MZ.Weapon | MZ.Armor} data
   * @param {number} count
   */
  constructor(data: MZ.Item | MZ.Weapon | MZ.Armor, count: number) {
    if (!data) {
      throw Error('素材情報が不正です');
    }
    this._data = data;
    this._count = count;
  }

  get data() {
    return this._data;
  }

  get count() {
    return this._count;
  }
}

class FusionItemGoods implements FusionItemGoodsInterface {
  _result: MZ.Item | MZ.Weapon | MZ.Armor;
  _materials: FusionItemMaterial[];
  _gold: number;
  _switchId: number;
  _variableId: number;
  _threshold: number;
  /**
   * @param {MZ.Item | MZ.Weapon | MZ.Armor} result
   * @param {FusionItemMaterial[]} materials
   * @param {number} gold
   * @param {number} switchId
   * @param {number} variableId
   * @param {number} threshold
   */
  constructor(result: MZ.Item | MZ.Weapon | MZ.Armor, materials: FusionItemMaterial[], gold: number, switchId: number, variableId: number, threshold: number) {
    this._result = result;
    this._materials = materials;
    this._gold = gold;
    this._switchId = switchId;
    this._variableId = variableId;
    this._threshold = threshold;
  }

  get result() {
    return this._result;
  }

  get materials() {
    return this._materials;
  }

  get gold() {
    return this._gold;
  }

  /**
   * @return {boolean}
   */
  isValid(): boolean {
    return (
      (!this._switchId || $gameSwitches.value(this._switchId)) &&
      (!this._variableId || $gameVariables.value(this._variableId) > this._threshold)
    );
  }
}

type _FusionItemGoods = typeof FusionItemGoods;
declare global {
  var FusionItemGoods: _FusionItemGoods;
}
globalThis.FusionItemGoods = FusionItemGoods;

/**
 * @param {Game_Party.prototype} gameParty
 */
function Game_Party_FusionItemMixIn(gameParty: Game_Party) {
  /**
   * アイテム融合に使用して良いアイテムの数
   * @param {MZ.Item | MZ.Weapon | MZ.Armor} item
   * @return {number}
   */
  gameParty.numUsableItemsForFusion = function (item) {
    return settings.useEquip ? this.numItemsWithEquip(item) : this.numItems(item);
  };

  /**
   * 所持＋装備しているアイテムの数
   * @param {MZ.Item | MZ.Weapon | MZ.Armor} item
   * @return {number}
   */
  gameParty.numItemsWithEquip = function (item: MZ.Item | MZ.Weapon | MZ.Armor): number {
    return this.numItems(item) + this.numEquippedItem(item);
  };

  /**
   * 装備しているアイテムの数
   * @param {MZ.Item | MZ.Weapon | MZ.Armor} item
   * @return {number}
   */
  gameParty.numEquippedItem = function (item: MZ.Item | MZ.Weapon | MZ.Armor): number {
    return this.members()
      .reduce((result: number, actor: Game_Actor) => result + actor.equips().filter((equip) => equip === item).length, 0);
    };
}

Game_Party_FusionItemMixIn(Game_Party.prototype);

type Constructor<T = Scene_MenuBase> = new (...args: any[]) => T;
function Scene_ShopLikeMixIn<TScene extends Constructor, TBuyWindow>(sceneClass: TScene) {
  return class extends sceneClass {
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

    prepare(goods: FusionItemGoodsInterface[]) {
      this._goods = goods;
      this._item = null;
    }

    create() {
      super.create();
      Scene_Shop.prototype.create.call(this);
    }

    createGoldWindow() {
      Scene_Shop.prototype.createGoldWindow.call(this);
    }

    goldWindowRect() {
      return Scene_Shop.prototype.goldWindowRect.call(this);
    }

    commandWindowRect() {
      return Scene_Shop.prototype.commandWindowRect.call(this);
    }

    createDummyWindow() {
      Scene_Shop.prototype.createDummyWindow.call(this);
    }

    dummyWindowRect() {
      return Scene_Shop.prototype.dummyWindowRect.call(this);
    }

    createNumberWindow() {
      Scene_Shop.prototype.createNumberWindow.call(this);
    }

    numberWindowRect() {
      return Scene_Shop.prototype.numberWindowRect.call(this);
    }

    statusWindowRect() {
      return Scene_Shop.prototype.statusWindowRect.call(this);
    }

    buyWindowRect() {
      return Scene_Shop.prototype.buyWindowRect.call(this);
    }

    createCategoryWindow() {
      Scene_Shop.prototype.createCategoryWindow.call(this);
    }

    categoryWindowRect() {
      return Scene_Shop.prototype.categoryWindowRect.call(this);
    }

    createSellWindow() {
      Scene_Shop.prototype.createSellWindow.call(this);
    }

    sellWindowRect() {
      return Scene_Shop.prototype.sellWindowRect.call(this);
    }

    statusWidth() {
      return Scene_Shop.prototype.statusWidth.call(this);
    }

    activateBuyWindow() {
      Scene_Shop.prototype.activateBuyWindow.call(this);
    }

    activateSellWindow() {
      Scene_Shop.prototype.activateSellWindow.call(this);
    }

    commandBuy() {
      Scene_Shop.prototype.commandBuy.call(this);
    }

    commandSell() {
      Scene_Shop.prototype.commandSell.call(this);
    }

    onCategoryOk() {
      Scene_Shop.prototype.onCategoryCancel.call(this);
    }

    onCategoryCancel() {
      Scene_Shop.prototype.onCategoryCancel.call(this);
    }

    onBuyOk() {
      Scene_Shop.prototype.onBuyOk.call(this);
    }

    onSellOk() {
      Scene_Shop.prototype.onSellOk.call(this);
    }

    onSellCancel() {
      Scene_Shop.prototype.onSellCancel.call(this);
    }

    onNumberOk() {
      Scene_Shop.prototype.onNumberOk.call(this);
    }

    onNumberCancel() {
      Scene_Shop.prototype.onNumberCancel.call(this);
    }

    doBuy(number: number) {
      Scene_Shop.prototype.doBuy.call(this, number);
    }

    doSell(number: number) {
      Scene_Shop.prototype.doSell.call(this, number);
    }

    endNumberInput() {
      Scene_Shop.prototype.endNumberInput.call(this);
    }

    maxBuy() {
      return Scene_Shop.prototype.maxBuy.call(this);
    }

    maxSell() {
      return Scene_Shop.prototype.maxSell.call(this);
    }

    money() {
      return Scene_Shop.prototype.money.call(this);
    }

    currencyUnit() {
      return Scene_Shop.prototype.currencyUnit.call(this);
    }

    sellingPrice() {
      return Scene_Shop.prototype.sellingPrice.call(this);
    }
  }
}

class Scene_FusionItem extends Scene_ShopLikeMixIn<typeof Scene_MenuBase, Window_FusionShopBuy>(Scene_MenuBase) {
  _materials: FusionItemMaterialInterface[] = [];

  /**
   * 融合する やめるの2択しかないので、ゲームパッド・キーボード操作の場合は不要
   * タッチ操作対応しようとするとボタン表示が面倒なので、コマンドウィンドウで済ませる
   * 不要派には拡張プラグインで対応してもらう
   */
  createCommandWindow() {
    const rect = this.commandWindowRect();
    this._commandWindow = new Window_FusionShopCommand(rect);
    this._commandWindow.y = this.mainAreaTop();
    this._commandWindow.setHandler('buy', this.commandBuy.bind(this));
    this._commandWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._commandWindow);
  }

  createStatusWindow() {
    const rect = this.statusWindowRect();
    this._statusWindow = new Window_FusionShopStatus(rect);
    this.addWindow(this._statusWindow);
  }

  createBuyWindow() {
    const rect = this.buyWindowRect();
    this._buyWindow = new Window_FusionShopBuy(rect);
    this._buyWindow.setupFusionGoods(this._goods);
    this._buyWindow.setMoney($gameParty.gold());
    this._buyWindow.setHelpWindow(this._helpWindow);
    this._buyWindow.setStatusWindow(this._statusWindow);
    this._buyWindow.setHandler('ok', this.onBuyOk.bind(this));
    this._buyWindow.setHandler('cancel', this.onBuyCancel.bind(this));
    this.addWindow(this._buyWindow);
  }

  onBuyOk() {
    this._materials = this._buyWindow.materials();
    super.onBuyOk();
  }

  onBuyCancel() {
    this._commandWindow.activate();
    this._dummyWindow.show();
    this._statusWindow.setItem(null);
    this._helpWindow.clear();
  }

  doBuy(number: number) {
    super.doBuy(number);
    this._materials.forEach((material) => {
      $gameParty.loseItem(material.data, material.count * number, settings.useEquip);
    });
  }

  maxBuy() {
    const max = super.maxBuy();
    return this._materials.reduce((prev, current) => {
      return Math.min(prev, Math.floor($gameParty.numUsableItemsForFusion(current.data) / current.count));
    }, max);
  }

  buyingPrice() {
    return this._buyWindow.price();
  }
}

type _Scene_FusionItem = typeof Scene_FusionItem;
declare global {
  var Scene_FusionItem: _Scene_FusionItem;
}
globalThis.Scene_FusionItem = Scene_FusionItem;

class Window_FusionShopCommand extends Window_ShopCommand {
  makeCommandList() {
    this.addCommand(settings.commandName, 'buy');
    this.addCommand(TextManager.cancel, 'cancel');
  }

  maxCols() {
    return 2;
  }
}

class Window_FusionShopStatus extends Window_ShopStatus {
  _materials: FusionItemMaterialInterface[] = [];
  refresh() {
    this.contents.clear();
    if (this._item) {
      const x = this.itemPadding();
      this.drawPossession(x, 0);
      this.drawMaterials(x, this.lineHeight());
    }
  }

  setMaterials(materials: FusionItemMaterialInterface[]) {
    this._materials = materials;
    this.refresh();
  }

  materialLineHeight() {
    return this.lineHeight();
  }

  drawMaterials(x: number, y: number) {
    if (this._materials) {
      const width = this.innerWidth - this.itemPadding() - x;
      this.changeTextColor(ColorManager.systemColor());
      this.drawText('必要素材', x, y, width);
      this.resetTextColor();
      const countWidth = this.textWidth('00/00');
      this._materials.forEach((material, index) => {
        const materialY = y + (index + 1) * this.materialLineHeight();
        this.drawText(material.data.name, x, materialY, width - countWidth);
        this.drawText(
          `${$gameParty.numUsableItemsForFusion(material.data)}/${material.count}`,
          x,
          materialY,
          width,
          'right'
        );
      });
    }
  }
}

class Window_FusionShopBuy extends Window_ShopBuy {
  _fusionGoods: FusionItemGoodsInterface[] = [];
  _materials: FusionItemMaterialInterface[][] = [];
  _statusWindow: Window_FusionShopStatus|null = null;

  setupFusionGoods(fusionGoods: FusionItemGoodsInterface[]) {
    this._fusionGoods = fusionGoods;
    this.refresh();
    this.select(0);
  }

  materials(): FusionItemMaterialInterface[] {
    return this.materialsAt(this.index());
  }

  materialsAt(index: number): FusionItemMaterialInterface[] {
    return this._materials && index >= 0 ? this._materials[index] : [];
  }

  isCurrentItemEnabled() {
    return this.isEnabledAt(this.index());
  }

  /**
   * 元の実装は同一アイテムに対して複数の価格設定があることを考慮していないため、上書きする
   * @return {number}
   */
  price(): number {
    return this.priceAt(this.index());
  }

  /**
   * @param {number} index
   * @return {number}
   */
  priceAt(index: number): number {
    return this._price[index] || 0;
  }

  /**
   * index単位でなければ一意に定まらないため、別メソッドとして定義する
   */
  isEnabledAt(index: number): boolean {
    const item = this.itemAt(index);
    const materials = this.materialsAt(index);
    return (
      !!item &&
      this.priceAt(index) <= this._money &&
      !$gameParty.hasMaxItems(item) &&
      materials.every((material) => $gameParty.numUsableItemsForFusion(material.data) >= material.count)
    );
  }

  /**
   * @deprecated isEnabledAtを利用してください。
   */
  isEnabled(item: MZ.Item|MZ.Weapon|MZ.Armor): boolean {
    return this._data ? this.isEnabledAt(this._data.indexOf(item)) : false;
  }

  includes(goods: FusionItemGoodsInterface): boolean {
    return goods.isValid();
  }

  makeItemList() {
    this._data = [];
    this._price = [];
    this._materials = [];
    this._fusionGoods
      .filter((goods) => this.includes(goods))
      .forEach((goods) => {
        this._data.push(goods.result);
        this._price.push(goods.gold);
        this._materials.push(goods.materials);
      });
  }

  drawItem(index: number) {
    const item = this.itemAt(index);
    const price = this.priceAt(index);
    const rect = this.itemLineRect(index);
    const priceWidth = this.priceWidth();
    const nameWidth = rect.width - priceWidth;
    this.changePaintOpacity(this.isEnabledAt(index));
    this.drawItemName(item, rect.x, rect.y, nameWidth);
    this.drawPrice(price, rect.x + rect.width - priceWidth, rect.y, priceWidth);
    this.changePaintOpacity(true);
  }

  drawPrice(price: number, x: number, y: number, width: number) {
    this.drawText(`${price}`, x, y, width, 'right');
  }

  updateHelp() {
    super.updateHelp();
    if (this._statusWindow) {
      this._statusWindow.setMaterials(this.materials());
    }
  }
}

type _Window_FusionShopStatus = typeof Window_FusionShopStatus;
type _Window_FusionShopBuy = typeof Window_FusionShopBuy;
declare global {
  var Window_FusionShopStatus: _Window_FusionShopStatus;
  var Window_FusionShopBuy: _Window_FusionShopBuy;
}
globalThis.Window_FusionShopStatus = Window_FusionShopStatus;
globalThis.Window_FusionShopBuy = Window_FusionShopBuy;
