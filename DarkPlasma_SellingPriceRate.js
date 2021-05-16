// DarkPlasma_SellingPriceRate 1.0.0
// Copyright (c) 2021 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2021/05/16 1.0.0 公開
 */

/*:ja
 * @plugindesc アイテム売却額倍率を設定する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param sellingPriceRate
 * @desc アイテム売却時の倍率を％で設定します。
 * @text 売却額倍率（％）
 * @type number
 * @default 50
 * @min 1
 *
 * @help
 * version: 1.0.0
 * アイテム売却時の倍率を設定します。
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParameters = PluginManager.parameters(pluginName);

  const settings = {
    sellingPriceRate: Number(pluginParameters.sellingPriceRate || 50),
  };

  Scene_Shop.prototype.sellingPrice = function () {
    return Math.floor(this._item.price / (100 / settings.sellingPriceRate));
  };
})();
