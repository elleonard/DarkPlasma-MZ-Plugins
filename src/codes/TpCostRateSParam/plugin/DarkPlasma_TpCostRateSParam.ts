/// <reference path="./TpCostRateSParam.d.ts" />

import { pluginName } from '../../../common/pluginName';
import { hasTraits } from '../../../common/data/hasTraits';
import { settings } from '../config/_build/DarkPlasma_TpCostRateSParam_parameters';

const tpCostRateSParamId = uniqueTraitDataIdCache.allocate(pluginName, Game_BattlerBase.TRAIT_SPARAM, 0, "TP消費率");
const tpCostRateSParamPlusId = uniqueTraitDataIdCache.allocate(pluginName, Game_BattlerBase.TRAIT_SPARAM, 1, "TP消費率");
const sparamKey = "tpCostRate";

function DataManager_TpCostRateMixIn(dataManager: typeof DataManager) {
  const _extractMetadata = dataManager.extractMetadata;
  dataManager.extractMetadata = function (data) {
    _extractMetadata.call(this, data);
    if (hasTraits(data) && data.meta.tpCostRate) {
      data.traits.push({
        code: Game_BattlerBase.TRAIT_SPARAM,
        dataId: tpCostRateSParamId.id,
        value: Number(data.meta.tpCostRate) / 100,
      });
    }
  };

  /**
   * ADDSParamTrait
   */
  const _sparamKeyToAddSParamId = dataManager.sparamKeyToSParamId;
  dataManager.sparamKeyToSParamId = function (key) {
    if (key === sparamKey) {
      return tpCostRateSParamId.id;
    }
    return _sparamKeyToAddSParamId.call(this, key);
  };

  const _sparamIdToAddSParamDataId = dataManager.sparamIdToAddSparamDataId;
  dataManager.sparamIdToAddSparamDataId = function(paramId) {
    if (paramId === tpCostRateSParamId.id) {
      return tpCostRateSParamPlusId.id;
    }
    return _sparamIdToAddSParamDataId.call(this, paramId);
  };
}

DataManager_TpCostRateMixIn(DataManager);

function Game_BattlerBase_TpCostRateMixIn(gameBattlerBase: Game_BattlerBase) {
  gameBattlerBase.tpCostRate = function () {
    return this.sparam(tpCostRateSParamId.id);
  };

  const _skillTpCost = gameBattlerBase.skillTpCost;
  gameBattlerBase.skillTpCost = function (skill) {
    return _skillTpCost.call(this, skill) * this.tpCostRate();
  };

  /**
   * LimitSParam
   */
  const _sparamLimitSetting = gameBattlerBase.sparamLimitSetting;
  gameBattlerBase.sparamLimitSetting = function (paramId) {
    if (paramId === tpCostRateSParamId.id) {
      return settings.limitSetting;
    }
    return _sparamLimitSetting.call(this, paramId);
  };
}

Game_BattlerBase_TpCostRateMixIn(Game_BattlerBase.prototype);
