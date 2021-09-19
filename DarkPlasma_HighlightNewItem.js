// DarkPlasma_HighlightNewItem 1.0.5
// Copyright (c) 2021 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2021/09/19 1.0.5 同じIDの別種別のアイテムが新しく入手した扱いになる不具合を修正
 * 2021/09/11 1.0.4 特定のクラスを操作するプラグインとの競合を修正
 * 2021/09/06 1.0.3 外した装備が新しく入手した扱いになる不具合を修正
 *            1.0.2 装備のつけ外しでエラーになる不具合を修正
 * 2021/09/05 1.0.1 売却時に入手した扱いになってしまう不具合を修正
 *            1.0.0 公開
 */

/*:ja
 * @plugindesc 新しく入手したアイテムをメニューのアイテム一覧で強調表示する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param newItemColor
 * @desc 新しく入手したアイテムの色番号
 * @text アイテム色
 * @type number
 * @default 2
 *
 * @help
 * version: 1.0.5
 * メニューのアイテム一覧で、新しく入手したアイテムを強調表示します。
 *
 * 強調表示は一度カーソルを合わせると元の色に戻ります。
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParameters = PluginManager.parameters(pluginName);

  const settings = {
    newItemColor: Number(pluginParameters.newItemColor || 2),
  };

  /**
   * @param {Game_Actor.prototype} gameActor
   */
  function Game_Actor_HighlightNewItemMixIn(gameActor) {
    const _tradeItemWithParty = gameActor.tradeItemWithParty;
    gameActor.tradeItemWithParty = function (newItem, oldItem) {
      const result = _tradeItemWithParty.call(this, newItem, oldItem);
      if (result && oldItem) {
        /**
         * 装備変更後に新アイテムとしてマークされてしまうので強引に触る
         */
        $gameParty.touchItem(oldItem);
      }
      return result;
    };
  }

  Game_Actor_HighlightNewItemMixIn(Game_Actor.prototype);

  /**
   * @param {Game_Party.prototype} gameParty
   */
  function Game_Party_HighlightNewItemMixIn(gameParty) {
    const _initAllItems = gameParty.initAllItems;
    gameParty.initAllItems = function () {
      _initAllItems.call(this);
      this.initializeNewItems();
    };

    gameParty.initializeNewItems = function () {
      this._newItemIds = [];
      this._newWeaponIds = [];
      this._newArmorIds = [];
    };

    const _gainItem = gameParty.gainItem;
    gameParty.gainItem = function (item, amount, includeEquip) {
      _gainItem.call(this, item, amount, includeEquip);
      if (item) {
        if (amount > 0) {
          this.addNewItems(item);
        } else {
          this.touchItem(item);
        }
      }
    };

    /**
     * @param {MZ.Item | MZ.Weapon | MZ.Armor} item アイテムデータ
     */
    gameParty.touchItem = function (item) {
      if (DataManager.isItem(item)) {
        if (!this._newItemIds) {
          this._newItemIds = [];
        }
        this._newItemIds = this._newItemIds.filter((id) => id && id !== item.id);
      } else if (DataManager.isWeapon(item)) {
        if (!this._newWeaponIds) {
          this._newWeaponIds = [];
        }
        this._newWeaponIds = this._newWeaponIds.filter((id) => id && id !== item.id);
      } else if (DataManager.isArmor(item)) {
        if (!this._newArmorIds) {
          this._newArmorIds = [];
        }
        this._newArmorIds = this._newArmorIds.filter((id) => id && id !== item.id);
      }
    };

    /**
     * @param {MZ.Item | MZ.Weapon | MZ.Armor} item アイテムデータ
     */
    gameParty.addNewItems = function (item) {
      if (this.hasItemAsNew(item)) {
        return;
      }
      if (DataManager.isItem(item)) {
        this._newItemIds.push(item.id);
      } else if (DataManager.isWeapon(item)) {
        this._newWeaponIds.push(item.id);
      } else if (DataManager.isArmor(item)) {
        this._newArmorIds.push(item.id);
      }
    };

    /**
     * @param {MZ.Item | MZ.Weapon | MZ.Armor} item アイテムデータ
     * @return {boolean}
     */
    gameParty.hasItemAsNew = function (item) {
      if (!this._newItemIds) {
        this._newItemIds = [];
      }
      const newItemIds = DataManager.isItem(item)
        ? this.newItemIds()
        : DataManager.isWeapon(item)
        ? this.newWeaponIds()
        : this.newArmorIds();
      return this.hasItem(item, false) && newItemIds.includes(item.id);
    };

    gameParty.newItemIds = function () {
      if (!this._newItemIds) {
        this._newItemIds = [];
      }
      return this._newItemIds;
    };

    gameParty.newWeaponIds = function () {
      if (!this._newWeaponIds) {
        this._newWeaponIds = [];
      }
      return this._newWeaponIds;
    };

    gameParty.newArmorIds = function () {
      if (!this._newArmorIds) {
        this._newArmorIds = [];
      }
      return this._newArmorIds;
    };
  }

  Game_Party_HighlightNewItemMixIn(Game_Party.prototype);

  /**
   * @param {Window_ItemList.prototype} windowClass
   */
  function Window_ItemList_HighlightNewItemMixIn(windowClass) {
    const _drawItemName = windowClass.drawItemName;
    windowClass.drawItemName = function (item, x, y, width) {
      if (this.isNewItem(item)) {
        this.drawNewItemName(item, x, y, width);
      } else {
        _drawItemName.call(this, item, x, y, width);
      }
    };

    /**
     * 新しいアイテムを描画する
     * 色を変えるため、描画中は resetTextColor を上書きする
     * @param {MZ.Item | MZ.Weapon | MZ.Armor} item アイテムデータ
     * @param {number} x X座標
     * @param {number} y Y座標
     * @param {number} width 幅
     */
    windowClass.drawNewItemName = function (item, x, y, width) {
      const resetTextColor = this.resetTextColor;
      this.resetTextColor = () => {};
      this.changeTextColor(ColorManager.textColor(settings.newItemColor));
      _drawItemName.call(this, item, x, y, width);
      this.resetTextColor = resetTextColor;
      this.resetTextColor();
    };

    /**
     * @param {MZ.Item | MZ.Weapon | MZ.Armor} item
     * @return {boolean}
     */
    windowClass.isNewItem = function (item) {
      return $gameParty.hasItemAsNew(item);
    };

    const _select = windowClass.select;
    windowClass.select = function (index) {
      _select.call(this, index);
      const item = this.item();
      if (item && this.isNewItem(item)) {
        $gameParty.touchItem(item);
        this.refresh();
      }
    };
  }

  Window_ItemList_HighlightNewItemMixIn(Window_ItemList.prototype);
})();
