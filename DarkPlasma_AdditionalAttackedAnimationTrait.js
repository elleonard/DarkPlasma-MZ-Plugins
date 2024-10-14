// DarkPlasma_AdditionalAttackedAnimationTrait 1.0.0
// Copyright (c) 2024 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2024/10/14 1.0.0 公開
 */

/*:
 * @plugindesc 攻撃を受ける際に追加アニメーションを表示する特徴
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @base DarkPlasma_AllocateUniqueTraitCode
 * @orderAfter DarkPlasma_AllocateUniqueTraitCode
 *
 * @help
 * version: 1.0.0
 * 攻撃を受ける際に追加アニメーションを表示する特徴を設定します。
 *
 * アクター、職業、装備、敵キャラ、ステートのメモ欄に以下のように記述すると
 * 攻撃(ダメージを伴う行動)を受ける際にアニメーション1を追加で表示します。
 * <additionalAttackedAnimation:1>
 *
 * 本プラグインの利用には下記プラグインを必要とします。
 * DarkPlasma_AllocateUniqueTraitCode version:1.0.1
 * 下記プラグインと共に利用する場合、それよりも下に追加してください。
 * DarkPlasma_AllocateUniqueTraitCode
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const additionalAttackedAnimationTrait = uniqueTraitIdCache.allocate(pluginName, 0, '被弾アニメーション');
  function DataManager_AdditionalAttackedAnimationTraitMixIn(dataManager) {
    const _extractMetadata = dataManager.extractMetadata;
    dataManager.extractMetadata = function (data) {
      _extractMetadata.call(this, data);
      if ('traits' in data) {
        if (data.meta.additionalAttackedAnimation) {
          data.traits.push({
            code: additionalAttackedAnimationTrait.id,
            dataId: Number(data.meta.additionalAttackedAnimation),
            value: 0,
          });
        }
      }
    };
  }
  DataManager_AdditionalAttackedAnimationTraitMixIn(DataManager);
  function Game_Battler_AdditionalAttackedAnimationTraitsMixIn(gameBattler) {
    gameBattler.additionalAttackedAnimationIds = function () {
      return this.traitsSet(additionalAttackedAnimationTrait.id);
    };
  }
  Game_Battler_AdditionalAttackedAnimationTraitsMixIn(Game_Battler.prototype);
  function Window_BattleLog_AdditionalAttackedAnimationTraitsMixIn(windowBattleLog) {
    const _startAction = windowBattleLog.startAction;
    windowBattleLog.startAction = function (subject, action, targets) {
      _startAction.call(this, subject, action, targets);
      if (action.isDamage()) {
        targets.forEach((target) => {
          target.additionalAttackedAnimationIds().forEach((animationId) => {
            this.push('waitForEffect');
            this.push('showAnimation', subject, [target], animationId);
          });
        });
      }
    };
  }
  Window_BattleLog_AdditionalAttackedAnimationTraitsMixIn(Window_BattleLog.prototype);
})();
