// DarkPlasma_FilterEquip_RecentlyGained 1.0.0
// Copyright (c) 2021 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2021/ 1.0.0 公開
 */

/*:ja
 * @plugindesc 最近入手した装備を絞り込む
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @base DarkPlasma_FilterEquip
 *
 * @param threshold
 * @desc この件数だけ装備の入手履歴を記録し、この履歴に含まれる装備を最近入手した装備として扱います。
 * @text 装備入手記録数
 * @type number
 * @default 5
 * @min 1
 *
 * @help
 * version: 1.0.0
 * DarkPlasma_FilterEquipによる装備絞り込みに「最近入手した装備」を追加します。
 *
 * 本プラグインの利用には下記プラグインを必要とします。
 * DarkPlasma_FilterEquip version:0.0.4
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParameters = PluginManager.parameters(pluginName);

  const settings = {
    threshold: Number(pluginParameters.threshold || 5),
  };

  Game_Party = class extends Game_Party {
    gainItem(item, amount, includeEquip) {
      super.gainItem(item, amount, includeEquip);
      const container = this.itemContainer(item);
      if (container) {
        if (DataManager.isWeapon(item)) {
          this.pushGainWeaponHistory(item);
        } else if (DataManager.isArmor(item)) {
          this.pushGainArmorHistory(item);
        }
      }
    }

    /**
     * @param {MZ.Weapon} weapon 武器データ
     */
    pushGainWeaponHistory(weapon) {
      if (!this._gainWeaponHistory) {
        this._gainWeaponHistory = [];
      }
      this._gainWeaponHistory.push(weapon.id);
      if (this._gainWeaponHistory.length > settings.threshold) {
        this._gainWeaponHistory.shift();
      }
    }

    /**
     * @param {MZ.Armor} armor 防具データ
     */
    pushGainArmorHistory(armor) {
      if (!this._gainArmorHistory) {
        this._gainArmorHistory = [];
      }
      this._gainArmorHistory.push(armor.id);
      if (this._gainArmorHistory.length > settings.threshold) {
        this._gainArmorHistory.shift();
      }
    }
  };
})();
