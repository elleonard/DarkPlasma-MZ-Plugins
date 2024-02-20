// DarkPlasma_CriticalDamageRateTrait 1.0.0
// Copyright (c) 2024 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
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
 * @param defaultCriticalDamageRate
 * @desc 会心ダメージ率の初期値を設定します。
 * @text デフォルト会心ダメージ率
 * @type number
 * @default 300
 *
 * @help
 * version: 1.0.0
 * 会心ダメージ率の特徴を設定できます。
 *
 * アクター、職業、スキル、武器、防具、敵キャラ、ステートのメモ欄に
 * 以下のように記述すると、対象に会心ダメージ率を+n％する特徴を追加します。
 *
 * <criticalDamageRate:n>
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
  };

  const criticalDamageRateTrait = uniqueTraitIdCache.allocate(pluginName, 0, '会心ダメージ率');
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
})();
