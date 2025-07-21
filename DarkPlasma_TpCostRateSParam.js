// DarkPlasma_TpCostRateSParam 1.0.0
// Copyright (c) 2025 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2025/07/21 1.0.0 最初のバージョン
 */

/*:
 * @plugindesc 特殊能力値 TP消費率を追加する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @base DarkPlasma_AllocateUniqueTraitDataId
 * @orderAfter DarkPlasma_AddSParamTrait
 * @orderAfter DarkPlasma_LimitSParam
 * @orderAfter DarkPlasma_AllocateUniqueTraitDataId
 *
 * @param limitSetting
 * @desc TP消費率の限界値を設定します。DarkPlasma_LimitSParam利用時のみ有効。
 * @text 限界値設定
 * @type struct<LimitValue>
 * @default {"enableLowerLimit":"false","enableUpperLimit":"false","lowerLimit":"0","upperLimit":"10000"}
 *
 * @help
 * version: 1.0.0
 * 特殊能力値特徴にTP消費率を追加します。
 * 特徴を追加したいデータのメモ欄に以下のように記述してください。
 *
 * <tpCostRate:倍率(％)>
 *
 * 例:
 * TP消費率150％
 * <tpCostRate:150>
 *
 * 加算で変化させたい場合は、DarkPlasma_AddSParamTraitを利用してください。
 *
 * 例:
 * TP消費率+10％
 * <addSParam:tpCostRate:10>
 *
 * 本プラグインの利用には下記プラグインを必要とします。
 * DarkPlasma_AllocateUniqueTraitDataId version:1.1.0
 * 下記プラグインと共に利用する場合、それよりも下に追加してください。
 * DarkPlasma_AddSParamTrait
 * DarkPlasma_LimitSParam
 * DarkPlasma_AllocateUniqueTraitDataId
 */
/*~struct~LimitValue:
 * @param enableUpperLimit
 * @desc ONにすると上限値設定が有効になります。OFFにすると上限値なしとなります。
 * @text 上限値を有効にする
 * @type boolean
 * @default false
 *
 * @param upperLimit
 * @text 上限値
 * @type number
 * @default 0
 *
 * @param enableLowerLimit
 * @desc ONにすると下限値設定が有効になります。OFFにすると下限値なしとなります。
 * @text 下限値を有効にする
 * @type boolean
 * @default false
 *
 * @param lowerLimit
 * @text 下限値
 * @type number
 * @default 0
 */
(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  function hasTraits(data) {
    return 'traits' in data;
  }

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    limitSetting: pluginParameters.limitSetting
      ? ((parameter) => {
          const parsed = JSON.parse(parameter);
          return {
            enableUpperLimit: String(parsed.enableUpperLimit || false) === 'true',
            upperLimit: Number(parsed.upperLimit || 0),
            enableLowerLimit: String(parsed.enableLowerLimit || false) === 'true',
            lowerLimit: Number(parsed.lowerLimit || 0),
          };
        })(pluginParameters.limitSetting)
      : { enableLowerLimit: false, enableUpperLimit: false, lowerLimit: 0, upperLimit: 10000 },
  };

  const tpCostRateSParamId = uniqueTraitDataIdCache.allocate(pluginName, Game_BattlerBase.TRAIT_SPARAM, 0, 'TP消費率');
  const tpCostRateSParamPlusId = uniqueTraitDataIdCache.allocate(
    pluginName,
    Game_BattlerBase.TRAIT_SPARAM,
    1,
    'TP消費率',
  );
  const sparamKey = 'tpCostRate';
  function DataManager_TpCostRateMixIn(dataManager) {
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
    dataManager.sparamIdToAddSparamDataId = function (paramId) {
      if (paramId === tpCostRateSParamId.id) {
        return tpCostRateSParamPlusId.id;
      }
      return _sparamIdToAddSParamDataId.call(this, paramId);
    };
  }
  DataManager_TpCostRateMixIn(DataManager);
  function Game_BattlerBase_TpCostRateMixIn(gameBattlerBase) {
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
})();
