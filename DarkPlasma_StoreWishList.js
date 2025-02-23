// DarkPlasma_StoreWishList 1.0.0
// Copyright (c) 2025 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2025/02/23 1.0.0 公開
 */

/*:
 * @plugindesc ウィッシュリストの保存と表示
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param wishListRegisteredColor
 * @desc ウィッシュリスト登録済みアイテムの色を指定します。
 * @text 登録済み色
 * @type color
 * @default 24
 *
 * @param emptyText
 * @desc ウィッシュリストが空の時に表示するテキストを設定します。
 * @text 空の時のテキスト
 * @type string
 * @default ウィッシュリストに何も登録されていません
 *
 * @param resultLabel
 * @desc ウィッシュリストに表示する成果物のラベルを設定します。
 * @text 成果物ラベル
 * @type string
 * @default 成果物
 *
 * @param materialLabel
 * @desc ウィッシュリストに表示する素材のラベルを設定します。
 * @text 素材ラベル
 * @type string
 * @default 素材
 *
 * @command sceneWishList
 * @text ウィッシュリストを開く
 *
 * @help
 * version: 1.0.0
 * ウィッシュリストを保存・表示します。
 *
 * アイテム合成などでの必要素材をウィッシュリストとして保存し、
 * 一覧を表示するプラグインです。
 * ウィッシュリストに追加したアイテムは、
 * 入手した時点でウィッシュリストから外れます。
 *
 * ウィッシュリスト表示シーンを開く
 * SceneManager.push(Scene_WishList);
 *
 * 本プラグインはセーブデータを拡張します。
 * ウィッシュリストの情報をセーブデータに追加します。
 *
 * ウィッシュリストへの登録・削除は拡張プラグインを利用してください。
 * DarkPlasma_WishListForFusionItem.jsを利用すると
 * DarkPlasma_FusionItem.jsで追加するアイテム融合ショップで
 * ウィッシュリスト登録・削除が可能になります。
 *
 * 拡張プラグインを作るためのインターフェースは
 * 配布元リポジトリmasterブランチにある
 * TypeScriptの型定義を参照してください。
 *
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const KIND = {
    ITEM: 1,
    WEAPON: 2,
    ARMOR: 3,
  };
  function DataManagerMixIn(dataManager) {
    dataManager.kindOf = function (data) {
      if (DataManager.isItem(data)) {
        return KIND.ITEM;
      } else if (DataManager.isWeapon(data)) {
        return KIND.WEAPON;
      } else if (DataManager.isArmor(data)) {
        return KIND.ARMOR;
      } else {
        return undefined;
      }
    };
    dataManager.dataObject = function (kind, dataId) {
      switch (kind) {
        case KIND.ITEM:
          return $dataItems[dataId];
        case KIND.WEAPON:
          return $dataWeapons[dataId];
        case KIND.ARMOR:
          return $dataArmors[dataId];
        default:
          return null;
      }
    };
  }

  const command_sceneWishList = 'sceneWishList';

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    wishListRegisteredColor: pluginParameters.wishListRegisteredColor?.startsWith('#')
      ? String(pluginParameters.wishListRegisteredColor)
      : Number(pluginParameters.wishListRegisteredColor || 24),
    emptyText: String(pluginParameters.emptyText || `ウィッシュリストに何も登録されていません`),
    resultLabel: String(pluginParameters.resultLabel || `成果物`),
    materialLabel: String(pluginParameters.materialLabel || `素材`),
  };

  PluginManager.registerCommand(pluginName, command_sceneWishList, function () {
    SceneManager.push(Scene_WishList);
  });
  ColorManager.wishListRegisteredColor = function () {
    return typeof settings.wishListRegisteredColor === 'string'
      ? settings.wishListRegisteredColor
      : this.textColor(settings.wishListRegisteredColor);
  };
  DataManagerMixIn(DataManager);
  class Game_WishListItem {
    constructor(result, materials) {
      this._result = result;
      this._materials = materials;
    }
    get result() {
      return this._result;
    }
    get materials() {
      return this._materials;
    }
    resultData() {
      return DataManager.dataObject(this._result.kind, this._result.dataId);
    }
  }
  class Game_WishList {
    constructor() {
      this._items = [];
    }
    get items() {
      return this._items;
    }
    add(data, materials) {
      const wishListItem = new Game_WishListItem(this.toItemWeaponArmorId(data), materials);
      const index = this._items.findIndex(
        (item) => item.result.dataId === wishListItem.result.dataId && item.result.kind === wishListItem.result.kind,
      );
      if (index >= 0) {
        this._items[index] = wishListItem;
      } else {
        this._items.push(wishListItem);
      }
    }
    delete(data) {
      const result = this.toItemWeaponArmorId(data);
      this._items = this._items.filter(
        (item) => item.result.dataId !== result.dataId || item.result.kind !== result.kind,
      );
    }
    item(data) {
      const result = this.toItemWeaponArmorId(data);
      return this._items.find((item) => item.result.dataId === result.dataId && item.result.kind === result.kind);
    }
    isInList(data) {
      const result = this.toItemWeaponArmorId(data);
      return this._items.some((item) => item.result.dataId === result.dataId && item.result.kind === result.kind);
    }
    isMaterialCompleted(data) {
      const item = this.item(data);
      return (
        !!item &&
        item.materials.every(
          (material) => $gameParty.numItems(DataManager.dataObject(material.kind, material.dataId)) >= material.count,
        )
      );
    }
    itemsHaveMaterial(material) {
      return this.items.filter((item) =>
        item.materials.some((m) => m.dataId === material.id && m.kind === DataManager.kindOf(material)),
      );
    }
    toItemWeaponArmorId(data) {
      return {
        kind: DataManager.kindOf(data),
        dataId: data.id,
      };
    }
  }
  function Game_Party_WishListMixIn(gameParty) {
    gameParty.wishList = function () {
      if (!this._wishList) {
        this._wishList = new Game_WishList();
      }
      return this._wishList;
    };
    gameParty.addWishListItem = function (result, materials) {
      this.wishList().add(result, materials);
    };
    gameParty.deleteWishListItem = function (result) {
      this.wishList().delete(result);
    };
    gameParty.isInWishList = function (result) {
      return !!result && this.wishList().isInList(result);
    };
    const _gainItem = gameParty.gainItem;
    gameParty.gainItem = function (item, amount, includeEquip) {
      _gainItem.call(this, item, amount, includeEquip);
      if (item && amount > 0) {
        if (this.isInWishList(item)) {
          this.deleteWishListItem(item);
        }
      }
    };
  }
  Game_Party_WishListMixIn(Game_Party.prototype);
  class Scene_WishList extends Scene_MenuBase {
    create() {
      super.create();
      this.createHelpWindow();
      this.createListWindow();
      this.createWishListDetailWindow();
    }
    start() {
      super.start();
      this._listWindow.activate();
    }
    createListWindow() {
      this._listWindow = new Window_WishList(this.listWindowRect());
      this._listWindow.setHelpWindow(this._helpWindow);
      this._listWindow.setHandler('ok', () => this.onListOk());
      this._listWindow.setHandler('cancel', () => this.onListCancel());
      this.addWindow(this._listWindow);
    }
    createWishListDetailWindow() {
      this._wishListDetailWindow = new Window_WishListDetail(this.wishListDetailWindowRect());
      this._wishListDetailWindow.setHelpWindow(this._helpWindow);
      this._wishListDetailWindow.setHandler('cancel', () => this.onWishListDetailCancel());
      this._listWindow.setWishListDetailWindow(this._wishListDetailWindow);
      this.addWindow(this._wishListDetailWindow);
    }
    listWindowRect() {
      return new Rectangle(0, this.mainAreaTop(), Math.floor(Graphics.boxWidth / 2), this.mainAreaHeight());
    }
    wishListDetailWindowRect() {
      const listWindowRect = this.listWindowRect();
      const x = listWindowRect.x + listWindowRect.width;
      return new Rectangle(x, this.mainAreaTop(), Graphics.boxWidth - x, this.mainAreaHeight());
    }
    onListOk() {
      this._listWindow.deactivate();
      this._wishListDetailWindow.activate();
      this._wishListDetailWindow.select(0);
      this._wishListDetailWindow.updateHelp();
    }
    onListCancel() {
      this.popScene();
    }
    onWishListDetailCancel() {
      this._wishListDetailWindow.deselect();
      this._wishListDetailWindow.deactivate();
      this._listWindow.activate();
      this._listWindow.updateHelp();
    }
  }
  class Window_WishList extends Window_Selectable {
    setWishListDetailWindow(detailWindow) {
      this._wishListDetailWindow = detailWindow;
      this.refresh();
    }
    makeItemList() {
      this._data = $gameParty.wishList().items;
    }
    maxItems() {
      return this._data ? this._data.length : 1;
    }
    item() {
      return this.itemAt(this.index());
    }
    itemAt(index) {
      return this._data ? this._data[index] || null : null;
    }
    isCurrentItemEnabled() {
      return !!this.item();
    }
    drawAllItems() {
      if (this.maxItems() === 0) {
        this.drawText(settings.emptyText, 0, 0, this.innerWidth);
      } else {
        super.drawAllItems();
      }
    }
    drawItem(index) {
      const item = this.itemAt(index);
      if (item) {
        const rect = this.itemLineRect(index);
        this.drawItemName(item.resultData() || null, rect.x, rect.y, rect.width);
      }
    }
    updateHelp() {
      super.updateHelp();
      this.setHelpWindowItem(this.item()?.resultData() || null);
      if (this._wishListDetailWindow) {
        this._wishListDetailWindow.setItem(this.item());
      }
    }
    refresh() {
      this.makeItemList();
      super.refresh();
    }
  }
  class Window_WishListDetail extends Window_Selectable {
    setItem(item) {
      if (this._item !== item) {
        this._item = item;
        this.refresh();
      }
    }
    maxItems() {
      return this._item ? this._item.materials.length : 0;
    }
    itemAt(index) {
      return this._item?.materials[index] || null;
    }
    item() {
      return this.itemAt(this.index());
    }
    isEnabled(item) {
      return item ? $gameParty.numItems(DataManager.dataObject(item.kind, item.dataId)) >= item.count : false;
    }
    itemRect(index) {
      const rect = super.itemRect(index);
      rect.y += this.lineHeight() * 3;
      return rect;
    }
    drawAllItems() {
      if (!this._item) {
        return;
      }
      this.changeTextColor(ColorManager.systemColor());
      this.drawText(settings.resultLabel, 0, 0, this.innerWidth);
      this.drawText(settings.materialLabel, 0, this.lineHeight() * 2, this.innerWidth);
      this.drawItemName(this._item.resultData() || null, 0, this.lineHeight(), this.innerWidth);
      super.drawAllItems();
    }
    drawItem(index) {
      const item = this.itemAt(index);
      if (item) {
        const data = DataManager.dataObject(item.kind, item.dataId);
        if (data) {
          const numberWidth = this.numberWidth();
          const rect = this.itemLineRect(index);
          this.changePaintOpacity(this.isEnabled(item));
          this.drawItemName(data || null, rect.x, rect.y, rect.width - numberWidth);
          this.drawMaterialCount($gameParty.numItems(data), item.count, rect.x, rect.y, rect.width);
          this.changePaintOpacity(true);
        }
      }
    }
    numberWidth() {
      return this.textWidth('000/000');
    }
    drawMaterialCount(count, required, x, y, width) {
      this.drawText(':', x, y, width - this.textWidth('000/000'), 'right');
      this.drawText(`${count}/${required}`, x, y, width, 'right');
    }
    updateHelp() {
      super.updateHelp();
      const item = this.item();
      if (item) {
        this.setHelpWindowItem(DataManager.dataObject(item.kind, item.dataId));
      }
    }
  }
  globalThis.Game_WishList = Game_WishList;
  globalThis.Game_WishListItem = Game_WishListItem;
  globalThis.Scene_WishList = Scene_WishList;
  globalThis.Window_WishList = Window_WishList;
  globalThis.Window_WishListDetail = Window_WishListDetail;
})();
