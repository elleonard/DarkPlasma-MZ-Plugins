/// <reference path="./MultiplyXParamTrait.d.ts" />

import { pluginName } from '../../../common/pluginName';

const XPARAM_KEYS = ['hit', 'eva', 'cri', 'cev', 'mev', 'mrf', 'cnt', 'hrg', 'mrg', 'trg'] as const;

const xparamRateDataIds = XPARAM_KEYS.map((_, paramId) => uniqueTraitDataIdCache.allocate(pluginName, Game_BattlerBase.TRAIT_XPARAM, paramId, TextManager.xparam ? TextManager.xparam(paramId) : ""));

function DataManager_MultiplyXParamTraitMixIn(dataManager: typeof DataManager) {
  const _extractMetadata = dataManager.extractMetadata;
  dataManager.extractMetadata = function (data) {
    _extractMetadata.call(this, data);
    if ("traits" in data) {
      if (data.meta.multiplyXParam) {
        data.traits.push(this.parseMultiplyXParamTrait(String(data.meta.multiplyXParam)));
      }
    }
  };

  dataManager.parseMultiplyXParamTrait = function (meta) {
    const metaTokens = meta.split(":").map(token => token.trim());
    if (metaTokens.length < 2) {
      throw Error(`追加能力値乗算の特徴の記述が不正です: ${meta}`);
    }
    const paramId = XPARAM_KEYS.indexOf(metaTokens[0] as typeof XPARAM_KEYS[number]);
    if (paramId < 0) {
      throw Error(`追加能力値乗算の対象パラメータの記述が不正です: ${metaTokens[0]}`);
    }
    return {
      code: Game_BattlerBase.TRAIT_XPARAM,
      dataId: xparamRateDataIds[paramId].id,
      value: Number(metaTokens[1])/100,
    };
  };
}

DataManager_MultiplyXParamTraitMixIn(DataManager);

function Game_BattlerBase_MultiplyXParamTraitMixIn(gameBattlerBase: Game_BattlerBase) {
  const _xparam = gameBattlerBase.xparam;
  gameBattlerBase.xparam = function (paramId) {
    return _xparam.call(this, paramId) * this.xparamRate(paramId);
  };

  gameBattlerBase.xparamRate = function (paramId) {
    return this.traitsPi(Game_BattlerBase.TRAIT_XPARAM, xparamRateDataIds[paramId].id);
  };
}

Game_BattlerBase_MultiplyXParamTraitMixIn(Game_BattlerBase.prototype);
