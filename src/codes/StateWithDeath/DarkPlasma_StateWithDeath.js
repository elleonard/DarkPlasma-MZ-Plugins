import { settings } from './_build/DarkPlasma_StateWithDeath_parameters';

/**
 * @param {Game_BattlerBase.prototype} gameBattlerBase
 */
function Game_BattlerBase_StateWithDeathMixIn(gameBattlerBase) {
  const _die = gameBattlerBase.die;
  gameBattlerBase.die = function () {
    const continueStates = this._states.filter((stateId) => settings.statesWithDeath.includes(stateId));
    const continueStateTurns = {};
    continuesStates.forEach((stateId) => (continueStateTurns[stateId] = this._stateTurns[stateId]));
    _die.call(this);
    this._states = continueStates;
    this._stateTurns = continueStateTurns;
  };
}

Game_BattlerBase_StateWithDeathMixIn(Game_BattlerBase.prototype);
