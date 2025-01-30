// DarkPlasma_OrderShopGoods 1.0.0
// Copyright (c) 2025 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2025/01/30 1.0.0 公開
 */

/*:
 * @plugindesc ショップの商品の並び順を指定する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @orderAfter DarkPlasma_OrderIdAlias
 * @orderAfter DarkPlasma_FusionShop
 *
 * @param itemSortKeys
 * @text アイテムの並び順キー
 * @type select[]
 * @option ID
 * @value id
 * @option 価格
 * @value price
 * @default ["id"]
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
 * @param armorSortKeys
 * @text 防具の並び順キー
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
 * @param goodsOrder
 * @desc 並び順キーに従って昇順・降順どちらで並べるかを指定します。
 * @text 商品の並び順
 * @type select
 * @option 昇順
 * @value asc
 * @option 降順
 * @value desc
 * @default asc
 *
 * @help
 * version: 1.0.0
 * ショップの商品の並び順を指定します。
 *
 * 商品はアイテム・武器・防具のカテゴリ順に並び、
 * その後それぞれのカテゴリ内で、本プラグインの設定に従って並びます。
 * DarkPlasma_OrderIdAliasとともに使用して並び順キーにIDを指定した場合、
 * データベースのIDの代わりにOrderIdが使用されます。
 *
 * 下記プラグインと共に利用する場合、それよりも下に追加してください。
 * DarkPlasma_OrderIdAlias
 * DarkPlasma_FusionShop
 */

(() => {
  'use strict';

  const zipArray = (...args) => {
    if (!args.length) return [];
    const minLen = args.reduce((a, c) => (a.length < c.length ? a : c)).length;
    let result = [];
    for (let i = 0; i < minLen; i++) {
      result.push(args.map((arg) => arg[i]));
    }
    return result;
  };

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    itemSortKeys: pluginParameters.itemSortKeys
      ? JSON.parse(pluginParameters.itemSortKeys).map((e) => {
          return String(e || ``);
        })
      : ['id'],
    weaponSortKeys: pluginParameters.weaponSortKeys
      ? JSON.parse(pluginParameters.weaponSortKeys).map((e) => {
          return String(e || ``);
        })
      : ['id'],
    armorSortKeys: pluginParameters.armorSortKeys
      ? JSON.parse(pluginParameters.armorSortKeys).map((e) => {
          return String(e || ``);
        })
      : ['id'],
    goodsOrder: String(pluginParameters.goodsOrder || `asc`),
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
  function Window_ShopBuy_OrderGoodsMixIn(windowShopBuy) {
    const _makeItemList = windowShopBuy.makeItemList;
    windowShopBuy.makeItemList = function () {
      _makeItemList.call(this);
      this.sortGoods(this.zipGoods());
    };
    windowShopBuy.sortGoods = function (goods) {
      goods.sort((a, b) => this.compareGoods(a, b));
      this._data = goods.map((g) => g[0]);
      this._price = goods.map((g) => g[1]);
    };
    windowShopBuy.zipGoods = function () {
      return zipArray(this._data, this._price);
    };
    windowShopBuy.compareGoods = function (a, b) {
      if (DataManager.isItem(a[0]) && !DataManager.isItem(b[0])) {
        return -1;
      } else if (DataManager.isItem(b[0]) && !DataManager.isItem(a[0])) {
        return 1;
      } else if (DataManager.isWeapon(a[0]) && DataManager.isArmor(b[0])) {
        return -1;
      } else if (DataManager.isItem(a[0]) && DataManager.isItem(b[0])) {
        return (
          (settings.goodsOrder === 'desc' ? -1 : 1) *
          this.compareGoodsSub([a[0], a[1]], [b[0], b[1]], settings.itemSortKeys.slice())
        );
      } else if (DataManager.isWeapon(a[0]) && DataManager.isWeapon(b[0])) {
        return (
          (settings.goodsOrder === 'desc' ? -1 : 1) *
          this.compareGoodsSub([a[0], a[1]], [b[0], b[1]], settings.weaponSortKeys.slice())
        );
      } else if (DataManager.isArmor(a[0]) && DataManager.isArmor(b[0])) {
        return (
          (settings.goodsOrder === 'desc' ? -1 : 1) *
          this.compareGoodsSub([a[0], a[1]], [b[0], b[1]], settings.armorSortKeys.slice())
        );
      }
      return 0;
    };
    windowShopBuy.compareGoodsSub = function (a, b, keys) {
      const key = keys.shift();
      if (!key) {
        return 0;
      }
      const diff = this.goodsSortKeyMap(a[0], a[1], key) - this.goodsSortKeyMap(b[0], b[1], key);
      if (diff === 0) {
        return keys.length === 0 ? 0 : this.compareGoodsSub(a, b, keys);
      }
      return diff;
    };
    windowShopBuy.goodsSortKeyMap = function (item, price, key) {
      if (key === 'id') {
        return item.orderId || item.id;
      } else if (key === 'price') {
        return price;
      }
      if (DataManager.isItem(item));
      else if (DataManager.isWeapon(item) || DataManager.isArmor(item)) {
        switch (key) {
          case 'mhp':
          case 'mmp':
          case 'atk':
          case 'def':
          case 'mat':
          case 'mdf':
          case 'agi':
          case 'luk':
            return item.params[paramsKeyMap[key]];
          case 'id':
            return item.orderId || item.id;
          default:
            const result = DataManager.isWeapon(item) ? item[key] : item[key];
            return Number.isFinite(result) ? Number(result) : 0;
        }
      }
      return 0;
    };
  }
  Window_ShopBuy_OrderGoodsMixIn(Window_ShopBuy.prototype);
  if (Window_FusionShopBuy) {
    Window_ShopBuy_OrderGoodsMixIn(Window_FusionShopBuy.prototype);
    function Window_FusionShopBuy_OrderGoodsMixIn(windowFusionShopBuy) {
      const _sortGoods = windowFusionShopBuy.sortGoods;
      windowFusionShopBuy.sortGoods = function (goods) {
        _sortGoods.call(this, goods);
        this._materials = goods.map((g) => g[2]);
      };
      windowFusionShopBuy.zipGoods = function () {
        return zipArray(this._data, this._price, this._materials);
      };
    }
    Window_FusionShopBuy_OrderGoodsMixIn(Window_FusionShopBuy.prototype);
  }
})();
