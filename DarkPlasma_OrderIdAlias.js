// DarkPlasma_OrderIdAlias 1.1.1
// Copyright (c) 2020 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2022/05/14 1.1.1 リファクタ
 * 2021/07/27 1.1.0 スキルの並び順設定をデフォルトのままにする設定を追加
 * 2021/07/05 1.0.3 MZ 1.3.2に対応
 * 2021/06/22 1.0.2 サブフォルダからの読み込みに対応
 * 2020/09/08 1.0.1 rollup構成へ移行
 * 2020/08/27 1.0.0 MZ版公開
 */

/*:ja
 * @plugindesc スキル/アイテムの表示順序IDを書き換える
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param sortSkillById
 * @desc スキルの表示順をID順にします。
 * @text スキルID順
 * @type boolean
 * @default false
 *
 * @help
 * version: 1.1.1
 * アイテムまたはスキルの順序がID順の場合、メモ欄に以下のように記述することで、
 * IDの代わりにその数値を順序として使います。
 *
 * スキルについてはプラグインパラメータでID順になっている場合のみ、
 * OrderIdタグが有効になります。
 *
 * <OrderId:xxx> xxxは整数値
 */

(() => {
  'use strict';

  function orderIdSort(a, b) {
    if (a === null && b === null) {
      // 両方nullなら順不同
      return 0;
    } else if (a === null) {
      return 1;
    } else if (b === null) {
      return -1;
    }
    return (a.orderId || a.id) - (b.orderId || b.id);
  }

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParameters = PluginManager.parameters(pluginName);

  const settings = {
    sortSkillById: String(pluginParameters.sortSkillById || false) === 'true',
  };

  const _DataManager_extractMetadata = DataManager.extractMetadata;
  DataManager.extractMetadata = function (data) {
    _DataManager_extractMetadata.call(this, data);
    data.orderId = Number(data.meta.OrderId || data.id);
  };

  const _Window_ItemList_makeItemList = Window_ItemList.prototype.makeItemList;
  Window_ItemList.prototype.makeItemList = function () {
    _Window_ItemList_makeItemList.call(this);
    this._data.sort(orderIdSort);
  };

  const _Window_SkillList_makeItemList = Window_SkillList.prototype.makeItemList;
  Window_SkillList.prototype.makeItemList = function () {
    _Window_SkillList_makeItemList.call(this);
    if (settings.sortSkillById) {
      this._data.sort(orderIdSort);
    }
  };
})();
