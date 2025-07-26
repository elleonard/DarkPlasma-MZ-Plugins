// DarkPlasma_HealOnBattleStartTrait 1.0.0
// Copyright (c) 2025 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2025/07/26 1.0.0 最初のバージョン
 */

/*:
 * @plugindesc 戦闘開始時に回復する特徴
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @help
 * version: 1.0.0
 * 戦闘開始時に回復する特徴を設定できます。
 *
 * <healHpOnBattleStart:x>
 * 戦闘開始時にHPをx％回復する
 *
 * <healMpOnBattleStart:x>
 * 戦闘開始時にMPをx％回復する
 *
 * <healTpOnBattleStart:x>
 * 戦闘開始時にTPをx％回復する
 *
 * これらの特徴を複数所持する場合、効果値は加算されます。
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  function hasTraits(data) {
    return 'traits' in data;
  }

  const healHpTrait = uniqueTraitIdCache.allocate(pluginName, 0, '戦闘開始時HP回復');
  const healMpTrait = uniqueTraitIdCache.allocate(pluginName, 1, '戦闘開始時MP回復');
  const healTpTrait = uniqueTraitIdCache.allocate(pluginName, 2, '戦闘開始時TP回復');
  function DataManager_HealOnBattleStartTraitMixIn(dataManager) {
    const _extractMetadata = dataManager.extractMetadata;
    dataManager.extractMetadata = function (data) {
      _extractMetadata.call(this, data);
      if (hasTraits(data)) {
        if (data.meta.healHpOnBattleStart) {
          data.traits.push({
            code: healHpTrait.id,
            dataId: 0,
            value: Number(data.meta.healHpOnBattleStart) / 100,
          });
        }
        if (data.meta.healMpOnBattleStart) {
          data.traits.push({
            code: healMpTrait.id,
            dataId: 0,
            value: Number(data.meta.healMpOnBattleStart) / 100,
          });
        }
        if (data.meta.healTpOnBattleStart) {
          data.traits.push({
            code: healTpTrait.id,
            dataId: 0,
            value: Number(data.meta.healTpOnBattleStart) / 100,
          });
        }
      }
    };
  }
  DataManager_HealOnBattleStartTraitMixIn(DataManager);
  function Game_Battler_HealOnBattleStartTraitMixIn(gameBattler) {
    const _onBattleStart = gameBattler.onBattleStart;
    gameBattler.onBattleStart = function (advantageous) {
      _onBattleStart.call(this, advantageous);
      this.healOnBattleStart();
    };
    gameBattler.healOnBattleStart = function () {
      this.healHpOnBattleStart();
      this.healMpOnBattleStart();
      this.healTpOnBattleStart();
    };
    gameBattler.healHpOnBattleStart = function () {
      const healHpRate = this.traitsSum(healHpTrait.id, 0);
      if (healHpRate) {
        this.gainHp(Math.floor(healHpRate * this.mhp));
      }
    };
    gameBattler.healMpOnBattleStart = function () {
      const healMpRate = this.traitsSum(healMpTrait.id, 0);
      if (healMpRate) {
        this.gainMp(Math.floor(healMpRate * this.mmp));
      }
    };
    gameBattler.healTpOnBattleStart = function () {
      const healTpRate = this.traitsSum(healTpTrait.id, 0);
      if (healTpRate) {
        this.gainTp(Math.floor(healTpRate * this.maxTp()));
      }
    };
  }
  Game_Battler_HealOnBattleStartTraitMixIn(Game_Battler.prototype);
})();
