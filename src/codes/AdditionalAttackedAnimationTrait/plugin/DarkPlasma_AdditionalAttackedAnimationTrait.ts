/// <reference path="./AdditionalAttackedAnimationTrait.d.ts" />

import { pluginName } from '../../../common/pluginName';

const additionalAttackedAnimationTrait = uniqueTraitIdCache.allocate(pluginName, 0, '被弾アニメーション');

function DataManager_AdditionalAttackedAnimationTraitMixIn(dataManager: typeof DataManager) {
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

function Game_Battler_AdditionalAttackedAnimationTraitsMixIn(gameBattler: Game_Battler) {
  gameBattler.additionalAttackedAnimationIds = function () {
    return this.traitsSet(additionalAttackedAnimationTrait.id);
  };
}

Game_Battler_AdditionalAttackedAnimationTraitsMixIn(Game_Battler.prototype);

function Window_BattleLog_AdditionalAttackedAnimationTraitsMixIn(windowBattleLog: Window_BattleLog) {
  const _startAction = windowBattleLog.startAction;
  windowBattleLog.startAction = function (subject, action, targets) {
    _startAction.call(this, subject, action, targets);
    if (action.isDamage()) {
      targets.forEach(target => {
        target.additionalAttackedAnimationIds().forEach(animationId => {
          this.push('waitForEffect');
          this.push('showAnimation', subject, [target], animationId);
        });
    });
    }
  };
}

Window_BattleLog_AdditionalAttackedAnimationTraitsMixIn(Window_BattleLog.prototype);
