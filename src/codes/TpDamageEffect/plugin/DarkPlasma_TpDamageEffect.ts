/// <reference path="./TpDamageEffect.d.ts" />

import { pluginName } from '../../../common/pluginName';

/**
 * 固定値ダメージ以外も拡張プラグインで実現できるようにするため、
 * 既存のEFFECT_GAIN_TPとは別効果とする。
 */
const tpDamageEffect = uniqueEffectCodeCache.allocate(pluginName, 0);

function DataManager_TpDamageEffectMixIn(dataManager: typeof DataManager) {
  const _extractMetadata = dataManager.extractMetadata;
  dataManager.extractMetadata = function (data) {
    _extractMetadata.call(this, data);
    if ("effects" in data && data.meta.tpDamage) {
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

function Game_Action_TpDamageEffectMixIn(gameAction: Game_Action) {
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
