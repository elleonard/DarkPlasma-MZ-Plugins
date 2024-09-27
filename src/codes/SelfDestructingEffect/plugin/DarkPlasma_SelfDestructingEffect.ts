/// <reference path="./SelfDestructingEffect.d.ts" />

import { pluginName } from '../../../common/pluginName';

const selfDestructingEffect = uniqueEffectCodeCache.allocate(pluginName, 0);

function DataManager_SelfDestructingMixIn(dataManager: typeof DataManager) {
  const _extractMetadata = dataManager.extractMetadata;
  dataManager.extractMetadata = function (data) {
    _extractMetadata.call(this, data);
    if ("effects" in data && data.meta.selfDestructing) {
      data.effects.push({
        code: selfDestructingEffect.code,
        dataId: 0,
        value1: 0,
        value2: 0,
      });
    }
  };
}

DataManager_SelfDestructingMixIn(DataManager);

function Game_Action_SelfDestructingMixIn(gameAction: Game_Action) {
  const _testItemEffect = gameAction.testItemEffect;
  gameAction.testItemEffect = function (target, effect) {
    if (effect.code === selfDestructingEffect.code) {
      return this.subject().isAlive();
    }
    return _testItemEffect.call(this, target, effect);
  };

  const _applyItemEffect = gameAction.applyItemEffect;
  gameAction.applyItemEffect = function (target, effect) {
    if (effect.code === selfDestructingEffect.code) {
      this.subject().die();
      this.subject().refresh();
      this.subject().performCollapse();
    }
    _applyItemEffect.call(this, target, effect);
  };
}

Game_Action_SelfDestructingMixIn(Game_Action.prototype);
