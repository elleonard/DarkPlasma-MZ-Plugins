// DarkPlasma_FusionItem 2.1.1
// Copyright (c) 2022 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2025/02/13 2.1.1 融合可能条件のデフォルト値が意図しない型になっていた不具合の修正
 * 2024/12/28 2.1.0 品揃えフィルタ用インターフェース追加
 * 2024/12/19 2.0.1 価格による有効判定が正常でない不具合の修正
 * 2024/10/04 2.0.0 所持数限界まで持っているアイテムを融合で作れる不具合の修正
 *                  コアスクリプトの型との互換性を破壊しないよう変更 (Breaking Change)
 * 2023/12/27 1.3.1 品揃え情報のインターフェース化
 * 2023/05/13 1.3.0 価格描画を関数に切り出す
 *                  商品ウィンドウクラス定義をグローバルに公開
 * 2022/12/11 1.2.3 リファクタ
 * 2022/09/04 1.2.2 typescript移行
 * 2022/07/03 1.2.1 コマンドウィンドウのコマンド表示幅変更
 * 2022/04/22 1.2.0 条件カスタマイズ用にクラス定義をグローバルに公開
 * 2022/03/14 1.1.0 レイアウト用にクラス定義をグローバルに公開
 * 2022/03/13 1.0.0 公開
 */

/*:
 * @plugindesc アイテム融合ショップ
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param presets
 * @text 品揃えプリセット
 * @type struct<FusionGoods>[]
 * @default []
 *
 * @param useEquip
 * @desc ONの場合、融合素材に装備しているものを使用します。
 * @text 装備しているものを使うか
 * @type boolean
 * @default false
 *
 * @param commandName
 * @desc ショップを開いた際に表示されるコマンド名
 * @text 融合コマンド名
 * @type string
 * @default 融合する
 *
 * @command fusionShop
 * @text 融合ショップを開く
 * @arg presetIds
 * @text プリセットIDリスト
 * @desc プラグインパラメータで設定したプリセットIDを指定します。複数指定した場合、マージされます。
 * @type number[]
 *
 * @help
 * version: 2.1.1
 * 複数のアイテム、武器、防具、お金を
 * ひとつのアイテムに変換する融合ショップを提供します。
 *
 * プラグインパラメータで品揃えプリセットを登録し、
 * プラグインコマンドでプリセットIDを指定してください。
 */
/*~struct~FusionGoods:
 * @param id
 * @desc プラグインコマンド実行時に指定するプリセットID
 * @text ID
 * @type number
 *
 * @param items
 * @text 融合アイテム品揃え
 * @type struct<FusionGoodItem>[]
 * @default []
 *
 * @param weapons
 * @text 融合武器品揃え
 * @type struct<FusionGoodWeapon>[]
 * @default []
 *
 * @param armors
 * @text 融合防具品揃え
 * @type struct<FusionGoodArmor>[]
 * @default []
 */
/*~struct~FusionGoodItem:
 * @param result
 * @text 融合結果アイテム
 * @type item
 *
 * @param base
 * @text 融合メタ情報
 * @type struct<FusionGoodBase>
 * @default {"materialItems":"[]", "materialWeapons":"[]", "materialArmors":"[]", "gold":"0", "condition":"0"}
 */
/*~struct~FusionGoodWeapon:
 * @param result
 * @text 融合結果武器
 * @type weapon
 *
 * @param base
 * @text 融合メタ情報
 * @type struct<FusionGoodBase>
 * @default {"materialItems":"[]", "materialWeapons":"[]", "materialArmors":"[]", "gold":"0", "condition":"0"}
 */
/*~struct~FusionGoodArmor:
 * @param result
 * @text 融合結果防具
 * @type armor
 *
 * @param base
 * @text 融合メタ情報
 * @type struct<FusionGoodBase>
 * @default {"materialItems":"[]", "materialWeapons":"[]", "materialArmors":"[]", "gold":"0", "condition":"0"}
 */
/*~struct~FusionGoodBase:
 * @param materialItems
 * @text 融合素材アイテムリスト
 * @type struct<MaterialItem>[]
 * @default []
 *
 * @param materialWeapons
 * @text 融合素材武器リスト
 * @type struct<MaterialWeapon>[]
 * @default []
 *
 * @param materialArmors
 * @text 融合素材防具リスト
 * @type struct<MaterialArmor>[]
 * @default []
 *
 * @param gold
 * @text 価格
 * @type number
 * @default 0
 *
 * @param condition
 * @desc 指定した場合、この条件がすべて満たされる場合のみ融合ショップに表示します。
 * @text 融合可能条件
 * @type struct<FusionGoodCondition>
 * @default {"switchId":"0", "variableId":"0", "threshold":"0"}
 */
/*~struct~MaterialItem:
 * @param id
 * @text アイテム
 * @type item
 *
 * @param count
 * @text 個数
 * @type number
 * @default 1
 * @min 1
 */
/*~struct~MaterialWeapon:
 * @param id
 * @text 武器
 * @type weapon
 *
 * @param count
 * @text 個数
 * @type number
 * @default 1
 * @min 1
 */
/*~struct~MaterialArmor:
 * @param id
 * @text 防具
 * @type armor
 *
 * @param count
 * @text 個数
 * @type number
 * @default 1
 * @min 1
 */
/*~struct~FusionGoodCondition:
 * @param switchId
 * @desc 指定した場合、このスイッチがONの場合のみ融合ショップに表示します。
 * @text スイッチ
 * @type switch
 * @default 0
 *
 * @param variableId
 * @desc 指定した場合、この変数が閾値より大の場合のみ融合ショップに表示します。
 * @text 変数
 * @type variable
 * @default 0
 *
 * @param threshold
 * @text 閾値
 * @type number
 * @default 0
 */
(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  function parseArgs_fusionShop(args) {
    return {
      presetIds: JSON.parse(args.presetIds || '[]').map((e) => {
        return Number(e || 0);
      }),
    };
  }

  const command_fusionShop = 'fusionShop';

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    presets: JSON.parse(pluginParameters.presets || '[]').map((e) => {
      return ((parameter) => {
        const parsed = JSON.parse(parameter);
        return {
          id: Number(parsed.id || 0),
          items: JSON.parse(parsed.items || '[]').map((e) => {
            return ((parameter) => {
              const parsed = JSON.parse(parameter);
              return {
                result: Number(parsed.result || 0),
                base: ((parameter) => {
                  const parsed = JSON.parse(parameter);
                  return {
                    materialItems: JSON.parse(parsed.materialItems || '[]').map((e) => {
                      return ((parameter) => {
                        const parsed = JSON.parse(parameter);
                        return {
                          id: Number(parsed.id || 0),
                          count: Number(parsed.count || 1),
                        };
                      })(e || '{}');
                    }),
                    materialWeapons: JSON.parse(parsed.materialWeapons || '[]').map((e) => {
                      return ((parameter) => {
                        const parsed = JSON.parse(parameter);
                        return {
                          id: Number(parsed.id || 0),
                          count: Number(parsed.count || 1),
                        };
                      })(e || '{}');
                    }),
                    materialArmors: JSON.parse(parsed.materialArmors || '[]').map((e) => {
                      return ((parameter) => {
                        const parsed = JSON.parse(parameter);
                        return {
                          id: Number(parsed.id || 0),
                          count: Number(parsed.count || 1),
                        };
                      })(e || '{}');
                    }),
                    gold: Number(parsed.gold || 0),
                    condition: ((parameter) => {
                      const parsed = JSON.parse(parameter);
                      return {
                        switchId: Number(parsed.switchId || 0),
                        variableId: Number(parsed.variableId || 0),
                        threshold: Number(parsed.threshold || 0),
                      };
                    })(parsed.condition || '{"switchId":"0", "variableId":"0", "threshold":"0"}'),
                  };
                })(
                  parsed.base ||
                    '{"materialItems":[], "materialWeapons":[], "materialArmors":[], "gold":"0", "condition":"0"}',
                ),
              };
            })(e || '{}');
          }),
          weapons: JSON.parse(parsed.weapons || '[]').map((e) => {
            return ((parameter) => {
              const parsed = JSON.parse(parameter);
              return {
                result: Number(parsed.result || 0),
                base: ((parameter) => {
                  const parsed = JSON.parse(parameter);
                  return {
                    materialItems: JSON.parse(parsed.materialItems || '[]').map((e) => {
                      return ((parameter) => {
                        const parsed = JSON.parse(parameter);
                        return {
                          id: Number(parsed.id || 0),
                          count: Number(parsed.count || 1),
                        };
                      })(e || '{}');
                    }),
                    materialWeapons: JSON.parse(parsed.materialWeapons || '[]').map((e) => {
                      return ((parameter) => {
                        const parsed = JSON.parse(parameter);
                        return {
                          id: Number(parsed.id || 0),
                          count: Number(parsed.count || 1),
                        };
                      })(e || '{}');
                    }),
                    materialArmors: JSON.parse(parsed.materialArmors || '[]').map((e) => {
                      return ((parameter) => {
                        const parsed = JSON.parse(parameter);
                        return {
                          id: Number(parsed.id || 0),
                          count: Number(parsed.count || 1),
                        };
                      })(e || '{}');
                    }),
                    gold: Number(parsed.gold || 0),
                    condition: ((parameter) => {
                      const parsed = JSON.parse(parameter);
                      return {
                        switchId: Number(parsed.switchId || 0),
                        variableId: Number(parsed.variableId || 0),
                        threshold: Number(parsed.threshold || 0),
                      };
                    })(parsed.condition || '{"switchId":"0", "variableId":"0", "threshold":"0"}'),
                  };
                })(
                  parsed.base ||
                    '{"materialItems":[], "materialWeapons":[], "materialArmors":[], "gold":"0", "condition":"0"}',
                ),
              };
            })(e || '{}');
          }),
          armors: JSON.parse(parsed.armors || '[]').map((e) => {
            return ((parameter) => {
              const parsed = JSON.parse(parameter);
              return {
                result: Number(parsed.result || 0),
                base: ((parameter) => {
                  const parsed = JSON.parse(parameter);
                  return {
                    materialItems: JSON.parse(parsed.materialItems || '[]').map((e) => {
                      return ((parameter) => {
                        const parsed = JSON.parse(parameter);
                        return {
                          id: Number(parsed.id || 0),
                          count: Number(parsed.count || 1),
                        };
                      })(e || '{}');
                    }),
                    materialWeapons: JSON.parse(parsed.materialWeapons || '[]').map((e) => {
                      return ((parameter) => {
                        const parsed = JSON.parse(parameter);
                        return {
                          id: Number(parsed.id || 0),
                          count: Number(parsed.count || 1),
                        };
                      })(e || '{}');
                    }),
                    materialArmors: JSON.parse(parsed.materialArmors || '[]').map((e) => {
                      return ((parameter) => {
                        const parsed = JSON.parse(parameter);
                        return {
                          id: Number(parsed.id || 0),
                          count: Number(parsed.count || 1),
                        };
                      })(e || '{}');
                    }),
                    gold: Number(parsed.gold || 0),
                    condition: ((parameter) => {
                      const parsed = JSON.parse(parameter);
                      return {
                        switchId: Number(parsed.switchId || 0),
                        variableId: Number(parsed.variableId || 0),
                        threshold: Number(parsed.threshold || 0),
                      };
                    })(parsed.condition || '{"switchId":"0", "variableId":"0", "threshold":"0"}'),
                  };
                })(
                  parsed.base ||
                    '{"materialItems":[], "materialWeapons":[], "materialArmors":[], "gold":"0", "condition":"0"}',
                ),
              };
            })(e || '{}');
          }),
        };
      })(e || '{}');
    }),
    useEquip: String(pluginParameters.useEquip || false) === 'true',
    commandName: String(pluginParameters.commandName || `融合する`),
  };

  function toFusionItemGood(data, item) {
    return new FusionItemGoods(
      data,
      item.base.materialItems
        .map((material) => new FusionItemMaterial($dataItems[material.id], material.count))
        .concat(
          item.base.materialWeapons.map(
            (material) => new FusionItemMaterial($dataWeapons[material.id], material.count),
          ),
        )
        .concat(
          item.base.materialArmors.map((material) => new FusionItemMaterial($dataArmors[material.id], material.count)),
        ),
      item.base.gold,
      item.base.condition.switchId,
      item.base.condition.variableId,
      item.base.condition.threshold,
    );
  }
  PluginManager.registerCommand(pluginName, command_fusionShop, function (args) {
    const parsedArgs = parseArgs_fusionShop(args);
    const goods = parsedArgs.presetIds
      .map((presetId) => {
        const preset = settings.presets.find((preset) => preset.id === presetId);
        if (!preset) {
          throw `無効なプリセットIDが指定されています。 ${presetId}`;
        }
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
  globalThis.FusionItemGoods = FusionItemGoods;
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
      return this.members().reduce(
        (result, actor) => result + actor.equips().filter((equip) => equip === item).length,
        0,
      );
    };
  }
  Game_Party_FusionItemMixIn(Game_Party.prototype);
  function Scene_ShopLikeMixIn(sceneClass) {
    return class extends sceneClass {
      prepare(goods) {
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
      doBuy(number) {
        Scene_Shop.prototype.doBuy.call(this, number);
      }
      doSell(number) {
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
    };
  }
  class Scene_FusionItem extends Scene_ShopLikeMixIn(Scene_MenuBase) {
    constructor() {
      super(...arguments);
      this._materials = [];
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
    maxCols() {
      return 2;
    }
  }
  class Window_FusionShopStatus extends Window_ShopStatus {
    constructor() {
      super(...arguments);
      this._materials = [];
    }
    refresh() {
      this.contents.clear();
      if (this._item) {
        const x = this.itemPadding();
        this.drawPossession(x, 0);
        this.drawMaterials(x, this.lineHeight());
      }
    }
    setMaterials(materials) {
      this._materials = materials;
      this.refresh();
    }
    materialLineHeight() {
      return this.lineHeight();
    }
    drawMaterials(x, y) {
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
            'right',
          );
        });
      }
    }
  }
  class Window_FusionShopBuy extends Window_ShopBuy {
    constructor() {
      super(...arguments);
      this._fusionGoods = [];
      this._materials = [];
      this._statusWindow = null;
    }
    setupFusionGoods(fusionGoods) {
      this._fusionGoods = fusionGoods;
      this.refresh();
      this.select(0);
    }
    materials() {
      return this.materialsAt(this.index());
    }
    materialsAt(index) {
      return this._materials && index >= 0 ? this._materials[index] : [];
    }
    isCurrentItemEnabled() {
      return this.isEnabledAt(this.index());
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
     * index単位でなければ一意に定まらないため、別メソッドとして定義する
     */
    isEnabledAt(index) {
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
    isEnabled(item) {
      return this._data ? this.isEnabledAt(this._data.indexOf(item)) : false;
    }
    includes(goods) {
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
    drawItem(index) {
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
    drawPrice(price, x, y, width) {
      this.drawText(`${price}`, x, y, width, 'right');
    }
    updateHelp() {
      super.updateHelp();
      if (this._statusWindow) {
        this._statusWindow.setMaterials(this.materials());
      }
    }
  }
  globalThis.Window_FusionShopStatus = Window_FusionShopStatus;
  globalThis.Window_FusionShopBuy = Window_FusionShopBuy;
})();
