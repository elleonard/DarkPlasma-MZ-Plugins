/// <reference path="./RegenerateByValueTrait.d.ts" />

import { pluginName } from '../../common/pluginName';
import { hasTraits } from '../../common/data/hasTraits';

const localTraitId = 1;
const hpRegenerationValueTraitId = uniqueTraitIdCache.allocate(pluginName, localTraitId, "HP再生値");
const mpRegenerationValueTraitId = uniqueTraitIdCache.allocate(pluginName, localTraitId + 1, "MP再生値");

function DataManager_RegenerationByValueMixIn(dataManager: typeof DataManager) {
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

function Game_Battler_RegenerationByValueMixIn(gameBattler: Game_Battler) {
  const _regenerateHp = gameBattler.regenerateHp;
  gameBattler.regenerateHp = function () {
    _regenerateHp.call(this);
    const value = this.totalHpRegenerationValue();
    if (value !== 0) {
      this.gainHp(value);
    }
  };

  gameBattler.totalHpRegenerationValue = function () {
    return this.traitsSet(hpRegenerationValueTraitId.id)
      .reduce((result, customId) => result + this.hpRegenerationValue(customId), 0);
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
    return this.traitsSet(mpRegenerationValueTraitId.id)
      .reduce((result, customId) => result + this.mpRegenerationValue(customId), 0);
  };

  gameBattler.mpRegenerationValue = function (customId) {
    return this.traitsSum(mpRegenerationValueTraitId.id, customId);
  };
}

Game_Battler_RegenerationByValueMixIn(Game_Battler.prototype);
