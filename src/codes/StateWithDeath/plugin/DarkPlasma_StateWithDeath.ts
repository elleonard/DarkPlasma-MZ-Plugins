/// <reference path="./StateWithDeath.d.ts" />

import { settings } from '../config/_build/DarkPlasma_StateWithDeath_parameters';

const STATE_AND_META_KEY = "withDeath";

function Game_BattlerBase_StateWithDeathMixIn(gameBattlerBase: Game_BattlerBase) {
  const _die = gameBattlerBase.die;
  gameBattlerBase.die = function () {
    $gameTemp.evacuateStatesAndMeta(STATE_AND_META_KEY, this.statesAndMetaForEvacuate(this.continueStateIdsAfterDeath()));
    _die.call(this);
    this.restoreStatesAndMeta($gameTemp.evacuatedStatesAndMeta(STATE_AND_META_KEY)!);
    $gameTemp.clearEvacuatedStatesAndMeta(STATE_AND_META_KEY);
  };

  gameBattlerBase.continueStateIdsAfterDeath = function () {
    return this._states.filter((stateId) => settings.statesWithDeath.includes(stateId));
  };
}

Game_BattlerBase_StateWithDeathMixIn(Game_BattlerBase.prototype);
