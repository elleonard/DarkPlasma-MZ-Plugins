// DarkPlasma_RegenerateByValueTrait 1.0.0
// Copyright (c) 2023 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2023/06/16 1.0.0 公開
 */

/*:
 * @plugindesc HP再生値 MP再生値特徴
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @base DarkPlasma_AllocateUniqueTraitId
 * @orderAfter DarkPlasma_AllocateUniqueTraitId
 *
 * @help
 * version: 1.0.0
 * HP再生値、MP再生値特徴を定義します。
 * 再生値特徴は再生率と異なり、HPやMPの上限値に対する割合ではなく、
 * 値によってターン経過時に回復・スリップダメージを受けます。
 *
 * 設定例:
 * <hpRegenerationValue:10>
 * HPを毎ターン10回復する特徴を追加します。
 *
 * <mpRegenerationValue:-10>
 * MPを毎ターン10消費する特徴を追加します。
 *
 * 特徴による回復量を動的に変動させたい場合は、
 * カスタムIDを定義した上で追加のプラグインを書いてください。
 *
 * <hpRegenerationCustomId:1>
 * <mpRegenerationCustomId:1>
 *
 * 追加プラグインの書き方の例については、
 * DarkPlasma_RegenerateByValueTraitCustomSample
 * を参照してください。
 *
 * 本プラグインの利用には下記プラグインを必要とします。
 * DarkPlasma_AllocateUniqueTraitId version:1.0.1
 * 下記プラグインと共に利用する場合、それよりも下に追加してください。
 * DarkPlasma_AllocateUniqueTraitId
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  function hasTraits(data) {
    return 'traits' in data;
  }

  const localTraitId = 1;
  const hpRegenerationValueTraitId = uniqueTraitIdCache.allocate(pluginName, localTraitId, 'HP再生値');
  const mpRegenerationValueTraitId = uniqueTraitIdCache.allocate(pluginName, localTraitId + 1, 'MP再生値');
  function DataManager_RegenerationByValueMixIn(dataManager) {
    const _extractMetadata = dataManager.extractMetadata;
    dataManager.extractMetadata = function (data) {
      _extractMetadata.call(this, data);
      if (hasTraits(data)) {
        this.extractRegenerationValueTrait(data);
      }
    };
    dataManager.extractRegenerationValueTrait = function (data) {
      if (data.meta.hpRegenerationValue) {
        data.traits.push({
          code: hpRegenerationValueTraitId.id,
          dataId: Number(data.meta.hpRegenerationCustomId || 0),
          value: Number(data.meta.hpRegenerationValue),
        });
      }
      if (data.meta.mpRegenerationValue) {
        data.traits.push({
          code: mpRegenerationValueTraitId.id,
          dataId: Number(data.meta.mpRegenerationCustomId || 0),
          value: Number(data.meta.mpRegenerationValue),
        });
      }
    };
    dataManager.hpRegenerationValueTraitId = function () {
      return hpRegenerationValueTraitId.id;
    };
    dataManager.mpRegenerationValueTraitId = function () {
      return mpRegenerationValueTraitId.id;
    };
  }
  DataManager_RegenerationByValueMixIn(DataManager);
  function Game_Battler_RegenerationByValueMixIn(gameBattler) {
    const _regenerateHp = gameBattler.regenerateHp;
    gameBattler.regenerateHp = function () {
      _regenerateHp.call(this);
      const value = this.totalHpRegenerationValue();
      if (value !== 0) {
        this.gainHp(value);
      }
    };
    gameBattler.totalHpRegenerationValue = function () {
      return this.traitsSet(hpRegenerationValueTraitId.id).reduce(
        (result, customId) => result + this.hpRegenerationValue(customId),
        0
      );
    };
    gameBattler.hpRegenerationValue = function (customId) {
      return this.traitsSum(hpRegenerationValueTraitId.id, customId);
    };
    const _regenerateMp = gameBattler.regenerateMp;
    gameBattler.regenerateMp = function () {
      _regenerateMp.call(this);
      const value = this.totalMpRegenerationValue();
      if (value !== 0) {
        this.gainMp(value);
      }
    };
    gameBattler.totalMpRegenerationValue = function () {
      return this.traitsSet(mpRegenerationValueTraitId.id).reduce(
        (result, customId) => result + this.mpRegenerationValue(customId),
        0
      );
    };
    gameBattler.mpRegenerationValue = function (customId) {
      return this.traitsSum(mpRegenerationValueTraitId.id, customId);
    };
  }
  Game_Battler_RegenerationByValueMixIn(Game_Battler.prototype);
})();
