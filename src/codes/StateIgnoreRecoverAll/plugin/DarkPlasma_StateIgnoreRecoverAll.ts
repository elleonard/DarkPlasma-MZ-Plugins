/// <reference path="./StateIgnoreRecoverAll.d.ts" />

import { settings } from '../config/_build/DarkPlasma_StateIgnoreRecoverAll_parameters';

function Game_Temp_StateIgnoreRecoverAllMixIn(gameTemp: Game_Temp) {
  gameTemp.evacuateStatesAndMeta = function (statesAndMeta) {
    this._evacuatedStatesAndMeta = statesAndMeta;
  };

  gameTemp.evacuatedStatesAndMeta = function () {
    return this._evacuatedStatesAndMeta;
  };

  gameTemp.clearEvacuatedStatesAndMeta = function () {
    this._evacuatedStatesAndMeta = undefined;
  };
}

Game_Temp_StateIgnoreRecoverAllMixIn(Game_Temp.prototype);

function Game_BattlerBase_StateIgnoreRecoverAllMixIn(gameBattlerBase: Game_BattlerBase) {
  const _recoverAll = gameBattlerBase.recoverAll;
  gameBattlerBase.recoverAll = function () {
    $gameTemp.evacuateStatesAndMeta(this.statesAndMetaForIgnoreRecoverAll());
    _recoverAll.call(this);
    const evacuated = $gameTemp.evacuatedStatesAndMeta()!;
    this.restoreStatesAndMeta(evacuated);
    $gameTemp.clearEvacuatedStatesAndMeta();
  };

  gameBattlerBase.statesAndMetaForIgnoreRecoverAll = function () {
    const stateIds = this.stateIdsIgnoreRecoverAll();
    const stateTurns: {[stateId: number]: number} = {};
    stateIds.forEach((stateId) => {
      stateTurns[stateId] = this._stateTurns[stateId];
    });
    return {
      ids: stateIds,
      turns: stateTurns,
    };
  };

  gameBattlerBase.stateIdsIgnoreRecoverAll = function () {
    return this._states.filter(stateId => settings.states.includes(stateId));
  };

  gameBattlerBase.restoreStatesAndMeta = function (statesAndMeta) {
    this._states = statesAndMeta.ids;
    this._stateTurns = statesAndMeta.turns;
  };
}

Game_BattlerBase_StateIgnoreRecoverAllMixIn(Game_BattlerBase.prototype);

function Game_Actor_StateIgnoreRecoverAllMixIn(gameActor: Game_Actor) {
  const _statesAndMetaForIgnoreRecoverAll = gameActor.statesAndMetaForIgnoreRecoverAll;
  gameActor.statesAndMetaForIgnoreRecoverAll = function () {
    return {
      ..._statesAndMetaForIgnoreRecoverAll.call(this),
      steps: this.stateStepsForIgnoreRecoverAll(),
    };
  };

  gameActor.stateStepsForIgnoreRecoverAll = function () {
    const stateIds = this.stateIdsIgnoreRecoverAll();
    const stateSteps: {[stateId: number]: number} = {};
    stateIds.forEach((stateId) => {
      stateSteps[stateId] = this._stateSteps[stateId];
    });
    return stateSteps;
  };

  const _restoreStatesAndMeta = gameActor.restoreStatesAndMeta;
  gameActor.restoreStatesAndMeta = function (statesAndMeta) {
    _restoreStatesAndMeta.call(this, statesAndMeta);
    if (statesAndMeta.steps) {
      this._stateSteps = statesAndMeta.steps;
    }
  };
}

Game_Actor_StateIgnoreRecoverAllMixIn(Game_Actor.prototype);
