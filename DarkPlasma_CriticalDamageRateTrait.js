// DarkPlasma_CriticalDamageRateTrait 1.1.0
// Copyright (c) 2024 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2025/09/15 1.1.0 装備絞り込み用の特徴名設定を追加
 * 2024/02/20 1.0.0 公開
 */

/*:
 * @plugindesc 会心ダメージ率の特徴を設定する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @base DarkPlasma_AllocateUniqueTraitId
 * @orderAfter DarkPlasma_AllocateUniqueTraitId
 * @orderAfter DarkPlasma_FilterEquip
 *
 * @param defaultCriticalDamageRate
 * @desc 会心ダメージ率の初期値を設定します。
 * @text デフォルト会心ダメージ率
 * @type number
 * @default 300
 *
 * @param namesForFilter
 * @desc 装備絞り込みの際に使用する特徴名を設定します。
 * @text フィルタ用特徴名
 * @type struct<NamesForFilter>
 * @default {"traitName":"追加能力値","effectName":"会心ダメージ率"}
 *
 * @help
 * version: 1.1.0
 * 会心ダメージ率の特徴を設定できます。
 *
 * アクター、職業、スキル、武器、防具、敵キャラ、ステートのメモ欄に
 * 以下のように記述すると、対象に会心ダメージ率を+n％する特徴を追加します。
 *
 * <criticalDamageRate:n>
 *
 * 本プラグインの利用には下記プラグインを必要とします。
 * DarkPlasma_AllocateUniqueTraitId version:1.0.1
 * 下記プラグインと共に利用する場合、それよりも下に追加してください。
 * DarkPlasma_AllocateUniqueTraitId
 * DarkPlasma_FilterEquip
 */
/*~struct~NamesForFilter:
 * @param traitName
 * @text 特徴名
 * @type string
 * @default 追加能力値
 *
 * @param effectName
 * @text 効果名
 * @type string
 * @default 会心ダメージ率
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
    defaultCriticalDamageRate: Number(pluginParameters.defaultCriticalDamageRate || 300),
    namesForFilter: pluginParameters.namesForFilter
      ? ((parameter) => {
          const parsed = JSON.parse(parameter);
          return {
            traitName: String(parsed.traitName || `追加能力値`),
            effectName: String(parsed.effectName || `会心ダメージ率`),
          };
        })(pluginParameters.namesForFilter)
      : { traitName: '追加能力値', effectName: '会心ダメージ率' },
  };

  const criticalDamageRateTrait = uniqueTraitIdCache.allocate(pluginName, 0, settings.namesForFilter.traitName);
  function DataManager_CriticalDamageRateTraitMixIn(dataManager) {
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
  function Game_BattlerBase_CriticalDamageRateTraitMixIn(gameBattlerBase) {
    gameBattlerBase.criticalDamageRate = function () {
      return (settings.defaultCriticalDamageRate + this.traitsSumAll(criticalDamageRateTrait.id)) / 100;
    };
  }
  Game_BattlerBase_CriticalDamageRateTraitMixIn(Game_BattlerBase.prototype);
  function Game_Action_CriticalDamageRateTraitMixIn(gameAction) {
    gameAction.applyCritical = function (damage) {
      return damage * this.subject().criticalDamageRate();
    };
  }
  Game_Action_CriticalDamageRateTraitMixIn(Game_Action.prototype);
  function Scene_Equip_AllocateUniqueTraitDataIdMixIn(sceneEquip) {
    if ('equipFilterBuilder' in sceneEquip && settings.namesForFilter.effectName) {
      const _equipFilterBuilder = sceneEquip.equipFilterBuilder;
      sceneEquip.equipFilterBuilder = function (equips) {
        return _equipFilterBuilder.call(this, equips).withTraitToEffectNameRule((traitId, dataId) => {
          return traitId === criticalDamageRateTrait.id ? settings.namesForFilter.effectName : null;
        });
      };
    }
  }
  Scene_Equip_AllocateUniqueTraitDataIdMixIn(Scene_Equip.prototype);
})();
