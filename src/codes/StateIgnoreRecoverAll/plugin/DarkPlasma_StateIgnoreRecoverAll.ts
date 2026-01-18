/// <reference path="./StateIgnoreRecoverAll.d.ts" />

import { settings } from '../config/_build/DarkPlasma_StateIgnoreRecoverAll_parameters';

function Game_BattlerBase_StateIgnoreRecoverAllMixIn(gameBattlerBase: Game_BattlerBase) {
  const _recoverAll = gameBattlerBase.recoverAll;
  gameBattlerBase.recoverAll = function () {
    const continueStates = this.stateIdsIgnoreRecoverAll();
    const continueStateTurns: {[stateId: number]: number} = {};
    continueStates.forEach((stateId) => (continueStateTurns[stateId] = this._stateTurns[stateId]));
    _recoverAll.call(this);
    this._states = continueStates;
    this._stateTurns = continueStateTurns;
  };

  gameBattlerBase.stateIdsIgnoreRecoverAll = function () {
    return this._states.filter(stateId => settings.states.includes(stateId));
  };
}

Game_BattlerBase_StateIgnoreRecoverAllMixIn(Game_BattlerBase.prototype);
