/// <reference path="./DualWieldDamageRateTrait.d.ts" />

import { pluginName } from '../../../common/pluginName';
import { hasTraits } from '../../../common/data/hasTraits';

const dualWieldRepeatsDamageRateTrait = uniqueTraitIdCache.allocate(pluginName, 0, "二刀流連撃ダメージ倍率");
const dualWieldRepeatsDamageRatePlusTrait = uniqueTraitIdCache.allocate(pluginName, 1, "二刀流連撃ダメージ倍率加算");

function DataManager_DualWieldDamageRateTraitMixIn(dataManager: typeof DataManager) {
  const _extractMetadata = dataManager.extractMetadata;
  dataManager.extractMetadata = function (data) {
    _extractMetadata.call(this, data);
    if (hasTraits(data)) {
      if (data.meta.dualWieldRepeatsDamageRate) {
        data.traits.push({
          code: dualWieldRepeatsDamageRateTrait.id,
          dataId: 0,
          value: Number(data.meta.dualWieldRepeatsDamageRate)/100,
        });
      }
      if (data.meta.dualWieldRepeatsDamageRatePlus) {
        data.traits.push({
          code: dualWieldRepeatsDamageRatePlusTrait.id,
          dataId: 0,
          value: Number(data.meta.dualWieldRepeatsDamageRatePlus)/100,
        })
      }
    }
  };
}

DataManager_DualWieldDamageRateTraitMixIn(DataManager);

function Game_BattlerBase_DualWieldDamageRateTraitMixIn(gameBattlerBase: Game_BattlerBase) {
  gameBattlerBase.dualWieldRepeatsDamageRate = function () {
    return this.traitsPi(dualWieldRepeatsDamageRateTrait.id, 0) + this.traitsSum(dualWieldRepeatsDamageRatePlusTrait.id, 0);
  };
}

Game_BattlerBase_DualWieldDamageRateTraitMixIn(Game_BattlerBase.prototype);

function Game_Action_DualWieldDamageRateTraitMixIn(gameAction: Game_Action) {
  const _makeDamageValue = gameAction.makeDamageValue;
  gameAction.makeDamageValue = function (target, critical) {
    let value = _makeDamageValue.call(this, target, critical);
    if (this.subject().isDualWield() && this.isDualWieldRepeats()) {
      value *= this.subject().dualWieldRepeatsDamageRate();
    }
    return Math.floor(value);
  };
}

Game_Action_DualWieldDamageRateTraitMixIn(Game_Action.prototype);
