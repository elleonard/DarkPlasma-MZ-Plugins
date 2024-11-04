/// <reference path="./AddSParamTrait.d.ts" />

import { pluginName } from '../../../common/pluginName';

const SPARAM_KEYS = ['tgr', 'grd', 'rec', 'pha', 'mcr', 'tcr', 'pdr', 'mdr', 'fdr', 'exr'] as const;

const sparamPlusDataIds = SPARAM_KEYS.map((_, paramId) => uniqueTraitDataIdCache.allocate(pluginName, Game_BattlerBase.TRAIT_SPARAM, paramId, TextManager.sparam ? TextManager.sparam(paramId) : ""));

function DataManager_MultiplyXParamTraitMixIn(dataManager: typeof DataManager) {
  const _extractMetadata = dataManager.extractMetadata;
  dataManager.extractMetadata = function (data) {
    _extractMetadata.call(this, data);
    if ("traits" in data) {
      if (data.meta.addSParam) {
        data.traits.push(this.parseAddSParamTrait(String(data.meta.addSParam)));
      }
    }
  };

  dataManager.parseAddSParamTrait = function (meta) {
    const metaTokens = meta.split(":").map(token => token.trim());
    if (metaTokens.length < 2) {
      throw Error(`特殊能力値加算の特徴の記述が不正です: ${meta}`);
    }
    const paramId = SPARAM_KEYS.indexOf(metaTokens[0] as typeof SPARAM_KEYS[number]);
    if (paramId < 0) {
      throw Error(`特殊能力値加算の対象パラメータの記述が不正です: ${metaTokens[0]}`);
    }
    return {
      code: Game_BattlerBase.TRAIT_SPARAM,
      dataId: sparamPlusDataIds[paramId].id,
      value: Number(metaTokens[1])/100,
    };
  };
}

DataManager_MultiplyXParamTraitMixIn(DataManager);

function Game_BattlerBase_AddSParamTraitMixIn(gameBattlerBase: Game_BattlerBase) {
  const _sparam = gameBattlerBase.sparam;
  gameBattlerBase.sparam = function (paramId) {
    return _sparam.call(this, paramId) * this.sparamPlus(paramId);
  };

  gameBattlerBase.sparamPlus = function (paramId) {
    return this.traitsSum(Game_BattlerBase.TRAIT_SPARAM, sparamPlusDataIds[paramId].id);
  };
}

Game_BattlerBase_AddSParamTraitMixIn(Game_BattlerBase.prototype);

