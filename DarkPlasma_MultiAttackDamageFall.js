// DarkPlasma_MultiAttackDamageFall 1.0.0
// Copyright (c) 2022 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2022/01/09 1.0.0 公開
 */

/*:ja
 * @plugindesc 範囲・連続攻撃のダメージ減衰
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param fallRate
 * @desc 攻撃対象1体ごとのダメージ減衰率
 * @text 減衰率（％）
 * @type number
 * @default 10
 *
 * @param minimumRate
 * @desc 減衰の限界となる最小ダメージ率
 * @text 最小ダメージ率（％）
 * @type number
 * @default 10
 *
 * @help
 * version: 1.0.0
 * スキルのメモ欄に <multiAttack> とつけると
 * 範囲または連続攻撃時にダメージを減衰していきます。
 *
 * 範囲攻撃において減衰率を10％とした場合、
 * 1体目には100％、2体目には90％、3体目には80％...
 * というふうに、与えるダメージが減少していきます。
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParameters = PluginManager.parameters(pluginName);

  const settings = {
    fallRate: Number(pluginParameters.fallRate || 10),
    minimumRate: Number(pluginParameters.minimumRate || 10),
  };

  /**
   * @param {Game_Action.prototype} gameAction
   */
  function Game_Action_MultiAttackDamageFallMixIn(gameAction) {
    const _clear = gameAction.clear;
    gameAction.clear = function () {
      _clear.call(this);
      this._cachedTargets = [];
    };

    const _makeDamageValue = gameAction.makeDamageValue;
    gameAction.makeDamageValue = function (target, critical) {
      const value = _makeDamageValue.call(this, target, critical);
      return Math.floor(value * this.multiAttackDamageFallRate(target));
    };

    gameAction.isMultiAttack = function () {
      return this.item().meta.multiAttack;
    };

    const _makeTargets = gameAction.makeTargets;
    gameAction.makeTargets = function () {
      /**
       * ダメージ計算で使うため、ターゲット情報はキャッシュしておく
       */
      const targets = _makeTargets.call(this);
      this._cachedTargets = [...targets];
      return targets;
    };

    gameAction.cachedTargetIndex = function (target) {
      return this._cachedTargets.indexOf(target);
    };

    gameAction.multiAttackDamageFallRate = function (target) {
      if (!this.isMultiAttack()) {
        return 1;
      }
      const targetIndex = this.cachedTargetIndex(target);
      if (targetIndex > 0) {
        return Math.max((100 - settings.fallRate * targetIndex) / 100, settings.minimumRate / 100);
      }
      return 1;
    };
  }

  Game_Action_MultiAttackDamageFallMixIn(Game_Action.prototype);
})();
