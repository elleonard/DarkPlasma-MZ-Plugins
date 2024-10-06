// DarkPlasma_TpDamageEffect 1.0.0
// Copyright (c) 2024 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2024/10/06 1.0.0 公開
 */

/*:
 * @plugindesc TPにダメージを与える使用効果
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @base DarkPlasma_AllocateUniqueEffectCode
 * @orderAfter DarkPlasma_AllocateUniqueEffectCode
 *
 * @help
 * version: 1.0.0
 * TPにダメージを与える使用効果を追加します。
 *
 * スキルやアイテムのメモ欄に以下のように記述すると、
 * TPに10のダメージを与える使用効果を設定できます。
 * <tpDamage:10>
 *
 * 固定値以外のダメージを与える効果にしたい場合は、
 * 拡張プラグインを作成してください。
 *
 * 本プラグインの利用には下記プラグインを必要とします。
 * DarkPlasma_AllocateUniqueEffectCode version:1.0.1
 * 下記プラグインと共に利用する場合、それよりも下に追加してください。
 * DarkPlasma_AllocateUniqueEffectCode
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  /**
   * 固定値ダメージ以外も拡張プラグインで実現できるようにするため、
   * 既存のEFFECT_GAIN_TPとは別効果とする。
   */
  const tpDamageEffect = uniqueEffectCodeCache.allocate(pluginName, 0);
  function DataManager_TpDamageEffectMixIn(dataManager) {
    const _extractMetadata = dataManager.extractMetadata;
    dataManager.extractMetadata = function (data) {
      _extractMetadata.call(this, data);
      if ('effects' in data && data.meta.tpDamage) {
        data.effects.push({
          code: tpDamageEffect.code,
          dataId: 0,
          value1: Number(data.meta.tpDamage) || 0,
          value2: 0,
        });
      }
    };
  }
  DataManager_TpDamageEffectMixIn(DataManager);
  function Game_Action_TpDamageEffectMixIn(gameAction) {
    const _testItemEffect = gameAction.testItemEffect;
    gameAction.testItemEffect = function (target, effect) {
      if (effect.code === tpDamageEffect.code) {
        return target.tp > 0;
      }
      return _testItemEffect.call(this, target, effect);
    };
    const _applyItemEffect = gameAction.applyItemEffect;
    gameAction.applyItemEffect = function (target, effect) {
      if (effect.code === tpDamageEffect.code) {
        const damage = this.calcTpDamage(target, effect);
        if (damage > 0) {
          target.gainTp(-this.calcTpDamage(target, effect));
          this.makeSuccess(target);
        }
      }
      _applyItemEffect.call(this, target, effect);
    };
    /**
     * 固定値以外のダメージにしたい場合に拡張プラグインで上書きするメソッド
     */
    gameAction.calcTpDamage = function (target, effect) {
      return effect.value1;
    };
  }
  Game_Action_TpDamageEffectMixIn(Game_Action.prototype);
})();
