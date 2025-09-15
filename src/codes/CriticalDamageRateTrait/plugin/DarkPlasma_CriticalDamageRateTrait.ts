/// <reference path="./CriticalDamageRateTrait.d.ts" />

import { pluginName } from '../../../common/pluginName';
import { hasTraits } from '../../../common/data/hasTraits';
import { settings } from '../config/_build/DarkPlasma_CriticalDamageRateTrait_parameters';

const criticalDamageRateTrait = uniqueTraitIdCache.allocate(pluginName, 0, settings.namesForFilter.traitName);

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

function Scene_Equip_AllocateUniqueTraitDataIdMixIn(sceneEquip: Scene_Equip) {
  if ("equipFilterBuilder" in sceneEquip && settings.namesForFilter.effectName) {
    const _equipFilterBuilder = sceneEquip.equipFilterBuilder;
    sceneEquip.equipFilterBuilder = function (equips) {
      return _equipFilterBuilder.call(this, equips)
        .withTraitToEffectNameRule((traitId, dataId) => {
          return traitId === criticalDamageRateTrait.id ? settings.namesForFilter.effectName : null;
        });
    };
  }
}

Scene_Equip_AllocateUniqueTraitDataIdMixIn(Scene_Equip.prototype);
