// DarkPlasma_HighlightNewItem 1.0.0
// Copyright (c) 2021 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2021/09/05 1.0.0 公開
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
 * version: 1.0.0
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

  Game_Party = class extends Game_Party {
    gainItem(item, amount, includeEquip) {
      super.gainItem(item, amount, includeEquip);
      const container = this.itemContainer(item);
      if (container) {
        this.addNewItems(item);
      } else {
        this.touchItem(item);
      }
    }

    /**
     * アイテムを新しいアイテム扱いではなくする
     * @param {MZ.Item | MZ.Weapon | MZ.Armor} item アイテムデータ
     */
    touchItem(item) {
      if (!this._newItemIds) {
        this._newItemIds = [];
      }
      this._newItemIds = this._newItemIds.filter((id) => id !== item.id);
    }

    /**
     * @param {MZ.Item | MZ.Weapon | MZ.Armor} item アイテムデータ
     */
    addNewItems(item) {
      if (!this._newItemIds) {
        this._newItemIds = [];
      }
      if (!this.hasItemAsNew(item)) {
        this._newItemIds.push(item.id);
      }
    }

    /**
     * @param {MZ.Item | MZ.Weapon | MZ.Armor} item アイテムデータ
     * @return {boolean}
     */
    hasItemAsNew(item) {
      if (!this._newItemIds) {
        this._newItemIds = [];
      }
      return this.hasItem(item, false) && this._newItemIds.includes(item.id);
    }
  };

  Window_ItemList = class extends Window_ItemList {
    drawItemName(item, x, y, width) {
      if (this.isNewItem(item)) {
        this.drawNewItemName(item, x, y, width);
      } else {
        super.drawItemName(item, x, y, width);
      }
    }

    /**
     * 新しいアイテムを描画する
     * 色を変えるため、描画中は resetTextColor を上書きする
     * @param {MZ.Item | MZ.Weapon | MZ.Armor} item アイテムデータ
     * @param {number} x X座標
     * @param {number} y Y座標
     * @param {number} width 幅
     */
    drawNewItemName(item, x, y, width) {
      const resetTextColor = this.resetTextColor;
      this.resetTextColor = () => {};
      this.changeTextColor(ColorManager.textColor(settings.newItemColor));
      super.drawItemName(item, x, y, width);
      this.resetTextColor = resetTextColor;
      this.resetTextColor();
    }

    /**
     * @param {MZ.Item | MZ.Weapon | MZ.Armor} item
     * @return {boolean}
     */
    isNewItem(item) {
      return $gameParty.hasItemAsNew(item);
    }

    select(index) {
      super.select(index);
      const item = this.item();
      if (item && this.isNewItem(item)) {
        $gameParty.touchItem(item);
        this.refresh();
      }
    }
  };
})();
