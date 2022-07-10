// DarkPlasma_FixEscapeRatio 1.0.0
// Copyright (c) 2022 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2022/05/29 1.0.0 公開
 */

/*:ja
 * @plugindesc 逃走確率を固定値にする
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param ratio
 * @text 逃走確率（％）
 * @type number
 * @default 50
 * @max 100
 *
 * @help
 * version: 1.0.0
 * 逃走確率を固定値に設定します。
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    ratio: Number(pluginParameters.ratio || 50),
  };

  BattleManager.makeEscapeRatio = function () {
    this._escapeRatio = settings.ratio / 100;
  };

  const _onEscapeFailure = BattleManager.onEscapeFailure;
  BattleManager.onEscapeFailure = function () {
    _onEscapeFailure.call(this);
    this._escapeRatio = settings.ratio / 100; // 逃走失敗時の増加分を無視する
  };
})();
