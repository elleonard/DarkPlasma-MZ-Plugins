/// <reference path="./LevelXState.d.ts" />

import { pluginName } from '../../common/pluginName';

const levelXStateEffect = uniqueEffectCodeCache.allocate(pluginName, 0);

function DataManager_LevelXStateMixIn(dataManager: typeof DataManager) {
  const _extractMetadata = dataManager.extractMetadata;
  dataManager.extractMetadata = function (data) {
    _extractMetadata.call(this, data);
    if ("effects" in data && data.meta.levelXState) {
      String(data.meta.levelXState)
        .split('\n')
        .filter(line => line.includes(':')).forEach(line => {
          const e = line.split(':');
          if (e.length === 2) {
            data.effects.push({
              code: levelXStateEffect.code,
              dataId: Number(e[1]),
              value1: Number(e[0]),
              value2: 0,
            });
          }
        })
    }
  };
}

DataManager_LevelXStateMixIn(DataManager);

function Game_Action_LevelXStateMixIn(gameAction: Game_Action) {
  const _testItemEffect = gameAction.testItemEffect;
  gameAction.testItemEffect = function (target, effect) {
    if (effect.code === levelXStateEffect.code) {
      return !target.isStateAffected(effect.dataId)
        && !!target.level
        && target.level%effect.value1 === 0;
    }
    return _testItemEffect.call(this, target, effect);
  };

  const _applyItemEffect = gameAction.applyItemEffect;
  gameAction.applyItemEffect = function (target, effect) {
    if (effect.code === levelXStateEffect.code) {
      if (
        !target.isStateResist(effect.dataId)
        && target.stateRate(effect.dataId) > 0
        && target.level
        && target.level%effect.value1 === 0
      ) {
        target.addState(effect.dataId);
        this.makeSuccess(target);
      }
    }
    _applyItemEffect.call(this, target, effect);
  };
}

Game_Action_LevelXStateMixIn(Game_Action.prototype);
