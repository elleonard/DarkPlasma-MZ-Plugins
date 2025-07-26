/// <reference path="./HealOnBattleStartTrait.d.ts" />

import { pluginName } from '../../../common/pluginName';
import { hasTraits } from '../../../common/data/hasTraits';

const healHpTrait = uniqueTraitIdCache.allocate(pluginName, 0, "戦闘開始時HP回復");
const healMpTrait = uniqueTraitIdCache.allocate(pluginName, 1, "戦闘開始時MP回復");
const healTpTrait = uniqueTraitIdCache.allocate(pluginName, 2, "戦闘開始時TP回復");

function DataManager_HealOnBattleStartTraitMixIn(dataManager: typeof DataManager) {
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

function Game_Battler_HealOnBattleStartTraitMixIn(gameBattler: Game_Battler) {
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
