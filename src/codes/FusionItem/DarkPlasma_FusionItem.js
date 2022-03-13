import { pluginName } from '../../common/pluginName';
import { parseArgs_fusionShop } from './_build/DarkPlasma_FusionItem_commands';
import { settings } from './_build/DarkPlasma_FusionItem_parameters';

/**
 * @param {MZ.Item | MZ.Weapon | MZ.Armor} data
 * @param {object} item
 * @returns
 */
function toFusionItemGood(data, item) {
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

PluginManager.registerCommand(pluginName, 'fusionShop', function (args) {
  const parsedArgs = parseArgs_fusionShop(args);
  const goods = parsedArgs.presetIds
    .map((presetId) => {
      const preset = settings.presets.find((preset) => preset.id === presetId);
      return preset.items
        .map((item) => toFusionItemGood($dataItems[item.result], item))
        .concat(preset.weapons.map((weapon) => toFusionItemGood($dataWeapons[weapon.result], weapon)))
        .concat(preset.armors.map((armor) => toFusionItemGood($dataArmors[armor.result], armor)));
    })
    .flat();
  SceneManager.push(Scene_FusionItem);
  SceneManager.prepareNextScene(goods);
});

class FusionItemMaterial {
  /**
   * @param {MZ.Item | MZ.Weapon | MZ.Armor} data
   * @param {number} count
   */
  constructor(data, count) {
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

class FusionItemGoods {
  /**
   * @param {MZ.Item | MZ.Weapon | MZ.Armor} result
   * @param {FusionItemMaterial[]} materials
   * @param {number} gold
   * @param {number} switchId
   * @param {number} variableId
   * @param {number} threshold
   */
  constructor(result, materials, gold, switchId, variableId, threshold) {
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
  isValid() {
    return (
      (!this._switchId || $gameSwitches.value(this._switchId)) &&
      (!this._variableId || $gameVariables.value(this._variableId) > this._threshold)
    );
  }
}

/**
 * @param {Game_Party.prototype} gameParty
 */
function Game_Party_FusionItemMixIn(gameParty) {
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
  gameParty.numItemsWithEquip = function (item) {
    return this.numItems(item) + this.numEquippedItem(item);
  };

  /**
   * 装備しているアイテムの数
   * @param {MZ.Item | MZ.Weapon | MZ.Armor} item
   * @return {number}
   */
  gameParty.numEquippedItem = function (item) {
    return this.members().reduce((result, actor) => result + actor.equips().filter((equip) => equip === item), 0)
      .length;
  };
}

Game_Party_FusionItemMixIn(Game_Party.prototype);

class Scene_FusionItem extends Scene_Shop {
  /**
   * @param {FusionItemGoods[]} goods
   */
  prepare(goods) {
    super.prepare(goods, true);
  }

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
    this._buyWindow.setupGoods(this._goods);
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

  doBuy(number) {
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

globalThis.Scene_FusionItem = Scene_FusionItem;

class Window_FusionShopCommand extends Window_ShopCommand {
  makeCommandList() {
    this.addCommand(settings.commandName, 'buy');
    this.addCommand(TextManager.cancel, 'cancel');
  }
}

class Window_FusionShopStatus extends Window_ShopStatus {
  refresh() {
    this.contents.clear();
    if (this._item) {
      const x = this.itemPadding();
      this.drawPossession(x, 0);
      this.drawMaterials(x, this.lineHeight());
    }
  }

  /**
   * @param {FusionItemMaterial[]} materials
   */
  setMaterials(materials) {
    this._materials = materials;
    this.refresh();
  }

  drawMaterials(x, y) {
    if (this._materials) {
      const width = this.innerWidth - this.itemPadding() - x;
      this.changeTextColor(ColorManager.systemColor());
      this.drawText('必要素材', x, y, width);
      this.resetTextColor();
      const countWidth = this.textWidth('00/00');
      this._materials.forEach((material, index) => {
        const materialY = y + (index + 1) * this.lineHeight();
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
  /**
   * @return {FusionItemMaterial[]}
   */
  materials() {
    return this.materialsAt(this.index());
  }

  /**
   * @param {number} index
   * @return {FusionItemMaterial[]}
   */
  materialsAt(index) {
    return this._materials && index >= 0 ? this._materials[index] : [];
  }

  isCurrentItemEnabled() {
    return this.isEnabled(this.index());
  }

  /**
   * 元の実装は同一アイテムに対して複数の価格設定があることを考慮していないため、上書きする
   * @return {number}
   */
  price() {
    return this.priceAt(this.index());
  }

  /**
   * @param {number} index
   * @return {number}
   */
  priceAt(index) {
    return this._price[index] || 0;
  }

  /**
   * @param {number} index
   * @return {boolean}
   */
  isEnabled(index) {
    const item = this.itemAt(index);
    const materials = this.materialsAt(index);
    return (
      item &&
      this.priceAt(index) <= this._money &&
      materials.every((material) => $gameParty.numUsableItemsForFusion(material.data) >= material.count)
    );
  }

  makeItemList() {
    this._data = [];
    this._price = [];
    this._materials = [];
    this._shopGoods
      .filter((goods) => goods.isValid())
      .forEach((goods) => {
        this._data.push(goods.result);
        this._price.push(goods.gold);
        this._materials.push(goods.materials);
      });
  }

  drawItem(index) {
    const item = this.itemAt(index);
    const price = this.priceAt(index);
    const rect = this.itemLineRect(index);
    const priceWidth = this.priceWidth();
    const priceX = rect.x + rect.width - priceWidth;
    const nameWidth = rect.width - priceWidth;
    this.changePaintOpacity(this.isEnabled(index));
    this.drawItemName(item, rect.x, rect.y, nameWidth);
    this.drawText(price, priceX, rect.y, priceWidth, 'right');
    this.changePaintOpacity(true);
  }

  updateHelp() {
    super.updateHelp();
    if (this._statusWindow) {
      this._statusWindow.setMaterials(this.materials());
    }
  }
}
