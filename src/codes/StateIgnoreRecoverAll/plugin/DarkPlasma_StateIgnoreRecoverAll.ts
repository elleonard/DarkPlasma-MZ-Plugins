/// <reference path="./StateIgnoreRecoverAll.d.ts" />

import { settings } from '../config/_build/DarkPlasma_StateIgnoreRecoverAll_parameters';

const STATE_AND_META_KEY = "recoverAll";

function Game_BattlerBase_StateIgnoreRecoverAllMixIn(gameBattlerBase: Game_BattlerBase) {
  const _recoverAll = gameBattlerBase.recoverAll;
  gameBattlerBase.recoverAll = function () {
    $gameTemp.evacuateStatesAndMeta(STATE_AND_META_KEY, this.statesAndMetaForEvacuate(this.stateIdsIgnoreRecoverAll()));
    _recoverAll.call(this);
    const evacuated = $gameTemp.evacuatedStatesAndMeta(STATE_AND_META_KEY)!;
    this.restoreStatesAndMeta(evacuated);
    $gameTemp.clearEvacuatedStatesAndMeta(STATE_AND_META_KEY);
  };

  gameBattlerBase.stateIdsIgnoreRecoverAll = function () {
    return this._states.filter(stateId => settings.states.includes(stateId));
  };
}

Game_BattlerBase_StateIgnoreRecoverAllMixIn(Game_BattlerBase.prototype);
