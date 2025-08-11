/// <reference path="./RemoveStateGroupEffect.d.ts" />

import { pluginName } from '../../../common/pluginName';

const removeStateGroupEffect = uniqueEffectCodeCache.allocate(pluginName, 0);

function DataManager_RemoveStateGroupEffectMixIn(dataManager: typeof DataManager) {
  const _extractMetadata = dataManager.extractMetadata;
  dataManager.extractMetadata = function (data) {
    _extractMetadata.call(this, data);
    if ("effects" in data && data.meta.removeStateGroup) {
      const groupName = String(data.meta.removeStateGroup).trim();
      data.effects.push({
        code: removeStateGroupEffect.code,
        dataId: this.allocateStateGroup(groupName).id,
        value1: 0,
        value2: 0,
      });
    }
  };
}

DataManager_RemoveStateGroupEffectMixIn(DataManager);

function Game_Action_RemoveStateGroupEffectMixIn(gameAction: Game_Action) {
  const _testItemEffect = gameAction.testItemEffect;
  gameAction.testItemEffect = function (target, effect) {
    if (effect.code === removeStateGroupEffect.code) {
      return target.isStateGroupAffected(effect.dataId);
    }
    return _testItemEffect.call(this, target, effect);
  };

  const _applyItemEffect = gameAction.applyItemEffect;
  gameAction.applyItemEffect = function (target, effect) {
    _applyItemEffect.call(this, target, effect);
    if (effect.code === removeStateGroupEffect.code) {
      this.itemEffectRemoveStateGroup(target, effect);
    }
  };

  gameAction.itemEffectRemoveStateGroup = function (target, effect) {
    DataManager.stateGroup(effect.dataId)?.stateIds.forEach(stateId => {
      target.removeState(stateId);
    });
    this.makeSuccess(target);
  };
}

Game_Action_RemoveStateGroupEffectMixIn(Game_Action.prototype);
