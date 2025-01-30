/// <reference path="./OrderShopGoods.d.ts" />

import { zipArray } from '../../../common/zipArray';
import { settings } from '../config/_build/DarkPlasma_OrderShopGoods_parameters';

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

function Window_ShopBuy_OrderGoodsMixIn(windowShopBuy: Window_ShopBuy) {
  const _makeItemList = windowShopBuy.makeItemList;
  windowShopBuy.makeItemList = function () {
    _makeItemList.call(this);
    this.sortGoods(this.zipGoods());
  };

  windowShopBuy.sortGoods = function (goods) {
    goods.sort((a, b) => this.compareGoods(a, b));
    this._data = goods.map(g => g[0]);
    this._price = goods.map(g => g[1]);
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
      return (settings.goodsOrder === 'desc' ? -1 : 1) * this.compareGoodsSub([a[0], a[1]], [b[0], b[1]], settings.itemSortKeys.slice());
    } else if (DataManager.isWeapon(a[0]) && DataManager.isWeapon(b[0])) {
      return (settings.goodsOrder === 'desc' ? -1 : 1) * this.compareGoodsSub([a[0], a[1]], [b[0], b[1]], settings.weaponSortKeys.slice());
    } else if (DataManager.isArmor(a[0]) && DataManager.isArmor(b[0])) {
      return (settings.goodsOrder === 'desc' ? -1 : 1) * this.compareGoodsSub([a[0], a[1]], [b[0], b[1]], settings.armorSortKeys.slice());
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
    if (DataManager.isItem(item)) {
      /**
       * アイテムに設定可能なキーはidとpriceのみ
       */
    } else if (DataManager.isWeapon(item) || DataManager.isArmor(item)) {
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
          const result = DataManager.isWeapon(item)
            ? item[key as keyof MZ.Weapon]
            : item[key as keyof MZ.Armor];
          return Number.isFinite(result) ? Number(result) : 0;
      }
    }
    return 0;
  };
}

Window_ShopBuy_OrderGoodsMixIn(Window_ShopBuy.prototype);

if (Window_FusionShopBuy) {
  Window_ShopBuy_OrderGoodsMixIn(Window_FusionShopBuy.prototype);

  function Window_FusionShopBuy_OrderGoodsMixIn(windowFusionShopBuy: Window_FusionShopBuy) {
    const _sortGoods = windowFusionShopBuy.sortGoods;
    windowFusionShopBuy.sortGoods = function (goods) {
      _sortGoods.call(this, goods);
      this._materials = goods.map(g => g[2]);
    };

    windowFusionShopBuy.zipGoods = function () {
      return zipArray(this._data, this._price, this._materials);
    };
  }

  Window_FusionShopBuy_OrderGoodsMixIn(Window_FusionShopBuy.prototype);
}
