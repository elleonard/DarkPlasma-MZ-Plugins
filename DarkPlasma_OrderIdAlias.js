// DarkPlasma_OrderIdAlias 1.1.4
// Copyright (c) 2020 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2023/02/23 1.1.4 英語翻訳を追加 (Add English translation)
 * 2023/02/18 1.1.3 デフォルト言語を設定
 * 2022/08/21 1.1.2 typescript移行
 * 2022/05/14 1.1.1 リファクタ
 * 2021/07/27 1.1.0 スキルの並び順設定をデフォルトのままにする設定を追加
 * 2021/07/05 1.0.3 MZ 1.3.2に対応
 * 2021/06/22 1.0.2 サブフォルダからの読み込みに対応
 * 2020/09/08 1.0.1 rollup構成へ移行
 * 2020/08/27 1.0.0 MZ版公開
 */

/*:
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
 * version: 1.1.4
 * アイテムまたはスキルの順序がID順の場合、メモ欄に以下のように記述することで、
 * IDの代わりにその数値を順序として使います。
 *
 * スキルについてはプラグインパラメータでID順になっている場合のみ、
 * OrderIdタグが有効になります。
 *
 * <OrderId:xxx> xxxは整数値
 */

/*:en
 * @plugindesc Set id to skill, item for display order
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param sortSkillById
 * @desc Sort skill by order id.
 * @text sort skill
 * @type boolean
 * @default false
 *
 * @help
 * version: 1.1.4
 * You can write note tag OrderId for item, skill
 * for change display order.
 *
 * If skill sort parameter is OFF,
 * skill's OrderId tag is ignored.
 *
 * <OrderId:xxx> xxx is number.
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

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    sortSkillById: String(pluginParameters.sortSkillById || false) === 'true',
  };

  function DataManager_OrderIdAliasMixIn() {
    const _extractMetadata = DataManager.extractMetadata;
    DataManager.extractMetadata = function (data) {
      _extractMetadata.call(this, data);
      if (isOrderIdHolder(data)) {
        extractOrderId(data);
      }
    };
    function isOrderIdHolder(data) {
      return !!data.id;
    }
    function extractOrderId(data) {
      data.orderId = Number(data.meta.OrderId || data.id);
    }
  }
  DataManager_OrderIdAliasMixIn();
  function Window_ItemList_OrderIdAliasMixIn(windowClass) {
    const _makeItemList = windowClass.makeItemList;
    windowClass.makeItemList = function () {
      _makeItemList.call(this);
      this._data.sort(orderIdSort);
    };
  }
  Window_ItemList_OrderIdAliasMixIn(Window_ItemList.prototype);
  function Window_SkillList_OrderIdAliasMixIn(windowClass) {
    const _makeItemList = windowClass.makeItemList;
    windowClass.makeItemList = function () {
      _makeItemList.call(this);
      if (settings.sortSkillById) {
        this._data.sort(orderIdSort);
      }
    };
  }
  Window_SkillList_OrderIdAliasMixIn(Window_SkillList.prototype);
})();
