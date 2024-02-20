/// <reference path="./CriticalDamageRateTrait.d.ts" />

import { pluginName } from '../../../common/pluginName';
import { hasTraits } from '../../../common/data/hasTraits';
import { settings } from '../config/_build/DarkPlasma_CriticalDamageRateTrait_parameters';

const criticalDamageRateTrait = uniqueTraitIdCache.allocate(pluginName, 0, "会心ダメージ率");

function DataManager_CriticalDamageRateTraitMixIn(dataManager: typeof DataManager) {
  const _extractMetadata = dataManager.extractMetadata;
  dataManager.extractMetadata = function (data) {
    _extractMetadata.call(this, data);
    if (hasTraits(data) && data.meta.criticalDamageRate) {
      data.traits.push({
        code: criticalDamageRateTrait.id,
        dataId: 0,
        value: Number(data.meta.criticalDamageRate),
      });
    }
  };
}

DataManager_CriticalDamageRateTraitMixIn(DataManager);

function Game_BattlerBase_CriticalDamageRateTraitMixIn(gameBattlerBase: Game_BattlerBase) {
  gameBattlerBase.criticalDamageRate = function () {
    return (settings.defaultCriticalDamageRate + this.traitsSumAll(criticalDamageRateTrait.id))/100;
  };
}

Game_BattlerBase_CriticalDamageRateTraitMixIn(Game_BattlerBase.prototype);

function Game_Action_CriticalDamageRateTraitMixIn(gameAction: Game_Action) {
  gameAction.applyCritical = function (damage) {
    return damage * this.subject().criticalDamageRate();
  };
}

Game_Action_CriticalDamageRateTraitMixIn(Game_Action.prototype);
