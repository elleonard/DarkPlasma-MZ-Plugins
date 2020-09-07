// DarkPlasma_OrderIdAlias 1.0.0
// Copyright (c) 2020 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2020/08/27 1.0.0 MZ版公開
 */

/*:ja
 * @plugindesc スキル/アイテムの表示順序IDを書き換える
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/RPGtkoolMZ-Plugins
 *
 * @help
 * アイテムまたはスキルの順序がID順の場合、メモ欄に以下のように記述することで、
 * IDの代わりにその数値を順序として使います。
 *
 * <OrderId:xxx> xxxは整数値
 */

(() => {
  'use strict';

  const _DataManager_extractMetadata = DataManager.extractMetadata;
  DataManager.extractMetadata = function (data) {
    _DataManager_extractMetadata.call(this, data);
    data.orderId = Number(data.meta.OrderId || data.id);
  };

  const _Window_ItemList_makeItemList = Window_ItemList.prototype.makeItemList;
  Window_ItemList.prototype.makeItemList = function () {
    _Window_ItemList_makeItemList.call(this);
    this._data.sort((a, b) => {
      if (a === null && b === null) {
        // 両方nullなら順不同
        return 0;
      } else if (a === null) {
        return 1;
      } else if (b === null) {
        return -1;
      }
      return a.orderId - b.orderId;
    });
  };

  const _Window_SkillList_makeItemList = Window_SkillList.prototype.makeItemList;
  Window_SkillList.prototype.makeItemList = function () {
    _Window_SkillList_makeItemList.call(this);
    this._data.sort((a, b) => a.orderId - b.orderId);
  };
})();
