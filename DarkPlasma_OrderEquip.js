// DarkPlasma_OrderEquip 1.0.1
// Copyright (c) 2022 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2022/05/23 1.0.1 装備アイテム選択時の並び順に対応
 * 2022/05/22 1.0.0 公開
 */

/*:ja
 * @plugindesc 装備の並び順を指定する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @orderAfter DarkPlasma_OrderIdAlias
 *
 * @param weaponSortKeys
 * @text 武器の並び順キー
 * @type select[]
 * @option ID
 * @value id
 * @option 攻撃力
 * @value atk
 * @option 防御力
 * @value def
 * @option 魔法力
 * @value mat
 * @option 魔法防御
 * @value mdf
 * @option 敏捷性
 * @value agi
 * @option 運
 * @value luk
 * @option 最大HP
 * @value mhp
 * @option 最大MP
 * @value mmp
 * @option 価格
 * @value price
 * @option 武器タイプ
 * @value wtypeId
 * @default ["id"]
 *
 * @param weaponOrder
 * @text 武器の並び順
 * @type select
 * @option 昇順
 * @value asc
 * @option 降順
 * @value desc
 * @default asc
 *
 * @param armorSortKeys
 * @text 防具の並び順
 * @type select[]
 * @option ID
 * @value id
 * @option 攻撃力
 * @value atk
 * @option 防御力
 * @value def
 * @option 魔法力
 * @value mat
 * @option 魔法防御
 * @value mdf
 * @option 敏捷性
 * @value agi
 * @option 運
 * @value luk
 * @option 最大HP
 * @value mhp
 * @option 最大MP
 * @value mmp
 * @option 価格
 * @value price
 * @option 装備タイプ
 * @value etypeId
 * @option 防具タイプ
 * @value atypeId
 * @default ["id"]
 *
 * @param armorOrder
 * @text 防具の並び順
 * @type select
 * @option 昇順
 * @value asc
 * @option 降順
 * @value desc
 * @default asc
 *
 * @help
 * version: 1.0.1
 * 武器・防具の並び順を指定します。
 *
 * プラグインパラメータの並び順指定に従って表示します。
 * DarkPlasma_OrderIdAliasとともに使用して並び順キーにIDを指定した場合、
 * データベースのIDの代わりにOrderIdが使用されます。
 *
 * 下記プラグインと共に利用する場合、それよりも下に追加してください。
 * DarkPlasma_OrderIdAlias
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParameters = PluginManager.parameters(pluginName);

  const settings = {
    weaponSortKeys: JSON.parse(pluginParameters.weaponSortKeys || '["id"]').map((e) => {
      return String(e || '');
    }),
    weaponOrder: String(pluginParameters.weaponOrder || 'asc'),
    armorSortKeys: JSON.parse(pluginParameters.armorSortKeys || '["id"]').map((e) => {
      return String(e || '');
    }),
    armorOrder: String(pluginParameters.armorOrder || 'asc'),
  };

  const paramsKeyMap = {
    mhp: 0,
    mmp: 1,
    atk: 2,
    def: 3,
    mat: 4,
    mdf: 5,
    agi: 6,
    luk: 7,
  };

  /**
   * プラグインパラメータで指定したソートキーから値を返す
   * @param {MZ.Weapon|MZ.Armor} equip
   * @param {string} key
   * @return {number}
   */
  function equipSortKeyMap(equip, key) {
    switch (key) {
      case 'mhp':
      case 'mmp':
      case 'atk':
      case 'def':
      case 'mat':
      case 'mdf':
      case 'agi':
      case 'luk':
        return equip.params[paramsKeyMap[key]];
      case 'id':
        return equip.orderId || equip.id;
      default:
        return equip[key];
    }
  }

  /**
   *
   * @param {MZ.Weapon|MZ.Armor} a
   * @param {MZ.Weapon|MZ.Armor} b
   * @param {string[]} keys
   */
  function compareEquip(a, b, keys) {
    if (a === null && b === null) {
      // 両方nullなら順不同
      return 0;
    } else if (a === null) {
      return 1;
    } else if (b === null) {
      return -1;
    }
    const key = keys.shift();
    const diff = equipSortKeyMap(a, key) - equipSortKeyMap(b, key);
    if (diff === 0) {
      return keys.length === 0 ? 0 : compareEquip(a, b, keys);
    }
    return diff;
  }

  /**
   * 武器・防具ソート用関数は各所で使えるようにしておく
   * @param {Window_Selectable.prototype} windowClass
   */
  function Window_OrderEquipMixIn(windowClass) {
    /**
     * @param {MZ.Weapon[]} weapons
     * @return {MZ.Weapon[]}
     */
    windowClass.sortWeapons = function (weapons) {
      return weapons.sort(
        (a, b) => (settings.weaponOrder === 'desc' ? -1 : 1) * compareEquip(a, b, settings.weaponSortKeys.slice())
      );
    };

    /**
     * @param {MZ.Armor[]} armors
     * @return {MZ.Armor[]}
     */
    windowClass.sortArmors = function (armors) {
      return armors.sort(
        (a, b) => (settings.armorOrder === 'desc' ? -1 : 1) * compareEquip(a, b, settings.armorSortKeys.slice())
      );
    };
  }

  Window_OrderEquipMixIn(Window_Selectable.prototype);

  /**
   * @param {Window_ItemList.prototype} windowClass
   */
  function Window_ItemList_OrderEquipMixIn(windowClass) {
    const _makeItemList = windowClass.makeItemList;
    windowClass.makeItemList = function () {
      _makeItemList.call(this);
      this.sortEquips();
    };

    windowClass.sortEquips = function () {
      if (this.isWeaponList()) {
        this._data = this.sortWeapons(this._data);
      } else if (this.isArmorList()) {
        this._data = this.sortArmors(this._data);
      }
    };

    windowClass.isWeaponList = function () {
      return this._category === 'weapon';
    };

    windowClass.isArmorList = function () {
      return this._category === 'armor';
    };
  }

  Window_ItemList_OrderEquipMixIn(Window_ItemList.prototype);

  /**
   * @param {Window_EquipItem.prototype} windowClass
   */
  function Window_EquipItem_OrderEquipMixIn(windowClass) {
    windowClass.isWeaponList = function () {
      return this.etypeId() === 1;
    };

    windowClass.isArmorList = function () {
      return this.etypeId() > 1;
    };
  }

  Window_EquipItem_OrderEquipMixIn(Window_EquipItem.prototype);
})();
