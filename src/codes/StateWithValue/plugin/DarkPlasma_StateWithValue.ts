/// <reference path="./StateWithValue.d.ts" />

function DataManager_StateWithValueMixIn(dataManager: typeof DataManager) {
  dataManager.maxStateValue = function (stateId, valueType) {
    return Infinity;
  };

  dataManager.minStateValue = function (stateId, valueType) {
    return 0;
  };
}

DataManager_StateWithValueMixIn(DataManager);

function Game_BattlerBase_StateWithValueMixIn(gameBattlerBase: Game_BattlerBase) {
  const _clearStates = gameBattlerBase.clearStates;
  gameBattlerBase.clearStates = function () {
    _clearStates.call(this);
    this._stateValues = {};
  };

  const _eraseState = gameBattlerBase.eraseState;
  gameBattlerBase.eraseState = function (stateId) {
    _eraseState.call(this, stateId);
    delete this._stateValues?.[stateId];
  };

  gameBattlerBase.setStateValue = function (stateId, valueType, value) {
    if (!this._stateValues) {
      this._stateValues = {};
    }
    if (!this._stateValues[stateId]) {
      this._stateValues[stateId] = {};
    }
    this._stateValues[stateId][valueType] = value.clamp(
      DataManager.minStateValue(stateId, valueType),
      DataManager.maxStateValue(stateId, valueType)
    );
  };

  gameBattlerBase.addStateValue = function (stateId, valueType, value) {
    this.setStateValue(stateId, valueType, this.stateValue(stateId, valueType) + value);
  };

  gameBattlerBase.stateValue = function (stateId, valueType) {
    return this._stateValues?.[stateId]?.[valueType] || 0;
  };

  gameBattlerBase.stateValuesForEvacuate = function (stateIds) {
    const result: {[stateId: number]: StateValue} = {};
    stateIds.forEach(stateId => {
      const values = this._stateValues?.[stateId];
      if (values) {
        result[stateId] = values;
      }
    });
    return result;
  };

  const _statesAndMetaForEvacuate = gameBattlerBase.statesAndMetaForEvacuate;
  gameBattlerBase.statesAndMetaForEvacuate = function (stateIds) {
    return {
      ..._statesAndMetaForEvacuate.call(this, stateIds),
      values: this.stateValuesForEvacuate(stateIds),
    };
  };

  const _restoreStatesAndMeta = gameBattlerBase.restoreStatesAndMeta;
  gameBattlerBase.restoreStatesAndMeta = function (statesAndMeta) {
    _restoreStatesAndMeta.call(this, statesAndMeta);
    if (statesAndMeta.values) {
      this._stateValues = statesAndMeta.values;
    }
  };
}

Game_BattlerBase_StateWithValueMixIn(Game_BattlerBase.prototype);
