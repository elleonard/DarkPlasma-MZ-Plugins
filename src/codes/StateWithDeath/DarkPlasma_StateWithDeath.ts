import { settings } from './_build/DarkPlasma_StateWithDeath_parameters';

/**
 * @param {Game_BattlerBase.prototype} gameBattlerBase
 */
function Game_BattlerBase_StateWithDeathMixIn(gameBattlerBase: Game_BattlerBase) {
  const _die = gameBattlerBase.die;
  gameBattlerBase.die = function () {
    const continueStates = this.continueStateIdsAfterDeath();
    const continueStateTurns: {[stateId: number]: number} = {};
    continueStates.forEach((stateId) => (continueStateTurns[stateId] = this._stateTurns[stateId]));
    _die.call(this);
    this._states = continueStates;
    this._stateTurns = continueStateTurns;
  };

  gameBattlerBase.continueStateIdsAfterDeath = function () {
    return this._states.filter((stateId) => settings.statesWithDeath.includes(stateId));
  };
}

Game_BattlerBase_StateWithDeathMixIn(Game_BattlerBase.prototype);
