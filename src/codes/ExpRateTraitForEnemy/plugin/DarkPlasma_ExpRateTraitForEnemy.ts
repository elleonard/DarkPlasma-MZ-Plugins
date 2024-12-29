/// <reference path="./ExpRateTraitForEnemy.d.ts" />

import { pluginName } from '../../../common/pluginName';

const expRateTrait = uniqueTraitIdCache.allocate(pluginName, 1, "経験値倍率");

function DataManager_ExpRateTraitMixIn(dataManager: typeof DataManager) {
  const _extractMetadata = dataManager.extractMetadata;
  dataManager.extractMetadata = function (data) {
    _extractMetadata.call(this, data);
    if ("traits" in data) {
      if (data.meta.expRateForEnemy) {
        data.traits.push({
          code: expRateTrait.id,
          dataId: 0,
          value: Number(data.meta.expRateForEnemy) / 100,
        });
      }
    }
  };
}

DataManager_ExpRateTraitMixIn(DataManager);

function Game_Enemy_ExpRateTraitMixIn(gameEnemy: Game_Enemy) {
  const _exp = gameEnemy.exp;
  gameEnemy.exp = function () {
    return _exp.call(this) * this.traitsPi(expRateTrait.id, 0);
  };
}

Game_Enemy_ExpRateTraitMixIn(Game_Enemy.prototype);
