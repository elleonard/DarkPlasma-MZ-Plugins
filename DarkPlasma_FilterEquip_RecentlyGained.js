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
 * @desc この件数だけ装備の入手履歴を記録し、この履歴に含まれる装備を最近入手した装備として扱います
 * @text 装備入手記録数
 * @type number
 * @default 5
 * @min 1
 *
 * @param traitName
 * @desc 絞り込み時に表示する特徴の名前を指定します
 * @text 特徴名
 * @type string
 * @default 最近入手した装備
 *
 * @help
 * version: 1.0.0
 * DarkPlasma_FilterEquipによる装備絞り込みに「最近入手した装備」を追加します。
 *
 * 本プラグインの利用には下記プラグインを必要とします。
 * DarkPlasma_FilterEquip version:0.0.5
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParameters = PluginManager.parameters(pluginName);

  const settings = {
    threshold: Number(pluginParameters.threshold || 5),
    traitName: String(pluginParameters.traitName || '最近入手した装備'),
  };

  Game_Party = class extends Game_Party {
    gainItem(item, amount, includeEquip) {
      super.gainItem(item, amount, includeEquip);
      if (amount > 0) {
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

    /**
     * 最近入手した武器ID一覧
     * @return {number[]}
     */
    gainWeaponHistory() {
      return this._gainWeaponHistory || [];
    }

    /**
     * 最近入手した防具ID一覧
     * @return {number[]}
     */
    gainArmorHistory() {
      return this._gainArmorHistory || [];
    }

    /**
     * 最近入手したアイテムかどうか
     * @param {MZ.Item|MZ.Weapon|MZ.Armor} item アイテムデータ
     * @return {boolean}
     */
    isRecentlyGainded(item) {
      if (DataManager.isWeapon(item)) {
        return this.gainWeaponHistory().includes(item.id);
      } else if (DataManager.isArmor(item)) {
        return this.gainArmorHistory().includes(item.id);
      }
      return false;
    }
  };

  const traitIds = [];

  Scene_Equip = class extends Scene_Equip {
    equipFilterBuilder(equips) {
      const ALLOCATION_TRAIT_ID_RECENTLY_GAINED = 0;
      traitIds[ALLOCATION_TRAIT_ID_RECENTLY_GAINED] = EquipFilterBuilder.allocateUniqueTraitId(
        pluginName,
        settings.traitName,
        ALLOCATION_TRAIT_ID_RECENTLY_GAINED
      );
      const builder = super.equipFilterBuilder(equips);
      return builder.withTrait(traitIds[ALLOCATION_TRAIT_ID_RECENTLY_GAINED]).withEquipToTraitsRule((equip) => {
        return $gameParty.isRecentlyGainded(equip)
          ? [
              {
                code: traitIds[ALLOCATION_TRAIT_ID_RECENTLY_GAINED],
                dataId: 1, // dummy
                value: 1, // dummy
              },
            ]
          : [];
      });
    }
  };
})();
