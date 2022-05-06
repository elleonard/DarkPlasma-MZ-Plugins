// DarkPlasma_MultiAttackDamageFall 1.0.2
// Copyright (c) 2022 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2022/05/07 1.0.2 身代わり発動時にエラーが起きる不具合を修正
 * 2022/01/09 1.0.1 同一対象への複数回攻撃でダメージが減衰しない不具合を修正
 *            1.0.0 公開
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
 * version: 1.0.2
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

  class MultiAttackTarget {
    constructor(target) {
      this._target = target;
      this._attacked = false;
    }

    /**
     * 複数攻撃のダメージ計算に用いる対象であるか
     * @param {Game_Battler} target
     * @return {boolean}
     */
    isMultiAttackTarget(target) {
      return this._target === target && !this._attacked;
    }

    /**
     * 身代わりによりダメージを受ける対象が変更される場合に呼び出す
     * @param {Game_Battler} originalTarget
     * @param {Game_Battler} realTarget
     */
    substitute(originalTarget, realTarget) {
      if (this._target === originalTarget) {
        this._target = realTarget;
      }
    }

    /**
     * 攻撃済みフラグを立てる
     */
    attack() {
      this._attacked = true;
    }
  }

  /**
   * @param {BattleManager} battleManager
   */
  function BattleManager_MultiAttackDamageFallMixIn(battleManager) {
    const _applySubstitute = battleManager.applySubstitute;
    battleManager.applySubstitute = function (target) {
      const realTarget = _applySubstitute.call(this, target);
      if (target !== realTarget && this._action && this._action.isMultiAttack()) {
        this._action.substituteMultiAttackTarget(target, realTarget);
      }
      return realTarget;
    };
  }

  BattleManager_MultiAttackDamageFallMixIn(BattleManager);

  /**
   * @param {Game_Action.prototype} gameAction
   */
  function Game_Action_MultiAttackDamageFallMixIn(gameAction) {
    const _clear = gameAction.clear;
    gameAction.clear = function () {
      _clear.call(this);
      this._multiAttackTargets = [];
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
      this._multiAttackTargets = targets.map((target) => new MultiAttackTarget(target));
      return targets;
    };

    /**
     * 身代わり処理
     * @param {Game_Battler} originalTarget
     * @param {Game_Battler} realTarget
     */
    gameAction.substituteMultiAttackTarget = function (originalTarget, realTarget) {
      this._multiAttackTargets.forEach((target) => target.substitute(originalTarget, realTarget));
    };

    gameAction.multiAttackTargetIndex = function (target) {
      return this._multiAttackTargets.findIndex((cache) => cache.isMultiAttackTarget(target));
    };

    gameAction.multiAttackDamageFallRate = function (target) {
      if (!this.isMultiAttack()) {
        return 1;
      }
      const targetIndex = this.multiAttackTargetIndex(target);
      this._multiAttackTargets[targetIndex].attack();
      if (targetIndex > 0) {
        return Math.max((100 - settings.fallRate * targetIndex) / 100, settings.minimumRate / 100);
      }
      return 1;
    };
  }

  Game_Action_MultiAttackDamageFallMixIn(Game_Action.prototype);
})();
