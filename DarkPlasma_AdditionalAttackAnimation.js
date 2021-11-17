// DarkPlasma_AdditionalAttackAnimation 2.0.3
// Copyright (c) 2020 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2021/07/05 2.0.3 MZ 1.3.2に対応
 * 2021/06/22 2.0.2 サブフォルダからの読み込みに対応
 * 2020/11/10 2.0.1 全体化プラグインとの順序を明記
 * 2020/09/08 2.0.0 パラメータ名変更
 * 2020/08/27 1.0.0 MZ版公開
 */

/*:ja
 * @plugindesc 攻撃アニメーションを特定条件で追加する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @orderAfter DarkPlasma_ExpandTargetScope
 *
 * @param additionalAnimations
 * @desc 追加アニメーション
 * @text 追加アニメーション
 * @type struct<AdditionalAnimation>[]
 * @default []
 *
 * @help
 * version: 2.0.3
 * 攻撃アニメーションを特定条件で追加します。
 *
 * 以下の条件でアニメーションを追加できます。
 * - 特定ステートにかかっている対象
 * - 特定の敵
 *
 * 下記プラグインと共に利用する場合、それよりも下に追加してください。
 * DarkPlasma_ExpandTargetScope version:1.0.8
 */
/*~struct~AdditionalAnimation:
 * @param animation
 * @desc 追加で表示するアニメーション
 * @text アニメーション
 * @type animation
 * @default 1
 *
 * @param onlyForSomeEnemies
 * @desc 追加表示対象の敵を限定するか
 * @text 対象敵限定？
 * @type boolean
 * @default false
 *
 * @param enemies
 * @desc 追加表示対象の敵
 * @text 追加表示対象の敵
 * @type enemy[]
 * @default []
 *
 * @param onlyForSomeStates
 * @desc 追加表示対象のステートを限定するか
 * @text 対象ステート限定？
 * @type boolean
 * @default false
 *
 * @param states
 * @desc 追加表示対象のステート
 * @text 追加表示対象のステート
 * @type state[]
 * @default []
 */
(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParameters = PluginManager.parameters(pluginName);

  const settings = {
    additionalAnimations: JSON.parse(pluginParameters.additionalAnimations || '[]').map((e) => {
      return ((parameter) => {
        const parsed = JSON.parse(parameter);
        return {
          animation: Number(parsed.animation || 1),
          onlyForSomeEnemies: String(parsed.onlyForSomeEnemies || false) === 'true',
          enemies: JSON.parse(parsed.enemies || '[]').map((e) => {
            return Number(e || 0);
          }),
          onlyForSomeStates: String(parsed.onlyForSomeStates || false) === 'true',
          states: JSON.parse(parsed.states || '[]').map((e) => {
            return Number(e || 0);
          }),
        };
      })(e || '{}');
    }),
  };

  const _Window_BattleLog_startAction = Window_BattleLog.prototype.startAction;
  Window_BattleLog.prototype.startAction = function (subject, action, targets) {
    _Window_BattleLog_startAction.call(this, subject, action, targets);
    this.push('waitForEffect');
    this.push('showAdditionalAnimation', subject, targets.clone());
  };

  Window_BattleLog.prototype.showAdditionalAnimation = function (subject, targets) {
    if (subject.isActor()) {
      settings.additionalAnimations.forEach((additionalAnimation) => {
        const additionalAnimationTargets = targets.filter((target) =>
          target.isAdditionalAnimationTarget(additionalAnimation)
        );
        this.showNormalAnimation(additionalAnimationTargets, additionalAnimation.animation, false);
      });
    }
  };

  Game_Actor.prototype.isAdditionalAnimationTarget = function (additionalAnimation) {
    if (additionalAnimation.onlyForSomeEnemies) {
      return false;
    }
    if (additionalAnimation.onlyForSomeStates) {
      if (!additionalAnimation.states.some((stateId) => this.isStateAffected(stateId))) {
        return false;
      }
    }
    return true;
  };

  Game_Enemy.prototype.isAdditionalAnimationTarget = function (additionalAnimation) {
    if (additionalAnimation.onlyForSomeEnemies) {
      if (!this.isEnemy()) {
        return false;
      }
      if (!additionalAnimation.enemies.some((enemyId) => enemyId === this.enemyId())) {
        return false;
      }
    }
    if (additionalAnimation.onlyForSomeStates) {
      if (!additionalAnimation.states.some((stateId) => this.isStateAffected(stateId))) {
        return false;
      }
    }
    return true;
  };
})();
