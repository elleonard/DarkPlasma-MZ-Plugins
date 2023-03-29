// DarkPlasma_MultiElementRate 1.0.0
// Copyright (c) 2023 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2023/03/29 1.0.0 公開
 */

/*:
 * @plugindesc 攻撃属性すべてを計算に用いる
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param addition
 * @desc 計算時に全属性の有効度を加算するかどうか。OFFの場合は乗算する
 * @text 加算するか
 * @type boolean
 * @default false
 *
 * @help
 * version: 1.0.0
 * 攻撃に付与されている属性が複数ある場合、
 * その攻撃の属性すべてをダメージ計算に使用します。
 *
 * 城さんと加算で計算方法が異なります。
 * 例えば、火＋光属性の攻撃を、火有効度200％ 光有効度150％の敵に使用すると
 * 以下のようになります。
 * 乗算の場合: 2 x 1.5 = 300％
 * 加算の場合: 2 + 1.5 = 350％
 *
 * 加算の場合、火有効度100％かつ光有効度100％の敵に火＋光属性攻撃を行うと
 * 1 + 1 = 200％となってしまうことに注意してください。
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    addition: String(pluginParameters.addition || false) === 'true',
  };

  function Game_Action_MultiElementRateMixIn(gameAction) {
    const _elementsMaxRate = gameAction.elementsMaxRate;
    gameAction.elementsMaxRate = function (target, elements) {
      if (elements.length > 0) {
        return elements.reduce((result, elementId) => {
          return settings.addition ? result + target.elementRate(elementId) : result * target.elementRate(elementId);
        }, 1);
      }
      return _elementsMaxRate.call(this, target, elements);
    };
  }
  Game_Action_MultiElementRateMixIn(Game_Action.prototype);
})();
