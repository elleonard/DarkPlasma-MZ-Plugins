/// <reference path="./GutsTrait.d.ts" />

import { pluginName } from '../../../common/pluginName';
import { hasTraits } from '../../../common/data/hasTraits';
import { isState } from '../../../common/data/isState';

const gutsTrait = uniqueTraitIdCache.allocate(
  pluginName, 0, "食いしばり"
);

function DataManager_GutsTraitMixIn(dataManager: typeof DataManager) {
  const _extractMetadata = dataManager.extractMetadata;
  dataManager.extractMetadata = function (data) {
    _extractMetadata.call(this, data);
    if (hasTraits(data) && data.meta.guts) {
      data.traits.push({
        code: gutsTrait.id,
        dataId: 0,
        value: Number(data.meta.guts || 0),
      });
    }
    if (isState(data) && data.meta.removeByGutsZero) {
      data.removeByGutsZero = true;
    }
  };
}

DataManager_GutsTraitMixIn(DataManager);

function Game_BattlerBase_GutsTraitMixIn(gameBattlerBase: Game_BattlerBase) {
  const _refresh = gameBattlerBase.refresh;
  gameBattlerBase.refresh = function () {
    _refresh.call(this);
    if ($gameParty.inBattle() && this.hp === 0 && this.gutsCount() > 0) {
      this._hp = 1;
      this.decreaseGuts();
    }
  };

  gameBattlerBase.initializeGuts = function () {
    this._gutsCount = this.traitsSum(gutsTrait.id, 0);
  };

  gameBattlerBase.gutsCount = function () {
    return this._gutsCount || 0;
  };

  gameBattlerBase.addGutsCount = function (count) {
    this._gutsCount = this.gutsCount() + count;
  };

  gameBattlerBase.decreaseGuts = function () {
    if (this._gutsCount) {
      this._gutsCount--;
      const minimumGutsCountState = this.minimumGutsCountState();
      if (minimumGutsCountState) {
        this.addStateValue(minimumGutsCountState.id, "guts", -1);
        if (this.stateValue(minimumGutsCountState.id, "guts") === 0) {
          this.onGutsZero(minimumGutsCountState.id);
        }
      }
    }
  };

  gameBattlerBase.onGutsZero = function () { };

  const _addNewState = gameBattlerBase.addNewState;
  gameBattlerBase.addNewState = function (stateId) {
    _addNewState.call(this, stateId);
    const gutsCount = Number($dataStates[stateId].meta.guts || 0);
    if (gutsCount) {
      this.addGutsCount(gutsCount);
      this.addStateValue(stateId, "guts", gutsCount);
    }
  };

  gameBattlerBase.minimumGutsCountState = function () {
    return this.states()
      .filter(state => this.stateValue(state.id, "guts") > 0)
      .reduce((prev: MZ.State|undefined, current) => {
        if (!prev) {
          return current;
        }
        const prevGuts = this.stateValue(prev.id, "guts");
        const currentGuts = this.stateValue(current.id, "guts");
        if (prevGuts > currentGuts) {
          return prev;
        } else {
          return current;
        }
      }, undefined);
  };
}

Game_BattlerBase_GutsTraitMixIn(Game_BattlerBase.prototype);

function Game_Battler_GutsTraitMixIn(gameBattler: Game_Battler) {
  const _onBattleStart = gameBattler.onBattleStart;
  gameBattler.onBattleStart = function (advantageous) {
    _onBattleStart.call(this, advantageous);
    this.initializeGuts();
  };

  gameBattler.onGutsZero = function (stateId) {
    if ($dataStates[stateId].removeByGutsZero) {
      this.removeState(stateId);
    }
  };
}

Game_Battler_GutsTraitMixIn(Game_Battler.prototype);
